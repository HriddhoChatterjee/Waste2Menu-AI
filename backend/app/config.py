"""
KitchenOS Backend Configuration
================================
Pydantic BaseSettings loading environment variables with strict typing.
Supports both SQLite (local development) and PostgreSQL (production).
"""

from functools import lru_cache
from typing import List
from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    APP_NAME: str = "KitchenOS - Scrap-to-Menu AI & NGO Redistribution System"
    APP_VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"
    DEBUG: bool = False

    # Database Configuration
    DATABASE_URL: str = Field(
        default="sqlite:///./kitchenos.db",
        description="Database connection string (SQLite for dev, PostgreSQL for production)",
    )
    DB_ECHO: bool = False

    # CORS Settings
    CORS_ORIGINS: List[str] = [
        "http://localhost:5173",
        "http://localhost:3000",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:3000",
        "*",
    ]

    # Restaurant Geolocation (Defaults to central location)
    RESTAURANT_LATITUDE: float = Field(default=28.6139, description="Restaurant Latitude")
    RESTAURANT_LONGITUDE: float = Field(default=77.2090, description="Restaurant Longitude")

    # Optimization & Business Defaults
    MIN_BATCH_PORTIONS: int = 8
    MIN_GROSS_MARGIN_PCT: float = 85.0
    CO2E_PER_KG_SCRAP: float = 2.5  # 2.5 kg CO2e avoided per kg food diverted

    # Security
    SECRET_KEY: str = "kitchenos-production-super-secret-key-change-in-env"
    OTP_EXPIRY_MINUTES: int = 60

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=True,
        extra="ignore",
    )


@lru_cache()
def get_settings() -> Settings:
    return Settings()
