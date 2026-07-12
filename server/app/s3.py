import io
import uuid
from functools import lru_cache

import boto3
from fastapi import HTTPException, UploadFile, status
from PIL import Image, ImageOps
from starlette.concurrency import run_in_threadpool

from app.config import get_settings

ALLOWED_CONTENT_TYPES = {"image/jpeg", "image/png", "image/webp"}
MAX_UPLOAD_BYTES = 5 * 1024 * 1024  # 5MB
TEAM_PHOTO_PREFIX = "team-photos"
EVENT_PHOTO_PREFIX = "event-photos"
PROJECT_PHOTO_PREFIX = "project-photos"

# Uploaded photos are re-encoded to WebP and capped to this size before
# storage, so the S3 origin file itself is small — the biggest lever for
# image load speed, independent of any CDN in front of the bucket.
MAX_IMAGE_DIMENSION = 1920
WEBP_QUALITY = 82


def _process_image(contents: bytes) -> bytes:
    """Downscales and re-encodes an image to WebP. Runs synchronously — call via threadpool."""
    image = Image.open(io.BytesIO(contents))
    image = ImageOps.exif_transpose(image)  # phone photos often carry rotation in EXIF, not pixels

    if image.mode not in ("RGB", "RGBA"):
        image = image.convert("RGBA" if "A" in image.getbands() else "RGB")

    image.thumbnail((MAX_IMAGE_DIMENSION, MAX_IMAGE_DIMENSION), Image.LANCZOS)

    buffer = io.BytesIO()
    image.save(buffer, format="WEBP", quality=WEBP_QUALITY, method=6)
    return buffer.getvalue()


@lru_cache
def get_s3_client():
    settings = get_settings()
    return boto3.client(
        "s3",
        aws_access_key_id=settings.aws_iam_key,
        aws_secret_access_key=settings.aws_iam_secret,
        region_name=settings.aws_region,
    )


def _build_object_url(key: str) -> str:
    settings = get_settings()
    return f"https://{settings.aws_s3_bucket_name}.s3.{settings.aws_region}.amazonaws.com/{key}"


async def _upload_photo(file: UploadFile, prefix: str) -> tuple[str, str]:
    """Uploads a photo to S3 under the given key prefix. Returns (url, object_key)."""
    if file.content_type not in ALLOWED_CONTENT_TYPES:
        raise HTTPException(
            status_code=status.HTTP_415_UNSUPPORTED_MEDIA_TYPE,
            detail="Photo must be a JPEG, PNG, or WEBP image.",
        )

    contents = await file.read()
    if len(contents) > MAX_UPLOAD_BYTES:
        raise HTTPException(
            status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
            detail="Photo must be smaller than 5MB.",
        )

    try:
        contents = await run_in_threadpool(_process_image, contents)
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Could not process this image. Please try a different file.",
        ) from exc

    key = f"{prefix}/{uuid.uuid4()}.webp"

    settings = get_settings()
    client = get_s3_client()
    client.put_object(
        Bucket=settings.aws_s3_bucket_name,
        Key=key,
        Body=contents,
        ContentType="image/webp",
    )

    return _build_object_url(key), key


def _delete_photo(object_key: str) -> None:
    settings = get_settings()
    client = get_s3_client()
    client.delete_object(Bucket=settings.aws_s3_bucket_name, Key=object_key)


async def upload_team_photo(file: UploadFile) -> tuple[str, str]:
    return await _upload_photo(file, TEAM_PHOTO_PREFIX)


def delete_team_photo(object_key: str) -> None:
    _delete_photo(object_key)


async def upload_event_photo(file: UploadFile) -> tuple[str, str]:
    return await _upload_photo(file, EVENT_PHOTO_PREFIX)


def delete_event_photo(object_key: str) -> None:
    _delete_photo(object_key)


async def upload_project_photo(file: UploadFile) -> tuple[str, str]:
    return await _upload_photo(file, PROJECT_PHOTO_PREFIX)


def delete_project_photo(object_key: str) -> None:
    _delete_photo(object_key)
