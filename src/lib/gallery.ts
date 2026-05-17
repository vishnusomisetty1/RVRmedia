import { promises as fs } from 'fs';
import path from 'path';

const GALLERY_DIR = path.join(process.cwd(), 'public', 'gallery');
const RAW_PREVIEW_DIR = path.join(GALLERY_DIR, 'previews');

const IMAGE_EXTENSIONS = new Set([
  '.jpg',
  '.jpeg',
  '.png',
  '.webp',
  '.gif',
  '.avif',
]);

const VIDEO_EXTENSIONS = new Set(['.mp4', '.mov', '.webm']);
const RAW_EXTENSIONS = new Set(['.arw']);

export type GalleryItem = {
  name: string;
  src: string;
  type: 'image' | 'video' | 'raw';
  previewSrc?: string;
};

export async function getGalleryItems(): Promise<GalleryItem[]> {
  const entries = await fs.readdir(GALLERY_DIR, { withFileTypes: true });
  const previewFiles = await getPreviewFiles();
  const items: GalleryItem[] = [];

  for (const entry of entries) {
    if (!entry.isFile()) {
      continue;
    }

    const extension = path.extname(entry.name).toLowerCase();
    const basename = path.basename(entry.name, extension);

    if (IMAGE_EXTENSIONS.has(extension)) {
      items.push({
        name: basename,
        src: `/gallery/${entry.name}`,
        type: 'image',
      });
      continue;
    }

    if (VIDEO_EXTENSIONS.has(extension)) {
      items.push({
        name: basename,
        src: `/gallery/${entry.name}`,
        type: 'video',
      });
      continue;
    }

    if (RAW_EXTENSIONS.has(extension)) {
      const previewName = `${basename}.jpg`;
      const hasPreview = previewFiles.has(previewName);

      items.push({
        name: basename,
        src: `/gallery/${entry.name}`,
        type: 'raw',
        previewSrc: hasPreview ? `/gallery/previews/${previewName}` : undefined,
      });
    }
  }

  return items.sort((a, b) => a.name.localeCompare(b.name));
}

async function getPreviewFiles() {
  try {
    const previewEntries = await fs.readdir(RAW_PREVIEW_DIR, {
      withFileTypes: true,
    });

    return new Set(
      previewEntries
        .filter((entry) => entry.isFile())
        .map((entry) => entry.name),
    );
  } catch {
    return new Set<string>();
  }
}
