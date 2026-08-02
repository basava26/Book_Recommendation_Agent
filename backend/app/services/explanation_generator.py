"""
Generates human-readable reasons explaining why a book was recommended,
based on which signals contributed to its score.
"""

from app.models.book import Book
from app.models.user import RecommendationRequest


def build_reasons(
    book: Book,
    request: RecommendationRequest,
    matched_genres: list[str],
    matched_interests: list[str],
    difficulty_match: bool,
    similar_to_history: list[str],
    matched_related_genres: list[str] | None = None,
) -> list[str]:
    reasons = []

    if matched_genres:
        genre_list = ", ".join(matched_genres)
        reasons.append(f"Matches your favorite genre(s): {genre_list}.")

    if matched_related_genres:
        related_list = ", ".join(matched_related_genres)
        reasons.append(f"Closely related to genres you enjoy: {related_list}.")

    if matched_interests:
        interest_list = ", ".join(matched_interests)
        reasons.append(f"Covers topics you're interested in: {interest_list}.")

    if difficulty_match:
        reasons.append(f"Difficulty level ({book.difficulty}) matches your preferred level.")

    if similar_to_history:
        titles = ", ".join(similar_to_history[:2])
        reasons.append(f"Similar in style/genre to books you've previously enjoyed: {titles}.")

    if not reasons:
        reasons.append("A well-regarded book that broadens your reading beyond your usual picks.")

    return reasons