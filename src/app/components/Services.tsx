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
    description: (
      <video
        src="/gallery/droneshot.MP4"
        autoPlay
        loop
        muted
        className="object-cover w-full h-full transition-all duration-300 hover:scale-105"
      />
    ),
  },
];

export default function Services() {
  return (
    <section id="services" className="py-20 bg-gray-100">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl font-bold mb-12 text-center text-black">
          Our Services
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-1">
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
