'use client';

import { useState } from 'react';
import SearchResultCard from '../components/SearchResultCard';

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [books, setBooks] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState('relevance');

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({
        q: searchQuery,
        maxResults: '20',
      });

      const response = await fetch(`/api/books/search?${params}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch books');
      }

      // Sort results based on selected option
      let sortedBooks = [...data.books];
      switch (sortBy) {
        case 'rating':
          sortedBooks.sort((a, b) => (b.averageRating || 0) - (a.averageRating || 0));
          break;
        case 'date':
          sortedBooks.sort((a, b) => new Date(b.publishedDate) - new Date(a.publishedDate));
          break;
        case 'title':
          sortedBooks.sort((a, b) => a.title.localeCompare(b.title));
          break;
        default:
          // Keep original relevance order
          break;
      }

      setBooks(sortedBooks);
      setTotalItems(data.totalItems);
    } catch (err) {
      setError(err.message);
      setBooks([]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Search Books
        </h1>
        <p className="text-gray-600">
          Search through millions of books to find your next great read
        </p>
      </div>

      {/* search Form */}
      <form onSubmit={handleSearch} className="mb-8">
        <div className="flex gap-2">
          <div className="flex-1">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by title, author, or ISBN..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent text-gray-900"
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="px-6 py-2 bg-accent text-white rounded-lg hover:bg-accent/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent disabled:opacity-50"
          >
            {isLoading ? 'Searching...' : 'Search'}
          </button>
        </div>
      </form>

      {/* filters */}
      <div className="mb-6 flex gap-4">
        <select 
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="px-4 py-2 border border-gray-900 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent bg-white text-gray-900"
        >
          <option value="relevance">Relevance</option>
          <option value="rating">Rating</option>
          <option value="date">Publication Date</option>
          <option value="title">Title</option>
        </select>
      </div>

      {/* Results Section */}
      <div className="space-y-6">
        {error && (
          <div className="text-red-500 text-center py-4">
            {error}
          </div>
        )}

        {books.length > 0 ? (
          <>
            <div className="text-sm text-gray-600 mb-4">
              Found {totalItems} results
            </div>
            {books.map((book) => (
              <SearchResultCard key={book.id} book={book} />
            ))}
          </>
        ) : (
          <div className="text-center text-gray-500 py-8">
            {isLoading ? 'Searching...' : 'Search for books to see results'}
          </div>
        )}
      </div>
    </div>
  );
}
