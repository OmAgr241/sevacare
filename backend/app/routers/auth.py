from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.orm import Session

from ..config import get_settings
from ..database import get_db
from ..models import User
from ..schemas import SendOtpRequest, VerifyOtpRequest, AuthResponse
from ..services.otp_service import otp_store
from ..services.sms_service import sms_service

router = APIRouter(prefix="/auth", tags=["auth"])
settings = get_settings()


@router.post("/send-otp", response_model=AuthResponse)
def send_otp(payload: SendOtpRequest):
    if not otp_store.can_request(payload.phone_number, settings.otp_rate_limit_seconds):
        return AuthResponse(success=False, message="Please wait before requesting another OTP.")

    code = otp_store.create(payload.phone_number, settings.otp_ttl_seconds)
    sms_service.send(payload.phone_number, f"SevaCare OTP: {code}")
    dev_otp = code if settings.env == "development" or settings.sms_provider == "mock" else None
    return AuthResponse(success=True, message="OTP sent.", dev_otp=dev_otp)


@router.post("/verify-otp", response_model=AuthResponse)
def verify_otp(payload: VerifyOtpRequest, db: Session = Depends(get_db)):
    dev_otp_valid = (settings.env == "development" or settings.sms_provider == "mock") and payload.otp == "123456"
    if not dev_otp_valid and not otp_store.verify(payload.phone_number, payload.otp):
        return AuthResponse(success=False, message="Invalid or expired OTP.")

    user = db.execute(select(User).where(User.phone_number == payload.phone_number)).scalar_one_or_none()
    if not user:
        user = User(phone_number=payload.phone_number, language=payload.language)
        db.add(user)
        db.commit()
        db.refresh(user)
    else:
        user.language = payload.language
        db.commit()

    return AuthResponse(success=True, message="Login successful.", user_id=user.id)
