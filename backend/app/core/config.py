import os
from pydantic import BaseSettings


class Settings(BaseSettings):
    firebase_service_account_path: str | None = None
    firebase_service_account_json: str | None = None
    firebase_project_id: str | None = None

    openai_api_key: str
    openai_model: str = "gpt-4o-mini"

    port: int = 8000
    training_mode: bool = False
    log_ttl_seconds: int = 604800

    class Config:
        env_file = ".env"


settings = Settings()
