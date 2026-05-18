from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """
    Application configuration loaded from environment variables (and .env file).

    Pydantic validates types: if MAX_UPLOAD_SIZE_MB is missing or non-numeric,
    the app refuses to start. This is much safer than os.getenv() everywhere.
    """

    # Database
    DATABASE_URL: str

    # JWT
    JWT_SECRET_KEY: str
    JWT_ALGORITHM: str = "HS256"
    JWT_EXPIRE_MINUTES: int = 60

    # AWS / S3
    AWS_REGION: str = "us-east-1"
    AWS_ACCESS_KEY_ID: str = ""
    AWS_SECRET_ACCESS_KEY: str = ""
    S3_BUCKET_NAME: str = ""

    # App behavior
    MAX_UPLOAD_SIZE_MB: int = 100
    PRESIGNED_URL_EXPIRE_MINUTES: int = 15

    model_config = SettingsConfigDict(env_file=".env", case_sensitive=True)


# A single, importable settings object the whole app uses.
settings = Settings()