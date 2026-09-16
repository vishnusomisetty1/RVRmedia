const SERVICES = [
  {
    title: 'Events',
    description:
      'Parties, graduations, religious events, banquets, and celebrations covered with a polished mix of photos and video.',
  },
  {
    title: 'Portraits',
    description:
      'Individual portraits, headshots, couples, families, and posed group photos with clean direction on location.',
  },
  {
    title: 'Candid / Lifestyle',
    description:
      'Natural moments, casual lifestyle shots, NYC shoots, and cinematic edits with a more spontaneous feel.',
  },
];

export default function Services() {
  return (
    <section id="services" className="scroll-mt-16 bg-surface py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-14 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-gold">
            Services
          </p>
          <h2 className="mt-3 font-display text-4xl font-semibold text-cream md:text-6xl">
            What We Shoot
          </h2>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {SERVICES.map((service, index) => (
            <div
              key={service.title}
              className="rounded-lg border border-cream/10 bg-ink p-8 transition-colors hover:border-gold/40"
            >
              <p className="font-display text-lg italic text-gold">
                {String(index + 1).padStart(2, '0')}
              </p>
              <h3 className="mt-3 font-display text-3xl font-semibold text-cream">
                {service.title}
              </h3>
              <p className="mt-4 leading-7 text-cream/65">
                {service.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
