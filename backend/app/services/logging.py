from google.cloud import firestore
from app.core import config
from datetime import datetime, timedelta


def add_training_log(payload: dict):
    db = firestore.Client()
    if not config.settings.training_mode:
        return
    doc = {**payload, "created_at": datetime.utcnow()}
    db.collection("training_logs").add(doc)


def cleanup_old_logs():
    # Example placeholder. Use Firestore TTL policy in production.
    pass
