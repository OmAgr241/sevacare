from functools import lru_cache
from pydantic import BaseModel
import os


class Settings(BaseModel):
    app_name: str = "SevaCare Rural API"
    env: str = os.getenv("ENV", "development")
    database_url: str = os.getenv(
        "DATABASE_URL", "sqlite:///./sevacare.db"
    )
    redis_url: str = os.getenv("REDIS_URL", "redis://localhost:6379/0")
    otp_ttl_seconds: int = int(os.getenv("OTP_TTL_SECONDS", "300"))
    otp_rate_limit_seconds: int = int(os.getenv("OTP_RATE_LIMIT_SECONDS", "45"))
    twilio_from_number: str | None = os.getenv("TWILIO_FROM_NUMBER")
    sms_provider: str = os.getenv("SMS_PROVIDER", "mock")
    cors_origins: list[str] = os.getenv(
        "CORS_ORIGINS", "http://localhost:3000,http://127.0.0.1:3000"
    ).split(",")


@lru_cache
def get_settings() -> Settings:
    return Settings()
