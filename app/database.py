from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker

from app.config import settings

# The "engine" is SQLAlchemy's low-level connection to the database.
# pool_pre_ping=True checks each connection is alive before using it
# (avoids "stale connection" errors after DB restarts).
engine = create_engine(settings.DATABASE_URL, pool_pre_ping=True)

# A SessionLocal is a factory: calling SessionLocal() gives you a new DB session.
# A "session" is a unit of work — you do some queries, commit, and close it.
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base is the parent class all our ORM models will inherit from.
Base = declarative_base()


def get_db():
    """
    FastAPI dependency that yields a database session per request,
    then closes it automatically when the request finishes.
    Used in endpoints like:  def my_endpoint(db: Session = Depends(get_db)):
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()