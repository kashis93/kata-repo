"""Application configuration loaded from environment variables."""

from functools import lru_cache

from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """
    Central configuration for the Car Dealership API.

    All secrets and connection strings are read from a `.env` file
    or the process environment; nothing sensitive is hardcoded here.
    """

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore",
    )

    database_url: str = Field(
        default="sqlite:///./car_dealership.db",
        description="SQLAlchemy database URL.",
    )
    secret_key: str = Field(
        ...,
        min_length=32,
        description="Secret key used to sign JWT access tokens.",
    )
    algorithm: str = Field(default="HS256", description="JWT signing algorithm.")
    access_token_expire_minutes: int = Field(
        default=30,
        ge=1,
        description="Access token lifetime in minutes.",
    )
    project_name: str = Field(
        default="Car Dealership API",
        description="Human-readable application name.",
    )


@lru_cache
def get_settings() -> Settings:
    """
    Return a cached Settings instance.

    Returns:
        Settings: Parsed application settings.
    """
    return Settings()


settings: Settings = get_settings()
