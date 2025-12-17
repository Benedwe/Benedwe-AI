from fastapi import APIRouter, Depends, HTTPException
from app.api.dependencies import get_current_user
from app.models import schemas
from app.services import chat_service, memory

router = APIRouter()


@router.post("/chat", response_model=schemas.ChatResponse)
async def chat_endpoint(req: schemas.ChatRequest, user=Depends(get_current_user)):
    uid = user.get("uid")
    if uid != req.user_id:
        # Optionally allow admin to act as other user; we keep strict mapping
        raise HTTPException(status_code=403, detail="Token UID does not match request user_id")

    resp = await chat_service.process_chat(uid, req.message, testing=req.testing)
    return schemas.ChatResponse(message=resp)


@router.post("/reset")
async def reset_endpoint(req: schemas.ResetRequest, user=Depends(get_current_user)):
    uid = user.get("uid")
    if uid != req.user_id:
        raise HTTPException(status_code=403, detail="Token UID does not match request user_id")
    await memory.reset_user_memory(uid)
    return {"ok": True}


@router.get("/health")
async def health():
    return {"status": "ok"}
