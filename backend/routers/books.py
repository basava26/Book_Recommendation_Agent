from fastapi import APIRouter
from app.services.google_books import search_books

router = APIRouter()

@router.get("/search")
def search(query: str):

    return search_books(query)