import uuid
from functools import lru_cache

import boto3
from fastapi import HTTPException, UploadFile, status

from app.config import get_settings

ALLOWED_CONTENT_TYPES = {"image/jpeg", "image/png", "image/webp"}
MAX_UPLOAD_BYTES = 5 * 1024 * 1024  # 5MB
TEAM_PHOTO_PREFIX = "team-photos"
EVENT_PHOTO_PREFIX = "event-photos"
PROJECT_PHOTO_PREFIX = "project-photos"


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

    extension = file.filename.rsplit(".", 1)[-1].lower() if file.filename and "." in file.filename else "jpg"
    key = f"{prefix}/{uuid.uuid4()}.{extension}"

    settings = get_settings()
    client = get_s3_client()
    client.put_object(
        Bucket=settings.aws_s3_bucket_name,
        Key=key,
        Body=contents,
        ContentType=file.content_type,
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
