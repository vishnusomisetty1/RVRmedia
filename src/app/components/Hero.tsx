import Image from 'next/image';
import Link from 'next/link';

export default function Hero() {
  return (
    <section className="relative h-screen">
      <Image
        src="/portfolio/swan_cabin.JPG"
        alt="Swan Cabin Background"
        fill
        className="object-cover"
        priority
      />
      <div className="absolute inset-0 bg-black/50" />

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
  );
}
