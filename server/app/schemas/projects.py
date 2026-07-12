from datetime import date, datetime
from typing import Annotated

from pydantic import BaseModel, BeforeValidator, ConfigDict, Field

PyObjectId = Annotated[str, BeforeValidator(str)]


class ProjectImage(BaseModel):
    url: str
    key: str


class ProjectPublic(BaseModel):
    model_config = ConfigDict(populate_by_name=True)

    id: PyObjectId = Field(alias="_id")
    title: str
    description: str
    date: date
    areas: list[str] = []
    team_member_ids: list[str] = []
    youtube_url: str | None = None
    images: list[ProjectImage] = []
    display_order: int = 0


class ProjectAdmin(ProjectPublic):
    is_active: bool = True
    created_at: datetime
    updated_at: datetime
