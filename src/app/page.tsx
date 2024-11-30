import Image from 'next/image';
import Link from 'next/link';
import Navbar from './components/Navbar';

export default function Home() {
  return (
    <>
      <Navbar />
      {/* Hero Section with Background Image */}
      <section className="relative h-screen">
        {/* Add your background image here */}
        <Image
          src="/portfolio/swan_cabin.JPG"
          alt="Swan Cabin Background"
          fill
          className="object-cover"
          priority
        />
        {/* Overlay to ensure text is readable */}
        <div className="absolute inset-0 bg-black/50" />

        {/* Hero Content */}
        <div className="relative h-full flex flex-col items-center justify-center text-center px-4">
          <h1 className="text-6xl font-bold mb-6 text-white">RVR Media</h1>
          <p className="text-xl text-white/90 mb-8 max-w-2xl">
            We bring your vision to life through innovative media solutions
          </p>
          <Link
            href="/contact"
            className="bg-white text-black px-8 py-4 rounded-full hover:bg-white/90 transition-colors"
          >
            Get in Touch
          </Link>
        </div>
      </section>

      {/* Gallery Section */}
      <section id="gallery" className="py-20 bg-black">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center text-white">
            Our Work
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-1">
            {[
              'candidme.JPG',
              'group.JPG',
              'spkkkk.JPG',
              'temple.JPG',
              'navside.JPG',
              'peacockwhite.JPG',
              'rishiside.JPG',
              'IMG_9164.jpeg',
              'peacocktwo.JPG',
              'mecasual.JPG',
              'bluepeacock.JPG',
              'pittsburgh.JPG',
              'swan.JPG',
              'lightning.JPG',
              'meside.JPG',
            ].map((image) => (
              <div
                key={image}
                className="relative aspect-square group overflow-hidden"
              >
                <Image
                  src={`/gallery/${image}`}
                  alt={`Gallery image ${image}`}
                  fill
                  className="object-cover transition-all duration-300 hover:scale-105"
                />
                <div className="absolute inset-0 border border-white/10" />
                <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section with White Background */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center text-black">
            Our Services
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: 'Photography',
                description:
                  'Professional photography services for all your needs',
              },
              {
                title: 'Videography',
                description: 'High-quality video production and editing',
              },
              {
                title: 'Drone Cinematography',
                description: 'Stunning aerial footage and perspectives',
              },
            ].map((service) => (
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
    </>
  );
}
