import uuid
from datetime import date as date_, datetime

from sqlalchemy import Date, DateTime, ForeignKey, String
from sqlalchemy.orm import Mapped, mapped_column

from app.database import Base


def _uuid() -> str:
    return str(uuid.uuid4())


class Task(Base):
    __tablename__ = "tasks"

    id: Mapped[str] = mapped_column(String, primary_key=True, default=_uuid)
    title: Mapped[str] = mapped_column(String, nullable=False)
    completed: Mapped[bool] = mapped_column(default=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    completed_at: Mapped[datetime | None] = mapped_column(DateTime, nullable=True)


class PomodoroSession(Base):
    __tablename__ = "pomodoro_sessions"

    id: Mapped[str] = mapped_column(String, primary_key=True, default=_uuid)
    task_id: Mapped[str | None] = mapped_column(ForeignKey("tasks.id"), nullable=True)
    started_at: Mapped[datetime] = mapped_column(DateTime, nullable=False)
    duration_min: Mapped[int] = mapped_column(nullable=False)
    completed: Mapped[bool] = mapped_column(default=False)


class Habit(Base):
    __tablename__ = "habits"

    id: Mapped[str] = mapped_column(String, primary_key=True, default=_uuid)
    name: Mapped[str] = mapped_column(String, nullable=False)
    weekly_target: Mapped[int] = mapped_column(default=7)


class HabitEntry(Base):
    __tablename__ = "habit_entries"

    id: Mapped[str] = mapped_column(String, primary_key=True, default=_uuid)
    habit_id: Mapped[str] = mapped_column(ForeignKey("habits.id"), nullable=False)
    date: Mapped[date_] = mapped_column(Date, nullable=False)
    completed: Mapped[bool] = mapped_column(default=False)


class MoodEntry(Base):
    __tablename__ = "mood_entries"

    id: Mapped[str] = mapped_column(String, primary_key=True, default=_uuid)
    date: Mapped[date_] = mapped_column(Date, nullable=False)
    score: Mapped[int] = mapped_column(nullable=False)
    note: Mapped[str | None] = mapped_column(String, nullable=True)


class SemesterEvent(Base):
    __tablename__ = "semester_events"

    id: Mapped[str] = mapped_column(String, primary_key=True, default=_uuid)
    title: Mapped[str] = mapped_column(String, nullable=False)
    date: Mapped[date_] = mapped_column(Date, nullable=False)
    description: Mapped[str | None] = mapped_column(String, nullable=True)
    google_event_id: Mapped[str | None] = mapped_column(String, unique=True, nullable=True)
    source: Mapped[str] = mapped_column(String, default="manual")
