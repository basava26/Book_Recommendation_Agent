"""
Small, dependency-free validation helpers used by routes and services.
Raising ValueError here lets FastAPI's exception handling turn these
into clean 400 responses when wrapped in HTTPException by the caller.
"""

VALID_DIFFICULTIES = {"easy", "medium", "hard"}


def validate_difficulty(value: str) -> str:
    normalized = (value or "").strip().lower()
    if normalized not in VALID_DIFFICULTIES:
        raise ValueError(
            f"Invalid difficulty '{value}'. Must be one of: {', '.join(sorted(VALID_DIFFICULTIES))}."
        )
    return normalized


def validate_rating(rating: float | None) -> float | None:
    if rating is None:
        return None
    if not (1 <= rating <= 5):
        raise ValueError("Rating must be between 1 and 5.")
    return rating


def validate_non_empty_list(values: list[str], field_name: str) -> list[str]:
    cleaned = [v.strip() for v in values if v and v.strip()]
    return cleaned  # empty is allowed (genres/interests are optional), just cleaned


def clean_genre_list(values: list[str] | None) -> list[str]:
    if not values:
        return []
    return [v.strip() for v in values if v and v.strip()]


def validate_user_id(user_id: str) -> str:
    normalized = (user_id or "").strip()
    if not normalized:
        raise ValueError("user_id must not be empty.")
    if len(normalized) > 100:
        raise ValueError("user_id is too long (max 100 characters).")
    return normalized