from fastapi import Header, HTTPException, Depends
from typing import Optional
from app.core.firebase import verify_id_token


def get_bearer_token(authorization: Optional[str] = Header(None)) -> str:
    if not authorization:
        raise HTTPException(status_code=401, detail="Authorization header missing")
    parts = authorization.split()
    if len(parts) != 2 or parts[0].lower() != "bearer":
        raise HTTPException(status_code=401, detail="Invalid authorization header")
    return parts[1]


def get_current_user(token: str = Depends(get_bearer_token)) -> dict:
    try:
        decoded = verify_id_token(token)
        return decoded
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid or expired Firebase ID token")
