"""
Database setup. Uses SQLite by default (zero-config, file-based) so the
project runs out of the box. Swap DATABASE_URL to point at Postgres/MySQL
in production — SQLAlchemy handles the rest without code changes elsewhere.
"""

import os
from sqlalchemy import create_engine, Column, Integer, String, Float, Date
from sqlalchemy.orm import declarative_base, sessionmaker
from sqlalchemy.pool import StaticPool

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./book_agent.db")

is_sqlite = DATABASE_URL.startswith("sqlite")
is_memory = DATABASE_URL in ("sqlite:///:memory:", "sqlite://")

engine_kwargs = {}
if is_sqlite:
    engine_kwargs["connect_args"] = {"check_same_thread": False}
if is_memory:
    # In-memory SQLite needs a single shared connection (StaticPool),
    # otherwise each session gets its own empty in-memory database.
    engine_kwargs["poolclass"] = StaticPool

engine = create_engine(DATABASE_URL, **engine_kwargs)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


class UserProfileORM(Base):
    __tablename__ = "user_profiles"

    user_id = Column(String, primary_key=True, index=True)
    display_name = Column(String, nullable=True)
    favorite_genres = Column(String, default="")   # stored as comma-separated
    interests = Column(String, default="")          # stored as comma-separated
    difficulty = Column(String, default="medium")


class ReadHistoryORM(Base):
    __tablename__ = "reading_history"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    user_id = Column(String, index=True, nullable=False)
    title = Column(String, nullable=False)
    author = Column(String, nullable=True)
    genre = Column(String, nullable=True)
    rating = Column(Float, nullable=True)
    read_date = Column(Date, nullable=True)


def init_db():
    """Creates tables if they don't already exist. Called on app startup."""
    Base.metadata.create_all(bind=engine)


def get_db():
    """FastAPI dependency that yields a DB session and closes it after use."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()