'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

const LINKS = [
  { href: '/', label: 'Home' },
  { href: '/portfolio', label: 'Portfolio' },
  { href: '/#services', label: 'Services' },
  { href: '/#about', label: 'About' },
  { href: '/booking', label: 'Book Us' },
  { href: '/#contact', label: 'Contact' },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  // Close the phone menu after navigating to another page.
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  return (
    <nav className="fixed top-0 z-50 w-full border-b border-cream/10 bg-ink/80 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Desktop: centered links */}
        <div className="hidden h-16 items-center justify-center md:flex">
          <div className="flex gap-x-10 text-xs font-semibold uppercase tracking-[0.25em]">
            {LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                aria-current={link.href === pathname ? 'page' : undefined}
                className={`transition-colors hover:text-orchid ${
                  link.href === pathname ? 'text-orchid' : 'text-cream/70'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Phone: brand + menu button */}
        <div className="flex h-16 items-center justify-between md:hidden">
          <Link
            href="/"
            className="font-display text-2xl font-normal tracking-wide text-cream"
          >
            RVR Media
          </Link>
          <button
            type="button"
            onClick={() => setIsOpen((open) => !open)}
            aria-expanded={isOpen}
            aria-controls="mobile-menu"
            aria-label={isOpen ? 'Close menu' : 'Open menu'}
            className="-mr-2 flex h-11 w-11 items-center justify-center rounded-full text-cream transition-colors hover:bg-cream/10 focus:outline-none focus-visible:ring-4 focus-visible:ring-orchid/40"
          >
            <svg
              viewBox="0 0 24 24"
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              aria-hidden
            >
              {isOpen ? (
                <path d="M6 6l12 12M18 6L6 18" />
              ) : (
                <path d="M4 7h16M4 12h16M4 17h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {isOpen ? (
        <div
          id="mobile-menu"
          className="border-t border-cream/10 bg-ink/95 px-4 pb-6 pt-2 md:hidden"
        >
          <ul className="flex flex-col">
            {LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  aria-current={link.href === pathname ? 'page' : undefined}
                  className={`block border-b border-cream/10 py-4 text-sm font-semibold uppercase tracking-[0.2em] transition-colors hover:text-orchid ${
                    link.href === pathname ? 'text-orchid' : 'text-cream/80'
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
          <Link
            href="/booking"
            onClick={() => setIsOpen(false)}
            className="mt-6 flex justify-center rounded-full bg-violet px-6 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-cream transition-colors hover:bg-violet-dark"
          >
            Book a Shoot
          </Link>
        </div>
      ) : null}
    </nav>
  );
}
