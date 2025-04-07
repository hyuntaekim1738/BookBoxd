from typing import List
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.db.models import UserRating, BookAssociation, Bookshelf
from app.core.config import settings
import requests
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import string


STOPWORDS = {
    'i', 'me', 'my', 'myself', 'we', 'our', 'ours', 'ourselves', 'you', 'your', 'yours',
    'yourself', 'yourselves', 'he', 'him', 'his', 'himself', 'she', 'her', 'hers',
    'herself', 'it', 'its', 'itself', 'they', 'them', 'their', 'theirs', 'themselves',
    'what', 'which', 'who', 'whom', 'this', 'that', 'these', 'those', 'am', 'is', 'are',
    'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'having', 'do', 'does',
    'did', 'doing', 'a', 'an', 'the', 'and', 'but', 'if', 'or', 'because', 'as', 'until',
    'while', 'of', 'at', 'by', 'for', 'with', 'about', 'against', 'between', 'into',
    'through', 'during', 'before', 'after', 'above', 'below', 'to', 'from', 'up', 'down',
    'in', 'out', 'on', 'off', 'over', 'under', 'again', 'further', 'then', 'once', 'here',
    'there', 'when', 'where', 'why', 'how', 'all', 'any', 'both', 'each', 'few', 'more',
    'most', 'other', 'some', 'such', 'no', 'nor', 'not', 'only', 'own', 'same', 'so',
    'than', 'too', 'very', 's', 't', 'can', 'will', 'just', 'don', 'should', 'now'
}

def preprocessText(text: str) -> str:
    if not text:
        return ""
    text = text.lower()
    text = text.translate(str.maketrans('', '', string.punctuation))
    words = text.split()
    words = [word for word in words if word not in STOPWORDS]
    return ' '.join(words)

def getBookDetails(bookId: str) -> dict:
    # ggets book details from Google Books API
    bookId = bookId[0]
    try:
        response = requests.get(f"https://www.googleapis.com/books/v1/volumes/{bookId}")
        response.raise_for_status()
        return response.json()
    except requests.RequestException as e:
        return None

def getBookDescription(bookId: str) -> str:
    bookDetails = getBookDetails(bookId)
    if bookDetails and 'volumeInfo' in bookDetails and 'description' in bookDetails['volumeInfo']:
        return preprocessText(bookDetails['volumeInfo']['description'])
    return ""

def getContentBasedRecommendations(
    db: Session,
    userIdDict: str,
    limit: int = 10
) -> List[str]:

    try:
        userId = userIdDict['uid']
        
        # get user's books to exclude from recommendations
        userBooks = set()
        bookshelfBooks = db.query(BookAssociation).join(Bookshelf).filter(Bookshelf.userId == userId).all()
        ratedBooks = db.query(UserRating).filter(UserRating.userId == userId).all()
        userBooks.update(book.bookId for book in bookshelfBooks)
        userBooks.update(book.bookId for book in ratedBooks)
        
        # get a sample of 100 rated books not in user's collection. Hopefully this will on average get frequently rated books
        candidateBooks = db.query(UserRating.bookId).group_by(UserRating.bookId).order_by(func.count(UserRating.userId).desc()).limit(100).all()
        print(candidateBooks)
        candidateBooks = [book for book in candidateBooks if book[0] not in userBooks]
        print(userBooks)
        if not candidateBooks:            
            return []
        
        # get descriptions
        descriptions = []
        validBooks = []
        for bookId in candidateBooks:
            description = getBookDescription(bookId)
            if description:  
                descriptions.append(description)
                validBooks.append(bookId)
        
        if not descriptions:
            return []
        
        #tfidf
        vectorizer = TfidfVectorizer()
        tfidfMatrix = vectorizer.fit_transform(descriptions)
        
        similarityMatrix = cosine_similarity(tfidfMatrix)
        
        recommendations = []
        for i in range(len(validBooks)):
            similarityScores = similarityMatrix[i]
            
            similarIndicies = np.argsort(similarityScores)[::-1][1:limit+1]
            similarBooks = [validBooks[j] for j in similarIndicies]
            
            for bookId in similarBooks:
                if bookId not in userBooks and bookId not in recommendations:
                    recommendations.append(bookId)
                    if len(recommendations) >= limit:
                        break
            
            if len(recommendations) >= limit:
                break
        
        return recommendations
        
    except Exception as e:
        print(e)
        raise

def getUserRecommendations(db: Session, userIdDict: str, limit: int = 10) -> List[str]:
    try:
        return getContentBasedRecommendations(db, userIdDict, limit)
    except Exception as e:
        print(e)
        raise 