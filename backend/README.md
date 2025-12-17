# Benedwe AI — Backend (FastAPI)

This repository contains the backend for Benedwe AI, an ethical conversational companion.

Quick start
1. Copy `.env.example` to `.env` and fill in credentials (Firebase service account, OpenAI key).
2. Create a Python virtual environment and install requirements:

```bash
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

3. Run the app locally:

```bash
export $(cat .env | xargs)
uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8000} --reload
```

Architecture
- FastAPI backend with modular services.
- Firebase Authentication for user identity and Cloud Firestore for storage.
- OpenAI (or compatible) LLM via environment-keyed API.

Security notes
- Do NOT expose `OPENAI_API_KEY` or Firebase service account to frontend.
- Enforce Firebase ID token verification on every request.

Files of interest
- `app/main.py` — app entry and router mounting
- `app/core/firebase.py` — firebase initialization
- `app/services` — chat, safety, mood, personality, memory
- `firestore.rules` — example security rules for Firestore
