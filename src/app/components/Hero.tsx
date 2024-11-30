'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function Hero() {
  const [scrollBlur, setScrollBlur] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      // Make the blur effect more gradual
      // Max blur of 8px when scrolled 800px
      const blur = Math.min((window.scrollY / 800) * 8, 8);
      requestAnimationFrame(() => {
        setScrollBlur(blur);
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section className="relative h-screen">
      <Image
        src="/portfolio/swan_cabin.JPG"
        alt="Swan Cabin Background"
        fill
        className="object-cover"
        priority
        style={{
          filter: `blur(${scrollBlur}px)`,
          transition: 'filter 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      />
      <div className="absolute inset-0 bg-black/50" />

      <div className="relative h-full flex flex-col items-center justify-center text-center px-4">
        <h1 className="text-6xl font-bold mb-6 text-white">RVR Media</h1>
        <p className="text-xl text-white/90 mb-8 max-w-2xl">
          We bring your vision to life through innovative media solutions
        </p>
        <Link
          href="/#contact"
          className="bg-white text-black px-8 py-4 rounded-full hover:bg-white/90 transition-colors"
        >
          Get in Touch
        </Link>
      </div>
    </section>
  );
}
