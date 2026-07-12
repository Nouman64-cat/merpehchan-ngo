from datetime import date, datetime
from typing import Annotated

from pydantic import BaseModel, BeforeValidator, ConfigDict, Field

PyObjectId = Annotated[str, BeforeValidator(str)]


class EventPhoto(BaseModel):
    url: str
    key: str


class EventPublic(BaseModel):
    model_config = ConfigDict(populate_by_name=True)

    id: PyObjectId = Field(alias="_id")
    title: str
    description: str | None = None
    date: date
    photos: list[EventPhoto] = []
    display_order: int = 0


class EventAdmin(EventPublic):
    is_active: bool = True
    created_at: datetime
    updated_at: datetime
