from pydantic import BaseModel, Field


class FlashcardItem(BaseModel):
    front: str
    back: str


class FlashcardsGenerateRequest(BaseModel):
    note_content: str
    note_title: str
    count: int = Field(default=10, ge=1, le=30)


class FlashcardsGenerateResponse(BaseModel):
    cards: list[FlashcardItem]
    note_title: str
