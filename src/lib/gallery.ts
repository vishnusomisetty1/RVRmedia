import galleryManifest from '@/generated/gallery-manifest.json';

export type GalleryItem = {
  name: string;
  src: string;
  type: 'image' | 'video' | 'raw';
  previewSrc?: string;
};

export function getGalleryItems(): GalleryItem[] {
  return galleryManifest as GalleryItem[];
}
