from collections.abc import AsyncIterator
from contextlib import asynccontextmanager
from typing import Annotated

from fastapi import Depends, FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import get_settings
from app.core.deps import CurrentUser, require_service_secret, require_user
from app.core.logging import configure_logging, get_logger
from app.routers import chem, flashcards, quiz, rag

logger = get_logger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncIterator[None]:  # noqa: ARG001
    settings = get_settings()
    configure_logging(settings.log_level)
    logger.info(
        "ai_service.start",
        supabase_configured=settings.is_supabase_configured,
        web_origin=settings.web_origin,
    )
    yield


app = FastAPI(
    title="StudyBuddy AI",
    version="0.1.0",
    description="RAG, embeddings, and science-specific tooling for StudyBuddy.",
    lifespan=lifespan,
)

settings = get_settings()
app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.web_origin],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health", tags=["meta"])
def health() -> dict[str, str]:
    return {"status": "ok"}


@app.get("/whoami", tags=["meta"], dependencies=[Depends(require_service_secret)])
def whoami(user: Annotated[CurrentUser, Depends(require_user)]) -> CurrentUser:
    return user


app.include_router(rag.router, prefix="/rag", tags=["rag"])
app.include_router(quiz.router, prefix="/quiz", tags=["quiz"])
app.include_router(flashcards.router, prefix="/flashcards", tags=["flashcards"])
app.include_router(chem.router, prefix="/chem", tags=["chem"])
