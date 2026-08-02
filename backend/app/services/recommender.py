import json
from pathlib import Path

from app.models.book import BookRecommendation


def _load_books() -> list[BookRecommendation]:
    data_path = Path(__file__).parents[1] / "data" / "curated_books.json"
    with data_path.open(encoding="utf-8") as data_file:
        payload = json.load(data_file)
    books = payload if isinstance(payload, list) else [payload]
    return [BookRecommendation(**book, score=0.0) for book in books]


def recommend_books(
    favorite_genres: list[str],
    reading_level: str,
    read_book_ids: list[str],
    interests: list[str] | None = None,
    max_results: int | None = None,
) -> list[BookRecommendation]:
    recommendations = []
    interests = interests or []
    for book in _load_books():
        if book.id in read_book_ids:
            continue
        matching_genres = set(book.genres).intersection(favorite_genres)
        score = len(matching_genres) * 3
        reasons = []
        if matching_genres:
            reasons.append(f"Matches your favorite genre: {', '.join(sorted(matching_genres))}")
        matching_interests = set(book.genres).intersection(interests)
        if matching_interests:
            score += len(matching_interests) * 2
            reasons.append(f"Touches on your interests: {', '.join(sorted(matching_interests))}")
        if book.difficulty == reading_level:
            score += 2
            reasons.append("Matches your preferred reading level")
        recommendations.append(book.model_copy(update={"score": score, "reasons": reasons}))

    recommendations.sort(key=lambda book: book.score, reverse=True)
    if max_results is not None:
        return recommendations[:max_results]
    return recommendations
