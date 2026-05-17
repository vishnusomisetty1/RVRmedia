import { existsSync, mkdirSync, readdirSync } from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

const galleryDir = path.join(process.cwd(), 'public', 'gallery');
const previewDir = path.join(galleryDir, 'previews');
const rawExtensions = new Set(['.arw']);

if (!existsSync(galleryDir)) {
  console.error(`Gallery folder not found: ${galleryDir}`);
  process.exit(1);
}

mkdirSync(previewDir, { recursive: true });

const rawFiles = readdirSync(galleryDir).filter((file) =>
  rawExtensions.has(path.extname(file).toLowerCase()),
);

if (rawFiles.length === 0) {
  console.log('No .ARW files found in public/gallery.');
  process.exit(0);
}

for (const file of rawFiles) {
  const inputPath = path.join(galleryDir, file);
  const previewName = `${path.basename(file, path.extname(file))}.jpg`;
  const outputPath = path.join(previewDir, previewName);

  try {
    execFileSync(
      'sips',
      ['-s', 'format', 'jpeg', inputPath, '--out', outputPath],
      { stdio: 'ignore' },
    );
    console.log(`Generated preview: ${path.relative(process.cwd(), outputPath)}`);
    continue;
  } catch {
    // Fall through to ImageMagick if sips cannot decode the RAW file.
  }

  try {
    execFileSync(
      'magick',
      [inputPath, '-auto-orient', '-resize', '2400x2400>', outputPath],
      { stdio: 'ignore' },
    );
    console.log(`Generated preview: ${path.relative(process.cwd(), outputPath)}`);
  } catch {
    console.warn(`Could not generate preview for ${file}.`);
  }
}
