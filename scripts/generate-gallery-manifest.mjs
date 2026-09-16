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
          ...(await getImageSize(path.join(categoryDir, entry.name))),
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
            ? {
                previewSrc: `/gallery/previews/${previewName}`,
                ...(await getImageSize(path.join(previewDir, previewName))),
              }
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

// Reads pixel dimensions from JPEG/PNG headers so the gallery can reserve the
// right space for each photo. Pure Node, so it also works in Linux builds.
async function getImageSize(filePath) {
  try {
    const buffer = await fs.readFile(filePath);

    if (buffer.toString('ascii', 1, 4) === 'PNG') {
      return {
        width: buffer.readUInt32BE(16),
        height: buffer.readUInt32BE(20),
      };
    }

    if (buffer[0] === 0xff && buffer[1] === 0xd8) {
      let offset = 2;

      while (offset < buffer.length) {
        if (buffer[offset] !== 0xff) {
          offset += 1;
          continue;
        }

        const marker = buffer[offset + 1];
        const isStartOfFrame =
          marker >= 0xc0 &&
          marker <= 0xcf &&
          ![0xc4, 0xc8, 0xcc].includes(marker);

        if (isStartOfFrame) {
          return {
            width: buffer.readUInt16BE(offset + 7),
            height: buffer.readUInt16BE(offset + 5),
          };
        }

        offset += 2 + buffer.readUInt16BE(offset + 2);
      }
    }
  } catch {
    // Fall through: the gallery uses a default shape when size is unknown.
  }

  return {};
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
