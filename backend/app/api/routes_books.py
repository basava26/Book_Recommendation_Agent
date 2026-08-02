from typing import List, Optional
from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.db.crud import get_user
from app.models.book import BookRecommendation
from app.services.recommender import recommend_books

router = APIRouter(prefix="/recommend", tags=["recommend"])


class RecommendRequest(BaseModel):
    favorite_genres: Optional[List[str]] = None
    interests: Optional[List[str]] = None
    reading_level: Optional[str] = None
    user_id: Optional[int] = None  # if provided, pulls preferences + history from DB
    max_results: Optional[int] = None


@router.post("", response_model=List[BookRecommendation])
def get_recommendations(payload: RecommendRequest, db: Session = Depends(get_db)):
    favorite_genres = payload.favorite_genres or []
    reading_level = payload.reading_level or "medium"
    read_book_ids: List[str] = []

    if payload.user_id is not None:
        user = get_user(db, payload.user_id)
        if user:
            favorite_genres = favorite_genres or (
                user.favorite_genres.split(",") if user.favorite_genres else []
            )
            reading_level = payload.reading_level or user.difficulty

    return recommend_books(
        favorite_genres=favorite_genres,
        reading_level=reading_level,
        read_book_ids=read_book_ids,
        interests=payload.interests or [],
        max_results=payload.max_results,
    )