import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="fixed top-0 w-full bg-background/80 backdrop-blur-sm z-50 border-b border-foreground/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center h-16">
          <div className="flex space-x-8">
            <Link
              href="/"
              className="hover:text-foreground/80 transition-colors"
            >
              Home
            </Link>
            <Link
              href="/Gallery"
              className="hover:text-foreground/80 transition-colors"
            >
              Gallery
            </Link>
            <Link
              href="/Contact us"
              className="hover:text-foreground/80 transition-colors"
            >
              Contact us
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
