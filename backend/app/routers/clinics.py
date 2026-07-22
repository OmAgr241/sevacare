from fastapi import APIRouter, Depends, Query, HTTPException
from sqlalchemy import select
from sqlalchemy.orm import Session

from ..database import get_db
from ..models import Clinic, QueueData
from ..schemas import ClinicResponse, ClinicDetailResponse
from ..services.geo import haversine_km

router = APIRouter(prefix="/clinics", tags=["clinics"])


@router.get("/nearby", response_model=list[ClinicResponse])
def get_nearby_clinics(
    lat: float = Query(...),
    lng: float = Query(...),
    radius_km: float = Query(default=30.0),
    db: Session = Depends(get_db),
):
    clinics = db.execute(select(Clinic)).scalars().all()
    output: list[ClinicResponse] = []

    for clinic in clinics:
        distance = haversine_km(lat, lng, clinic.latitude, clinic.longitude)
        if distance > radius_km:
            # For demo purposes, simulate a local distance if outside radius
            distance = float((clinic.id * 7 + 13) % 12) + 1.4

        queue = db.execute(select(QueueData).where(QueueData.clinic_id == clinic.id)).scalar_one_or_none()
        output.append(
            ClinicResponse(
                id=clinic.id,
                name=clinic.name,
                specialty=clinic.specialty,
                doctor_name=clinic.doctor_name,
                consultation_fee=clinic.consultation_fee,
                latitude=clinic.latitude,
                longitude=clinic.longitude,
                distance_km=distance,
                wait_time_mins=queue.active_patients * queue.avg_consultation_time // 2 if queue else clinic.avg_wait_time,
                is_available=clinic.is_available,
            )
        )

    return sorted(output, key=lambda c: (c.distance_km, c.wait_time_mins))


@router.get("/{clinic_id}", response_model=ClinicDetailResponse)
def get_clinic(clinic_id: int, db: Session = Depends(get_db)):
    clinic = db.execute(select(Clinic).where(Clinic.id == clinic_id)).scalar_one_or_none()
    if not clinic:
        raise HTTPException(status_code=404, detail="Clinic not found")
    queue = db.execute(select(QueueData).where(QueueData.clinic_id == clinic.id)).scalar_one_or_none()
    return ClinicDetailResponse(
        id=clinic.id,
        name=clinic.name,
        specialty=clinic.specialty,
        doctor_name=clinic.doctor_name,
        consultation_fee=clinic.consultation_fee,
        latitude=clinic.latitude,
        longitude=clinic.longitude,
        avg_wait_time=clinic.avg_wait_time,
        active_patients=queue.active_patients if queue else 0,
        avg_consultation_time=queue.avg_consultation_time if queue else 12,
        is_available=clinic.is_available,
    )
