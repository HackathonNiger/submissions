from pathlib import Path
from dotenv import load_dotenv
from pydantic_settings import BaseSettings

env_path = Path(__file__).resolve().parent / ".env"
load_dotenv(dotenv_path=env_path)

class Settings(BaseSettings):
    DATABASE_URL: str
    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24
    PAYSTACK_SECRET: str | None = None
    PAYSTACK_WEBHOOK_SECRET: str | None = None
    PAYSTACK_CALLBACK_URL: str | None = None
    PAYSTACK_CANCEL_URL: str | None = None
    OPENROUTER_API_KEY: str | None = None
    FACE_MATCH_THRESHOLD: float  = 0.90
    MAX_DISTANCE_THRESHOLD: float | None = None

    refresh_token_expire_days: int = 7
    reset_password_token_expire_minutes: int = 30

    class Config:
        env_file = ".env"
        extra = "ignore"

def get_settings() -> Settings:
    return Settings()

settings = Settings()

print("Loaded DATABASE_URL:", settings.DATABASE_URL)
print("Loaded SECRET_KEY:", settings.SECRET_KEY)


