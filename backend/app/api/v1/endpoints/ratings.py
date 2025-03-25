from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import Optional
from app.db.session import get_db
from app.db.models import UserRating
from app.core.auth import get_current_user
from app.schemas.rating import RatingCreate, RatingResponse, RatingBase, BookRatingStats

router = APIRouter()

@router.get("/{book_id}", response_model=RatingBase)
async def getUserRating(
    book_id: str,
    currentUser: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """get user's rating for a specific book"""
    rating = db.query(UserRating).filter(
        UserRating.userId == currentUser["uid"],
        UserRating.bookId == book_id
    ).first()
    
    return {"rating": rating.rating if rating else None}

@router.get("/{book_id}/stats", response_model=BookRatingStats)
async def getBookRatingStats(
    book_id: str,
    db: Session = Depends(get_db)
):
    """get average rating and total number of ratings for a book"""
    result = db.query(
        func.avg(UserRating.rating).label('average'),
        func.count(UserRating.userId).label('count')
    ).filter(UserRating.bookId == book_id).first()
    
    return {
        "averageRating": float(result[0]) if result[0] else None,
        "ratingsCount": result[1]
    }

@router.post("/{book_id}", response_model=RatingResponse)
async def rateBook(
    book_id: str,
    rating_data: RatingCreate,
    currentUser: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """rate a book or update existing rating"""
    if rating_data.rating < 1 or rating_data.rating > 5:
        raise HTTPException(status_code=400, detail="Rating must be between 1 and 5")

    existing_rating = db.query(UserRating).filter(
        UserRating.userId == currentUser["uid"],
        UserRating.bookId == book_id
    ).first()

    if existing_rating:
        existing_rating.rating = rating_data.rating
        db.commit()
        return existing_rating
    else:
        new_rating = UserRating(
            userId=currentUser["uid"],
            bookId=book_id,
            rating=rating_data.rating
        )
        db.add(new_rating)
        db.commit()
        db.refresh(new_rating)
        return new_rating 