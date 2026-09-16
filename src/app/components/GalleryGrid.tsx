'use client';

import Image from 'next/image';
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
} from 'react';

import type { GalleryItem } from '@/lib/gallery';

type GalleryGridProps = {
  items: GalleryItem[];
};

const SWIPE_THRESHOLD = 50;
const DEFAULT_ASPECT_RATIO = 4 / 5;

// Matches Tailwind's sm (640px) and lg (1024px) breakpoints.
const COLUMN_QUERIES = [
  { query: '(min-width: 1024px)', columns: 3 },
  { query: '(min-width: 640px)', columns: 2 },
];

function subscribeToColumnCount(onChange: () => void) {
  const lists = COLUMN_QUERIES.map(({ query }) => window.matchMedia(query));
  lists.forEach((list) => list.addEventListener('change', onChange));

  return () =>
    lists.forEach((list) => list.removeEventListener('change', onChange));
}

function getColumnCount() {
  return (
    COLUMN_QUERIES.find(({ query }) => window.matchMedia(query).matches)
      ?.columns ?? 1
  );
}

function useColumnCount() {
  return useSyncExternalStore(subscribeToColumnCount, getColumnCount, () => 3);
}

// Places each photo, in order, into the currently shortest column so the
// layout stays balanced while reading left-to-right like the lightbox order.
function buildMasonryColumns(items: GalleryItem[], columnCount: number) {
  const columns: number[][] = Array.from({ length: columnCount }, () => []);
  const heights = new Array<number>(columnCount).fill(0);

  items.forEach((item, index) => {
    const shortest = heights.indexOf(Math.min(...heights));
    columns[shortest].push(index);
    heights[shortest] += 1 / getAspectRatioValue(item);
  });

  return columns;
}

function getAspectRatioValue(item: GalleryItem) {
  return item.width && item.height
    ? item.width / item.height
    : DEFAULT_ASPECT_RATIO;
}

function getAspectRatio(item: GalleryItem) {
  return item.width && item.height
    ? `${item.width} / ${item.height}`
    : '4 / 5';
}

export default function GalleryGrid({ items }: GalleryGridProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const columnCount = useColumnCount();
  const columns = useMemo(
    () => buildMasonryColumns(items, columnCount),
    [items, columnCount],
  );

  const close = useCallback(() => setActiveIndex(null), []);

  const step = useCallback(
    (direction: 1 | -1) => {
      setActiveIndex((current) =>
        current === null
          ? current
          : (current + direction + items.length) % items.length,
      );
    },
    [items.length],
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

  return (
    <>
      <div className="flex items-start gap-4">
        {columns.map((column, columnIndex) => (
          <div key={columnIndex} className="flex min-w-0 flex-1 flex-col gap-4">
            {column.map((index) => {
              const item = items[index];

              return (
                <article
                  key={item.src}
                  className="gallery-card group overflow-hidden rounded-lg bg-black shadow-[0_18px_70px_rgba(0,0,0,0.12)]"
                  style={{ animationDelay: `${index * 70}ms` }}
                >
                  <button
                    type="button"
                    onClick={() => setActiveIndex(index)}
                    className="relative block w-full cursor-zoom-in overflow-hidden text-left focus:outline-none focus-visible:ring-4 focus-visible:ring-black/30"
                    style={{ aspectRatio: getAspectRatio(item) }}
                    aria-label={`Open ${formatTitle(item.name)} preview`}
                  >
                    <GalleryMedia item={item} priority={index < 3} />
                    <div className="absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/35" />
                  </button>
                </article>
              );
            })}
          </div>
        ))}
      </div>

      {activeIndex !== null && items[activeIndex] ? (
        <FullScreenPreview
          items={items}
          index={activeIndex}
          onClose={close}
          onStep={step}
        />
      ) : null}
    </>
  );
}

function GalleryMedia({
  item,
  priority = false,
}: {
  item: GalleryItem;
  priority?: boolean;
}) {
  if (item.type === 'video') {
    return (
      <video
        src={item.src}
        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        muted
        playsInline
        preload="metadata"
      />
    );
  }

  if (item.previewSrc || item.type === 'image') {
    return (
      <Image
        src={item.previewSrc ?? item.src}
        alt={formatTitle(item.name)}
        fill
        priority={priority}
        sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
        className="object-cover transition-transform duration-500 group-hover:scale-105"
      />
    );
  }

  return (
    <div className="flex h-full items-center justify-center bg-[radial-gradient(circle_at_top,#d9c5a1,transparent_45%),linear-gradient(135deg,#1f1b17,#55473a)] p-8 text-center text-white transition-transform duration-500 group-hover:scale-105">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/70">
          Sony RAW
        </p>
        <p className="mt-3 text-lg font-semibold">{formatTitle(item.name)}</p>
        <p className="mt-3 text-sm text-white/70">Preview not generated yet.</p>
      </div>
    </div>
  );
}

function FullScreenPreview({
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

function isStillImage(item: GalleryItem) {
  return item.type === 'image' || Boolean(item.previewSrc);
}

function formatTitle(value: string) {
  return value.replace(/[-_]+/g, ' ');
}
