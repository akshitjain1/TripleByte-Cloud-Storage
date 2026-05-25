import uuid
import re
import boto3
from botocore.exceptions import ClientError

from app.config import settings
from botocore.config import Config


def sanitize_filename(filename: str) -> str:
    filename = filename.strip()
    filename = filename.replace(" ", "_")

    filename = re.sub(
        r"[^a-zA-Z0-9._-]",
        "",
        filename,
    )

    return filename


class S3Service:
    def __init__(self):
        self.s3_client = boto3.client(
    "s3",
    region_name=settings.AWS_REGION,
    aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
    aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
    config=Config(
        signature_version="s3v4",
        s3={"addressing_style": "virtual"}
    ),
    endpoint_url=f"https://s3.{settings.AWS_REGION}.amazonaws.com"
)
        self.bucket_name = settings.S3_BUCKET_NAME

    def generate_s3_key(
        self,
        user_id: str,
        filename: str,
    ) -> str:
        unique_id = uuid.uuid4()
        safe_filename = sanitize_filename(filename)
        return (
            f"users/{user_id}/"
            f"{unique_id}_{safe_filename}"
        )

    def upload_file(
        self,
        file_obj,
        s3_key: str,
        content_type: str,
    ):
        self.s3_client.upload_fileobj(
            Fileobj=file_obj,
            Bucket=self.bucket_name,
            Key=s3_key,
            ExtraArgs={
                "ContentType": content_type
            },
        )

    def generate_download_url(
        self,
        s3_key: str,
        expires_in: int = 900,
    ):
        return self.s3_client.generate_presigned_url(
            "get_object",
            Params={
                "Bucket": self.bucket_name,
                "Key": s3_key,
            },
            ExpiresIn=expires_in,
        )

    def delete_file(self, s3_key: str):
        self.s3_client.delete_object(
            Bucket=self.bucket_name,
            Key=s3_key,
        )


s3_service = S3Service()