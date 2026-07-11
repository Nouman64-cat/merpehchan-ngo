from datetime import datetime
from typing import Annotated

from pydantic import BaseModel, BeforeValidator, ConfigDict, Field

PyObjectId = Annotated[str, BeforeValidator(str)]


class TeamMemberPublic(BaseModel):
    model_config = ConfigDict(populate_by_name=True)

    id: PyObjectId = Field(alias="_id")
    name: str
    role: str
    bio: str | None = None
    photo_url: str | None = None
    display_order: int = 0


class TeamMemberAdmin(TeamMemberPublic):
    is_active: bool = True
    photo_key: str | None = None
    created_at: datetime
    updated_at: datetime


class TeamMemberUpdate(BaseModel):
    name: str | None = None
    role: str | None = None
    bio: str | None = None
    display_order: int | None = None
    is_active: bool | None = None
