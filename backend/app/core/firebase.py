import os
import json
import firebase_admin
from firebase_admin import credentials, auth, firestore
from app.core import config

_initialized = False


def initialize():
    global _initialized
    if _initialized:
        return

    service_path = config.settings.firebase_service_account_path
    service_json = config.settings.firebase_service_account_json

    cred = None
    if service_json:
        data = json.loads(service_json)
        cred = credentials.Certificate(data)
    elif service_path and os.path.exists(service_path):
        cred = credentials.Certificate(service_path)
    else:
        # Use application default credentials fallback
        try:
            cred = credentials.ApplicationDefault()
        except Exception:
            raise RuntimeError("Firebase credentials not found. Set FIREBASE_SERVICE_ACCOUNT_PATH or FIREBASE_SERVICE_ACCOUNT_JSON")

    firebase_admin.initialize_app(cred, {
        'projectId': config.settings.firebase_project_id
    })

    # Expose Firestore client referenced by modules
    firestore.client()
    _initialized = True


def verify_id_token(id_token: str) -> dict:
    """Verify a Firebase ID token and return decoded token (claims)."""
    try:
        return auth.verify_id_token(id_token)
    except Exception as e:
        raise
