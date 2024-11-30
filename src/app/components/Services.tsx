const SERVICES = [
  {
    title: 'Photography',
    description: 'Professional photography services for all your needs',
  },
  {
    title: 'Videography',
    description: 'High-quality video production and editing',
  },
  {
    title: 'Drone Cinematography',
    description: 'Stunning aerial footage and perspectives',
  },
];

export default function Services() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl font-bold mb-12 text-center text-black">
          Our Services
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {SERVICES.map((service) => (
            <div
              key={service.title}
              className="p-6 border border-black/10 rounded-lg text-center"
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
