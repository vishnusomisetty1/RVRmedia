import Link from 'next/link';

export default function Navbar() {
  const links = [
    { href: '/', label: 'Home' },
    { href: '/portfolio', label: 'Portfolio' },
    { href: '/#services', label: 'Services' },
    { href: '/#about', label: 'About' },
    { href: '/booking', label: 'Book Us' },
    { href: '/#contact', label: 'Contact' },
  ];

  return (
    <nav className="fixed top-0 w-full bg-black/80 backdrop-blur-sm z-50 border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center h-16">
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm font-bold sm:text-base md:gap-x-12">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-white hover:text-white/80 transition-colors"
                scroll={true}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}
