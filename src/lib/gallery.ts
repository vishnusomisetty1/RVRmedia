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
  {
    id: 'commercial',
    title: 'Commercial',
    folder: 'commercial',
    coverImageName: 'DSC09906',
  },
] as const;

export type PortfolioCategoryId = (typeof PORTFOLIO_CATEGORIES)[number]['id'];

export type GalleryItem = {
  name: string;
  src: string;
  type: 'image' | 'video' | 'raw';
  category: PortfolioCategoryId;
  previewSrc?: string;
  // Day the photo was taken (YYYY-MM-DD); photos sharing it are one shoot.
  shoot?: string;
  width?: number;
  height?: number;
};

export function getGalleryItems(): GalleryItem[] {
  return galleryManifest as GalleryItem[];
}

/**
 * Spreads the photos so no two neighbours come from the same shoot (same
 * faces, same room), and where possible not the same category either.
 *
 * At each step it takes from whichever shoot has the most photos left,
 * skipping the one just used. Draining the biggest shoot first is what keeps
 * an oversized shoot from piling up at the end. When a single shoot makes up
 * more than half the list, some neighbours have to repeat it.
 *
 * Deterministic on purpose: a random shuffle would produce different output on
 * the server and the client and break hydration.
 */
export function spreadOutShoots(items: GalleryItem[]): GalleryItem[] {
  const buckets = new Map<string, GalleryItem[]>();

  for (const item of items) {
    const key = shootKey(item);
    const bucket = buckets.get(key);
    if (bucket) {
      bucket.push(item);
    } else {
      buckets.set(key, [item]);
    }
  }

  const result: GalleryItem[] = [];
  let previous: GalleryItem | null = null;

  while (result.length < items.length) {
    let pick: string | null = null;
    let pickChangesCategory = false;

    for (const [key, queue] of buckets) {
      if (queue.length === 0 || (previous && key === shootKey(previous))) {
        continue;
      }

      const changesCategory = queue[0].category !== previous?.category;
      const isBigger = queue.length > (pick ? buckets.get(pick)!.length : 0);

      if (
        pick === null ||
        (changesCategory && !pickChangesCategory) ||
        (changesCategory === pickChangesCategory && isBigger)
      ) {
        pick = key;
        pickChangesCategory = changesCategory;
      }
    }

    // Only the previous shoot is left; the tail has to repeat it.
    if (pick === null) {
      pick =
        [...buckets.entries()].find(([, queue]) => queue.length > 0)?.[0] ??
        null;
    }

    if (pick === null) {
      break;
    }

    previous = buckets.get(pick)!.shift()!;
    result.push(previous);
  }

  return result;
}

/**
 * The film strip repeats its list to scroll forever, so the last photo ends up
 * next to the first one at the wrap point. If those two share a shoot, move
 * the last photo to the first gap where both neighbours differ from it.
 */
export function closeTheLoop(items: GalleryItem[]): GalleryItem[] {
  if (items.length < 3) {
    return items;
  }

  const last = items[items.length - 1];
  if (shootKey(last) !== shootKey(items[0])) {
    return items;
  }

  const rest = items.slice(0, -1);
  const gap = rest.findIndex(
    (item, index) =>
      index > 0 &&
      shootKey(item) !== shootKey(last) &&
      shootKey(rest[index - 1]) !== shootKey(last),
  );

  if (gap === -1) {
    return items;
  }

  return [...rest.slice(0, gap), last, ...rest.slice(gap)];
}

// Photos with no capture date are treated as their own one-photo shoot.
function shootKey(item: GalleryItem) {
  return item.shoot ?? item.src;
}
