import './globals.css';
import Navbar from './components/Navbar';
import BackgroundLayout from './components/BackgroundLayout';
import { AuthProvider } from './auth/AuthContext';

export const metadata = {
  title: 'BookBoxd - Track Your Reading Journey',
  description: 'A social platform for book lovers to track, review, and discover books.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-full">
      <body className="h-full overflow-x-hidden">
        <AuthProvider>
          <Navbar />
          <BackgroundLayout>
            {children}
          </BackgroundLayout>
        </AuthProvider>
      </body>
    </html>
  );
}
