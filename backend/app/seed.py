from sqlalchemy import select
from sqlalchemy.orm import Session

from .models import Clinic, QueueData


CLINICS = [
    {"name": "PHC Kolar", "latitude": 13.1362, "longitude": 78.1290, "specialty": "General Medicine", "avg_wait_time": 15},
    {"name": "Seva Women's Clinic", "latitude": 13.1207, "longitude": 78.1678, "specialty": "Gynecology", "avg_wait_time": 25},
    {"name": "Grama Child Care", "latitude": 13.1123, "longitude": 78.1506, "specialty": "Pediatrics", "avg_wait_time": 20},
    {"name": "Sri Krishna Eye Care", "latitude": 13.1415, "longitude": 78.1325, "specialty": "Eye Care", "avg_wait_time": 10},
    {"name": "Rural Dental Center", "latitude": 13.1510, "longitude": 78.1210, "specialty": "Dental Care", "avg_wait_time": 18},
    {"name": "Sanjeevani Wellness Center", "latitude": 13.1250, "longitude": 78.1180, "specialty": "General Medicine", "avg_wait_time": 30},
    {"name": "Ayush Alternative Medicine", "latitude": 13.1090, "longitude": 78.1410, "specialty": "General Medicine", "avg_wait_time": 12},
]

QUEUE = [
    {"clinic_id": 1, "active_patients": 6, "avg_consultation_time": 10},
    {"clinic_id": 2, "active_patients": 11, "avg_consultation_time": 12},
    {"clinic_id": 3, "active_patients": 4, "avg_consultation_time": 11},
    {"clinic_id": 4, "active_patients": 2, "avg_consultation_time": 8},
    {"clinic_id": 5, "active_patients": 5, "avg_consultation_time": 15},
    {"clinic_id": 6, "active_patients": 12, "avg_consultation_time": 14},
    {"clinic_id": 7, "active_patients": 3, "avg_consultation_time": 9},
]


def seed_data(db: Session) -> None:
    existing = db.execute(select(Clinic.id)).first()
    if existing:
        # If database already has clinics, clear them first to allow reseeding the new dataset
        db.execute(select(Clinic)).close() # Close any open result sets
        db.query(QueueData).delete()
        db.query(Clinic).delete()
        db.commit()

    for row in CLINICS:
        db.add(Clinic(**row))
    db.commit()

    for row in QUEUE:
        db.add(QueueData(**row))
    db.commit()
