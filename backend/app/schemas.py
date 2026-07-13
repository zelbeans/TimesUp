from datetime import date as date_, datetime

from pydantic import BaseModel, ConfigDict, Field

from app.models import HabitType


class TaskCreate(BaseModel):
    title: str


class TaskUpdate(BaseModel):
    title: str | None = None
    completed: bool | None = None
    completed_at: datetime | None = None


class TaskRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    title: str
    completed: bool
    created_at: datetime
    completed_at: datetime | None = None


class PomodoroSessionCreate(BaseModel):
    task_id: str | None = None
    started_at: datetime
    duration_min: int
    completed: bool = True


class PomodoroSessionRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    task_id: str | None = None
    started_at: datetime
    duration_min: int
    completed: bool


class HabitEntryCreate(BaseModel):
    type: HabitType
    date: date_
    completed: bool = True


class HabitEntryUpdate(BaseModel):
    completed: bool | None = None


class HabitEntryRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    type: HabitType
    date: date_
    completed: bool


class MoodEntryCreate(BaseModel):
    date: date_
    score: int = Field(ge=1, le=5)
    note: str | None = None


class MoodEntryUpdate(BaseModel):
    score: int | None = Field(default=None, ge=1, le=5)
    note: str | None = None


class MoodEntryRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    date: date_
    score: int
    note: str | None = None


class SemesterEventCreate(BaseModel):
    title: str
    date: date_
    description: str | None = None


class SemesterEventUpdate(BaseModel):
    title: str | None = None
    date: date_ | None = None
    description: str | None = None


class SemesterEventRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    title: str
    date: date_
    description: str | None = None
