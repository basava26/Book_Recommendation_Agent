"""
Fetches candidate books from the Google Books public API.
Falls back to the local curated dataset if the API call fails
or returns no usable results (e.g. no network access, rate limit hit).
"""

import json
import httpx
from pathlib import Path

from app.config import settings
from app.models.book import Book
from app.services.difficulty_estimator import estimate_difficulty, estimate_reading_minutes

CURATED_PATH = Path(__file__).resolve().parent.parent / "data" / "curated_books.json"


def _load_curated() -> list[Book]:
    with open(CURATED_PATH, "r", encoding="utf-8") as f:
        raw = json.load(f)
    if isinstance(raw, dict):
        raw = [raw]
    books = []
    for item in raw:
        minutes = estimate_reading_minutes(item.get("page_count"))
        books.append(Book(
            id=item["id"],
            title=item["title"],
            authors=item.get("authors", []),
            genres=item.get("genres", []),
            description=item.get("description", ""),
            difficulty=item.get("difficulty", "medium"),
            page_count=item.get("page_count"),
            estimated_reading_minutes=minutes,
            thumbnail=None,
            source="curated",
        ))
    return books


async def search_google_books(query: str, max_results: int = 10) -> list[Book]:
    """Query Google Books API for books matching a genre/interest keyword."""
    params = {"q": query, "maxResults": min(max_results, 40)}
    if settings.GOOGLE_BOOKS_API_KEY:
        params["key"] = settings.GOOGLE_BOOKS_API_KEY

    try:
        async with httpx.AsyncClient(timeout=8.0) as client:
            resp = await client.get(settings.GOOGLE_BOOKS_BASE_URL, params=params)
            resp.raise_for_status()
            data = resp.json()
    except (httpx.HTTPError, ValueError):
        return []

    items = data.get("items", [])
    books = []
    for item in items:
        info = item.get("volumeInfo", {})
        title = info.get("title")
        if not title:
            continue

        description = info.get("description", "")
        page_count = info.get("pageCount")
        categories = info.get("categories", [])
        difficulty = estimate_difficulty(description, page_count)
        minutes = estimate_reading_minutes(page_count)
        thumbnail = info.get("imageLinks", {}).get("thumbnail")
        preview_link = info.get("previewLink")
        info_link = info.get("infoLink")

        books.append(Book(
            id=item.get("id", title),
            title=title,
            authors=info.get("authors", []),
            genres=[c.lower() for c in categories] if categories else [],
            description=description,
            difficulty=difficulty,
            page_count=page_count,
            estimated_reading_minutes=minutes,
            thumbnail=thumbnail,
            preview_link=preview_link,
            info_link=info_link,
            source="google_books",
        ))
    return books


async def search_open_library(query: str, max_results: int = 10) -> list[Book]:
    """Use Open Library when Google Books is unavailable or rate limited."""
    try:
        async with httpx.AsyncClient(timeout=8.0) as client:
            resp = await client.get(
                f"{settings.OPEN_LIBRARY_BASE_URL}/search.json",
                params={"q": query, "limit": min(max_results, 40)},
            )
            resp.raise_for_status()
            data = resp.json()
    except (httpx.HTTPError, ValueError):
        return []

    books = []
    for item in data.get("docs", []):
        title = item.get("title")
        if not title:
            continue

        authors = item.get("author_name", [])
        subjects = item.get("subject", [])[:5]
        cover_id = item.get("cover_i")
        books.append(Book(
            id=f"openlibrary-{item.get('key', title).split('/')[-1]}",
            title=title,
            authors=authors,
            genres=[subject.lower() for subject in subjects],
            description="",
            difficulty="medium",
            page_count=item.get("number_of_pages_median"),
            estimated_reading_minutes=estimate_reading_minutes(
                item.get("number_of_pages_median")
            ),
            thumbnail=(
                f"https://covers.openlibrary.org/b/id/{cover_id}-M.jpg"
                if cover_id else None
            ),
            info_link=(
                f"https://openlibrary.org{item.get('key')}"
                if item.get("key") else None
            ),
            source="open_library",
        ))
    return books


async def fetch_candidate_books(genres: list[str], interests: list[str]) -> list[Book]:
    """
    Builds a candidate pool by querying Google Books for each genre/interest,
    then always appending the curated dataset as a safety net so the agent
    still works offline or if the API is unreachable.
    """
    candidates: dict[str, Book] = {}

    search_terms = list(dict.fromkeys(genres + interests))  # dedupe, keep order
    for term in search_terms[:6]:  # cap external calls to keep response snappy
        query = f"subject:{term}"
        results = await search_google_books(query, max_results=8)
        for b in results:
            candidates[b.id] = b

    # Always include curated dataset as fallback / supplement
    for b in _load_curated():
        candidates.setdefault(b.id, b)

    return list(candidates.values())


async def search_books(query: str, max_results: int = 10) -> list[Book]:
    results = await search_google_books(query, max_results=max_results)
    if not results:
        results = await search_open_library(query, max_results=max_results)
    if results:
        return results

    normalized_query = query.strip().lower()
    if not normalized_query:
        return []

    matches = []
    for book in _load_curated():
        searchable_text = " ".join([
            book.title,
            *book.authors,
            *book.genres,
        ]).lower()
        if normalized_query in searchable_text:
            matches.append(book)

    return matches[:max_results]


def get_all_curated_books() -> list[Book]:
    return _load_curated()


def get_curated_book_by_id(book_id: str) -> Book | None:
    for book in _load_curated():
        if book.id == book_id:
            return book
    return None