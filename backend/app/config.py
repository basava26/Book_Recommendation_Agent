import os
from dotenv import load_dotenv

load_dotenv()


class Settings:
    APP_NAME: str = os.getenv("APP_NAME", "Book Recommendation Agent")
    DEBUG: bool = os.getenv("DEBUG", "true").lower() in {"1", "true", "yes", "on"}
    GOOGLE_BOOKS_API_KEY: str = os.getenv("GOOGLE_BOOKS_API_KEY", "")
    AVG_WORDS_PER_MINUTE: int = int(os.getenv("AVG_WORDS_PER_MINUTE", "200"))
    CORS_ORIGINS: list[str] = os.getenv(
        "CORS_ORIGINS", "http://localhost:5500,http://127.0.0.1:5500"
    ).split(",")
    GOOGLE_BOOKS_BASE_URL: str = "https://www.googleapis.com/books/v1/volumes"
    OPEN_LIBRARY_BASE_URL: str = "https://openlibrary.org"


settings = Settings()