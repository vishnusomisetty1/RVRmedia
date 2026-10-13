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
// Full-resolution backups made by gallery:optimize. Local only (gitignored).
const originalsDir = path.join(process.cwd(), 'gallery-originals');

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
  {
    id: 'commercial',
    folder: 'commercial',
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
// The ZV-E10's clock was never set, so its photos are stamped with dates from
// 2021. Map each wrong camera date to the real shoot date so shots from both
// cameras at the same event are recognised as one shoot. Remove an entry once
// the camera clock is fixed and those photos are re-exported.
const SHOOT_DATE_FIXES = {
  '2021-01-08': '2026-10-09',
};

// Photos taken before this hour count toward the previous day's shoot, so an
// event that runs past midnight stays one shoot.
const SHOOT_DAY_STARTS_AT_HOUR = 6;

const videoExtensions = new Set(['.mp4', '.mov', '.webm']);
const rawExtensions = new Set(['.arw']);

async function main() {
  const previewFiles = await getPreviewFiles();
  const previousShoots = await getPreviousShoots();
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
          ...(await getImageDetails(path.join(categoryDir, entry.name))),
        });

        // gallery:optimize strips the capture date out of the web copies, so
        // fall back to the local full-size backup, then to the last manifest
        // (the only source on Vercel, where the backups don't exist).
        const item = items[items.length - 1];
        item.shoot ??=
          (await getShootFromFile(
            path.join(originalsDir, category.folder, entry.name),
          )) ?? previousShoots.get(src);
        if (!item.shoot) {
          delete item.shoot;
        }
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
                ...(await getImageDetails(path.join(previewDir, previewName))),
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

async function getShootFromFile(filePath) {
  try {
    return getShoot(await fs.readFile(filePath));
  } catch {
    return null;
  }
}

async function getPreviousShoots() {
  try {
    const previous = JSON.parse(await fs.readFile(manifestPath, 'utf8'));
    return new Map(
      previous
        .filter((item) => item.shoot)
        .map((item) => [item.src, item.shoot]),
    );
  } catch {
    return new Map();
  }
}

async function getImageDetails(filePath) {
  try {
    const buffer = await fs.readFile(filePath);
    const shoot = getShoot(buffer);

    return { ...getImageSize(buffer), ...(shoot ? { shoot } : {}) };
  } catch {
    return {};
  }
}

// Reads pixel dimensions from JPEG/PNG headers so the gallery can reserve the
// right space for each photo. Pure Node, so it also works in Linux builds.
function getImageSize(buffer) {
  try {
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

// Groups photos into shoots by the day they were taken, so the site can keep
// shots from the same event apart.
function getShoot(buffer) {
  const taken = getCaptureTime(buffer);
  if (!taken) {
    return null;
  }

  const [, year, month, day, hour] =
    taken.match(/^(\d{4}):(\d{2}):(\d{2}) (\d{2})/) ?? [];
  if (!year) {
    return null;
  }

  const date = new Date(Date.UTC(Number(year), Number(month) - 1, Number(day)));
  if (Number(hour) < SHOOT_DAY_STARTS_AT_HOUR) {
    date.setUTCDate(date.getUTCDate() - 1);
  }

  const shootDate = date.toISOString().slice(0, 10);
  return SHOOT_DATE_FIXES[shootDate] ?? shootDate;
}

// Pulls DateTimeOriginal ("YYYY:MM:DD HH:MM:SS") out of a JPEG's EXIF block.
function getCaptureTime(buffer) {
  if (buffer[0] !== 0xff || buffer[1] !== 0xd8) {
    return null;
  }

  let offset = 2;

  while (offset + 4 < buffer.length && buffer[offset] === 0xff) {
    const marker = buffer[offset + 1];
    const length = buffer.readUInt16BE(offset + 2);

    if (
      marker === 0xe1 &&
      buffer.toString('ascii', offset + 4, offset + 8) === 'Exif'
    ) {
      return readDateTimeOriginal(buffer, offset + 10);
    }

    // Start of scan: no more metadata segments follow.
    if (marker === 0xda) {
      return null;
    }

    offset += 2 + length;
  }

  return null;
}

function readDateTimeOriginal(buffer, tiffStart) {
  const littleEndian =
    buffer.toString('ascii', tiffStart, tiffStart + 2) === 'II';
  const read16 = (at) =>
    littleEndian ? buffer.readUInt16LE(at) : buffer.readUInt16BE(at);
  const read32 = (at) =>
    littleEndian ? buffer.readUInt32LE(at) : buffer.readUInt32BE(at);

  const findTag = (ifdOffset, tag) => {
    const ifdStart = tiffStart + ifdOffset;
    const count = read16(ifdStart);

    for (let index = 0; index < count; index += 1) {
      const entry = ifdStart + 2 + index * 12;
      if (read16(entry) === tag) {
        return entry;
      }
    }

    return null;
  };

  try {
    const exifPointer = findTag(read32(tiffStart + 4), 0x8769);
    if (exifPointer === null) {
      return null;
    }

    const dateEntry = findTag(read32(exifPointer + 8), 0x9003);
    if (dateEntry === null) {
      return null;
    }

    const valueStart = tiffStart + read32(dateEntry + 8);
    return buffer.toString('ascii', valueStart, valueStart + 19);
  } catch {
    return null;
  }
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
