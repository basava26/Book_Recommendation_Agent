from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routes_books import router as recommend_router
from app.api.routes_users import router as books_router
from app.db.database import init_db

app = FastAPI(title="Book Recommendation API")

init_db()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def home():
    return {"message": "Backend Running Successfully"}

app.include_router(recommend_router)
app.include_router(books_router)
