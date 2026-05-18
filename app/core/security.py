from datetime import datetime, timedelta, timezone
from typing import Any

from jose import JWTError, jwt
from passlib.context import CryptContext

from app.config import settings

# bcrypt context. `deprecated="auto"` lets us upgrade hash schemes later
# without breaking existing users.
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


# ---------- Password helpers ----------

def hash_password(plain_password: str) -> str:
    """Hash a plain password for storing in the DB."""
    return pwd_context.hash(plain_password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Check a plain password against a stored hash."""
    return pwd_context.verify(plain_password, hashed_password)


# ---------- JWT helpers ----------

def create_access_token(subject: str | Any, expires_minutes: int | None = None) -> str:
    """
    Create a signed JWT.
    `subject` becomes the `sub` claim — we put the user's UUID there.
    """
    expire = datetime.now(timezone.utc) + timedelta(
        minutes=expires_minutes or settings.JWT_EXPIRE_MINUTES
    )
    to_encode = {
        "sub": str(subject),
        "exp": expire,
        "iat": datetime.now(timezone.utc),  # issued-at
    }
    return jwt.encode(
        to_encode,
        settings.JWT_SECRET_KEY,
        algorithm=settings.JWT_ALGORITHM,
    )


def decode_access_token(token: str) -> dict | None:
    """
    Verify a JWT's signature and expiry.
    Returns the payload dict, or None if invalid/expired.
    """
    try:
        payload = jwt.decode(
            token,
            settings.JWT_SECRET_KEY,
            algorithms=[settings.JWT_ALGORITHM],
        )
        return payload
    except JWTError:
        return None