# Google Calendar sync setup

One-time setup so the backend can read your Google Calendar. You do this yourself — it needs your own Google account login, which nothing automated can do for you.

## 1. Create a Google Cloud project

1. Go to https://console.cloud.google.com/projectcreate
2. Give it any name (e.g. "TimesUp") and click **Create**.

## 2. Enable the Calendar API

1. Go to https://console.cloud.google.com/apis/library/calendar-json.googleapis.com
2. Make sure your new project is selected in the top bar.
3. Click **Enable**.

## 3. Configure the OAuth consent screen

1. Go to https://console.cloud.google.com/apis/credentials/consent
2. Choose **External** (unless you have a Google Workspace org), click **Create**.
3. Fill in the required fields (app name, your email as support/contact email). Everything else can be left default.
4. On the **Scopes** step, you don't need to add anything manually.
5. On the **Test users** step, add your own Google account's email address. While the app is in "Testing" mode, only accounts you list here can authorize it — that's fine, it's just you.
6. Save through to the end.

## 4. Create OAuth client credentials

1. Go to https://console.cloud.google.com/apis/credentials
2. Click **Create Credentials** → **OAuth client ID**.
3. Application type: **Desktop app**.
4. Give it any name, click **Create**.
5. Click **Download JSON** on the credential you just created.
6. Save that file as `backend/credentials.json` (exact filename, in the `backend/` folder). This file is gitignored — never commit it.

## 5. Run the one-time authorization script

```bash
cd backend
source .venv/bin/activate
python scripts/google_auth_setup.py
```

This opens a browser tab, asks you to log in and approve access to your calendar (read-only), then saves `backend/token.json`. That file is also gitignored. The backend reads it on every sync request afterward and refreshes it automatically — you shouldn't need to run this script again unless `token.json` gets deleted or access is revoked.

## Troubleshooting

- **"Access blocked: this app's request is invalid"** — double check you added your own email under Test users in step 3.5.
- **"This app isn't verified"** warning during login — expected, since this is a personal unpublished app. Click "Advanced" → "Go to (app name) (unsafe)" to proceed. This is your own app; it's safe.
