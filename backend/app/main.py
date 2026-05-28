from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

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


@app.on_event("startup")
def on_startup():
    Base.metadata.create_all(bind=engine)
    with SessionLocal() as db:
        seed_data(db)


@app.get("/health")
def health():
    return {"ok": True, "service": settings.app_name}


app.include_router(auth.router)
app.include_router(clinics.router)
app.include_router(appointments.router)
app.include_router(predictions.router)
