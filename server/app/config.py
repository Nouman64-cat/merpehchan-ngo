from functools import lru_cache

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    # Database
    mongodb_url: str
    mongodb_db_name: str = "meripehchan"

    # Auth
    jwt_secret_key: str
    jwt_algorithm: str = "HS256"
    jwt_expires_minutes: int = 60 * 12  # 12 hours

    # Unset until `python -m scripts.create_admin` is run
    admin_username: str | None = None
    admin_password_hash: str | None = None

    # AWS S3 (team member photos)
    aws_iam_key: str
    aws_iam_secret: str
    aws_s3_bucket_name: str
    aws_region: str = "us-east-1"

    # AWS SES (not wired up yet, reserved for future notifications)
    aws_ses_username: str | None = None
    aws_ses_password: str | None = None
    aws_ses_from_email: str | None = None

    # CORS
    cors_origins: str = "http://localhost:3002"

    @property
    def cors_origin_list(self) -> list[str]:
        return [origin.strip() for origin in self.cors_origins.split(",") if origin.strip()]


@lru_cache
def get_settings() -> Settings:
    return Settings()
