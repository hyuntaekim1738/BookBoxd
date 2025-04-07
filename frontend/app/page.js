'use client';

import Link from 'next/link';
import { useAuth } from './auth/AuthContext';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.push('/home');
    }
  }, [user, router]);

  if (user) {
    return null;
  }

  return (
    <div className="text-center max-w-md mx-auto px-4">
      <h2 className="text-3xl font-extrabold text-gray-900 mb-8 mt-6 text-center">
        Welcome to BookBoxd
      </h2>
      <h3 className="max-w-md text-xl  mt-2 text-center text-gray-600">
        Consider this your digital bookshelf, recording books you've read and your thoughts on them.
        Click the button below to log in and get started!
      </h3>
      <div className="mt-6 flex justify-center">
        <Link href="/auth/login" className="px-8 py-3 bg-accent hover:bg-accent/90 text-white font-semibold rounded-lg transition-colors shadow-lg">
          Get Started!
        </Link>
      </div>
    </div>
  );
}
