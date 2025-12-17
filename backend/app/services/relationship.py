from google.cloud import firestore
from datetime import datetime


def touch_interaction(uid: str):
    db = firestore.Client()
    ref = db.collection("relationship_state").document(uid)
    now = datetime.utcnow().isoformat()
    doc = ref.get()
    if not doc.exists:
        ref.set({"level": 1, "interactions": 1, "last_interaction": now})
    else:
        data = doc.to_dict()
        level = data.get("level", 1)
        interactions = data.get("interactions", 0) + 1
        # escalate level every N interactions, enforce caps
        if interactions % 10 == 0 and level < 5:
            level += 1
        ref.update({"level": level, "interactions": interactions, "last_interaction": now})


def get_relationship_state(uid: str) -> dict:
    db = firestore.Client()
    doc = db.collection("relationship_state").document(uid).get()
    if not doc.exists:
        return {"level": 1, "interactions": 0}
    return doc.to_dict()
