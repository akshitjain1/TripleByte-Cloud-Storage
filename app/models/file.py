import uuid
from datetime import datetime

from sqlalchemy import BigInteger, Boolean, Column, DateTime, ForeignKey, String
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship

from app.database import Base


class File(Base):
    """
    Metadata for a file stored in S3.
    The actual bytes live in S3; this row tells us who owns it
    and where to find it (s3_key).
    """
    __tablename__ = "files"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    owner_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False, index=True)
    filename = Column(String(255), nullable=False)        # original/user-facing name
    s3_key = Column(String(512), unique=True, nullable=False)  # path inside the bucket
    size_bytes = Column(BigInteger, nullable=False)
    content_type = Column(String(127), nullable=True)
    uploaded_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    is_deleted = Column(Boolean, default=False, nullable=False)

    # Many-to-one: every file belongs to one user.
    owner = relationship("User", back_populates="files")