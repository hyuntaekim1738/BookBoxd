import Link from 'next/link';

export default function BookshelfCard({ bookshelf }) {
  return (
    <Link 
      href={`/bookshelves/${bookshelf.id}`}
      className="block"
    >
      <div className="flex items-center justify-between p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow">
        <div className="flex items-center gap-4">
          <div className="w-24 h-36 bg-accent/10 rounded flex items-center justify-center">
            <span className="text-accent text-2xl">📚</span>
          </div>  
          <h3 className="text-3xl font-bold text-gray-900">{bookshelf.name}</h3>
        </div>
        <p className="text-gray-600 pr-8">{bookshelf.bookCount} books</p>
      </div>
    </Link>
  );
} 