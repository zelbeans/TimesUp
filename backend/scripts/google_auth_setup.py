"""One-time Google Calendar authorization. Run from the backend/ directory:

    python scripts/google_auth_setup.py

Opens a browser for you to log in and approve read-only calendar access,
then saves the resulting token to backend/token.json.
"""

from pathlib import Path

from google_auth_oauthlib.flow import InstalledAppFlow

SCOPES = ["https://www.googleapis.com/auth/calendar.readonly"]
BACKEND_DIR = Path(__file__).resolve().parent.parent
CREDENTIALS_FILE = BACKEND_DIR / "credentials.json"
TOKEN_FILE = BACKEND_DIR / "token.json"


def main() -> None:
    if not CREDENTIALS_FILE.exists():
        raise SystemExit(
            f"Missing {CREDENTIALS_FILE}. Follow GOOGLE_CALENDAR_SETUP.md to download it first."
        )

    flow = InstalledAppFlow.from_client_secrets_file(str(CREDENTIALS_FILE), SCOPES)
    credentials = flow.run_local_server(port=0)

    TOKEN_FILE.write_text(credentials.to_json())
    print(f"Saved {TOKEN_FILE} — Google Calendar sync is ready.")


if __name__ == "__main__":
    main()
