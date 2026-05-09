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
    # Comma-separated list of allowed CORS origins.
    web_origins: str = "http://localhost:3000"

    # Python-native environment flag. Set APP_ENV=production on Fly.io.
    app_env: str = "local"

    # Set BYPASS_AUTH=true in local dev to skip JWT validation.
    bypass_auth: bool = False

    host: str = "0.0.0.0"
    port: int = 8000
    log_level: str = "info"

    @property
    def allowed_origins(self) -> list[str]:
        return [o.strip() for o in self.web_origins.split(",") if o.strip()]

    @property
    def is_supabase_configured(self) -> bool:
        return bool(self.supabase_jwt_secret) and self.supabase_jwt_secret != "YOUR-JWT-SECRET"


@lru_cache
def get_settings() -> Settings:
    return Settings()
