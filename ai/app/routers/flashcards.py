from fastapi import APIRouter, Depends, HTTPException, status

from app.core.deps import require_service_secret, require_user

router = APIRouter(dependencies=[Depends(require_service_secret), Depends(require_user)])


@router.post("/generate")
def generate() -> dict[str, str]:
    raise HTTPException(status.HTTP_501_NOT_IMPLEMENTED, detail="generate lands in Phase 3")
