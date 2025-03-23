'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../auth/AuthContext';
import BookshelfCard from '../components/BookshelfCard';

export default function BookshelvesPage() {
  const { user } = useAuth();
  const [bookshelves, setBookshelves] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBookshelves = async () => {
      if (!user) return;

      try {
        const response = await fetch('http://localhost:8000/api/v1/bookshelves', {
          headers: {
            'Authorization': `Bearer ${user.uid}`
          }
        });
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Failed to fetch bookshelves');
        }

        setBookshelves(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBookshelves();
  }, [user]);

  if (!user) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Please log in to view your bookshelves.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            My Bookshelves
          </h1>
          <p className="text-gray-600">
            Organize and manage your book collections
          </p>
        </div>
        <button
          onClick={() => {/* TODO: Implement create bookshelf */}}
          className="px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent"
        >
          Create Bookshelf
        </button>
      </div>

      {error && (
        <div className="text-red-500 text-center py-4">
          {error}
        </div>
      )}

      {isLoading ? (
        <div className="text-center py-8">
          <p className="text-gray-500">Loading bookshelves...</p>
        </div>
      ) : bookshelves.length > 0 ? (
        <div className="space-y-4">
          {bookshelves.map((bookshelf) => (
            <BookshelfCard key={bookshelf.id} bookshelf={bookshelf} />
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-gray-500">No bookshelves yet</p>
        </div>
      )}
    </div>
  );
} 