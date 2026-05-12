import logging
from typing import Annotated

import anthropic
from fastapi import APIRouter, Depends, HTTPException, status

from app.core.config import Settings, get_settings
from app.core.deps import CurrentUser, require_service_secret, require_user
from app.schemas.flashcards import (
    FlashcardItem,
    FlashcardsGenerateRequest,
    FlashcardsGenerateResponse,
)

logger = logging.getLogger(__name__)

router = APIRouter(dependencies=[Depends(require_service_secret)])

FLASHCARD_TOOL = {
    "name": "save_flashcards",
    "description": "Save the generated flashcards.",
    "input_schema": {
        "type": "object",
        "properties": {
            "cards": {
                "type": "array",
                "items": {
                    "type": "object",
                    "properties": {
                        "front": {
                            "type": "string",
                            "description": "Question or prompt on the front of the card",
                        },
                        "back": {
                            "type": "string",
                            "description": "Answer or explanation on the back of the card",
                        },
                    },
                    "required": ["front", "back"],
                },
            }
        },
        "required": ["cards"],
    },
}


@router.post("/generate", response_model=FlashcardsGenerateResponse)
def generate(
    body: FlashcardsGenerateRequest,
    settings: Annotated[Settings, Depends(get_settings)],
    _user: Annotated[CurrentUser, Depends(require_user)],
) -> FlashcardsGenerateResponse:
    if not settings.anthropic_api_key:
        raise HTTPException(
            status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="ANTHROPIC_API_KEY is not configured",
        )

    client = anthropic.Anthropic(api_key=settings.anthropic_api_key)

    response = client.messages.create(
        model="claude-sonnet-4-6",
        max_tokens=4096,
        system=(
            "You are an expert study assistant. Generate concise, high-quality flashcards "
            "from the provided note content. Each card should test a single concept. "
            "Front: a clear question or prompt. Back: a precise, complete answer."
        ),
        messages=[
            {
                "role": "user",
                "content": (
                    f"Note title: {body.note_title}\n\n"
                    f"Note content:\n{body.note_content}\n\n"
                    f"Generate {body.count} flashcards from this note."
                ),
            }
        ],
        tools=[FLASHCARD_TOOL],  # type: ignore[list-item]
        tool_choice={"type": "tool", "name": "save_flashcards"},
    )

    # Extract tool_use block
    tool_block = next(
        (
            b
            for b in response.content
            if b.type == "tool_use" and b.name == "save_flashcards"
        ),
        None,
    )
    if not tool_block:
        raise HTTPException(
            status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Model did not return flashcards",
        )

    raw = tool_block.input  # type: ignore[attr-defined]
    cards = [
        FlashcardItem(front=c["front"], back=c["back"]) for c in raw.get("cards", [])
    ]

    return FlashcardsGenerateResponse(cards=cards, note_title=body.note_title)
