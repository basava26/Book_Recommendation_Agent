from datetime import date

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
    source: str = "curated"           # "google_books" | "curated"


class RecommendedBook(Book):
    score: float
    reasons: list[str] = Field(default_factory=list)


class ReadHistoryItem(BaseModel):
    title: str
    author: str | None = None
    genre: str | None = None
    rating: float | None = None
    read_date: date | None = None


class ReadHistoryCreate(ReadHistoryItem):
    pass


class ReadHistoryRecord(ReadHistoryItem):
    id: int
    user_id: str


class HistoryEntryCreate(BaseModel):
    title: str
    author: str | None = None
    genre: str | None = None
    rating: float | None = None
    notes: str | None = None
    user_id: int | None = None


class HistoryEntryOut(BaseModel):
    id: int
    user_id: int
    title: str
    author: str | None = None
    genre: str | None = None
    rating: float | None = None
    notes: str | None = None