'use client';

import { useState } from 'react';

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    // TODO: Implement search functionality
    setIsLoading(false);
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
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
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
        <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent">
          <option value="">All Genres</option>
          <option value="fiction">Fiction</option>
          <option value="non-fiction">Non-Fiction</option>
          <option value="mystery">Mystery</option>
          <option value="sci-fi">Science Fiction</option>
          <option value="fantasy">Fantasy</option>
        </select>

        <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent">
          <option value="">Sort By</option>
          <option value="relevance">Relevance</option>
          <option value="rating">Rating</option>
          <option value="date">Publication Date</option>
          <option value="title">Title</option>
        </select>
      </div>

      {/* Results Section */}
      <div className="space-y-6">
        {/* Example Result Card - This will be mapped over actual results */}
        <div className="flex gap-4 p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow">
          <div className="flex-shrink-0">
            <div className="w-24 h-36 bg-gray-200 rounded"></div>
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-semibold text-gray-900 mb-1">Book Title Example</h3>
            <p className="text-gray-600 mb-2">Author Name</p>
            <p className="text-sm text-gray-500 mb-4">
              Published by Publisher Name (2023)
            </p>
            <p className="text-gray-700 line-clamp-2">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </p>
            <div className="mt-4 flex items-center gap-4">
              <button className="px-4 py-1 text-sm border border-accent text-accent rounded hover:bg-accent hover:text-white transition-colors">
                Add to List
              </button>
              <div className="flex items-center">
                <span className="text-yellow-400">★★★★</span>
                <span className="text-gray-400">★</span>
                <span className="ml-1 text-sm text-gray-600">(4.0)</span>
              </div>
            </div>
          </div>
        </div>

        {/* map over actual results here */}
        <div className="text-center text-gray-500 py-8">
          Search for books to see results
        </div>
      </div>
    </div>
  );
}
