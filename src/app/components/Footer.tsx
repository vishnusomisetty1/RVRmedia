import Link from 'next/link';

import Reveal from './Reveal';

const EMAIL = 'rvr.mediaco@gmail.com';

const LINKS = [
  { href: '/portfolio', label: 'Portfolio' },
  { href: '/#services', label: 'Services' },
  { href: '/#about', label: 'About' },
  { href: '/booking', label: 'Book Us' },
];

export default function Footer() {
  return (
    <footer className="border-t border-cream/10 bg-ink text-cream">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-10 md:flex-row md:items-end md:justify-between">
          <Reveal className="max-w-md">
            <p className="font-display text-4xl font-normal">RVR Media</p>
            <p className="mt-3 text-cream/60">
              Photo and video for events, portraits, and the moments in between.
            </p>
            <Link
              href="/booking"
              className="mt-7 inline-flex rounded-full bg-violet px-7 py-3 text-sm font-semibold text-cream transition-colors hover:bg-violet-dark focus:outline-none focus-visible:ring-4 focus-visible:ring-orchid/40"
            >
              Book a Shoot
            </Link>
          </Reveal>

          <Reveal
            delay={120}
            className="grid grid-cols-2 gap-10 text-sm sm:gap-16"
          >
            <nav aria-label="Footer">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-orchid">
                Explore
              </p>
              <ul className="mt-4 space-y-3">
                {LINKS.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-cream/70 transition-colors hover:text-cream"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-orchid">
                Contact
              </p>
              <ul className="mt-4 space-y-3">
                <li>
                  <a
                    href={`mailto:${EMAIL}`}
                    className="break-all text-cream/70 transition-colors hover:text-cream"
                  >
                    {EMAIL}
                  </a>
                </li>
              </ul>
            </div>
          </Reveal>
        </div>

        <p className="mt-14 border-t border-cream/10 pt-6 text-xs text-cream/40">
          © {new Date().getFullYear()} RVR Media. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
