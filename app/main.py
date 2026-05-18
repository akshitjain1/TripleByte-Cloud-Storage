from fastapi import Depends, FastAPI
from sqlalchemy import text
from sqlalchemy.orm import Session

from app.database import get_db
from app.dependencies import get_current_user
from app.models.user import User
from app.routers import auth
from app.schemas.user import UserRead

app = FastAPI(
    title="Cloud File Storage System",
    description="A secure cloud-based file management system using AWS S3.",
    version="0.1.0",
)

# Register the auth router. All its endpoints get the /auth prefix.
app.include_router(auth.router)


@app.get("/health")
def health_check():
    return {"status": "ok"}


@app.get("/health/db")
def db_health(db: Session = Depends(get_db)):
    result = db.execute(text("SELECT 1")).scalar()
    return {"db": "ok", "result": result}


@app.get("/auth/me", response_model=UserRead, tags=["auth"])
def me(current_user: User = Depends(get_current_user)):
    """Returns the currently authenticated user."""
    return current_user


@app.get("/")
def root():
    return {"message": "Welcome to the Cloud File Storage System API", "docs": "/docs"}