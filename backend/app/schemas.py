from datetime import datetime
from pydantic import BaseModel, Field


class SendOtpRequest(BaseModel):
    phone_number: str = Field(min_length=10, max_length=15)


class VerifyOtpRequest(BaseModel):
    phone_number: str = Field(min_length=10, max_length=15)
    otp: str = Field(min_length=4, max_length=8)
    language: str = "en"


class AuthResponse(BaseModel):
    success: bool
    message: str
    user_id: int | None = None
    dev_otp: str | None = None


class DoctorResponse(BaseModel):
    id: int
    name: str
    consultation_fee: int
    is_available: bool


class ClinicResponse(BaseModel):
    id: int
    name: str
    specialty: str
    doctor_name: str
    consultation_fee: int
    latitude: float
    longitude: float
    distance_km: float
    wait_time_mins: int
    is_available: bool
    available_doctor_count: int
    doctors: list[DoctorResponse]


class ClinicDetailResponse(BaseModel):
    id: int
    name: str
    specialty: str
    doctor_name: str
    consultation_fee: int
    latitude: float
    longitude: float
    avg_wait_time: int
    active_patients: int
    avg_consultation_time: int
    is_available: bool
    available_doctor_count: int
    doctors: list[DoctorResponse]


class BookAppointmentRequest(BaseModel):
    user_id: int
    clinic_id: int
    doctor_id: int
    appointment_time: datetime
    client_request_id: str | None = None


class BookAppointmentResponse(BaseModel):
    appointment_id: int
    booking_status: str
    sms_status: str


class AppointmentStatusResponse(BaseModel):
    appointment_id: int
    booking_status: str
    appointment_time: datetime
    clinic_name: str
    doctor_name: str | None = None


class WaitTimeResponse(BaseModel):
    clinic_id: int
    estimated_wait_mins: int
    crowd_level: str
    best_visit_time: str
