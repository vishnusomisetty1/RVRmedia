'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';

const HERO_IMAGES = [
  {
    src: '/gallery/_DSC9302.jpg',
    alt: 'Cinematic private event moment',
  },
  {
    src: '/gallery/_DSC9499.jpg',
    alt: 'Event portrait in a warm lounge setting',
  },
  {
    src: '/gallery/_DSC9526.jpg',
    alt: 'Candid event coverage moment',
  },
  {
    src: '/gallery/DSC09348.jpg',
    alt: 'Large group portrait at a private event',
  },
];

export default function Hero() {
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setActiveImage((currentImage) => (currentImage + 1) % HERO_IMAGES.length);
    }, 5000);

    return () => window.clearInterval(interval);
  }, []);

  return (
    <section className="relative flex min-h-[92vh] items-center justify-center overflow-hidden bg-black px-4 py-24">
      <div className="absolute inset-0">
        {HERO_IMAGES.map((image, index) => (
          <div
            key={image.src}
            className={`absolute inset-0 transition-opacity duration-[1800ms] ease-in-out ${
              activeImage === index ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <Image
              src={image.src}
              alt={image.alt}
              fill
              priority={index === 0}
              sizes="100vw"
              className={`object-cover ${
                activeImage === index ? 'hero-image-pan-right' : 'scale-105'
              }`}
            />
          </div>
        ))}
      </div>

      <div className="absolute inset-0 bg-black/60" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.35)_0%,rgba(0,0,0,0.2)_48%,rgba(0,0,0,0.65)_100%)]" />

      <div className="relative z-10 mx-auto max-w-4xl text-center text-white">
        <p className="text-sm font-semibold uppercase tracking-[0.35em] text-white/70">
          RVR Media
        </p>
        <h1 className="mt-5 text-4xl font-bold leading-tight sm:text-5xl md:text-7xl">
          Capture Your Moments. Relive Them Forever.
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-white/85 md:text-xl">
          Professional photo and video coverage for birthdays, weddings,
          private events, and more.
        </p>
        <a
          href="#contact"
          className="mt-9 inline-flex rounded-full bg-white px-8 py-3 text-sm font-semibold text-black transition-colors hover:bg-white/85"
        >
          Get in Touch
        </a>
      </div>
    </section>
  );
}
