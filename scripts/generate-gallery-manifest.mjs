import { promises as fs } from 'fs';
import path from 'path';

const galleryDir = path.join(process.cwd(), 'public', 'gallery');
const previewDir = path.join(galleryDir, 'previews');
const manifestPath = path.join(
  process.cwd(),
  'src',
  'generated',
  'gallery-manifest.json',
);

const categories = [
  {
    id: 'events',
    folder: 'events',
  },
  {
    id: 'portraits',
    folder: 'portraits',
  },
  {
    id: 'creative',
    folder: 'creative',
  },
];

const imageExtensions = new Set([
  '.jpg',
  '.jpeg',
  '.png',
  '.webp',
  '.gif',
  '.avif',
]);
const videoExtensions = new Set(['.mp4', '.mov', '.webm']);
const rawExtensions = new Set(['.arw']);

async function main() {
  const previewFiles = await getPreviewFiles();
  const items = [];

  for (const category of categories) {
    const categoryDir = path.join(galleryDir, category.folder);
    await fs.mkdir(categoryDir, { recursive: true });

    const entries = await fs.readdir(categoryDir, { withFileTypes: true });

    for (const entry of entries) {
      if (!entry.isFile()) {
        continue;
      }

      const extension = path.extname(entry.name).toLowerCase();
      const basename = path.basename(entry.name, extension);
      const src = `/gallery/${category.folder}/${entry.name}`;

      if (imageExtensions.has(extension)) {
        items.push({
          name: basename,
          src,
          type: 'image',
          category: category.id,
        });
        continue;
      }

      if (videoExtensions.has(extension)) {
        items.push({
          name: basename,
          src,
          type: 'video',
          category: category.id,
        });
        continue;
      }

      if (rawExtensions.has(extension)) {
        const previewName = `${basename}.jpg`;
        const hasPreview = previewFiles.has(previewName);

        items.push({
          name: basename,
          src,
          type: 'raw',
          category: category.id,
          ...(hasPreview
            ? { previewSrc: `/gallery/previews/${previewName}` }
            : {}),
        });
      }
    }
  }

  items.sort((a, b) => {
    if (a.category !== b.category) {
      return a.category.localeCompare(b.category);
    }

    return a.name.localeCompare(b.name);
  });

  await fs.mkdir(path.dirname(manifestPath), { recursive: true });
  await fs.writeFile(manifestPath, `${JSON.stringify(items, null, 2)}\n`);

  console.log(`Generated gallery manifest with ${items.length} items.`);
}

async function getPreviewFiles() {
  try {
    const previewEntries = await fs.readdir(previewDir, {
      withFileTypes: true,
    });

    return new Set(
      previewEntries
        .filter((entry) => entry.isFile())
        .map((entry) => entry.name),
    );
  } catch {
    return new Set();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
