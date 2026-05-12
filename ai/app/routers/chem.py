from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import Response

from app.core.deps import require_service_secret

# No require_user — SMILES rendering is stateless and user-independent
router = APIRouter(dependencies=[Depends(require_service_secret)])


@router.get("/smiles/{smiles:path}")
def smiles_to_svg(smiles: str) -> Response:
    try:
        from rdkit import Chem
        from rdkit.Chem.Draw import rdMolDraw2D
    except ImportError as exc:
        raise HTTPException(
            status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="RDKit is not installed. Run `uv add rdkit`.",
        ) from exc

    mol = Chem.MolFromSmiles(smiles)
    if mol is None:
        raise HTTPException(status.HTTP_400_BAD_REQUEST, detail="Invalid SMILES string")

    drawer = rdMolDraw2D.MolDraw2DSVG(300, 200)
    drawer.drawOptions().addStereoAnnotation = True  # type: ignore[assignment]
    drawer.DrawMolecule(mol)
    drawer.FinishDrawing()
    svg = drawer.GetDrawingText()

    return Response(content=svg, media_type="image/svg+xml")
