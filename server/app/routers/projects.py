from datetime import date, datetime, timezone

from bson import ObjectId
from bson.errors import InvalidId
from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile, status
from motor.motor_asyncio import AsyncIOMotorDatabase

from app.database import get_database
from app.s3 import delete_project_photo, upload_project_photo
from app.schemas.projects import ProjectAdmin, ProjectPublic
from app.security import require_admin

public_router = APIRouter(prefix="/api/projects", tags=["projects"])
admin_router = APIRouter(
    prefix="/api/admin/projects", tags=["admin:projects"], dependencies=[Depends(require_admin)]
)

COLLECTION = "projects"


def _object_id(project_id: str) -> ObjectId:
    try:
        return ObjectId(project_id)
    except InvalidId as exc:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid project id."
        ) from exc


async def _get_project_or_404(db: AsyncIOMotorDatabase, project_id: str) -> dict:
    doc = await db[COLLECTION].find_one({"_id": _object_id(project_id)})
    if doc is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Project not found.")
    return doc


async def _upload_images(files: list[UploadFile]) -> list[dict]:
    images = []
    for file in files:
        if not file.filename:
            continue
        url, key = await upload_project_photo(file)
        images.append({"url": url, "key": key})
    return images


@public_router.get("", response_model=list[ProjectPublic])
async def list_public_projects(db: AsyncIOMotorDatabase = Depends(get_database)):
    cursor = db[COLLECTION].find({"is_active": True}).sort(
        [("date", -1), ("display_order", 1)]
    )
    return [ProjectPublic.model_validate(doc) async for doc in cursor]


@public_router.get("/{project_id}", response_model=ProjectPublic)
async def get_public_project(project_id: str, db: AsyncIOMotorDatabase = Depends(get_database)):
    doc = await _get_project_or_404(db, project_id)
    if not doc.get("is_active"):
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Project not found.")
    return ProjectPublic.model_validate(doc)


@admin_router.get("", response_model=list[ProjectAdmin])
async def list_all_projects(db: AsyncIOMotorDatabase = Depends(get_database)):
    cursor = db[COLLECTION].find().sort([("date", -1), ("display_order", 1)])
    return [ProjectAdmin.model_validate(doc) async for doc in cursor]


@admin_router.get("/{project_id}", response_model=ProjectAdmin)
async def get_project(project_id: str, db: AsyncIOMotorDatabase = Depends(get_database)):
    doc = await _get_project_or_404(db, project_id)
    return ProjectAdmin.model_validate(doc)


@admin_router.post("", response_model=ProjectAdmin, status_code=status.HTTP_201_CREATED)
async def create_project(
    title: str = Form(...),
    description: str = Form(...),
    date: date = Form(...),
    youtube_url: str | None = Form(None),
    display_order: int = Form(0),
    is_active: bool = Form(True),
    areas: list[str] = Form([]),
    team_member_ids: list[str] = Form([]),
    images: list[UploadFile] = File([]),
    db: AsyncIOMotorDatabase = Depends(get_database),
):
    uploaded_images = await _upload_images(images)

    now = datetime.now(timezone.utc)
    doc = {
        "title": title,
        "description": description,
        "date": date.isoformat(),
        "youtube_url": youtube_url or None,
        "areas": areas,
        "team_member_ids": team_member_ids,
        "images": uploaded_images,
        "display_order": display_order,
        "is_active": is_active,
        "created_at": now,
        "updated_at": now,
    }
    result = await db[COLLECTION].insert_one(doc)
    doc["_id"] = result.inserted_id
    return ProjectAdmin.model_validate(doc)


@admin_router.put("/{project_id}", response_model=ProjectAdmin)
async def update_project(
    project_id: str,
    title: str | None = Form(None),
    description: str | None = Form(None),
    date: date | None = Form(None),
    youtube_url: str | None = Form(None),
    display_order: int | None = Form(None),
    is_active: bool | None = Form(None),
    areas: list[str] = Form([]),
    team_member_ids: list[str] = Form([]),
    new_images: list[UploadFile] = File([]),
    remove_image_keys: list[str] = Form([]),
    db: AsyncIOMotorDatabase = Depends(get_database),
):
    existing = await _get_project_or_404(db, project_id)

    updates: dict = {
        "updated_at": datetime.now(timezone.utc),
        "areas": areas,
        "team_member_ids": team_member_ids,
        # Always applied (not gated on "is not None"): FastAPI collapses an
        # empty-string Form value to None for Optional[str] fields, which is
        # indistinguishable from the field being omitted entirely. Since the
        # admin form always submits this field, treating it as always-present
        # (like areas/team_member_ids) is what actually lets an admin clear it.
        "youtube_url": youtube_url or None,
    }
    if title is not None:
        updates["title"] = title
    if description is not None:
        updates["description"] = description
    if date is not None:
        updates["date"] = date.isoformat()
    if display_order is not None:
        updates["display_order"] = display_order
    if is_active is not None:
        updates["is_active"] = is_active

    images = list(existing.get("images", []))
    if remove_image_keys:
        remove_set = set(remove_image_keys)
        images = [image for image in images if image["key"] not in remove_set]
        for key in remove_set:
            delete_project_photo(key)

    images.extend(await _upload_images(new_images))
    updates["images"] = images

    await db[COLLECTION].update_one({"_id": existing["_id"]}, {"$set": updates})
    updated = await db[COLLECTION].find_one({"_id": existing["_id"]})
    return ProjectAdmin.model_validate(updated)


@admin_router.delete("/{project_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_project(project_id: str, db: AsyncIOMotorDatabase = Depends(get_database)):
    existing = await _get_project_or_404(db, project_id)
    await db[COLLECTION].delete_one({"_id": existing["_id"]})
    for image in existing.get("images", []):
        delete_project_photo(image["key"])
