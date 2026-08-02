from pydantic import BaseModel, Field

from app.models.history import ReadHistoryItem


class UserProfile(BaseModel):
    """A stored user profile: preferences that persist across sessions."""
    user_id: str
    display_name: str | None = None
    favorite_genres: list[str] = Field(default_factory=list)
    interests: list[str] = Field(default_factory=list)
    difficulty: str = "medium"   # easy | medium | hard


class UserProfileCreate(BaseModel):
    """Payload for creating/updating a user profile."""
    display_name: str | None = None
    favorite_genres: list[str] = Field(default_factory=list)
    interests: list[str] = Field(default_factory=list)
    difficulty: str = "medium"


class RecommendationRequest(BaseModel):
    favorite_genres: list[str] = Field(default_factory=list)
    interests: list[str] = Field(default_factory=list)     # free-text topics/keywords
    difficulty: str = "medium"                              # easy | medium | hard
    reading_history: list[ReadHistoryItem] = Field(default_factory=list)
    max_results: int = 5


class UserCreate(BaseModel):
    name: str
    favorite_genres: list[str] = Field(default_factory=list)
    reading_level: str = "intermediate"
    weekly_reading_hours: int | None = None


class UserOut(BaseModel):
    id: int
    name: str
    favorite_genres: list[str] = Field(default_factory=list)
    reading_level: str = "intermediate"
    weekly_reading_hours: int | None = None