'use client';

import { useMemo, useState } from 'react';

import type { GalleryItem, PortfolioCategoryId } from '@/lib/gallery';
import GalleryGrid from './GalleryGrid';

type PortfolioCategory = {
  id: PortfolioCategoryId;
  title: string;
  folder: string;
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
    ? categoryItemsById.get(activeCategory.id) ?? []
    : [];

  if (activeCategory) {
    return (
      <div>
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h3 className="text-2xl font-bold text-black md:text-3xl">
            {activeCategory.title}
          </h3>
          <button
            type="button"
            onClick={() => setActiveCategoryId(null)}
            className="inline-flex w-fit rounded-full border border-black/15 px-5 py-2 text-sm font-semibold text-black transition-colors hover:bg-black hover:text-white focus:outline-none focus-visible:ring-4 focus-visible:ring-black/25"
          >
            Exit
          </button>
        </div>

        <GalleryGrid items={activeItems} />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      {categories.map((category) => {
        const categoryItems = categoryItemsById.get(category.id) ?? [];
        const coverImage = categoryItems[0]?.previewSrc ?? categoryItems[0]?.src;

        return (
          <button
            key={category.title}
            type="button"
            onClick={() => setActiveCategoryId(category.id)}
            className="group overflow-hidden rounded-lg border border-black/10 bg-black text-left text-white transition-transform duration-300 hover:-translate-y-1 focus:outline-none focus-visible:ring-4 focus-visible:ring-black/25"
          >
            <div
              className="h-52 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
              style={
                coverImage
                  ? { backgroundImage: `url(${coverImage})` }
                  : undefined
              }
            />
            <div className="p-5">
              <h3 className="text-xl font-bold">{category.title}</h3>
              <p className="mt-1 text-sm text-white/60">
                {categoryItems.length} photo
                {categoryItems.length === 1 ? '' : 's'}
              </p>
            </div>
          </button>
        );
      })}
    </div>
  );
}
