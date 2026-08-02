from typing import List, Optional
from fastapi import APIRouter, HTTPException, Query

from app.models.book import Book
from app.services.book_api_client import search_books, get_all_curated_books, get_curated_book_by_id

router = APIRouter(prefix="/books", tags=["books"])


@router.get("", response_model=List[Book])
async def list_books(q: Optional[str] = Query(None, description="Search query (title/author/genre)")):
    if q:
        return await search_books(q)
    return get_all_curated_books()


@router.get("/search", response_model=List[Book])
async def search_book_catalog(query: str = Query(..., min_length=1)):
    return await search_books(query)


@router.get("/{book_id}", response_model=Book)
def get_book(book_id: str):
    book = get_curated_book_by_id(book_id)
    if not book:
        raise HTTPException(status_code=404, detail="Book not found")
    return book