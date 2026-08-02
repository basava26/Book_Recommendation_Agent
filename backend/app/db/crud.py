"""
Plain CRUD functions against the ORM models. Kept separate from the API
routes so the persistence logic can be tested or reused independently
of FastAPI.
"""

from sqlalchemy.orm import Session

from app.db.database import UserProfileORM, ReadHistoryORM
from app.models.user import UserProfileCreate, UserProfile
from app.models.history import ReadHistoryCreate, ReadHistoryRecord


def _split_csv(value: str) -> list[str]:
    return [v for v in (value or "").split(",") if v]


def _join_csv(values: list[str]) -> str:
    return ",".join(values)


# ---------- User profile CRUD ----------

def get_user(db: Session, user_id: str) -> UserProfile | None:
    row = db.query(UserProfileORM).filter(UserProfileORM.user_id == user_id).first()
    if not row:
        return None
    return UserProfile(
        user_id=row.user_id,
        display_name=row.display_name,
        favorite_genres=_split_csv(row.favorite_genres),
        interests=_split_csv(row.interests),
        difficulty=row.difficulty,
    )


def upsert_user(db: Session, user_id: str, payload: UserProfileCreate) -> UserProfile:
    row = db.query(UserProfileORM).filter(UserProfileORM.user_id == user_id).first()
    if row is None:
        row = UserProfileORM(user_id=user_id)
        db.add(row)

    row.display_name = payload.display_name
    row.favorite_genres = _join_csv(payload.favorite_genres)
    row.interests = _join_csv(payload.interests)
    row.difficulty = payload.difficulty

    db.commit()
    db.refresh(row)
    return get_user(db, user_id)


def delete_user(db: Session, user_id: str) -> bool:
    row = db.query(UserProfileORM).filter(UserProfileORM.user_id == user_id).first()
    if not row:
        return False
    db.delete(row)
    db.commit()
    return True


# ---------- Reading history CRUD ----------

def list_history(db: Session, user_id: str) -> list[ReadHistoryRecord]:
    rows = db.query(ReadHistoryORM).filter(ReadHistoryORM.user_id == user_id).all()
    return [
        ReadHistoryRecord(
            id=r.id, user_id=r.user_id, title=r.title, author=r.author,
            genre=r.genre, rating=r.rating, read_date=r.read_date,
        )
        for r in rows
    ]


def add_history_item(db: Session, user_id: str, payload: ReadHistoryCreate) -> ReadHistoryRecord:
    row = ReadHistoryORM(
        user_id=user_id,
        title=payload.title,
        author=payload.author,
        genre=payload.genre,
        rating=payload.rating,
        read_date=payload.read_date,
    )
    db.add(row)
    db.commit()
    db.refresh(row)
    return ReadHistoryRecord(
        id=row.id, user_id=row.user_id, title=row.title, author=row.author,
        genre=row.genre, rating=row.rating, read_date=row.read_date,
    )


def delete_history_item(db: Session, user_id: str, history_id: int) -> bool:
    row = db.query(ReadHistoryORM).filter(
        ReadHistoryORM.id == history_id, ReadHistoryORM.user_id == user_id
    ).first()
    if not row:
        return False
    db.delete(row)
    db.commit()
    return True


def get_history_for_user(db: Session, user_id: int) -> list[ReadHistoryRecord]:
    rows = db.query(ReadHistoryORM).filter(ReadHistoryORM.user_id == str(user_id)).all()
    return [
        ReadHistoryRecord(
            id=r.id,
            user_id=r.user_id,
            title=r.title,
            author=r.author,
            genre=r.genre,
            rating=r.rating,
            read_date=r.read_date,
        )
        for r in rows
    ]


def create_user(db: Session, payload: UserProfileCreate) -> UserProfile:
    row = UserProfileORM(user_id=str(payload.display_name or "user"))
    db.add(row)
    db.commit()
    db.refresh(row)
    return get_user(db, row.user_id)


def list_users(db: Session) -> list[UserProfile]:
    rows = db.query(UserProfileORM).all()
    return [
        UserProfile(
            user_id=row.user_id,
            display_name=row.display_name,
            favorite_genres=_split_csv(row.favorite_genres),
            interests=_split_csv(row.interests),
            difficulty=row.difficulty,
        )
        for row in rows
    ]


def add_history(db: Session, payload: ReadHistoryCreate) -> ReadHistoryRecord:
    row = ReadHistoryORM(
        user_id=payload.user_id or "",
        title=payload.title,
        author=payload.author,
        genre=payload.genre,
        rating=payload.rating,
        read_date=payload.read_date,
    )
    db.add(row)
    db.commit()
    db.refresh(row)
    return ReadHistoryRecord(
        id=row.id,
        user_id=row.user_id,
        title=row.title,
        author=row.author,
        genre=row.genre,
        rating=row.rating,
        read_date=row.read_date,
    )


def get_history(db: Session, history_id: int) -> ReadHistoryRecord | None:
    row = db.query(ReadHistoryORM).filter(ReadHistoryORM.id == history_id).first()
    if not row:
        return None
    return ReadHistoryRecord(
        id=row.id,
        user_id=row.user_id,
        title=row.title,
        author=row.author,
        genre=row.genre,
        rating=row.rating,
        read_date=row.read_date,
    )