from datetime import datetime, timezone

from bson import ObjectId
from bson.errors import InvalidId
from fastapi import APIRouter, Depends, HTTPException, Query, status
from motor.motor_asyncio import AsyncIOMotorDatabase

from app.database import get_database
from app.schemas.contact import (
    ContactMessage,
    ContactMessageCreate,
    ContactMessageStatusUpdate,
)
from app.security import require_admin

public_router = APIRouter(prefix="/api/contact", tags=["contact"])
admin_router = APIRouter(
    prefix="/api/admin/contact", tags=["admin:contact"], dependencies=[Depends(require_admin)]
)

COLLECTION = "contact_messages"


def _object_id(message_id: str) -> ObjectId:
    try:
        return ObjectId(message_id)
    except InvalidId as exc:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid message id."
        ) from exc


async def _get_message_or_404(db: AsyncIOMotorDatabase, message_id: str) -> dict:
    doc = await db[COLLECTION].find_one({"_id": _object_id(message_id)})
    if doc is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Message not found.")
    return doc


@public_router.post("", response_model=ContactMessage, status_code=status.HTTP_201_CREATED)
async def submit_contact_message(
    payload: ContactMessageCreate, db: AsyncIOMotorDatabase = Depends(get_database)
):
    doc = {
        "name": payload.name,
        "email": payload.email,
        "subject": payload.subject,
        "message": payload.message,
        "is_read": False,
        "created_at": datetime.now(timezone.utc),
    }
    result = await db[COLLECTION].insert_one(doc)
    doc["_id"] = result.inserted_id
    return ContactMessage.model_validate(doc)


@admin_router.get("", response_model=list[ContactMessage])
async def list_messages(
    is_read: bool | None = Query(None),
    db: AsyncIOMotorDatabase = Depends(get_database),
):
    query: dict = {} if is_read is None else {"is_read": is_read}
    cursor = db[COLLECTION].find(query).sort([("created_at", -1)])
    return [ContactMessage.model_validate(doc) async for doc in cursor]


@admin_router.get("/{message_id}", response_model=ContactMessage)
async def get_message(message_id: str, db: AsyncIOMotorDatabase = Depends(get_database)):
    doc = await _get_message_or_404(db, message_id)
    # Viewing a message in the admin panel marks it read, mirroring standard inbox UX.
    if not doc.get("is_read"):
        await db[COLLECTION].update_one({"_id": doc["_id"]}, {"$set": {"is_read": True}})
        doc["is_read"] = True
    return ContactMessage.model_validate(doc)


@admin_router.patch("/{message_id}", response_model=ContactMessage)
async def update_message_status(
    message_id: str,
    payload: ContactMessageStatusUpdate,
    db: AsyncIOMotorDatabase = Depends(get_database),
):
    existing = await _get_message_or_404(db, message_id)
    await db[COLLECTION].update_one(
        {"_id": existing["_id"]}, {"$set": {"is_read": payload.is_read}}
    )
    updated = await db[COLLECTION].find_one({"_id": existing["_id"]})
    return ContactMessage.model_validate(updated)


@admin_router.delete("/{message_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_message(message_id: str, db: AsyncIOMotorDatabase = Depends(get_database)):
    existing = await _get_message_or_404(db, message_id)
    await db[COLLECTION].delete_one({"_id": existing["_id"]})
