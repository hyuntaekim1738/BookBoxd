import Image from "next/image";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-200 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-primary mb-8 text-center">
          Welcome to BookBoxd
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Featured Books Section */}
          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <h2 className="text-xl font-semibold text-secondary mb-4">
              Featured Books
            </h2>
            <p className="text-gray-600">
              Discover our handpicked selection of must-read books.
            </p>
          </div>

          {/* Reading Lists Section */}
          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <h2 className="text-xl font-semibold text-secondary mb-4">
              Reading Lists
            </h2>
            <p className="text-gray-600">
              Create and share your personalized reading lists.
            </p>
          </div>

          {/* Community Section */}
          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <h2 className="text-xl font-semibold text-secondary mb-4">
              Join the Community
            </h2>
            <p className="text-gray-600">
              Connect with fellow book lovers and share your thoughts.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
