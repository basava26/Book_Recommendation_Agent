"""
Estimates reading difficulty (when unknown) and reading time for a book.

Difficulty is inferred using simple heuristics: page count + presence of
"dense" keywords in the description. This can be swapped later for a
real readability model (e.g. Flesch-Kincaid on sample text) without
changing the public function signatures.
"""

from app.config import settings

DENSE_KEYWORDS = [
    "philosophy", "quantum", "theorem", "epistemology", "algorithm",
    "metaphysics", "existential", "cognitive science", "economics",
]

WORDS_PER_PAGE = 275  # rough average for a standard printed page


def estimate_difficulty(description: str, page_count: int | None) -> str:
    """Infer easy/medium/hard when a book's difficulty isn't already tagged."""
    text = (description or "").lower()
    dense_hits = sum(1 for kw in DENSE_KEYWORDS if kw in text)

    if page_count and page_count > 500:
        base = "hard"
    elif page_count and page_count > 300:
        base = "medium"
    else:
        base = "easy"

    if dense_hits >= 2:
        return "hard"
    if dense_hits == 1 and base == "easy":
        return "medium"
    return base


def estimate_reading_minutes(page_count: int | None) -> int | None:
    if not page_count:
        return None
    total_words = page_count * WORDS_PER_PAGE
    return round(total_words / settings.AVG_WORDS_PER_MINUTE)