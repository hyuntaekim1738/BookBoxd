'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white shadow-md z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* logo section */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <span className="text-2xl font-bold text-primary">BookBoxd</span>
            </Link>
          </div>

          {/* desktop navbar */}
          <div className="hidden sm:flex sm:items-center sm:space-x-8">
            <Link href="/books" className="text-gray-700 hover:text-primary px-3 py-2 rounded-md text-sm font-medium">
              Search Books
            </Link>
            <Link href="/lists" className="text-gray-700 hover:text-primary px-3 py-2 rounded-md text-sm font-medium">
              Bookshelves {/* Contains To-Read, Currently Reading, and Finished Books */}
            </Link>
            <Link href="/community" className="text-gray-700 hover:text-primary px-3 py-2 rounded-md text-sm font-medium">
              Community
            </Link>
            <div className="flex items-center space-x-4">
              <button className="bg-accent text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-accent/90 transition-colors">
                Sign Up
              </button>
              <button className="border border-primary text-primary px-4 py-2 rounded-md text-sm font-medium hover:bg-primary/10 transition-colors">
                Log In
              </button>
            </div>
          </div>

          {/* open/close menu buttons for mobile */}
          <div className="flex items-center sm:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-primary hover:bg-gray-100 focus:outline-none"
            >
              <span className="sr-only">Open main menu</span>
              {/* open menu icon */}
              <svg
                className={`${isMenuOpen ? 'hidden' : 'block'} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              {/* close menu icon */}
              <svg
                className={`${isMenuOpen ? 'block' : 'hidden'} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* mobile navbar */}
      <div className={`${isMenuOpen ? 'block' : 'hidden'} sm:hidden`}>
        <div className="px-2 pt-2 pb-3 space-y-1">
          <Link
            href="/books"
            className="block text-gray-700 hover:text-primary px-3 py-2 rounded-md text-base font-medium"
            onClick={() => setIsMenuOpen(false)}
          >
            Search Books
          </Link>
          <Link
            href="/lists"
            className="block text-gray-700 hover:text-primary px-3 py-2 rounded-md text-base font-medium"
            onClick={() => setIsMenuOpen(false)}
          >
            Bookshelves
          </Link>
          <Link
            href="/community"
            className="block text-gray-700 hover:text-primary px-3 py-2 rounded-md text-base font-medium"
            onClick={() => setIsMenuOpen(false)}
          >
            Community
          </Link>
          <div className="pt-4 pb-3 border-t border-gray-200">
            <button className="w-full bg-accent text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-accent/90 transition-colors mb-2">
              Sign Up
            </button>
            <button className="w-full border border-primary text-primary px-4 py-2 rounded-md text-sm font-medium hover:bg-primary/10 transition-colors">
              Log In
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
} 