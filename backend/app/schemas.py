from datetime import date as date_, datetime

from pydantic import BaseModel, ConfigDict, Field
from pydantic.alias_generators import to_camel


class CamelModel(BaseModel):
    model_config = ConfigDict(alias_generator=to_camel, populate_by_name=True)


class ReadModel(CamelModel):
    model_config = ConfigDict(alias_generator=to_camel, populate_by_name=True, from_attributes=True)


class TaskCreate(CamelModel):
    title: str


class TaskUpdate(CamelModel):
    title: str | None = None
    completed: bool | None = None
    completed_at: datetime | None = None


class TaskRead(ReadModel):
    id: str
    title: str
    completed: bool
    created_at: datetime
    completed_at: datetime | None = None


class PomodoroSessionCreate(CamelModel):
    task_id: str | None = None
    started_at: datetime
    duration_min: int
    completed: bool = True


class PomodoroSessionRead(ReadModel):
    id: str
    task_id: str | None = None
    started_at: datetime
    duration_min: int
    completed: bool


class HabitCreate(CamelModel):
    name: str
    weekly_target: int = 7


class HabitUpdate(CamelModel):
    name: str | None = None
    weekly_target: int | None = None


class HabitRead(ReadModel):
    id: str
    name: str
    weekly_target: int


class HabitEntryCreate(CamelModel):
    habit_id: str
    date: date_
    completed: bool = True


class HabitEntryUpdate(CamelModel):
    completed: bool | None = None


class HabitEntryRead(ReadModel):
    id: str
    habit_id: str
    date: date_
    completed: bool


class MoodEntryCreate(CamelModel):
    date: date_
    score: int = Field(ge=1, le=5)
    note: str | None = None


class MoodEntryUpdate(CamelModel):
    score: int | None = Field(default=None, ge=1, le=5)
    note: str | None = None


class MoodEntryRead(ReadModel):
    id: str
    date: date_
    score: int
    note: str | None = None


class SemesterEventCreate(CamelModel):
    title: str
    date: date_
    description: str | None = None


class SemesterEventUpdate(CamelModel):
    title: str | None = None
    date: date_ | None = None
    description: str | None = None


class SemesterEventRead(ReadModel):
    id: str
    title: str
    date: date_
    description: str | None = None
    google_event_id: str | None = None
    source: str


class GoogleSyncResult(CamelModel):
    imported: int
    updated: int
