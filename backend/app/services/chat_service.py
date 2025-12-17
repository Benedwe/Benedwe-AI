from google.cloud import firestore
from datetime import datetime
from app.services import personality, mood, safety, memory, relationship
from app.core import llm_client

MAX_HISTORY = 20


async def process_chat(uid: str, user_message: str, testing: bool = False) -> str:
    db = firestore.Client()

    # Pre-filter user message
    allowed, reason = safety.pre_prompt_filter(user_message)
    if not allowed:
        return "I'm sorry — I can't engage with that request."

    # Load recent messages
    conv_ref = db.collection("conversations").document(uid).collection("messages")
    msgs = conv_ref.order_by("timestamp", direction=firestore.Query.DESCENDING).limit(MAX_HISTORY).stream()
    history = []
    for d in reversed(list(msgs)):
        data = d.to_dict()
        role = "user" if data.get("sender") == "user" else "assistant"
        history.append({"role": role, "content": data.get("content")})

    # Personality injection
    p = personality.get_personality_for_user(uid)
    system_prompt = p.get("system_prompt")

    # Mood detection to adjust tone
    detected = mood.detect_mood(user_message)
    if detected == "sad":
        system_prompt += "\nBe extra empathetic and reassuring."
    elif detected == "stressed":
        system_prompt += "\nOffer brief grounding and calming suggestions."

    # Build messages list for LLM
    messages = [{"role": "system", "content": system_prompt}]
    messages.extend(history)
    messages.append({"role": "user", "content": user_message})

    # Call LLM
    try:
        ai_text = llm_client.generate_completion(messages)
    except Exception:
        ai_text = "Sorry — I'm having trouble thinking right now. Can we try again in a moment?"

    # Post response validation
    ok, reason = safety.post_response_validate(ai_text)
    if not ok:
        ai_text = "I want to be helpful, but I can't respond that way. Let's try a different approach."

    # Persist user message and assistant reply
    ts = int(datetime.utcnow().timestamp())
    conv_ref.add({"sender": "user", "content": user_message, "timestamp": ts})
    conv_ref.add({"sender": "assistant", "content": ai_text, "timestamp": ts + 1})

    # Update relationship progression and optionally memory snippet
    relationship.touch_interaction(uid)

    # Optionally save training logs if testing
    if testing:
        db.collection("training_logs").add({"uid": uid, "user": user_message, "assistant": ai_text, "ts": ts, "ttl": firestore.SERVER_TIMESTAMP})

    return ai_text
