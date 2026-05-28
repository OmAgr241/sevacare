from redis import Redis
from redis.exceptions import RedisError

from ..config import get_settings


settings = get_settings()


class SmsService:
    def __init__(self):
        self.redis_client: Redis | None = None
        try:
            self.redis_client = Redis.from_url(settings.redis_url, decode_responses=True)
            self.redis_client.ping()
        except RedisError:
            self.redis_client = None

    def send(self, to_phone: str, message: str) -> str:
        # Production integration point: Twilio/Exotel.
        if self.redis_client:
            try:
                self.redis_client.rpush("sms:outbox", f"{to_phone}|{message}")
            except RedisError:
                pass
        return "queued"


sms_service = SmsService()
