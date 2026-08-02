from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.db import crud
from app.models.user import UserProfile, UserProfileCreate
from app.models.history import ReadHistoryCreate, ReadHistoryRecord

router = APIRouter(tags=["users"])


@router.put("/users/{user_id}", response_model=UserProfile)
def upsert_user(user_id: str, user: UserProfileCreate, db: Session = Depends(get_db)):
    return crud.upsert_user(db, user_id, user)


@router.get("/users/{user_id}", response_model=UserProfile)
def get_user(user_id: str, db: Session = Depends(get_db)):
    db_user = crud.get_user(db, user_id)
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")
    return db_user


@router.get("/users", response_model=List[UserProfile])
def list_users(db: Session = Depends(get_db)):
    return crud.list_users(db)


@router.post("/users/{user_id}/history", response_model=ReadHistoryRecord)
def add_history(user_id: str, entry: ReadHistoryCreate, db: Session = Depends(get_db)):
    return crud.add_history_item(db, user_id, entry)


@router.get("/users/{user_id}/history", response_model=List[ReadHistoryRecord])
def get_history(user_id: str, db: Session = Depends(get_db)):
    return crud.list_history(db, user_id)