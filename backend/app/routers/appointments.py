from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import select
from sqlalchemy.orm import Session

from ..database import get_db
from ..models import Appointment, Clinic, Doctor, User
from ..schemas import (
    BookAppointmentRequest,
    BookAppointmentResponse,
    AppointmentStatusResponse,
)
from ..services.sms_service import sms_service

router = APIRouter(prefix="/appointments", tags=["appointments"])


@router.post("/book", response_model=BookAppointmentResponse)
def book_appointment(payload: BookAppointmentRequest, db: Session = Depends(get_db)):
    user = db.execute(select(User).where(User.id == payload.user_id)).scalar_one_or_none()
    clinic = db.execute(select(Clinic).where(Clinic.id == payload.clinic_id)).scalar_one_or_none()
    if not user or not clinic:
        raise HTTPException(status_code=404, detail="User or clinic not found")

    doctor = db.execute(
        select(Doctor).where(Doctor.id == payload.doctor_id, Doctor.clinic_id == clinic.id)
    ).scalar_one_or_none()
    if not doctor or not doctor.is_available:
        raise HTTPException(status_code=400, detail="Selected doctor is not available for booking")

    if payload.client_request_id:
        existing = db.execute(
            select(Appointment).where(Appointment.client_request_id == payload.client_request_id)
        ).scalar_one_or_none()
        if existing:
            return BookAppointmentResponse(
                appointment_id=existing.id,
                booking_status=existing.booking_status,
                sms_status="already_sent",
            )

    appt = Appointment(
        user_id=payload.user_id,
        clinic_id=payload.clinic_id,
        doctor_id=doctor.id,
        appointment_time=payload.appointment_time,
        booking_status="confirmed",
        client_request_id=payload.client_request_id,
    )
    db.add(appt)
    db.commit()
    db.refresh(appt)

    msg = f"Your appointment with {doctor.name} at {clinic.name} is confirmed for {appt.appointment_time.strftime('%I:%M %p')}."
    sms_status = sms_service.send(user.phone_number, msg)
    return BookAppointmentResponse(
        appointment_id=appt.id,
        booking_status=appt.booking_status,
        sms_status=sms_status,
    )


@router.get("/status", response_model=AppointmentStatusResponse)
def appointment_status(appointment_id: int = Query(...), db: Session = Depends(get_db)):
    appt = db.execute(select(Appointment).where(Appointment.id == appointment_id)).scalar_one_or_none()
    if not appt:
        raise HTTPException(status_code=404, detail="Appointment not found")
    clinic = db.execute(select(Clinic).where(Clinic.id == appt.clinic_id)).scalar_one()
    doctor = db.get(Doctor, appt.doctor_id) if appt.doctor_id else None

    return AppointmentStatusResponse(
        appointment_id=appt.id,
        booking_status=appt.booking_status,
        appointment_time=appt.appointment_time,
        clinic_name=clinic.name,
        doctor_name=doctor.name if doctor else None,
    )
