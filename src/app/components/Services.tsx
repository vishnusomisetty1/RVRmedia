import Link from 'next/link';

import Reveal from './Reveal';
import RevealText from './RevealText';

// `category` matches the ids in PORTFOLIO_CATEGORIES so each card can deep
// link straight into that set on the portfolio page.
const SERVICES = [
  {
    title: 'Events',
    category: 'events',
    description:
      'Parties, graduations, religious events, banquets, and celebrations covered with a polished mix of photos and video.',
  },
  {
    title: 'Portraits',
    category: 'portraits',
    description:
      'Individual portraits, headshots, couples, families, and posed group photos with clean direction on location.',
  },
  {
    title: 'Candid / Lifestyle',
    category: 'creative',
    description:
      'Natural moments, casual lifestyle shots, NYC shoots, and cinematic edits with a more spontaneous feel.',
  },
];

export default function Services() {
  return (
    <section id="services" className="scroll-mt-16 bg-surface py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal className="mb-3 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-orchid">
            Services
          </p>
        </Reveal>
        <RevealText
          as="h2"
          text="What We Shoot"
          className="mb-14 text-center font-display text-4xl font-normal text-cream md:text-6xl"
        />
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {SERVICES.map((service, index) => (
            <Reveal key={service.title} delay={index * 110}>
              <Link
                href={`/portfolio#${service.category}`}
                className="group flex h-full flex-col rounded-lg border border-cream/10 bg-ink p-8 transition-all duration-300 hover:-translate-y-1 hover:border-orchid/40 focus:outline-none focus-visible:ring-4 focus-visible:ring-orchid/40"
              >
                <RevealText
                  as="h3"
                  text={service.title}
                  delay={index * 110}
                  className="font-display text-3xl font-normal text-cream"
                />
                <p className="mt-4 leading-7 text-cream/65">
                  {service.description}
                </p>
                <span className="mt-6 text-sm font-semibold uppercase tracking-[0.2em] text-orchid transition-colors group-hover:text-cream">
                  View work
                  <span
                    aria-hidden
                    className="ml-2 inline-block transition-transform duration-300 group-hover:translate-x-1"
                  >
                    &rarr;
                  </span>
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
