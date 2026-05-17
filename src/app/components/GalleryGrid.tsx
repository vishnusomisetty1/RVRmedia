'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';

import type { GalleryItem } from '@/lib/gallery';

type GalleryGridProps = {
  items: GalleryItem[];
};

export default function GalleryGrid({ items }: GalleryGridProps) {
  const [activeItem, setActiveItem] = useState<GalleryItem | null>(null);

  useEffect(() => {
    if (!activeItem) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setActiveItem(null);
      }
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [activeItem]);

  return (
    <>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item, index) => (
          <article
            key={item.src}
            className="gallery-card group overflow-hidden rounded-lg bg-black shadow-[0_18px_70px_rgba(0,0,0,0.12)]"
            style={{ animationDelay: `${index * 70}ms` }}
          >
            <button
              type="button"
              onClick={() => setActiveItem(item)}
              className="relative block aspect-[4/5] w-full cursor-zoom-in overflow-hidden text-left focus:outline-none focus-visible:ring-4 focus-visible:ring-black/30"
              aria-label={`Open ${formatTitle(item.name)} preview`}
            >
              <GalleryMedia item={item} priority={index < 3} />
              <div className="absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/35" />
              <div className="absolute inset-x-0 bottom-0 translate-y-3 p-5 text-white opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                <p className="text-lg font-semibold">
                  {formatTitle(item.name)}
                </p>
                <p className="mt-1 text-sm text-white/75">
                  {getItemLabel(item)}
                </p>
              </div>
            </button>
          </article>
        ))}
      </div>

      {activeItem ? (
        <FullScreenPreview
          item={activeItem}
          onClose={() => setActiveItem(null)}
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
  item,
  onClose,
}: {
  item: GalleryItem;
  onClose: () => void;
}) {
  const previewSrc = item.previewSrc ?? item.src;

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
    >
      <button
        type="button"
        onClick={onClose}
        className="absolute right-4 top-4 z-10 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold text-white backdrop-blur transition-colors hover:bg-white hover:text-black focus:outline-none focus-visible:ring-4 focus-visible:ring-white/30"
      >
        Close
      </button>

      <div className="relative flex h-full w-full max-w-6xl items-center justify-center">
        {item.type === 'video' ? (
          <video
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
            src={previewSrc}
            alt={formatTitle(item.name)}
            fill
            sizes="100vw"
            className="object-contain"
          />
        )}
      </div>

      <div className="pointer-events-none absolute bottom-4 left-4 right-4 text-center text-white sm:bottom-6">
        <p className="text-base font-semibold">{formatTitle(item.name)}</p>
        <p className="mt-1 text-sm text-white/60">{getItemLabel(item)}</p>
      </div>
    </div>
  );
}

function getItemLabel(item: GalleryItem) {
  if (item.type === 'raw') {
    return item.previewSrc ? 'RAW preview' : 'Sony RAW';
  }

  return item.type === 'video' ? 'Video clip' : 'Photo';
}

function formatTitle(value: string) {
  return value.replace(/[-_]+/g, ' ');
}
