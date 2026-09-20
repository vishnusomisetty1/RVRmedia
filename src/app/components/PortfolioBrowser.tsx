'use client';

import Image from 'next/image';
import { useEffect, useMemo, useState } from 'react';

import type { GalleryItem, PortfolioCategoryId } from '@/lib/gallery';
import GalleryGrid from './GalleryGrid';
import Reveal from './Reveal';

type PortfolioCategory = {
  id: PortfolioCategoryId;
  title: string;
  folder: string;
  coverImageName?: string;
};

type PortfolioBrowserProps = {
  categories: PortfolioCategory[];
  items: GalleryItem[];
};

export default function PortfolioBrowser({
  categories,
  items,
}: PortfolioBrowserProps) {
  const [activeCategoryId, setActiveCategoryId] = useState<string | null>(null);

  // A /portfolio#events style link (from the Services cards) opens straight
  // into that category instead of the category chooser.
  useEffect(() => {
    const openFromHash = () => {
      const id = window.location.hash.replace('#', '');
      if (categories.some((category) => category.id === id)) {
        setActiveCategoryId(id);
      }
    };

    openFromHash();
    window.addEventListener('hashchange', openFromHash);
    return () => window.removeEventListener('hashchange', openFromHash);
  }, [categories]);

  const categoryItemsById = useMemo(() => {
    return new Map(
      categories.map((category) => [
        category.id,
        items.filter((item) => item.category === category.id),
      ]),
    );
  }, [categories, items]);

  const activeCategory = categories.find(
    (category) => category.id === activeCategoryId,
  );
  const activeItems = activeCategory
    ? (categoryItemsById.get(activeCategory.id) ?? [])
    : [];

  if (activeCategory) {
    return (
      <div>
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h3 className="font-display text-3xl font-normal text-cream md:text-4xl">
            {activeCategory.title}
          </h3>
          <button
            type="button"
            onClick={() => {
              setActiveCategoryId(null);
              window.history.replaceState(null, '', window.location.pathname);
            }}
            className="inline-flex w-fit rounded-full border border-cream/25 px-5 py-2 text-sm font-semibold text-cream transition-colors hover:bg-cream hover:text-ink focus:outline-none focus-visible:ring-4 focus-visible:ring-cream/30"
          >
            ← All categories
          </button>
        </div>

        <GalleryGrid items={activeItems} />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      {categories.map((category, index) => {
        const categoryItems = categoryItemsById.get(category.id) ?? [];
        const coverItem =
          categoryItems.find((item) => item.name === category.coverImageName) ??
          categoryItems[0];
        const coverImage = coverItem?.previewSrc ?? coverItem?.src;

        return (
          <Reveal key={category.title} delay={index * 110}>
            <button
              type="button"
              onClick={() => setActiveCategoryId(category.id)}
              className="group relative h-72 w-full overflow-hidden rounded-lg border border-cream/10 bg-surface text-left text-cream transition-transform duration-300 hover:-translate-y-1 focus:outline-none focus-visible:ring-4 focus-visible:ring-orchid/40"
            >
              {coverImage ? (
                <Image
                  src={coverImage}
                  alt=""
                  fill
                  sizes="(min-width: 768px) 33vw, 100vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              ) : null}
              <div className="absolute inset-0 bg-[linear-gradient(0deg,rgba(0,0,0,0.75)_0%,rgba(0,0,0,0.15)_55%,rgba(0,0,0,0.05)_100%)]" />
              <div className="absolute inset-x-5 bottom-5">
                <h3 className="font-display text-3xl font-normal">
                  {category.title}
                </h3>
                <p className="mt-1 text-sm text-cream/70">View →</p>
              </div>
            </button>
          </Reveal>
        );
      })}
    </div>
  );
}
