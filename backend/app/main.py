from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import select

from app.config import settings
from app.database import Base, SessionLocal, engine
from app.models import Habit
from app.routers import events, habit_entries, habits, mood, pomodoro, tasks

DEFAULT_HABITS = ["Gym", "Walk", "Sleep", "Meals"]


def _seed_default_habits() -> None:
    db = SessionLocal()
    try:
        if db.scalar(select(Habit)) is None:
            for name in DEFAULT_HABITS:
                db.add(Habit(name=name, weekly_target=7))
            db.commit()
    finally:
        db.close()


@asynccontextmanager
async def lifespan(app: FastAPI):
    Base.metadata.create_all(bind=engine)
    _seed_default_habits()
    yield


app = FastAPI(title="TimesUp API", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origin_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(tasks.router)
app.include_router(habits.router)
app.include_router(habit_entries.router)
app.include_router(mood.router)
app.include_router(events.router)
app.include_router(pomodoro.router)


@app.get("/health")
def health():
    return {"status": "ok"}
