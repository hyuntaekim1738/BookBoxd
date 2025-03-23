'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../../auth/AuthContext';
import SearchResultCard from '../../components/SearchResultCard';
import { useParams } from 'next/navigation';

export default function BookshelfPage() {
  const { user } = useAuth();
  const params = useParams();
  const [bookshelf, setBookshelf] = useState(null);
  const [books, setBooks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchBookshelf = async () => {
    if (!user || !params.id) return;

    try {
      const response = await fetch(`http://localhost:8000/api/v1/bookshelves/${params.id}`, {
        headers: {
          'Authorization': `Bearer ${user.uid}`
        }
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch bookshelf');
      }
      setBookshelf(data);
      
      // fetch book details for each book ID
      const bookPromises = data.bookIds.map(async (bookId) => {
        const bookResponse = await fetch(`/api/books/search?q=id:${bookId}`);
        if (!bookResponse.ok) {
          throw new Error(`Failed to fetch book ${bookId}`);
        }
        const bookData = await bookResponse.json();
        return bookData.books[0];
      });

      const bookResults = await Promise.all(bookPromises);
      setBooks(bookResults.filter(book => book !== null));
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBookshelf();
  }, [user, params.id]);

  if (!user) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Please log in to view this bookshelf.</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Loading bookshelf...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  if (!bookshelf) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Bookshelf not found.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          {bookshelf.name}
        </h1>
        <p className="text-sm text-gray-500">
          {books.length} books
        </p>
      </div>

      {/* books List */}
      <div className="space-y-6">
        {books.length > 0 ? (
          books.map((book) => (
            <div key={book.id} className="relative group">
              <SearchResultCard 
                book={book} 
                onBookshelfChange={fetchBookshelf}
              />
            </div>
          ))
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500">No books in this shelf yet</p>
          </div>
        )}
      </div>
    </div>
  );
} 