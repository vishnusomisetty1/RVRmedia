'use client';

import Image from 'next/image';
import { useEffect, useRef } from 'react';

import type { GalleryItem } from '@/lib/gallery';

type FilmStripProps = {
  items: GalleryItem[];
};

const SPEED = 0.6; // pixels per frame at 60fps — a slow, ambient drift
const SCROLL_PUSH = 4.5; // how far the strips travel per pixel of page scroll (~13 photos per pass)
const SCROLL_EASE = 0.12; // smooths the scroll push so it glides instead of jumps
const DRAG_THRESHOLD = 6; // px of movement before a pointer counts as a drag
const TILT = 10; // degrees each strip leans; the two cross at 2 × TILT
const TILT_RISE = Math.tan((TILT * Math.PI) / 180).toFixed(3); // rise per unit of width

// The two strips lean opposite ways and travel opposite ways.
const STRIPS = [
  { tilt: -TILT, direction: 1 },
  { tilt: TILT, direction: -1 },
] as const;

type StripState = {
  offset: number;
  half: number;
  drag: { isDown: boolean; startX: number; startY: number; startOffset: number; moved: number };
};

export default function FilmStrip({ items }: FilmStripProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRefs = useRef<(HTMLDivElement | null)[]>([]);
  const strips = useRef<StripState[]>(
    STRIPS.map(() => ({
      offset: 0,
      half: 0,
      drag: { isDown: false, startX: 0, startY: 0, startOffset: 0, moved: 0 },
    })),
  );

  // Width of a single copy of each list, measured once and on resize instead
  // of on every frame.
  useEffect(() => {
    const tracks = trackRefs.current.filter(
      (track): track is HTMLDivElement => track !== null,
    );

    const measure = () => {
      trackRefs.current.forEach((track, index) => {
        if (track) {
          strips.current[index].half = track.scrollWidth / 2;
        }
      });
    };

    measure();

    if (typeof ResizeObserver === 'undefined') {
      window.addEventListener('resize', measure);
      return () => window.removeEventListener('resize', measure);
    }

    const observer = new ResizeObserver(measure);
    tracks.forEach((track) => observer.observe(track));
    return () => observer.disconnect();
  }, [items.length]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) {
      return;
    }

    const reduceMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;

    let frame = 0;
    let running = false;
    // The scroll push follows an eased copy of scrollY, so a flick of the
    // wheel turns into a smooth surge rather than a jump.
    let eased = window.scrollY;

    const tick = () => {
      const previous = eased;
      eased += (window.scrollY - eased) * SCROLL_EASE;
      // Scrolling either way speeds the strips along their own direction;
      // they never run backwards when the page scrolls up.
      const pushed = reduceMotion
        ? 0
        : Math.abs(eased - previous) * SCROLL_PUSH;

      STRIPS.forEach(({ direction }, index) => {
        const strip = strips.current[index];
        const track = trackRefs.current[index];
        if (!track) {
          return;
        }

        // Keeps drifting under the cursor; only an active drag takes over.
        if (!reduceMotion && !strip.drag.isDown) {
          strip.offset += (SPEED + pushed) * direction;
        }

        const span = strip.half;
        if (span > 0) {
          // Wrap in both directions so backwards motion stays seamless too.
          strip.offset = ((strip.offset % span) + span) % span;
        }

        track.style.transform = `translate3d(${-strip.offset}px, 0, 0)`;
      });

      frame = window.requestAnimationFrame(tick);
    };

    const start = () => {
      if (!running) {
        running = true;
        eased = window.scrollY;
        frame = window.requestAnimationFrame(tick);
      }
    };

    const stop = () => {
      running = false;
      window.cancelAnimationFrame(frame);
    };

    // Only animate while the strips are on screen.
    if (typeof IntersectionObserver === 'undefined') {
      start();
      return stop;
    }

    const observer = new IntersectionObserver(([entry]) =>
      entry.isIntersecting ? start() : stop(),
    );
    observer.observe(section);

    return () => {
      observer.disconnect();
      stop();
    };
  }, []);

  const onPointerDown =
    (index: number) => (event: React.PointerEvent<HTMLDivElement>) => {
      strips.current[index].drag = {
        isDown: true,
        startX: event.clientX,
        startY: event.clientY,
        startOffset: strips.current[index].offset,
        moved: 0,
      };
      event.currentTarget.setPointerCapture(event.pointerId);
    };

  const onPointerMove =
    (index: number) => (event: React.PointerEvent<HTMLDivElement>) => {
      const strip = strips.current[index];
      if (!strip.drag.isDown) {
        return;
      }

      // Project the pointer onto the strip's own tilted axis, so dragging
      // follows the film rather than the screen.
      const angle = (STRIPS[index].tilt * Math.PI) / 180;
      const delta =
        (event.clientX - strip.drag.startX) * Math.cos(angle) +
        (event.clientY - strip.drag.startY) * Math.sin(angle);
      strip.drag.moved = Math.max(strip.drag.moved, Math.abs(delta));

      if (strip.drag.moved > DRAG_THRESHOLD) {
        strip.offset = strip.drag.startOffset - delta;
      }
    };

  const endDrag =
    (index: number) => (event: React.PointerEvent<HTMLDivElement>) => {
      strips.current[index].drag.isDown = false;
      if (event.currentTarget.hasPointerCapture(event.pointerId)) {
        event.currentTarget.releasePointerCapture(event.pointerId);
      }
    };

  if (items.length === 0) {
    return null;
  }

  // The second strip starts halfway through the list so the same photo is
  // never sitting on both strips where they cross.
  const middle = Math.floor(items.length / 2);
  const lists = [items, [...items.slice(middle), ...items.slice(0, middle)]];

  return (
    <section
      ref={sectionRef}
      aria-label="Recent work"
      // --strip is the full height of one strip, film edges included. The
      // section is exactly tall enough for the tilted ends to reach the screen
      // edges without being clipped, and no taller. It is pulled up by the
      // empty wedge above the crossing so that wedge tucks under the hero
      // instead of reading as a gap; it stays transparent and click-through
      // there so the hero's scroll cue still shows and works.
      className="pointer-events-none relative overflow-hidden [--strip:14.75rem] sm:[--strip:18.75rem] lg:[--strip:22.75rem]"
      style={{
        height: `calc(${TILT_RISE} * 100vw + var(--strip) * 1.02)`,
        marginTop: `calc(${TILT_RISE} * -50vw + 0.5rem)`,
      }}
    >
      {STRIPS.map(({ tilt }, index) => (
        <div
          key={tilt}
          onPointerDown={onPointerDown(index)}
          onPointerMove={onPointerMove(index)}
          onPointerUp={endDrag(index)}
          onPointerCancel={endDrag(index)}
          className={`pointer-events-auto absolute left-[-15vw] top-1/2 w-[130vw] overflow-hidden shadow-[0_20px_50px_-10px_rgba(0,0,0,0.8)] ${
            index === 0 ? 'z-10' : 'z-0'
          }`}
          // pan-y keeps vertical page scrolling native on phones while
          // drags along the film stay ours.
          style={{
            cursor: 'grab',
            touchAction: 'pan-y',
            transform: `translateY(-50%) rotate(${tilt}deg)`,
          }}
        >
          <div
            ref={(node) => {
              trackRefs.current[index] = node;
            }}
            className="flex w-max will-change-transform"
          >
            {/* Duplicated once so the strip can wrap around without a visible seam. */}
            {[...lists[index], ...lists[index]].map((item, frameIndex) => (
              <Frame key={`${item.src}-${frameIndex}`} item={item} />
            ))}
          </div>
        </div>
      ))}

      {/* Fade the strips into the page edges instead of cutting them off. */}
      <div className="pointer-events-none absolute inset-y-0 left-0 z-20 w-16 bg-gradient-to-r from-ink to-transparent sm:w-28" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-20 w-16 bg-gradient-to-l from-ink to-transparent sm:w-28" />
    </section>
  );
}

