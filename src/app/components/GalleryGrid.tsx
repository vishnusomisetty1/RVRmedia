'use client';

import Image from 'next/image';
import { useMemo, useSyncExternalStore } from 'react';

import type { GalleryItem } from '@/lib/gallery';
import { formatTitle, Lightbox, useLightbox } from './Lightbox';

type GalleryGridProps = {
  items: GalleryItem[];
};

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
  return item.width && item.height ? `${item.width} / ${item.height}` : '4 / 5';
}

export default function GalleryGrid({ items }: GalleryGridProps) {
  const { activeIndex, open, close, step } = useLightbox(items.length);
  const columnCount = useColumnCount();
  const columns = useMemo(
    () => buildMasonryColumns(items, columnCount),
    [items, columnCount],
  );

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
                    onClick={() => open(index)}
                    className="relative block w-full cursor-zoom-in overflow-hidden text-left focus:outline-none focus-visible:ring-4 focus-visible:ring-orchid/40"
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
        <Lightbox
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
    <div className="flex h-full items-center justify-center bg-[radial-gradient(circle_at_top,#e88fd8,transparent_45%),linear-gradient(135deg,#1f1528,#6b2a60)] p-8 text-center text-white transition-transform duration-500 group-hover:scale-105">
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
