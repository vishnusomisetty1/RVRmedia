'use client';
import { useEffect, useState } from 'react';

export default function Hero() {
  const [scrollBlur, setScrollBlur] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const maxBlur = 10; // maximum blur in pixels
      const blurValue = Math.min((scrollPosition / 200) * maxBlur, maxBlur);
      setScrollBlur(blurValue);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section className="relative h-screen flex items-center justify-center">
      {/* Background image with dynamic blur */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-all duration-100"
        style={{
          backgroundImage: 'url(/portfolio/NYbridge.png)',
          opacity: 0.7,
          filter: `blur(${scrollBlur}px)`,
        }}
      />

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/50" />

      {/* Content */}
      <div className="relative z-10 text-center text-white">
        <h1 className="text-5xl font-bold mb-4">RVR Media</h1>
        <p className="text-xl italic">
          Professional video production for your special moments -
          <br />
          weddings, birthday parties, and more
        </p>
        <a
          href="#contact"
          className="inline-block mt-8 px-8 py-3 bg-white text-black rounded-full font-semibold hover:bg-black hover:text-white transition-colors"
        >
          Get in Touch
        </a>
      </div>
    </section>
  );
}
