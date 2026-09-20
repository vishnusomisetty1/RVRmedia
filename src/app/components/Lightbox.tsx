'use client';

import Image from 'next/image';
import { useCallback, useEffect, useRef, useState } from 'react';

import type { GalleryItem } from '@/lib/gallery';

const SWIPE_THRESHOLD = 50;

/**
 * Shared state for the fullscreen photo viewer: which photo is open, plus
 * Escape / arrow-key handling and a scroll lock while it is up. Used by both
 * the portfolio masonry grid and the home page film strip.
 */
export function useLightbox(itemCount: number) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const open = useCallback((index: number) => setActiveIndex(index), []);
  const close = useCallback(() => setActiveIndex(null), []);

  const step = useCallback(
    (direction: 1 | -1) => {
      setActiveIndex((current) =>
        current === null
          ? current
          : (current + direction + itemCount) % itemCount,
      );
    },
    [itemCount],
  );

  useEffect(() => {
    if (activeIndex === null) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        close();
      } else if (event.key === 'ArrowRight') {
        step(1);
      } else if (event.key === 'ArrowLeft') {
        step(-1);
      }
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [activeIndex, close, step]);

  return { activeIndex, open, close, step };
}

export function Lightbox({
  items,
  index,
  onClose,
  onStep,
}: {
  items: GalleryItem[];
  index: number;
  onClose: () => void;
  onStep: (direction: 1 | -1) => void;
}) {
  const item = items[index];
  const hasMultiple = items.length > 1;
  const touchStart = useRef<{ x: number; y: number } | null>(null);

  // Load the neighbouring photos in the background so flipping feels instant.
  const neighbours = hasMultiple
    ? [
        items[(index + 1) % items.length],
        items[(index - 1 + items.length) % items.length],
      ].filter((neighbour) => neighbour !== item && isStillImage(neighbour))
    : [];

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 p-4 sm:p-8"
      role="dialog"
      aria-modal="true"
      aria-label={`${formatTitle(item.name)} preview`}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
      onTouchStart={(event) => {
        const touch = event.touches[0];
        touchStart.current = { x: touch.clientX, y: touch.clientY };
      }}
      onTouchEnd={(event) => {
        const start = touchStart.current;
        touchStart.current = null;

        if (!start || !hasMultiple) {
          return;
        }

        const touch = event.changedTouches[0];
        const deltaX = touch.clientX - start.x;
        const deltaY = touch.clientY - start.y;

        if (
          Math.abs(deltaX) > SWIPE_THRESHOLD &&
          Math.abs(deltaX) > Math.abs(deltaY)
        ) {
          onStep(deltaX < 0 ? 1 : -1);
        }
      }}
    >
      <div className="absolute left-4 top-4 z-10 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold tabular-nums text-white backdrop-blur">
        {index + 1} / {items.length}
      </div>

      <button
        type="button"
        onClick={onClose}
        className="absolute right-4 top-4 z-10 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold text-white backdrop-blur transition-colors hover:bg-white hover:text-black focus:outline-none focus-visible:ring-4 focus-visible:ring-white/30"
      >
        Close
      </button>

      {hasMultiple ? (
        <>
          <NavButton direction="previous" onClick={() => onStep(-1)} />
          <NavButton direction="next" onClick={() => onStep(1)} />
        </>
      ) : null}

      <div className="relative flex h-full w-full max-w-6xl items-center justify-center">
        {item.type === 'video' ? (
          <video
            key={item.src}
            src={item.src}
            className="max-h-full max-w-full rounded-lg object-contain"
            controls
            autoPlay
            playsInline
          />
        ) : item.type === 'raw' && !item.previewSrc ? (
          <div className="max-w-md rounded-lg border border-white/15 bg-white/10 p-8 text-center text-white backdrop-blur">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-white/60">
              Sony RAW
            </p>
            <h3 className="mt-4 text-2xl font-semibold">
              {formatTitle(item.name)}
            </h3>
            <p className="mt-3 text-sm text-white/70">
              A web preview has not been generated for this file yet.
            </p>
            <a
              href={item.src}
              className="mt-6 inline-flex rounded-full bg-white px-5 py-2 text-sm font-semibold text-black transition-colors hover:bg-white/85"
            >
              Download RAW
            </a>
          </div>
        ) : (
          <Image
            key={item.src}
            src={item.previewSrc ?? item.src}
            alt={formatTitle(item.name)}
            fill
            priority
            sizes="100vw"
            className="select-none object-contain"
            draggable={false}
          />
        )}

        {neighbours.map((neighbour) => (
          <Image
            key={`preload-${neighbour.src}`}
            src={neighbour.previewSrc ?? neighbour.src}
            alt=""
            aria-hidden
            fill
            sizes="100vw"
            loading="eager"
            className="pointer-events-none invisible object-contain"
          />
        ))}
      </div>
    </div>
  );
}

function NavButton({
  direction,
  onClick,
}: {
  direction: 'previous' | 'next';
  onClick: () => void;
}) {
  const isNext = direction === 'next';

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={isNext ? 'Next photo' : 'Previous photo'}
      className={`absolute top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white backdrop-blur transition-colors hover:bg-white hover:text-black focus:outline-none focus-visible:ring-4 focus-visible:ring-white/30 ${
        isNext ? 'right-3 sm:right-6' : 'left-3 sm:left-6'
      }`}
    >
      <svg
        viewBox="0 0 24 24"
        className="h-6 w-6"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
      >
        <path d={isNext ? 'M9 5l7 7-7 7' : 'M15 5l-7 7 7 7'} />
      </svg>
    </button>
  );
}

export function isStillImage(item: GalleryItem) {
  return item.type === 'image' || Boolean(item.previewSrc);
}

export function formatTitle(value: string) {
  return value.replace(/[-_]+/g, ' ');
}
