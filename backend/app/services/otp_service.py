import random
import time
from dataclasses import dataclass


@dataclass
class OtpRecord:
    code: str
    expires_at: float
    requested_at: float


class OtpStore:
    def __init__(self):
        self._store: dict[str, OtpRecord] = {}

    def create(self, phone_number: str, ttl_seconds: int) -> str:
        code = f"{random.randint(100000, 999999)}"
        now = time.time()
        self._store[phone_number] = OtpRecord(code=code, expires_at=now + ttl_seconds, requested_at=now)
        return code

    def can_request(self, phone_number: str, min_interval_seconds: int) -> bool:
        record = self._store.get(phone_number)
        if not record:
            return True
        return (time.time() - record.requested_at) >= min_interval_seconds

    def verify(self, phone_number: str, otp: str) -> bool:
        record = self._store.get(phone_number)
        if not record or time.time() > record.expires_at:
            return False
        return record.code == otp


otp_store = OtpStore()
