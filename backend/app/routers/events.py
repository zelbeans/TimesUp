from fastapi import Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.crud import make_crud_router
from app.database import get_db
from app.models import SemesterEvent
from app.schemas import (
    GoogleSyncResult,
    SemesterEventCreate,
    SemesterEventRead,
    SemesterEventUpdate,
)
from app.services.google_calendar import GoogleCalendarNotConnected, fetch_upcoming_events

router = make_crud_router(
    model=SemesterEvent,
    create_schema=SemesterEventCreate,
    read_schema=SemesterEventRead,
    update_schema=SemesterEventUpdate,
    prefix="/events",
    tags=["events"],
)


@router.post("/sync-google-calendar", response_model=GoogleSyncResult)
def sync_google_calendar(db: Session = Depends(get_db)):
    try:
        events = fetch_upcoming_events()
    except GoogleCalendarNotConnected as exc:
        raise HTTPException(status_code=424, detail=str(exc)) from exc

    imported = 0
    updated = 0
    for event in events:
        existing = db.scalar(
            select(SemesterEvent).where(SemesterEvent.google_event_id == event["google_event_id"])
        )
        if existing:
            existing.title = event["title"]
            existing.date = event["date"]
            updated += 1
        else:
            db.add(
                SemesterEvent(
                    title=event["title"],
                    date=event["date"],
                    google_event_id=event["google_event_id"],
                    source="google",
                )
            )
            imported += 1

    db.commit()
    return GoogleSyncResult(imported=imported, updated=updated)
