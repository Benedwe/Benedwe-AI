from typing import Literal

MOOD_KEYWORDS = {
    "sad": ["sad", "unhappy", "depressed", "down", "lonely", "cry"],
    "happy": ["happy", "joy", "excited", "great", "wonderful", "yay"],
    "stressed": ["stressed", "anxious", "overwhelmed", "panic"],
    "playful": ["lol", "haha", "joke", "tease", "flirt"],
}


def detect_mood(text: str) -> Literal["sad", "happy", "stressed", "playful", "neutral"]:
    t = text.lower()
    scores = {k: 0 for k in MOOD_KEYWORDS}
    for mood, words in MOOD_KEYWORDS.items():
        for w in words:
            if w in t:
                scores[mood] += 1

    best = max(scores.items(), key=lambda x: x[1])
    if best[1] == 0:
        return "neutral"
    return best[0]
