import galleryManifest from '@/generated/gallery-manifest.json';

export const PORTFOLIO_CATEGORIES = [
  {
    id: 'events',
    title: 'Events',
    folder: 'events',
  },
  {
    id: 'portraits',
    title: 'Portraits',
    folder: 'portraits',
    coverImageName: '_DSC9770',
  },
  {
    id: 'creative',
    title: 'Candid / Lifestyle',
    folder: 'creative',
  },
] as const;

export type PortfolioCategoryId = (typeof PORTFOLIO_CATEGORIES)[number]['id'];

export type GalleryItem = {
  name: string;
  src: string;
  type: 'image' | 'video' | 'raw';
  category: PortfolioCategoryId;
  previewSrc?: string;
  width?: number;
  height?: number;
};

export function getGalleryItems(): GalleryItem[] {
  return galleryManifest as GalleryItem[];
}

/**
 * Spreads the photos so no two neighbours share a category — a run of shots
 * from the same event (same faces, same room) never sits together in the
 * film strip.
 *
 * At each step it takes from whichever category has the most left, skipping
 * the one just used. Draining the biggest bucket first is what keeps an
 * oversized category from piling up at the end.
 *
 * Deterministic on purpose: a random shuffle would produce different output on
 * the server and the client and break hydration.
 */
export function interleaveByCategory(items: GalleryItem[]): GalleryItem[] {
  const buckets = new Map<PortfolioCategoryId, GalleryItem[]>();

  for (const item of items) {
    const bucket = buckets.get(item.category);
    if (bucket) {
      bucket.push(item);
    } else {
      buckets.set(item.category, [item]);
    }
  }

  const result: GalleryItem[] = [];
  let previous: PortfolioCategoryId | null = null;

  while (result.length < items.length) {
    let pick: PortfolioCategoryId | null = null;

    for (const [category, queue] of buckets) {
      if (queue.length === 0 || category === previous) {
        continue;
      }
      if (pick === null || queue.length > (buckets.get(pick)?.length ?? 0)) {
        pick = category;
      }
    }

    // Only the previous category is left; the tail has to repeat it.
    if (pick === null) {
      pick =
        [...buckets.entries()].find(([, queue]) => queue.length > 0)?.[0] ??
        null;
    }

    if (pick === null) {
      break;
    }

    result.push(buckets.get(pick)!.shift()!);
    previous = pick;
  }

  return closeTheLoop(result);
}

/**
 * The film strip repeats its list to scroll forever, so the last photo ends up
 * next to the first one at the wrap point. If those two share a category, move
 * the last photo to the first gap where both neighbours differ from it.
 */
function closeTheLoop(items: GalleryItem[]): GalleryItem[] {
  if (items.length < 3) {
    return items;
  }

  const last = items[items.length - 1];
  if (last.category !== items[0].category) {
    return items;
  }

  const rest = items.slice(0, -1);
  const gap = rest.findIndex(
    (item, index) =>
      index > 0 &&
      item.category !== last.category &&
      rest[index - 1].category !== last.category,
  );

  if (gap === -1) {
    return items;
  }

  return [...rest.slice(0, gap), last, ...rest.slice(gap)];
}
