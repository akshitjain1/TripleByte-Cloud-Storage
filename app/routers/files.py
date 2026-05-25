from uuid import UUID

from fastapi import APIRouter, Depends, File as FastAPIFile, HTTPException, UploadFile, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.dependencies import get_current_user
from app.models.file import File
from app.models.user import User
from app.schemas.file import (
    DownloadResponse,
    FileRead,
    FileUploadResponse,
)
from app.services.s3_service import s3_service
from app.core.logger import logger

router = APIRouter(
    prefix="/files",
    tags=["files"],
)
ALLOWED_TYPES = {
    "application/pdf",
    "text/plain",
    "image/png",
    "image/jpeg",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
}
@router.post(
    "/upload",
    response_model=FileUploadResponse,
    status_code=status.HTTP_201_CREATED,
)
def upload_file(
    uploaded_file: UploadFile = FastAPIFile(...),
      
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Upload file to S3 and store metadata in PostgreSQL.
    """
    logger.info(
        f"Filename={uploaded_file.filename}, "
        f"ContentType={uploaded_file.content_type}"
    )
    
    if uploaded_file.content_type not in ALLOWED_TYPES:
        raise HTTPException(
            status_code=400,
            detail=f"File type not allowed: {uploaded_file.content_type}",
        )
    
    uploaded_file.file.seek(0, 2)
    file_size = uploaded_file.file.tell()
    uploaded_file.file.seek(0)
    
    MAX_FILE_SIZE = 5 * 1024 * 1024
    if file_size > MAX_FILE_SIZE:
        raise HTTPException(
            status_code=400,
            detail="File size exceeds the maximum allowed size",
        )
    
    s3_key = s3_service.generate_s3_key(
        str(current_user.id),
        uploaded_file.filename,
    )

    try:
        s3_service.upload_file(
            file_obj=uploaded_file.file,
            s3_key=s3_key,
            content_type=uploaded_file.content_type,
        )
    except Exception:
        raise HTTPException(
            status_code=500,
            detail="Failed to upload file",
        )

    file_record = File(
        owner_id=current_user.id,
        filename=uploaded_file.filename,
        s3_key=s3_key,
        size_bytes=file_size,
        content_type=uploaded_file.content_type,
    )

    db.add(file_record)
    db.commit()
    db.refresh(file_record)
    
    logger.info(
        f"File uploaded: {uploaded_file.filename}"
    )
    
    return {
        "message": "File uploaded successfully",
        "file": file_record,
    }
    
@router.get(
    "",
    response_model=list[FileRead],
)
def list_files(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    files = (
        db.query(File)
        .filter(
            File.owner_id == current_user.id,
            File.is_deleted == False,
        )
        .order_by(File.uploaded_at.desc())
        .all()
    )

    return files

@router.get(
    "/{file_id}/download",
    response_model=DownloadResponse,
)
def download_file(
    file_id: UUID,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    file_record = (
        db.query(File)
        .filter(
            File.id == file_id,
            File.owner_id == current_user.id,
            File.is_deleted == False,
        )
        .first()
    )

    if not file_record:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="File not found",
        )

    download_url = s3_service.generate_download_url(
        file_record.s3_key
    )

    return {
        "download_url": download_url
    }

@router.delete("/{file_id}")
def delete_file(
    file_id: UUID,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    file_record = (
        db.query(File)
        .filter(
            File.id == file_id,
            File.owner_id == current_user.id,
            File.is_deleted == False,
        )
        .first()
    )

    if not file_record:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="File not found",
        )

    s3_service.delete_file(
        file_record.s3_key
    )

    file_record.is_deleted = True

    db.commit()

    return {
        "message": "File deleted successfully"
    }