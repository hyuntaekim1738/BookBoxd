from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.db.session import get_db
from app.db.models import Review
from app.core.auth import get_current_user
from app.schemas.review import ReviewCreate, ReviewResponse

router = APIRouter()

@router.get("/{book_id}", response_model=List[ReviewResponse])
async def getBookReviews(
    book_id: str,
    db: Session = Depends(get_db)
):
    """get all reviews for a specific book"""
    reviews = db.query(Review).filter(Review.bookId == book_id).all()
    return reviews

@router.post("/{book_id}", response_model=ReviewResponse)
async def createReview(
    book_id: str,
    review: ReviewCreate,
    currentUser: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """create a new review for a book"""
    # Check if user has already reviewed this book
    existing_review = db.query(Review).filter(
        Review.userId == currentUser["uid"],
        Review.bookId == book_id
    ).first()

    if existing_review:
        raise HTTPException(
            status_code=400,
            detail="You have already reviewed this book"
        )

    db_review = Review(
        userId=currentUser["uid"],
        bookId=book_id,
        content=review.content
    )
    db.add(db_review)
    db.commit()
    db.refresh(db_review)
    return db_review

@router.put("/{review_id}", response_model=ReviewResponse)
async def updateReview(
    review_id: int,
    review: ReviewCreate,
    currentUser: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """update an existing review"""
    db_review = db.query(Review).filter(Review.id == review_id).first()
    if not db_review:
        raise HTTPException(status_code=404, detail="Review not found")
    
    if db_review.userId != currentUser["uid"]:
        raise HTTPException(status_code=403, detail="Not authorized to update this review")

    db_review.content = review.content
    db.commit()
    db.refresh(db_review)
    return db_review

@router.delete("/{review_id}")
async def deleteReview(
    review_id: int,
    currentUser: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """delete a review"""
    db_review = db.query(Review).filter(Review.id == review_id).first()
    if not db_review:
        raise HTTPException(status_code=404, detail="Review not found")
    
    if db_review.userId != currentUser["uid"]:
        raise HTTPException(status_code=403, detail="Not authorized to delete this review")

    db.delete(db_review)
    db.commit()
    return {"message": "Review deleted successfully"} 