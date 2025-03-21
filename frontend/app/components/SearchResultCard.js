export default function SearchResultCard({ book }) {
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
          <button className="px-4 py-1 text-sm border border-accent text-accent rounded hover:bg-accent hover:text-white transition-colors">
            Add to List
          </button>
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