// Sprocket holes along one edge of a frame, drawn with a repeating gradient
// so each frame carries its own and they travel with the film.
const SPROCKETS =
  'repeating-linear-gradient(90deg, transparent 0 5px, rgba(243, 234, 243, 0.82) 5px 13px, transparent 13px 18px)';

function Frame({ item }: { item: GalleryItem }) {
  return (
    <div aria-hidden className="relative shrink-0 bg-[#0a070d] px-[3px] py-[22px]">
      <span
        className="absolute inset-x-0 top-[7px] h-[8px] rounded-[1px]"
        style={{ backgroundImage: SPROCKETS }}
      />
      <div
        className="group relative h-48 overflow-hidden rounded-[3px] bg-black/40 sm:h-64 lg:h-80"
        style={{ aspectRatio: '3 / 2' }}
      >
        <Image
          src={item.previewSrc ?? item.src}
          alt=""
          aria-hidden
          fill
          draggable={false}
          sizes="(min-width: 1024px) 30rem, (min-width: 640px) 24rem, 18rem"
          className="select-none object-cover opacity-85 transition-opacity duration-500 group-hover:opacity-100"
        />
        <span className="absolute inset-0 rounded-[3px] ring-1 ring-inset ring-cream/10 transition-colors duration-300 group-hover:ring-orchid/50" />
      </div>
      <span
        className="absolute inset-x-0 bottom-[7px] h-[8px] rounded-[1px]"
        style={{ backgroundImage: SPROCKETS }}
      />
    </div>
  );
}
