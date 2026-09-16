import Link from 'next/link';

const EMAIL = 'rvr.mediaco@gmail.com';
const INSTAGRAM_URL = 'https://www.instagram.com/rvr_mediaco/';

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
          <div className="max-w-md">
            <p className="font-display text-4xl font-semibold">RVR Media</p>
            <p className="mt-3 text-cream/60">
              Photo and video for events, portraits, and the moments in
              between.
            </p>
            <Link
              href="/booking"
              className="mt-7 inline-flex rounded-full bg-gold px-7 py-3 text-sm font-semibold text-ink transition-colors hover:bg-cream focus:outline-none focus-visible:ring-4 focus-visible:ring-gold/40"
            >
              Book a Shoot
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-10 text-sm sm:gap-16">
            <nav aria-label="Footer">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gold">
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
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gold">
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
                <li>
                  <a
                    href={INSTAGRAM_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-cream/70 transition-colors hover:text-cream"
                  >
                    @rvr_mediaco
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <p className="mt-14 border-t border-cream/10 pt-6 text-xs text-cream/40">
          © {new Date().getFullYear()} RVR Media. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
