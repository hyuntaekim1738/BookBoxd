'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/app/auth/AuthContext';

export default function BookDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBookDetails = async () => {
      try {
        const response = await fetch(`/api/books/search?q=id:${params.id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch book details');
        }
        const data = await response.json();
        if (data.books && data.books.length > 0) {
          setBook(data.books[0]);
        } else {
          throw new Error('Book not found');
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBookDetails();
  }, [params.id]);

  if (loading) return <div className="container mx-auto px-4 py-8">Loading...</div>;
  if (error) return <div className="container mx-auto px-4 py-8">Error: {error}</div>;
  if (!book) return <div className="container mx-auto px-4 py-8">Book not found</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <button
        onClick={() => router.back()}
        className="mb-6 flex items-center text-accent hover:text-accent-dark"
      >
        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Back
      </button>

      <div className="flex flex-col md:flex-row gap-8">
        <div className="flex-shrink-0">
          {book.imageLinks?.thumbnail ? (
            <img
              src={book.imageLinks.thumbnail.replace('zoom=1', 'zoom=2')}
              alt={book.title}
              className="w-48 h-72 object-cover rounded-lg shadow-lg"
            />
          ) : (
            <div className="w-48 h-72 bg-gray-200 rounded-lg flex items-center justify-center">
              <span className="text-gray-400">No image</span>
            </div>
          )}
        </div>

        <div className="flex-grow">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">{book.title}</h1>
          
          <div className="mb-6">
            <p className="text-xl text-gray-600 mb-2">{book.authors?.join(', ')}</p>
            {book.publisher && (
              <p className="text-gray-500">
                Published by {book.publisher}
                {book.publishedDate && ` (${book.publishedDate})`}
              </p>
            )}
          </div>

          {book.averageRating && (
            <div className="flex items-center mb-6">
              <div className="flex text-yellow-400">
                {'★'.repeat(Math.round(book.averageRating))}
                {'☆'.repeat(5 - Math.round(book.averageRating))}
              </div>
              <span className="ml-2 text-gray-600">
                {book.averageRating.toFixed(1)} ({book.ratingsCount} ratings)
              </span>
            </div>
          )}

          {book.categories && book.categories.length > 0 && (
            <div className="mb-6">
              <h2 className="text-lg text-gray-900 font-semibold mb-2">Categories</h2>
              <div className="flex flex-wrap gap-2">
                {book.categories.map((category, index) => (
                  <span
                    key={index}
                    className="py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                  >
                    {category}
                  </span>
                ))}
              </div>
            </div>
          )}

          {book.description && (
            <div className="mb-6">
              <h2 className="text-lg text-gray-900 font-semibold mb-2">Description</h2>
              <p className="text-gray-700 whitespace-pre-line">{book.description}</p>
            </div>
          )}

          <div className="flex gap-4">
            {book.previewLink && (
              <a
                href={book.previewLink}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-accent text-white rounded hover:bg-accent-dark transition-colors"
              >
                Preview Book
              </a>
            )}
            {book.infoLink && (
              <a
                href={book.infoLink}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 border border-accent text-accent rounded hover:bg-accent hover:text-white transition-colors"
              >
                More Info
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 