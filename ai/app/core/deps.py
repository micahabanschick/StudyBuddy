import logging
from typing import Annotated

from fastapi import Depends, Header, HTTPException, status
from jose import JWTError, jwt
from pydantic import BaseModel

from app.core.config import Settings, get_settings

logger = logging.getLogger(__name__)


class CurrentUser(BaseModel):
    id: str
    email: str | None = None
    role: str | None = None


def require_service_secret(
    settings: Annotated[Settings, Depends(get_settings)],
    x_service_secret: Annotated[str | None, Header(alias="X-Service-Secret")] = None,
) -> None:
    expected = settings.service_secret
    if not expected:
        # Warn unless explicitly running in local dev mode.
        if settings.app_env not in ("development", "local"):
            logger.warning(
                "SERVICE_SECRET is not set — internal auth is disabled. "
                "Set SERVICE_SECRET in production to prevent unauthenticated access."
            )
        return
    if x_service_secret != expected:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="invalid service secret",
        )


def require_user(
    settings: Annotated[Settings, Depends(get_settings)],
    authorization: Annotated[str | None, Header()] = None,
) -> CurrentUser:
    if not settings.is_supabase_configured:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="auth not configured: set SUPABASE_JWT_SECRET",
        )

    if not authorization or not authorization.lower().startswith("bearer "):
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, detail="missing bearer token")

    token = authorization.split(" ", 1)[1].strip()

    try:
        payload = jwt.decode(
            token,
            settings.supabase_jwt_secret or "",
            algorithms=["HS256"],
            audience="authenticated",
        )
    except JWTError as exc:
        logger.debug("JWT validation failed: %s", exc)
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, detail="invalid token") from exc

    sub = payload.get("sub")
    if not isinstance(sub, str):
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, detail="malformed token")

    return CurrentUser(id=sub, email=payload.get("email"), role=payload.get("role"))
