from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import inspect, text

from .config import get_settings
from .database import Base, engine, SessionLocal
from .routers import auth, clinics, appointments, predictions
from .seed import seed_data

settings = get_settings()
app = FastAPI(title=settings.app_name)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def ensure_clinic_columns():
    columns = {column["name"] for column in inspect(engine).get_columns("clinics")}
    additions = []
    if "doctor_name" not in columns:
        additions.append(
            "ALTER TABLE clinics ADD COLUMN doctor_name VARCHAR(120) NOT NULL DEFAULT 'Doctor unavailable'"
        )
    if "consultation_fee" not in columns:
        additions.append("ALTER TABLE clinics ADD COLUMN consultation_fee INTEGER NOT NULL DEFAULT 0")

    if additions:
        with engine.begin() as connection:
            for statement in additions:
                connection.execute(text(statement))


@app.on_event("startup")
def on_startup():
    Base.metadata.create_all(bind=engine)
    ensure_clinic_columns()
    with SessionLocal() as db:
        seed_data(db)


@app.get("/health")
def health():
    return {"ok": True, "service": settings.app_name}


app.include_router(auth.router)
app.include_router(clinics.router)
app.include_router(appointments.router)
app.include_router(predictions.router)
