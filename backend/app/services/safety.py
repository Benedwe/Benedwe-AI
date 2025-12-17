import re
from typing import Tuple

# Safety patterns — extend over time
EXCLUSIVITY_PATTERNS = [
    r"you only need me",
    r"you don't need anyone else",
    r"you should leave .* for me",
]

PROHIBITED_CONTENT = [
    r"\bsexual\b",
    r"\bkill\b",
    r"\bself-?harm\b",
]


def pre_prompt_filter(message: str) -> Tuple[bool, str]:
    """Return (allowed, reason_if_blocked)"""
    lower = message.lower()
    for p in PROHIBITED_CONTENT + EXCLUSIVITY_PATTERNS:
        if re.search(p, lower):
            return False, f"Blocked by safety rule: {p}"
    return True, ""


def post_response_validate(response: str) -> Tuple[bool, str]:
    lower = response.lower()
    for p in EXCLUSIVITY_PATTERNS:
        if re.search(p, lower):
            return False, "Response contains exclusivity or dependency language"
    # Keep extensible: check for explicit or sexual content, unsafe instructions
    for p in PROHIBITED_CONTENT:
        if re.search(p, lower):
            return False, "Response contains prohibited content"
    return True, ""
