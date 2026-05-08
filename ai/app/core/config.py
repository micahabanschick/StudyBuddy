from functools import lru_cache

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore",
    )

    supabase_url: str | None = None
    supabase_anon_key: str | None = None
    supabase_service_role_key: str | None = None
    supabase_jwt_secret: str | None = None

    anthropic_api_key: str | None = None

    service_secret: str | None = None
    web_origin: str = "http://localhost:3000"

    host: str = "0.0.0.0"
    port: int = 8000
    log_level: str = "info"

    @property
    def is_supabase_configured(self) -> bool:
        return bool(self.supabase_jwt_secret) and self.supabase_jwt_secret != "YOUR-JWT-SECRET"


@lru_cache
def get_settings() -> Settings:
    return Settings()
