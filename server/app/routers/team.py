from datetime import datetime, timezone

from bson import ObjectId
from bson.errors import InvalidId
from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile, status
from motor.motor_asyncio import AsyncIOMotorDatabase

from app.database import get_database
from app.s3 import delete_team_photo, upload_team_photo
from app.schemas.team import TeamMemberAdmin, TeamMemberPublic
from app.security import require_admin

public_router = APIRouter(prefix="/api/team", tags=["team"])
admin_router = APIRouter(
    prefix="/api/admin/team", tags=["admin:team"], dependencies=[Depends(require_admin)]
)

COLLECTION = "team_members"


def _object_id(member_id: str) -> ObjectId:
    try:
        return ObjectId(member_id)
    except InvalidId as exc:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid team member id."
        ) from exc


async def _get_member_or_404(db: AsyncIOMotorDatabase, member_id: str) -> dict:
    doc = await db[COLLECTION].find_one({"_id": _object_id(member_id)})
    if doc is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Team member not found."
        )
    return doc


@public_router.get("", response_model=list[TeamMemberPublic])
async def list_public_team(db: AsyncIOMotorDatabase = Depends(get_database)):
    cursor = db[COLLECTION].find({"is_active": True}).sort(
        [("display_order", 1), ("name", 1)]
    )
    return [TeamMemberPublic.model_validate(doc) async for doc in cursor]


@admin_router.get("", response_model=list[TeamMemberAdmin])
async def list_all_team(db: AsyncIOMotorDatabase = Depends(get_database)):
    cursor = db[COLLECTION].find().sort([("display_order", 1), ("name", 1)])
    return [TeamMemberAdmin.model_validate(doc) async for doc in cursor]


@admin_router.get("/{member_id}", response_model=TeamMemberAdmin)
async def get_team_member(
    member_id: str, db: AsyncIOMotorDatabase = Depends(get_database)
):
    doc = await _get_member_or_404(db, member_id)
    return TeamMemberAdmin.model_validate(doc)


@admin_router.post("", response_model=TeamMemberAdmin, status_code=status.HTTP_201_CREATED)
async def create_team_member(
    name: str = Form(...),
    role: str = Form(...),
    bio: str | None = Form(None),
    display_order: int = Form(0),
    is_active: bool = Form(True),
    photo: UploadFile | None = File(None),
    db: AsyncIOMotorDatabase = Depends(get_database),
):
    photo_url, photo_key = (None, None)
    if photo is not None and photo.filename:
        photo_url, photo_key = await upload_team_photo(photo)

    now = datetime.now(timezone.utc)
    doc = {
        "name": name,
        "role": role,
        "bio": bio,
        "photo_url": photo_url,
        "photo_key": photo_key,
        "display_order": display_order,
        "is_active": is_active,
        "created_at": now,
        "updated_at": now,
    }
    result = await db[COLLECTION].insert_one(doc)
    doc["_id"] = result.inserted_id
    return TeamMemberAdmin.model_validate(doc)


@admin_router.put("/{member_id}", response_model=TeamMemberAdmin)
async def update_team_member(
    member_id: str,
    name: str | None = Form(None),
    role: str | None = Form(None),
    bio: str | None = Form(None),
    display_order: int | None = Form(None),
    is_active: bool | None = Form(None),
    photo: UploadFile | None = File(None),
    db: AsyncIOMotorDatabase = Depends(get_database),
):
    existing = await _get_member_or_404(db, member_id)

    updates: dict = {"updated_at": datetime.now(timezone.utc)}
    if name is not None:
        updates["name"] = name
    if role is not None:
        updates["role"] = role
    if bio is not None:
        updates["bio"] = bio
    if display_order is not None:
        updates["display_order"] = display_order
    if is_active is not None:
        updates["is_active"] = is_active

    if photo is not None and photo.filename:
        new_url, new_key = await upload_team_photo(photo)
        updates["photo_url"] = new_url
        updates["photo_key"] = new_key
        old_key = existing.get("photo_key")
        if old_key:
            delete_team_photo(old_key)

    await db[COLLECTION].update_one({"_id": existing["_id"]}, {"$set": updates})
    updated = await db[COLLECTION].find_one({"_id": existing["_id"]})
    return TeamMemberAdmin.model_validate(updated)


@admin_router.delete("/{member_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_team_member(
    member_id: str, db: AsyncIOMotorDatabase = Depends(get_database)
):
    existing = await _get_member_or_404(db, member_id)
    await db[COLLECTION].delete_one({"_id": existing["_id"]})
    photo_key = existing.get("photo_key")
    if photo_key:
        delete_team_photo(photo_key)
