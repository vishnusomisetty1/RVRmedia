'use client';

import Image from 'next/image';
import { useEffect, useRef } from 'react';

import type { GalleryItem } from '@/lib/gallery';

type FilmStripProps = {
  items: GalleryItem[];
};

const SPEED = 0.75; // pixels per frame at 60fps — a slow, ambient drift
const DRAG_THRESHOLD = 6; // px of movement before a pointer counts as a drag

export default function FilmStrip({ items }: FilmStripProps) {
  const trackRef = useRef<HTMLDivElement>(null);

  // Position is driven by a transform rather than scrollLeft. Transforms are
  // composited on the GPU, so the drift never has to wait on layout; writing
  // scrollLeft (and reading scrollWidth) every frame forces a synchronous
  // reflow, which is what made this stutter.
  const offset = useRef(0);
  const half = useRef(0);
  const drag = useRef({ isDown: false, startX: 0, startOffset: 0, moved: 0 });

  // Width of a single copy of the list, measured once and on resize instead
  // of on every frame.
  useEffect(() => {
    const track = trackRef.current;
    if (!track) {
      return;
    }

    const measure = () => {
      half.current = track.scrollWidth / 2;
    };

    measure();

    if (typeof ResizeObserver === 'undefined') {
      window.addEventListener('resize', measure);
      return () => window.removeEventListener('resize', measure);
    }

    const observer = new ResizeObserver(measure);
    observer.observe(track);
    return () => observer.disconnect();
  }, [items.length]);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) {
      return;
    }

    const reduceMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;

    let frame = 0;

    const tick = () => {
      // Keeps drifting under the cursor; only an active drag takes over.
      if (!reduceMotion && !drag.current.isDown) {
        offset.current += SPEED;
      }

      const span = half.current;
      if (span > 0) {
        // Wrap in both directions so dragging backwards stays seamless too.
        if (offset.current >= span) {
          offset.current -= span;
        } else if (offset.current < 0) {
          offset.current += span;
        }
      }

      track.style.transform = `translate3d(${-offset.current}px, 0, 0)`;
      frame = window.requestAnimationFrame(tick);
    };

    frame = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(frame);
  }, []);

  const onPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    drag.current = {
      isDown: true,
      startX: event.clientX,
      startOffset: offset.current,
      moved: 0,
    };
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const onPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!drag.current.isDown) {
      return;
    }

    const delta = event.clientX - drag.current.startX;
    drag.current.moved = Math.max(drag.current.moved, Math.abs(delta));

    if (drag.current.moved > DRAG_THRESHOLD) {
      offset.current = drag.current.startOffset - delta;
    }
  };

  const endDrag = (event: React.PointerEvent<HTMLDivElement>) => {
    drag.current.isDown = false;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  };

  if (items.length === 0) {
    return null;
  }

  // Duplicated once so the strip can wrap around without a visible seam.
  const track = [...items, ...items];

  return (
    <section
      aria-label="Recent work"
      className="relative overflow-hidden border-y border-cream/10 bg-ink py-6"
    >
      <div
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        className="overflow-hidden"
        // pan-y keeps vertical page scrolling native on phones while
        // horizontal drags stay ours.
        style={{ cursor: 'grab', touchAction: 'pan-y' }}
      >
        <div
          ref={trackRef}
          className="flex w-max gap-[3px] will-change-transform"
        >
          {track.map((item, index) => (
            <div
              key={`${item.src}-${index}`}
              aria-hidden
              className="group relative h-40 w-auto shrink-0 overflow-hidden bg-black/40 sm:h-52 lg:h-60"
              style={{ aspectRatio: '3 / 2' }}
            >
              <Image
                src={item.previewSrc ?? item.src}
                alt=""
                aria-hidden
                fill
                draggable={false}
                sizes="(min-width: 1024px) 24rem, 18rem"
                className="select-none object-cover opacity-85 transition-opacity duration-500 group-hover:opacity-100"
              />
              <span className="absolute inset-0 ring-1 ring-inset ring-cream/10 transition-colors duration-300 group-hover:ring-orchid/50" />
            </div>
          ))}
        </div>
      </div>

      {/* Fade the strip into the page edges instead of cutting it off. */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-ink to-transparent sm:w-28" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-ink to-transparent sm:w-28" />
    </section>
  );
}
