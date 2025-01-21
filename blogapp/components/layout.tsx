import TopNavBar from '@/components/top-nav-bar';
import { ReactNode } from 'react';
import Link from 'next/link';

interface LayoutProps {
  children: ReactNode;
  title?: string; // Optional title for the page
}

const Layout: React.FC<LayoutProps> = ({ children, title }) => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Header */}
        <TopNavBar />

      {/* Main Content */}
      <main className="flex-grow py-12 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {title && <h2 className="text-3xl font-bold text-blue-600 mb-8 text-center">{title}</h2>}
          {children}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-6">
        <div className="container mx-auto text-center">
          <p>&copy; 2025 My Blog. All rights reserved.</p>
          <nav className="mt-4">
            <Link href="/about" className="text-blue-400 hover:underline mx-2">
              About
            </Link>
            <Link href="/contact" className="text-blue-400 hover:underline mx-2">
              Contact
            </Link>
            <Link href="/privacy" className="text-blue-400 hover:underline mx-2">
              Privacy Policy
            </Link>
          </nav>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
