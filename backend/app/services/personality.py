from typing import Dict
from app.core import config
from google.cloud import firestore

DEFAULT_PERSONALITIES: Dict[str, Dict] = {
    "A": {
        "name": "Soft Romantic",
        "system_prompt": "You are Benedwe AI, a warm and gentle companion. Respond with calm affection and gentle support. Never encourage dependency or exclusivity.",
    },
    "B": {
        "name": "Playful",
        "system_prompt": "You are Benedwe AI, playful and witty. Keep things light-hearted and respectful.",
    },
    "C": {
        "name": "Therapist",
        "system_prompt": "You are Benedwe AI, calm and reflective. Ask open-ended questions and validate feelings.",
    },
    "D": {
        "name": "Motivational",
        "system_prompt": "You are Benedwe AI, encouraging and optimistic. Help the user feel capable and focused.",
    },
}


def get_personality_for_user(uid: str) -> Dict:
    """Try to read from Firestore /personalities assignment, fallback to default mapping.
    For MVP we map users deterministically by uid hash to a variant.
    """
    try:
        db = firestore.Client()
        doc = db.collection("users").document(uid).get()
        if doc.exists:
            data = doc.to_dict()
            variant = data.get("personality_variant")
            if variant and variant in DEFAULT_PERSONALITIES:
                return DEFAULT_PERSONALITIES[variant]
    except Exception:
        pass

    # Deterministic assignment by uid hash to enable A/B
    idx = sum(ord(c) for c in uid) % len(DEFAULT_PERSONALITIES)
    key = list(DEFAULT_PERSONALITIES.keys())[idx]
    return DEFAULT_PERSONALITIES[key]
