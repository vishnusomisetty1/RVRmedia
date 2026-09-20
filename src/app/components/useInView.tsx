'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * Reports the first time an element scrolls into view, then stops observing.
 *
 * The flag is flipped on a later frame than the one that mounts the element,
 * because setting the "visible" class in the same commit that paints the
 * hidden state skips the CSS transition entirely — which is what makes
 * already-in-viewport content appear instantly instead of animating.
 */
export function useInView<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) {
      return;
    }

    if (typeof IntersectionObserver === 'undefined') {
      setIsVisible(true);
      return;
    }

    let outer = 0;
    let inner = 0;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) {
          return;
        }

        observer.disconnect();
        outer = window.requestAnimationFrame(() => {
          inner = window.requestAnimationFrame(() => setIsVisible(true));
        });
      },
      { threshold: 0.05, rootMargin: '0px 0px -5% 0px' },
    );

    observer.observe(node);

    return () => {
      observer.disconnect();
      window.cancelAnimationFrame(outer);
      window.cancelAnimationFrame(inner);
    };
  }, []);

  return { ref, isVisible };
}
