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
    title: 'Creative / Lifestyle',
    description:
      'NYC shoots, cinematic edits, fashion-style sessions, and experimental visuals built around a sharper concept.',
  },
];

export default function Services() {
  return (
    <section id="services" className="py-20 bg-gray-100">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-12 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-black/50">
            Services
          </p>
          <h2 className="mt-3 text-3xl font-bold text-black md:text-4xl">
            What We Shoot
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-1">
          {SERVICES.map((service) => (
            <div
              key={service.title}
              className="p-6 border border-black/10 rounded-lg bg-white text-center"
            >
              <h3 className="text-xl font-bold mb-4 text-black">
                {service.title}
              </h3>
              <p className="text-black/70">{service.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
