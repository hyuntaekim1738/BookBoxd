import './globals.css';
import Navbar from './components/Navbar';

export const metadata = {
  title: 'BookBoxd - Track Your Reading Journey',
  description: 'A social platform for book lovers to track, review, and discover books.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-full">
      <body className="h-full overflow-x-hidden">
        <Navbar />
        {children}
      </body>
    </html>
  );
}
