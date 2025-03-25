'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/app/auth/AuthContext';

export default function BookReviewsPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [book, setBook] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userHasReviewed, setUserHasReviewed] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // fetch book details
        const bookResponse = await fetch(`/api/books/search?q=id:${params.id}`);
        if (!bookResponse.ok) {
          throw new Error('Failed to fetch book details');
        }
        const bookData = await bookResponse.json();
        if (bookData.books && bookData.books.length > 0) {
          setBook(bookData.books[0]);
        }

        // fetch reviews
        const reviewsResponse = await fetch(`http://localhost:8000/api/v1/reviews/${params.id}`);
        if (!reviewsResponse.ok) {
          throw new Error('Failed to fetch reviews');
        }
        const reviewsData = await reviewsResponse.json();
        setReviews(reviewsData);

        // check if user has already reviewed
        if (user) {
          setUserHasReviewed(reviewsData.some(review => review.userId === user.uid));
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [params.id, user]);

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!user) {
      router.push('/login');
      return;
    }

    try {
      const response = await fetch(`http://localhost:8000/api/v1/reviews/${params.id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.uid}`
        },
        body: JSON.stringify({ content: newReview })
      });

      if (!response.ok) {
        throw new Error('Failed to submit review');
      }

      const newReviewData = await response.json();
      setReviews(prev => [...prev, newReviewData]);
      setNewReview('');
      setUserHasReviewed(true);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeleteReview = async (reviewId) => {
    try {
      const response = await fetch(`http://localhost:8000/api/v1/reviews/${reviewId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${user.uid}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete review');
      }

      setReviews(prev => prev.filter(review => review.id !== reviewId));
      setUserHasReviewed(false);
    } catch (err) {
      setError(err.message);
    }
  };

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
        Back to Book
      </button>

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{book.title}</h1>
        <p className="text-gray-600">Reviews</p>
      </div>

      {!userHasReviewed && user && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4 text-gray-900">Write a Review</h2>
          <form onSubmit={handleSubmitReview}>
            <textarea
              value={newReview}
              onChange={(e) => setNewReview(e.target.value)}
              className="w-full p-4 border rounded-lg mb-4 min-h-[150px] text-gray-900"
              placeholder="Share your thoughts about this book..."
              required
            />
            <button
              type="submit"
              className="px-6 py-2 bg-accent text-white rounded hover:bg-accent-dark transition-colors"
            >
              Submit Review
            </button>
          </form>
        </div>
      )}

      {!user && (
        <div className="mb-8 p-4 bg-gray-50 rounded-lg">
          <p className="text-gray-600">Please log in to write a review.</p>
        </div>
      )}

      <div className="space-y-6">
        {reviews.length > 0 ? (
          reviews.map((review) => (
            <div key={review.id} className="bg-white p-6 rounded-lg shadow">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-gray-500 text-sm">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </p>
                </div>
                {user && user.uid === review.userId && (
                  <button
                    onClick={() => handleDeleteReview(review.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    Delete
                  </button>
                )}
              </div>
              <p className="text-gray-700 whitespace-pre-line">{review.content}</p>
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-center py-8">No reviews yet. Be the first to review!</p>
        )}
      </div>
    </div>
  );
} 