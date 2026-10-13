import { execFileSync } from 'node:child_process';
import {
  copyFileSync,
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  renameSync,
  statSync,
  unlinkSync,
  writeFileSync,
} from 'node:fs';
import path from 'node:path';

const galleryDir = path.join(process.cwd(), 'public', 'gallery');
const backupDir = path.join(process.cwd(), 'gallery-originals');
const imageExtensions = new Set(['.jpg', '.jpeg']);
const maxPixels = '2400';
const quality = '82';

if (!existsSync(galleryDir)) {
  console.error(`Gallery folder not found: ${galleryDir}`);
  process.exit(1);
}

mkdirSync(backupDir, { recursive: true });

const imageFiles = getImageFiles(galleryDir);

if (imageFiles.length === 0) {
  console.log('No JPEG files found in public/gallery.');
  process.exit(0);
}

for (const file of imageFiles) {
  const inputPath = path.join(galleryDir, file);
  const backupPath = path.join(backupDir, file);
  const tempPath = path.join(
    path.dirname(inputPath),
    `${path.basename(file)}.optimized.jpg`,
  );

  if (!existsSync(backupPath)) {
    mkdirSync(path.dirname(backupPath), { recursive: true });
    copyFileSync(inputPath, backupPath);
  }

  const before = statSync(inputPath).size;

  if (stripMetadata(inputPath)) {
    console.log(`Stripped metadata from ${file}.`);
  }

  if (getLongestSide(inputPath) <= Number(maxPixels)) {
    console.log(`Skipped ${file}; already web-sized.`);
    continue;
  }

  try {
    execFileSync(
      'sips',
      [
        '-Z',
        maxPixels,
        '-s',
        'format',
        'jpeg',
        '-s',
        'formatOptions',
        quality,
        inputPath,
        '--out',
        tempPath,
      ],
      { stdio: 'ignore' },
    );
  } catch (error) {
    if (existsSync(tempPath)) {
      unlinkSync(tempPath);
    }

    console.warn(`Could not optimize ${file}.`);
    continue;
  }

  const after = statSync(tempPath).size;

  if (after >= before) {
    unlinkSync(tempPath);
    console.log(`Skipped ${file}; optimized file was not smaller.`);
    continue;
  }

  renameSync(tempPath, inputPath);
  stripMetadata(inputPath);
  console.log(
    `Optimized ${file}: ${formatMegabytes(before)} -> ${formatMegabytes(after)}`,
  );
}

console.log(`Full-resolution backups are in ${path.relative(process.cwd(), backupDir)}.`);

// Removes the date, camera, and location data a downloaded photo would
// otherwise carry (EXIF/XMP in APP1, IPTC in APP13). Cuts the segments out
// rather than re-encoding, so the picture itself is untouched. The colour
// profile (APP2) stays. Returns true if anything was removed.
function stripMetadata(filePath) {
  const buffer = readFileSync(filePath);

  if (buffer[0] !== 0xff || buffer[1] !== 0xd8) {
    return false;
  }

  const kept = [buffer.subarray(0, 2)];
  let offset = 2;
  let removed = false;

  while (offset + 4 <= buffer.length && buffer[offset] === 0xff) {
    const marker = buffer[offset + 1];

    // Start of scan: the image data runs from here to the end of the file.
    if (marker === 0xda) {
      break;
    }

    const end = offset + 2 + buffer.readUInt16BE(offset + 2);

    if (marker === 0xe1 || marker === 0xed) {
      removed = true;
    } else {
      kept.push(buffer.subarray(offset, end));
    }

    offset = end;
  }

  if (!removed) {
    return false;
  }

  kept.push(buffer.subarray(offset));
  writeFileSync(filePath, Buffer.concat(kept));
  return true;
}

function getImageFiles(directory, baseDirectory = directory) {
  const files = [];

  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const entryPath = path.join(directory, entry.name);

    if (entry.isDirectory()) {
      if (entry.name === 'previews') {
        continue;
      }

      files.push(...getImageFiles(entryPath, baseDirectory));
      continue;
    }

    if (imageExtensions.has(path.extname(entry.name).toLowerCase())) {
      files.push(path.relative(baseDirectory, entryPath));
    }
  }

  return files;
}

function getLongestSide(filePath) {
  try {
    const output = execFileSync(
      'sips',
      ['-g', 'pixelWidth', '-g', 'pixelHeight', filePath],
      { encoding: 'utf8' },
    );
    const sizes = [...output.matchAll(/pixel(?:Width|Height):\s*(\d+)/g)].map(
      (match) => Number(match[1]),
    );

    return sizes.length === 2 ? Math.max(...sizes) : Infinity;
  } catch {
    return Infinity;
  }
}

function formatMegabytes(bytes) {
  return `${(bytes / 1024 / 1024).toFixed(1)}MB`;
}
