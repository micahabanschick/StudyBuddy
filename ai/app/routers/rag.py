from fastapi import APIRouter, Depends, HTTPException, status

from app.core.deps import require_service_secret, require_user

router = APIRouter(dependencies=[Depends(require_service_secret), Depends(require_user)])


@router.post("/ingest")
def ingest() -> dict[str, str]:
    raise HTTPException(status.HTTP_501_NOT_IMPLEMENTED, detail="ingest lands in Phase 2")


@router.post("/query")
def query() -> dict[str, str]:
    raise HTTPException(status.HTTP_501_NOT_IMPLEMENTED, detail="query lands in Phase 2")
