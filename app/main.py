from fastapi import Depends, FastAPI
from sqlalchemy import text
from sqlalchemy.orm import Session

from app.database import get_db

app = FastAPI(
    title="Cloud File Storage System",
    description="A secure cloud-based file management system using AWS S3.",
    version="0.1.0",
)


@app.get("/health")
def health_check():
    return {"status": "ok"}


@app.get("/health/db")
def db_health(db: Session = Depends(get_db)):
    """Verifies the app can actually reach the database."""
    result = db.execute(text("SELECT 1")).scalar()
    return {"db": "ok", "result": result}


@app.get("/")
def root():
    return {"message": "Welcome to the Cloud File Storage System API", "docs": "/docs"}