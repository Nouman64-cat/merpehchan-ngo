from datetime import date, datetime, timezone

from bson import ObjectId
from bson.errors import InvalidId
from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile, status
from motor.motor_asyncio import AsyncIOMotorDatabase

from app.database import get_database
from app.s3 import delete_event_photo, upload_event_photo
from app.schemas.events import EventAdmin, EventPublic
from app.security import require_admin

public_router = APIRouter(prefix="/api/events", tags=["events"])
admin_router = APIRouter(
    prefix="/api/admin/events", tags=["admin:events"], dependencies=[Depends(require_admin)]
)

COLLECTION = "events"


def _object_id(event_id: str) -> ObjectId:
    try:
        return ObjectId(event_id)
    except InvalidId as exc:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid event id."
        ) from exc


async def _get_event_or_404(db: AsyncIOMotorDatabase, event_id: str) -> dict:
    doc = await db[COLLECTION].find_one({"_id": _object_id(event_id)})
    if doc is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Event not found.")
    return doc


async def _upload_photos(files: list[UploadFile]) -> list[dict]:
    photos = []
    for file in files:
        if not file.filename:
            continue
        url, key = await upload_event_photo(file)
        photos.append({"url": url, "key": key})
    return photos


@public_router.get("", response_model=list[EventPublic])
async def list_public_events(db: AsyncIOMotorDatabase = Depends(get_database)):
    cursor = db[COLLECTION].find({"is_active": True}).sort(
        [("date", -1), ("display_order", 1)]
    )
    return [EventPublic.model_validate(doc) async for doc in cursor]


@admin_router.get("", response_model=list[EventAdmin])
async def list_all_events(db: AsyncIOMotorDatabase = Depends(get_database)):
    cursor = db[COLLECTION].find().sort([("date", -1), ("display_order", 1)])
    return [EventAdmin.model_validate(doc) async for doc in cursor]


@admin_router.get("/{event_id}", response_model=EventAdmin)
async def get_event(event_id: str, db: AsyncIOMotorDatabase = Depends(get_database)):
    doc = await _get_event_or_404(db, event_id)
    return EventAdmin.model_validate(doc)


@admin_router.post("", response_model=EventAdmin, status_code=status.HTTP_201_CREATED)
async def create_event(
    title: str = Form(...),
    description: str | None = Form(None),
    date: date = Form(...),
    display_order: int = Form(0),
    is_active: bool = Form(True),
    photos: list[UploadFile] = File([]),
    db: AsyncIOMotorDatabase = Depends(get_database),
):
    uploaded_photos = await _upload_photos(photos)

    now = datetime.now(timezone.utc)
    doc = {
        "title": title,
        "description": description,
        "date": date.isoformat(),
        "photos": uploaded_photos,
        "display_order": display_order,
        "is_active": is_active,
        "created_at": now,
        "updated_at": now,
    }
    result = await db[COLLECTION].insert_one(doc)
    doc["_id"] = result.inserted_id
    return EventAdmin.model_validate(doc)


@admin_router.put("/{event_id}", response_model=EventAdmin)
async def update_event(
    event_id: str,
    title: str | None = Form(None),
    description: str | None = Form(None),
    date: date | None = Form(None),
    display_order: int | None = Form(None),
    is_active: bool | None = Form(None),
    new_photos: list[UploadFile] = File([]),
    remove_photo_keys: list[str] = Form([]),
    db: AsyncIOMotorDatabase = Depends(get_database),
):
    existing = await _get_event_or_404(db, event_id)

    updates: dict = {"updated_at": datetime.now(timezone.utc)}
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

    photos = list(existing.get("photos", []))
    if remove_photo_keys:
        remove_set = set(remove_photo_keys)
        photos = [photo for photo in photos if photo["key"] not in remove_set]
        for key in remove_set:
            delete_event_photo(key)

    photos.extend(await _upload_photos(new_photos))
    updates["photos"] = photos

    await db[COLLECTION].update_one({"_id": existing["_id"]}, {"$set": updates})
    updated = await db[COLLECTION].find_one({"_id": existing["_id"]})
    return EventAdmin.model_validate(updated)


@admin_router.delete("/{event_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_event(event_id: str, db: AsyncIOMotorDatabase = Depends(get_database)):
    existing = await _get_event_or_404(db, event_id)
    await db[COLLECTION].delete_one({"_id": existing["_id"]})
    for photo in existing.get("photos", []):
        delete_event_photo(photo["key"])
