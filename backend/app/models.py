from datetime import datetime
from sqlalchemy import String, Float, Integer, DateTime, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship

from .database import Base


class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    phone_number: Mapped[str] = mapped_column(String(20), unique=True, index=True)
    language: Mapped[str] = mapped_column(String(8), default="en")
    location_lat: Mapped[float | None] = mapped_column(Float, nullable=True)
    location_lng: Mapped[float | None] = mapped_column(Float, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    appointments: Mapped[list["Appointment"]] = relationship(back_populates="user")


class Clinic(Base):
    __tablename__ = "clinics"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(120), index=True)
    latitude: Mapped[float] = mapped_column(Float)
    longitude: Mapped[float] = mapped_column(Float)
    specialty: Mapped[str] = mapped_column(String(80))
    doctor_name: Mapped[str] = mapped_column(String(120), default="Doctor unavailable")
    consultation_fee: Mapped[int] = mapped_column(Integer, default=0)
    avg_wait_time: Mapped[int] = mapped_column(Integer, default=20)
    is_available: Mapped[bool] = mapped_column(default=True)

    queue_data: Mapped["QueueData"] = relationship(back_populates="clinic", uselist=False)
    doctors: Mapped[list["Doctor"]] = relationship(back_populates="clinic", cascade="all, delete-orphan")
    appointments: Mapped[list["Appointment"]] = relationship(back_populates="clinic")


class Doctor(Base):
    __tablename__ = "doctors"

    id: Mapped[int] = mapped_column(primary_key=True)
    clinic_id: Mapped[int] = mapped_column(ForeignKey("clinics.id"), index=True)
    name: Mapped[str] = mapped_column(String(120))
    consultation_fee: Mapped[int] = mapped_column(Integer, default=0)
    is_available: Mapped[bool] = mapped_column(default=True)

    clinic: Mapped[Clinic] = relationship(back_populates="doctors")
    appointments: Mapped[list["Appointment"]] = relationship(back_populates="doctor")


class Appointment(Base):
    __tablename__ = "appointments"

    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), index=True)
    clinic_id: Mapped[int] = mapped_column(ForeignKey("clinics.id"), index=True)
    doctor_id: Mapped[int | None] = mapped_column(ForeignKey("doctors.id"), index=True, nullable=True)
    appointment_time: Mapped[datetime] = mapped_column(DateTime, index=True)
    booking_status: Mapped[str] = mapped_column(String(32), default="confirmed")
    client_request_id: Mapped[str | None] = mapped_column(String(64), unique=True, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    user: Mapped["User"] = relationship(back_populates="appointments")
    clinic: Mapped["Clinic"] = relationship(back_populates="appointments")
    doctor: Mapped[Doctor | None] = relationship(back_populates="appointments")


class QueueData(Base):
    __tablename__ = "queue_data"

    clinic_id: Mapped[int] = mapped_column(ForeignKey("clinics.id"), primary_key=True)
    active_patients: Mapped[int] = mapped_column(Integer, default=0)
    avg_consultation_time: Mapped[int] = mapped_column(Integer, default=12)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    clinic: Mapped[Clinic] = relationship(back_populates="queue_data")
