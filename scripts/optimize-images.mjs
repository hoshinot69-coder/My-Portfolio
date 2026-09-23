import { readdir, unlink } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const root = path.resolve('public/images');

async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...(await walk(full)));
    else if (/\.(jpe?g|png)$/i.test(entry.name)) files.push(full);
  }
  return files;
}

const files = await walk(root);
if (!files.length) {
  console.log('Images already optimized.');
} else {
  for (const file of files) {
    const out = file.replace(/\.(jpe?g|png)$/i, '.webp');
    const portrait = path.basename(file).startsWith('takeshi');
    await sharp(file)
      .rotate()
      .resize({ width: portrait ? 480 : 960, withoutEnlargement: true })
      .webp({ quality: portrait ? 76 : 68 })
      .toFile(out);
    await unlink(file);
    console.log(`${path.basename(file)} -> ${path.basename(out)}`);
  }
}
