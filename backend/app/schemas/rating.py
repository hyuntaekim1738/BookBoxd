from pydantic import BaseModel
from typing import Optional

class RatingBase(BaseModel):
    rating: Optional[float] = None

class RatingCreate(RatingBase):
    rating: float

class RatingResponse(RatingBase):
    userId: str
    bookId: str
    rating: float

    class Config:
        from_attributes = True

class BookRatingStats(BaseModel):
    averageRating: Optional[float] = None
    ratingsCount: int 