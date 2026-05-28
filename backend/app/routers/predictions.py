from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import select
from sqlalchemy.orm import Session

from ..database import get_db
from ..models import Clinic, QueueData
from ..schemas import WaitTimeResponse
from ..services.prediction_service import PredictionInput, predict_wait_time

router = APIRouter(prefix="/predictions", tags=["predictions"])


@router.get("/wait-time", response_model=WaitTimeResponse)
def get_wait_time(clinic_id: int = Query(...), db: Session = Depends(get_db)):
    clinic = db.execute(select(Clinic).where(Clinic.id == clinic_id)).scalar_one_or_none()
    if not clinic:
        raise HTTPException(status_code=404, detail="Clinic not found")

    queue = db.execute(select(QueueData).where(QueueData.clinic_id == clinic_id)).scalar_one_or_none()
    now = datetime.now()
    estimate, crowd, best_time = predict_wait_time(
        PredictionInput(
            active_queue=queue.active_patients if queue else 0,
            avg_consultation_mins=queue.avg_consultation_time if queue else 12,
            avg_wait_mins=clinic.avg_wait_time,
            hour=now.hour,
            weekday=now.weekday(),
        )
    )
    return WaitTimeResponse(
        clinic_id=clinic_id,
        estimated_wait_mins=estimate,
        crowd_level=crowd,
        best_visit_time=best_time,
    )
