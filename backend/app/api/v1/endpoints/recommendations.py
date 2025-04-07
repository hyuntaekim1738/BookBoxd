from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.db.session import get_db
from app.services.recommendations import getUserRecommendations, getBookDetails
from app.core.auth import get_current_user

router = APIRouter()

@router.get("/recommendations")
async def getRecommendations(
    limit: int = 10,
    current_user: str = Depends(get_current_user),
    db: Session = Depends(get_db)
):

    try:
        
        bookIds = getUserRecommendations(db, current_user, limit)
        
        recommendations = []
        for bookId in bookIds:
            try:
                bookDetails = getBookDetails(bookId)
                if bookDetails:
                    recommendations.append(bookDetails)
            except Exception as e:
                print(e)
                continue
        
        return recommendations
        
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to get recommendations: {str(e)}"
        ) 