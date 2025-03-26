'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../auth/AuthContext';
import BookshelfCard from '../components/BookshelfCard';

export default function BookshelvesPage() {
  const { user } = useAuth();
  const [bookshelves, setBookshelves] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [newName, setNewName] = useState('');
  const [modalError, setModalError] = useState('');

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

  const handleCreateBookshelf = async () => {
    setModalError('');
    if (bookshelves.some((b) => b.name.toLowerCase() === newName.toLowerCase())) {
      setModalError('Bookshelf name already used.');
      return;
    }

    try {
      const response = await fetch('http://localhost:8000/api/v1/bookshelves', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.uid}`,
        },
        body: JSON.stringify({ name: newName }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to create bookshelf');
      }

      setBookshelves([...bookshelves, data]);
      setNewName('');
      setShowModal(false);
    } catch (err) {
      setModalError(err.message);
    }
  };

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
          onClick={() => setShowModal(true)}
          className="px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent"
        >
          Create Bookshelf
        </button>
      </div>

      {error && <div className="text-red-500 text-center py-4">{error}</div>}

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

      {/* add bookshelf modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4 text-gray-900">Create New Bookshelf</h2>
            <input
              type="text"
              placeholder="Enter bookshelf name"
              className="w-full border rounded-md p-2 mb-2 text-gray-700"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
            />
            {modalError && <p className="text-red-500 mb-2">{modalError}</p>}
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateBookshelf}
                className="px-4 py-2 bg-accent text-white rounded-md hover:bg-accent/90"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
