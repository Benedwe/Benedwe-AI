from pydantic import BaseModel, Field
from typing import Optional, List


class ChatRequest(BaseModel):
    user_id: str = Field(..., description="Firebase UID of the requester")
    message: str
    testing: bool = False


class ChatResponse(BaseModel):
    message: str


class ResetRequest(BaseModel):
    user_id: str


class HealthResponse(BaseModel):
    status: str


class MessageModel(BaseModel):
    sender: str
    content: str
    timestamp: Optional[int]


class UserMemory(BaseModel):
    display_name: Optional[str]
    tone_preference: Optional[str]
    interests: Optional[List[str]] = []
