import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="fixed top-0 w-full bg-black/80 backdrop-blur-sm z-50 border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center h-16">
          <div className="flex space-x-8 md:space-x-16 font-bold">
            <Link
              href="/"
              className="text-white hover:text-white/80 transition-colors"
            >
              Home
            </Link>
            <Link
              href="/#gallery"
              className="text-white hover:text-white/80 transition-colors"
              scroll={true}
            >
              Gallery
            </Link>
            <Link
              href="/#contact"
              className="text-white hover:text-white/80 transition-colors"
              scroll={true}
            >
              Contact us
            </Link>
            <Link
              href="/booking"
              className="text-white hover:text-white/80 transition-colors"
            >
              Book Us
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
