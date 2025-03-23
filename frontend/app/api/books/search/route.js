import { NextResponse } from 'next/server';

const GOOGLE_BOOKS_API = 'https://www.googleapis.com/books/v1/volumes';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');
  const startIndex = searchParams.get('startIndex') || '0';
  const maxResults = searchParams.get('maxResults') || '10';
  const filter = searchParams.get('filter') || '';

  if (!query) {
    return NextResponse.json({ error: 'Query parameter is required' }, { status: 400 });
  }

  try {
    // checks if this is a book ID lookup
    if (query.startsWith('id:')) {
      const bookId = query.substring(3);
      const volumeUrl = `${GOOGLE_BOOKS_API}/${bookId}`;
      
      const response = await fetch(volumeUrl);
      const book = await response.json();

      if (book.error) {
        return NextResponse.json({ books: [], totalItems: 0 });
      }

      const transformedBook = {
        id: book.id,
        title: book.volumeInfo.title,
        authors: book.volumeInfo.authors || ['Unknown Author'],
        publisher: book.volumeInfo.publisher,
        publishedDate: book.volumeInfo.publishedDate,
        description: book.volumeInfo.description,
        imageLinks: book.volumeInfo.imageLinks,
        categories: book.volumeInfo.categories || [],
        averageRating: book.volumeInfo.averageRating,
        ratingsCount: book.volumeInfo.ratingsCount,
        pageCount: book.volumeInfo.pageCount,
        language: book.volumeInfo.language,
        previewLink: book.volumeInfo.previewLink,
        infoLink: book.volumeInfo.infoLink,
      };

      return NextResponse.json({
        books: [transformedBook],
        totalItems: 1,
      });
    }

    const searchUrl = new URL(GOOGLE_BOOKS_API);
    searchUrl.searchParams.append('q', query);
    searchUrl.searchParams.append('startIndex', startIndex);
    searchUrl.searchParams.append('maxResults', maxResults);
    if (filter) {
      searchUrl.searchParams.append('filter', filter);
    }

    const response = await fetch(searchUrl.toString());
    const data = await response.json();

    // Transform the response to match our application's needs
    const transformedBooks = data.items?.map(book => ({
      id: book.id,
      title: book.volumeInfo.title,
      authors: book.volumeInfo.authors || ['Unknown Author'],
      publisher: book.volumeInfo.publisher,
      publishedDate: book.volumeInfo.publishedDate,
      description: book.volumeInfo.description,
      imageLinks: book.volumeInfo.imageLinks,
      categories: book.volumeInfo.categories || [],
      averageRating: book.volumeInfo.averageRating,
      ratingsCount: book.volumeInfo.ratingsCount,
      pageCount: book.volumeInfo.pageCount,
      language: book.volumeInfo.language,
      previewLink: book.volumeInfo.previewLink,
      infoLink: book.volumeInfo.infoLink,
    })) || [];

    return NextResponse.json({
      books: transformedBooks,
      totalItems: data.totalItems || 0,
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch books' },
      { status: 500 }
    );
  }
} 