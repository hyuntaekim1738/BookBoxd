from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.db.session import get_db
from app.db.models import Bookshelf, BookAssociation
from app.schemas.bookshelf import BookshelfCreate, Bookshelf as BookshelfSchema
from app.core.auth import get_current_user

router = APIRouter()

@router.post("/", response_model=BookshelfSchema)
def create_bookshelf(
    bookshelf: BookshelfCreate,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """create a new bookshelf"""
    db_bookshelf = Bookshelf(
        userId=current_user["uid"],
        name=bookshelf.name
    )
    db.add(db_bookshelf)
    db.commit()
    db.refresh(db_bookshelf)
    return db_bookshelf

@router.get("/", response_model=List[BookshelfSchema])
def get_user_bookshelves(
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """get all bookshelves for a user"""
    bookshelves = db.query(Bookshelf).filter(Bookshelf.userId == current_user["uid"]).all()
    
    # get book counts and bookIds for each bookshelf
    result = []
    for bookshelf in bookshelves:
        # get book associations
        book_associations = db.query(BookAssociation).filter(
            BookAssociation.bookshelfId == bookshelf.id
        ).all()
        
        # create a dictionary with the bookshelf data
        bookshelf_dict = {
            "id": bookshelf.id,
            "name": bookshelf.name,
            "userId": bookshelf.userId,
            "bookIds": [assoc.bookId for assoc in book_associations],
            "bookCount": len(book_associations)
        }
        result.append(bookshelf_dict)
    
    return result

@router.get("/{bookshelfId}", response_model=BookshelfSchema)
def get_bookshelf(
    bookshelfId: int,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """get a specific bookshelf by ID"""
    bookshelf = db.query(Bookshelf).filter(
        Bookshelf.id == bookshelfId,
        Bookshelf.userId == current_user["uid"]
    ).first()
    
    if not bookshelf:
        raise HTTPException(status_code=404, detail="Bookshelf not found")
    
    # get book associations
    book_associations = db.query(BookAssociation).filter(
        BookAssociation.bookshelfId == bookshelfId
    ).all()
    
    
    # create a dictionary with the bookshelf data
    bookshelf_dict = {
        "id": bookshelf.id,
        "name": bookshelf.name,
        "userId": bookshelf.userId,
        "bookIds": [assoc.bookId for assoc in book_associations],
        "bookCount": len(book_associations)
    }
    
    return bookshelf_dict

@router.post("/{bookshelfId}/books/{bookId}")
def add_book_to_bookshelf(
    bookshelfId: int,
    bookId: str,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    
    # check if bookshelf exists and belongs to user
    bookshelf = db.query(Bookshelf).filter(
        Bookshelf.id == bookshelfId,
        Bookshelf.userId == current_user["uid"]
    ).first()
    if not bookshelf:
        raise HTTPException(status_code=404, detail="Bookshelf not found")

    # check if book is already in bookshelf
    existing = db.query(BookAssociation).filter(
        BookAssociation.bookshelfId == bookshelfId,
        BookAssociation.bookId == bookId
    ).first()
    
    if existing:
        return {"message": "Book already in bookshelf"}

    # add book to bookshelf
    book_association = BookAssociation(
        bookshelfId=bookshelfId,
        bookId=bookId
    )
    db.add(book_association)
    db.commit()
    return {"message": "Book added to bookshelf successfully"}

@router.delete("/{bookshelfId}/books/{bookId}")
def remove_book_from_bookshelf(
    bookshelfId: int,
    bookId: str,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # check if bookshelf exists and belongs to user
    bookshelf = db.query(Bookshelf).filter(
        Bookshelf.id == bookshelfId,
        Bookshelf.userId == current_user["uid"]
    ).first()
    if not bookshelf:
        raise HTTPException(status_code=404, detail="Bookshelf not found")

    # remove book from bookshelf
    book_association = db.query(BookAssociation).filter(
        BookAssociation.bookshelfId == bookshelfId,
        BookAssociation.bookId == bookId
    ).first()
    
    if not book_association:
        raise HTTPException(status_code=404, detail="Book not found in bookshelf")

    db.delete(book_association)
    db.commit()
    return {"message": "Book removed from bookshelf successfully"}

@router.post("/default", response_model=BookshelfSchema)
def create_default_bookshelf(
    bookshelf: BookshelfCreate,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # check if user already has a default bookshelf
    existing = db.query(Bookshelf).filter(
        Bookshelf.userId == current_user["uid"],
        Bookshelf.name == bookshelf.name
    ).first()
    
    
    if existing:
        return {
            **existing.__dict__,
            'bookIds': [assoc.bookId for assoc in existing.bookIds] if existing.bookIds else []
        }

    # create new default bookshelf
    db_bookshelf = Bookshelf(
        userId=current_user["uid"],
        name=bookshelf.name
    )
    db.add(db_bookshelf)
    db.commit()
    db.refresh(db_bookshelf)
    return db_bookshelf 

@router.delete("/{bookshelfId}")
def delete_bookshelf(
    bookshelfId: int,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # check if bookshelf exists and belongs to user
    bookshelf = db.query(Bookshelf).filter(
        Bookshelf.id == bookshelfId,
        Bookshelf.userId == current_user["uid"]
    ).first()
    if not bookshelf:
        raise HTTPException(status_code=404, detail="Bookshelf not found")
    
    # delete bookshelf
    db.delete(bookshelf)
    db.commit()
    return {"message": "Bookshelf deleted successfully"}