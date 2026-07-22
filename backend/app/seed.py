from sqlalchemy.orm import Session

from .models import Clinic, QueueData


CLINICS = [
    {"id": 1, "name": "PHC Kolar", "latitude": 13.1362, "longitude": 78.1290, "specialty": "General Medicine", "doctor_name": "Dr. Ananya Rao", "consultation_fee": 120, "avg_wait_time": 15},
    {"id": 2, "name": "Seva Women's Clinic", "latitude": 13.1207, "longitude": 78.1678, "specialty": "Gynecology", "doctor_name": "Dr. Kavya Menon", "consultation_fee": 250, "avg_wait_time": 25},
    {"id": 3, "name": "Grama Child Care", "latitude": 13.1123, "longitude": 78.1506, "specialty": "Pediatrics", "doctor_name": "Dr. Arjun Iyer", "consultation_fee": 180, "avg_wait_time": 20},
    {"id": 4, "name": "Sri Krishna Eye Care", "latitude": 13.1415, "longitude": 78.1325, "specialty": "Eye Care", "doctor_name": "Dr. Nitin Shankar", "consultation_fee": 220, "avg_wait_time": 10},
    {"id": 5, "name": "Rural Dental Center", "latitude": 13.1510, "longitude": 78.1210, "specialty": "Dental Care", "doctor_name": "Dr. Rakesh Bhat", "consultation_fee": 200, "avg_wait_time": 18},
    {"id": 6, "name": "Sanjeevani Wellness Center", "latitude": 13.1250, "longitude": 78.1180, "specialty": "General Medicine", "doctor_name": "Dr. Meera Kulkarni", "consultation_fee": 150, "avg_wait_time": 30},
    {"id": 7, "name": "Ayush Alternative Medicine", "latitude": 13.1090, "longitude": 78.1410, "specialty": "General Medicine", "doctor_name": "Dr. Suresh Naidu", "consultation_fee": 100, "avg_wait_time": 12},
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
    for row in CLINICS:
        clinic = db.get(Clinic, row["id"])
        if clinic:
            for field, value in row.items():
                setattr(clinic, field, value)
        else:
            db.add(Clinic(**row))
    db.commit()

    for row in QUEUE:
        queue = db.get(QueueData, row["clinic_id"])
        if queue:
            queue.active_patients = row["active_patients"]
            queue.avg_consultation_time = row["avg_consultation_time"]
        else:
            db.add(QueueData(**row))
    db.commit()
