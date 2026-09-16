'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';

const HERO_IMAGES = [
  {
    src: '/gallery/events/_DSC9302.jpg',
    alt: 'Cinematic private event moment',
  },
  {
    src: '/gallery/events/_DSC9499.jpg',
    alt: 'Event portrait in a warm lounge setting',
  },
  {
    src: '/gallery/events/_DSC9526.jpg',
    alt: 'Candid event coverage moment',
  },
  {
    src: '/gallery/portraits/DSC09348.jpg',
    alt: 'Large group portrait at a private event',
  },
];

const SLIDES = [...HERO_IMAGES, HERO_IMAGES[0]];

export default function Hero() {
  const [activeImage, setActiveImage] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(true);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setIsTransitioning(true);
      setActiveImage((currentImage) => currentImage + 1);
    }, 8000);

    return () => window.clearInterval(interval);
  }, []);

  useEffect(() => {
    if (isTransitioning || activeImage !== 0) {
      return;
    }

    const frame = window.requestAnimationFrame(() => {
      setIsTransitioning(true);
    });

    return () => window.cancelAnimationFrame(frame);
  }, [activeImage, isTransitioning]);

  return (
    <section className="relative flex min-h-[92vh] items-center justify-center overflow-hidden bg-black px-4 py-24">
      <div className="absolute inset-0">
        <div
          className={`flex h-full ${
            isTransitioning
              ? 'transition-transform duration-[1400ms] ease-in-out'
              : ''
          }`}
          style={{ transform: `translateX(-${activeImage * 100}%)` }}
          onTransitionEnd={() => {
            if (activeImage === HERO_IMAGES.length) {
              setIsTransitioning(false);
              setActiveImage(0);
            }
          }}
        >
          {SLIDES.map((image, index) => (
            <div
              key={`${image.src}-${index}`}
              className="relative h-full min-w-full overflow-hidden"
            >
              <Image
                src={image.src}
                alt={image.alt}
                fill
                priority={index === 0}
                sizes="100vw"
                className="hero-slide-image object-cover"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Keep the photos bright: darken only behind the text and at the edges. */}
      <div className="absolute inset-0 bg-black/15" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_45%_at_center,rgba(0,0,0,0.45)_0%,rgba(0,0,0,0)_100%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.35)_0%,rgba(0,0,0,0)_22%,rgba(0,0,0,0)_70%,rgba(0,0,0,0.45)_100%)]" />

      <div className="relative z-10 mx-auto max-w-4xl text-center text-white [text-shadow:0_2px_24px_rgba(0,0,0,0.45)]">
        <p className="text-sm font-semibold uppercase tracking-[0.35em] text-cream/85">
          RVR Media
        </p>
        <h1 className="mt-5 font-display text-5xl font-semibold leading-[1.05] sm:text-6xl md:text-8xl">
          Capture Your Moments. Relive Them Forever.
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-white/85 md:text-xl">
          Professional photo and video coverage for birthdays, weddings,
          private events, and more.
        </p>
        <a
          href="#contact"
          className="mt-9 inline-flex rounded-full bg-gold px-8 py-3 text-sm font-semibold text-ink transition-colors hover:bg-cream [text-shadow:none]"
        >
          Get in Touch
        </a>
      </div>
    </section>
  );
}
