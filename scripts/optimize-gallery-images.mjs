import { execFileSync } from 'node:child_process';
import {
  copyFileSync,
  existsSync,
  mkdirSync,
  readdirSync,
  renameSync,
  statSync,
  unlinkSync,
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
  console.log(
    `Optimized ${file}: ${formatMegabytes(before)} -> ${formatMegabytes(after)}`,
  );
}

console.log(`Full-resolution backups are in ${path.relative(process.cwd(), backupDir)}.`);

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

function formatMegabytes(bytes) {
  return `${(bytes / 1024 / 1024).toFixed(1)}MB`;
}
