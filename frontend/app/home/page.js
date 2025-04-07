'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../auth/AuthContext';
import SearchResultCard from '../components/SearchResultCard';

export default function Home() {
    const [recommendations, setRecommendations] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();

    useEffect(() => {
        const fetchRecommendations = async () => {
            if (!user) return;
            
            try {
                const response = await fetch('http://localhost:8000/api/v1/recommendations', {
                    headers: {
                        'Authorization': `Bearer ${user.uid}`
                    }
                });
                
                if (!response.ok) {
                    throw new Error('Failed to fetch recommendations');
                }
                
                const data = await response.json();
                setRecommendations(data);
            } catch (error) {
                console.error('Error fetching recommendations:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchRecommendations();
    }, [user]);

    if (!user) {
        return null;
    }

    return (
        <div className="max-w-4xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-4">
                    Home
                </h1>
                <p className="text-gray-600 mb-8">
                    Navigate around our site to interact with users, find books, and record your thoughts!
                </p>
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                    Recommended Books
                </h2>
                
                {loading ? (
                    <div className="text-center py-8">
                        <p className="text-gray-600">Loading recommendations...</p>
                    </div>
                ) : recommendations.length > 0 ? (
                    <div className="space-y-4">
                        {recommendations.map((book) => (
                            <SearchResultCard
                                key={book.id}
                                book={book.volumeInfo}
                                onBookshelfChange={() => {}}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-8">
                        <p className="text-gray-600">No recommendations available yet. Start adding books to your bookshelves!</p>
                    </div>
                )}
            </div>
        </div>
    );
}