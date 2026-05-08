from fastapi import APIRouter, Depends, HTTPException, status

from app.core.deps import require_service_secret, require_user

router = APIRouter(dependencies=[Depends(require_service_secret), Depends(require_user)])


@router.get("/smiles/{smiles:path}")
def smiles_to_svg(smiles: str) -> dict[str, str]:  # noqa: ARG001
    raise HTTPException(status.HTTP_501_NOT_IMPLEMENTED, detail="rdkit lands in Phase 1")
