from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, ConfigDict


class FileRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    filename: str
    size_bytes: int
    content_type: str | None
    uploaded_at: datetime


class FileUploadResponse(BaseModel):
    message: str
    file: FileRead


class DownloadResponse(BaseModel):
    download_url: str