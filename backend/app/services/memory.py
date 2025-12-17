from google.cloud import firestore
from typing import Optional
from app.models.schemas import UserMemory

MEMORY_LIMIT = 10


async def get_user_memory(uid: str) -> UserMemory:
    db = firestore.Client()
    doc = db.collection("users").document(uid).get()
    if not doc.exists:
        return UserMemory()
    data = doc.to_dict().get("memory", {})
    return UserMemory(**data)


async def update_user_memory(uid: str, memory: dict):
    db = firestore.Client()
    # Enforce limits (e.g., max interests length)
    interests = memory.get("interests") or []
    if len(interests) > MEMORY_LIMIT:
        memory["interests"] = interests[:MEMORY_LIMIT]
    db.collection("users").document(uid).set({"memory": memory}, merge=True)


async def reset_user_memory(uid: str):
    db = firestore.Client()
    db.collection("users").document(uid).set({"memory": firestore.DELETE_FIELD}, merge=True)
