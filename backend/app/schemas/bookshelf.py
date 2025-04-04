from pydantic import BaseModel
from typing import List

class BookshelfBase(BaseModel):
    name: str

class BookshelfCreate(BookshelfBase):
    name: str

class Bookshelf(BookshelfBase):
    id: int
    userId: str
    bookIds: List[str] = []  # list of Google Books IDs
    bookCount: int = 0  # number of books in the bookshelf

    class Config:
        from_attributes = True
        orm_mode = True

# this file is for the schemas for the bookshelf. It is used to validate the data that is sent to the database.