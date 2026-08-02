from fastapi.testclient import TestClient

from app.main import app
from app.services import book_api_client


client = TestClient(app)


async def no_external_results(query: str, max_results: int = 10):
    return []


def test_book_search_uses_curated_fallback(monkeypatch):
    monkeypatch.setattr(book_api_client, "search_google_books", no_external_results)

    response = client.get("/books/search", params={"query": "Atomic"})

    assert response.status_code == 200
    assert response.json()[0]["title"] == "Atomic Habits"


def test_book_query_alias_uses_same_search(monkeypatch):
    monkeypatch.setattr(book_api_client, "search_google_books", no_external_results)

    response = client.get("/books", params={"q": "Atomic"})

    assert response.status_code == 200
    assert response.json()[0]["title"] == "Atomic Habits"