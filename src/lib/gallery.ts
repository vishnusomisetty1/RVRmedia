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
  },
  {
    id: 'creative',
    title: 'Creative / Lifestyle',
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
};

export function getGalleryItems(): GalleryItem[] {
  return galleryManifest as GalleryItem[];
}
