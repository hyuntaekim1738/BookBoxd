import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../auth/AuthContext';

export default function SearchResultCard({ book, onBookshelfChange }) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [bookshelves, setBookshelves] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [bookShelvesWithBook, setBookShelvesWithBook] = useState(new Set());
  const { user } = useAuth();
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const fetchBookshelves = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:8000/api/v1/bookshelves', {
        headers: {
          'Authorization': `Bearer ${user.uid}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch bookshelves');
      }
      
      const data = await response.json();
      setBookshelves(data);
      
      // create a Set of bookshelf IDs that already contain this book
      const shelvesWithBook = new Set(
        data
          .filter(shelf => shelf.bookIds.includes(book.id))
          .map(shelf => shelf.id)
      );
      setBookShelvesWithBook(shelvesWithBook);
    } catch (error) {
      console.error('Error fetching bookshelves:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const addToBookshelf = async (bookshelfId) => {
    try {
      const response = await fetch(`http://localhost:8000/api/v1/bookshelves/${bookshelfId}/books/${book.id}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${user.uid}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to add book to bookshelf');
      }

      // update the local state to reflect the change
      setBookShelvesWithBook(prev => {
        const newSet = new Set(prev);
        newSet.add(bookshelfId);
        return newSet;
      });

      // notify parent component to refresh
      if (onBookshelfChange) {
        onBookshelfChange();
      }
    } catch (error) {
      console.error('Error adding book to bookshelf:', error);
    }
  };

  const removeFromBookshelf = async (bookshelfId) => {
    // update UI immediately
    setBookShelvesWithBook(prev => {
      const newSet = new Set(prev);
      newSet.delete(bookshelfId);
      return newSet;
    });

    try {
      const response = await fetch(`http://localhost:8000/api/v1/bookshelves/${bookshelfId}/books/${book.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${user.uid}`
        }
      });

      if (!response.ok) {
        // revert the UI change if the API call fails
        setBookShelvesWithBook(prev => {
          const newSet = new Set(prev);
          newSet.add(bookshelfId);
          return newSet;
        });
        throw new Error('Failed to remove book from bookshelf');
      }

      // notify parent component to refresh
      if (onBookshelfChange) {
        onBookshelfChange();
      }
    } catch (error) {
      console.error('Error removing book from bookshelf:', error);
    }
  };

  const handleBookshelfToggle = async (bookshelfId) => {
    if (bookShelvesWithBook.has(bookshelfId)) {
      await removeFromBookshelf(bookshelfId);
    } else {
      await addToBookshelf(bookshelfId);
    }
  };

  return (
    <div className="flex gap-4 p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow">
      <div className="flex-shrink-0">
        {book.imageLinks?.thumbnail ? (
          <img
            src={book.imageLinks.thumbnail}
            alt={book.title}
            className="w-24 h-36 object-cover rounded"
          />
        ) : (
          <div className="w-24 h-36 bg-gray-200 rounded flex items-center justify-center">
            <span className="text-gray-400 text-sm">No image</span>
          </div>
        )}
      </div>
      <div className="flex-1">
        <h3 className="text-xl font-semibold text-gray-900 mb-1">{book.title}</h3>
        <p className="text-gray-600 mb-2">{book.authors.join(', ')}</p>
        <p className="text-sm text-gray-500 mb-4">
          {book.publisher && `${book.publisher} • `}
          {book.publishedDate && `Published ${book.publishedDate}`}
        </p>
        <p className="text-gray-700 line-clamp-2">
          {book.description || 'No description available'}
        </p>
        <div className="mt-4 flex items-center gap-4">
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => {
                if (!isDropdownOpen) {
                  fetchBookshelves();
                }
                setIsDropdownOpen(!isDropdownOpen);
              }}
              className="px-4 py-1 text-sm border border-accent text-accent rounded hover:bg-accent hover:text-white transition-colors"
            >
              Add to List
            </button>
            
            {isDropdownOpen && (
              <div className="absolute z-10 mt-1 w-48 bg-white rounded-md shadow-lg border border-gray-200">
                {isLoading ? (
                  <div className="px-4 py-2 text-sm text-gray-500">Loading...</div>
                ) : bookshelves.length > 0 ? (
                  <div className="py-1">
                    {bookshelves.map((bookshelf) => (
                      <button
                        key={bookshelf.id}
                        onClick={() => handleBookshelfToggle(bookshelf.id)}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                      >
                        <input
                          type="checkbox"
                          checked={bookShelvesWithBook.has(bookshelf.id)}
                          onChange={() => {}}
                          className="mr-2"
                        />
                        {bookshelf.name}
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="px-4 py-2 text-sm text-gray-500">No bookshelves found</div>
                )}
              </div>
            )}
          </div>
          
          {book.averageRating && (
            <div className="flex items-center">
              <span className="text-yellow-400">
                {'★'.repeat(Math.round(book.averageRating))}
              </span>
              <span className="text-gray-400">
                {'★'.repeat(5 - Math.round(book.averageRating))}
              </span>
              <span className="ml-1 text-sm text-gray-600">
                ({book.averageRating.toFixed(1)})
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 