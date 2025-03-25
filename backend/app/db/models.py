from sqlalchemy import Column, Integer, String, ForeignKey, Float, Text, DateTime
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.db.base_class import Base

class Bookshelf(Base):
    __tablename__ = "bookshelves"

    id = Column(Integer, primary_key=True, index=True)
    userId = Column(String, nullable=False)  # Firebase UID
    name = Column(String, nullable=False)

    # relationship with books (just storing the IDs)
    bookIds = relationship("BookAssociation", back_populates="bookshelf")

class BookAssociation(Base):
    __tablename__ = "bookAssociations"

    bookshelfId = Column(Integer, ForeignKey('bookshelves.id'), primary_key=True)
    bookId = Column(String, primary_key=True)  # google Books ID
    bookshelf = relationship("Bookshelf", back_populates="bookIds") 

class UserRating(Base):
    __tablename__ = "userRatings"
    userId = Column(String, index=True, primary_key=True)
    bookId = Column(String, index=True, primary_key=True)
    rating = Column(Integer)  # rating from 1-5 

class Review(Base):
    __tablename__ = "reviews"
    id = Column(Integer, primary_key=True, index=True)
    userId = Column(String, index=True, nullable=False)
    bookId = Column(String, index=True, nullable=False)
    content = Column(Text, nullable=False)
    createdAt = Column(DateTime(timezone=True), server_default=func.now())
    updatedAt = Column(DateTime(timezone=True), onupdate=func.now())