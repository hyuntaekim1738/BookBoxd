from sqlalchemy import Column, Integer, String, ForeignKey
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
    __tablename__ = "book_associations"

    bookshelfId = Column(Integer, ForeignKey('bookshelves.id'), primary_key=True)
    bookId = Column(String, primary_key=True)  # google Books ID
    bookshelf = relationship("Bookshelf", back_populates="bookIds") 