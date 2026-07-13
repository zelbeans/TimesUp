from datetime import date as date_, datetime, timedelta

from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
from googleapiclient.discovery import build

from app.config import settings


class GoogleCalendarNotConnected(Exception):
    pass


def _load_credentials() -> Credentials:
    token_path = settings.google_token_file
    try:
        creds = Credentials.from_authorized_user_file(token_path)
    except FileNotFoundError as exc:
        raise GoogleCalendarNotConnected(
            "Google Calendar not connected — run backend/scripts/google_auth_setup.py"
        ) from exc

    if creds.expired and creds.refresh_token:
        creds.refresh(Request())
        with open(token_path, "w") as f:
            f.write(creds.to_json())

    return creds


def _extract_date(event: dict) -> date_:
    start = event["start"]
    if "date" in start:
        return date_.fromisoformat(start["date"])
    return datetime.fromisoformat(start["dateTime"]).date()


def fetch_upcoming_events() -> list[dict]:
    creds = _load_credentials()
    service = build("calendar", "v3", credentials=creds)

    now = datetime.utcnow()
    time_min = now.isoformat() + "Z"
    time_max = (now + timedelta(days=settings.google_sync_days)).isoformat() + "Z"

    events: list[dict] = []
    page_token = None
    while True:
        response = (
            service.events()
            .list(
                calendarId="primary",
                timeMin=time_min,
                timeMax=time_max,
                singleEvents=True,
                orderBy="startTime",
                pageToken=page_token,
            )
            .execute()
        )
        for item in response.get("items", []):
            if "start" not in item:
                continue
            events.append(
                {
                    "google_event_id": item["id"],
                    "title": item.get("summary", "Untitled event"),
                    "date": _extract_date(item),
                }
            )
        page_token = response.get("nextPageToken")
        if not page_token:
            break

    return events
