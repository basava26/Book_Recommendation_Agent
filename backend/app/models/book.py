from pydantic import BaseModel, Field


class Book(BaseModel):
    id: str
    title: str
    authors: list[str] = Field(default_factory=list)
    genres: list[str] = Field(default_factory=list)
    description: str = ""
    difficulty: str = "medium"        # easy | medium | hard
    page_count: int | None = None
    estimated_reading_minutes: int | None = None
    thumbnail: str | None = None
    preview_link: str | None = None
    info_link: str | None = None
    source: str = "curated"           # "google_books" | "curated"


class RecommendedBook(Book):
    score: float
    reasons: list[str] = Field(default_factory=list)


class BookRecommendation(Book):
    score: float = 0.0
    reasons: list[str] = Field(default_factory=list)