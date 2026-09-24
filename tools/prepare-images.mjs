// Pipeline de imagini bitmap: bannerul (fotografie Color Metal) și logo-ul oficial.
// Desenele tehnice sunt vectoriale și se generează separat: tools/generate-tech-drawings.mjs
// Utilizare: node tools/prepare-images.mjs <folder-sursă>
//   <folder-sursă>/banner-gold.webp     fotografia de banner (textură metalică aurie)
//   <folder-sursă>/logo_official.png    CM_Singular_Logo_color_print_1.png
import sharp from 'sharp';
import fs from 'node:fs';
import path from 'node:path';

const src = process.argv[2];
if (!src) throw new Error('source folder required');
const out = path.resolve('public/assets');
fs.mkdirSync(path.join(out, 'banner'), { recursive: true });
fs.mkdirSync(path.join(out, 'brand'), { recursive: true });

const banner = path.join(src, 'banner-gold.webp');
await sharp(banner).resize(1920, 480, { fit: 'cover', position: 'centre' }).jpeg({ quality: 82, mozjpeg: true }).toFile(path.join(out, 'banner', 'hero.jpg'));
await sharp(banner).resize(960, 480, { fit: 'cover', position: 'centre' }).jpeg({ quality: 82, mozjpeg: true }).toFile(path.join(out, 'banner', 'hero-mobile.jpg'));

await sharp(path.join(src, 'logo_official.png')).resize({ width: 1200 }).png({ compressionLevel: 9 }).toFile(path.join(out, 'brand', 'color-metal-logo.png'));
await sharp(path.join(src, 'logo_official.png')).resize({ width: 480 }).png({ compressionLevel: 9 }).toFile(path.join(out, 'brand', 'color-metal-logo-sm.png'));
console.log('done');
