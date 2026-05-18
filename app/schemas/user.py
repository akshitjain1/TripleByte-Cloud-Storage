import uuid
from datetime import datetime

from pydantic import BaseModel, ConfigDict, EmailStr, Field


class UserCreate(BaseModel):
    """Incoming JSON for POST /auth/register"""
    email: EmailStr
    password: str = Field(min_length=8, max_length=128)


class UserLogin(BaseModel):
    """Incoming JSON for POST /auth/login"""
    email: EmailStr
    password: str


class UserRead(BaseModel):
    """Outgoing JSON when returning a user — note: no password field, ever."""
    id: uuid.UUID
    email: EmailStr
    is_active: bool
    created_at: datetime

    # Lets Pydantic read attributes off SQLAlchemy ORM objects.
    model_config = ConfigDict(from_attributes=True)


class Token(BaseModel):
    """Response from POST /auth/login"""
    access_token: str
    token_type: str = "bearer"