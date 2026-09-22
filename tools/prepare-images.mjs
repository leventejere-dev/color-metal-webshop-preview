// Pipeline de imagini: bannerul (fotografie Color Metal, decupaj din zona clară), ilustrațiile
// oficiale ale calculatorului de greutate (ghid dimensiuni + pictograme) și logo-ul.
// Utilizare: node tools/prepare-images.mjs <folder-sursă>
//   <folder-sursă>/banner-colormetal.jpg      fotografia originală (2000×1332)
//   <folder-sursă>/calc_img/*                 fișierele descărcate de pe color-metal.ro/ro/calculator-greutate
//   <folder-sursă>/logo_official.png          CM_Singular_Logo_color_print_1.png
import sharp from 'sharp';
import fs from 'node:fs';
import path from 'node:path';

const src = process.argv[2];
if (!src) throw new Error('source folder required');
const out = path.resolve('public/assets');
fs.mkdirSync(path.join(out, 'banner'), { recursive: true });
fs.mkdirSync(path.join(out, 'tech'), { recursive: true });
fs.mkdirSync(path.join(out, 'brand'), { recursive: true });

// Banner: zona clară (bare de cupru + profile de aluminiu) din fotografia Color Metal
const banner = path.join(src, 'banner-colormetal.jpg');
await sharp(banner).extract({ left: 560, top: 600, width: 1440, height: 360 }).resize(1920, 480).jpeg({ quality: 80, mozjpeg: true }).toFile(path.join(out, 'banner', 'hero.jpg'));
await sharp(banner).extract({ left: 1100, top: 500, width: 900, height: 450 }).resize(960, 480).jpeg({ quality: 80, mozjpeg: true }).toFile(path.join(out, 'banner', 'hero-mobile.jpg'));

// Ghid dimensiuni: ilustrațiile oficiale (notațiile dimensiunilor), dimensiune uniformă, fundal alb
const techMap = {
  thick_plate: 'placa-dreptunghiulara-aluminiu.jpg', sheet: 'tabla-aluminiu.jpg', profile_u: 'Profil-U.jpg', profile_l: 'Profil-L.jpg',
  profile_t: 'Profil-T.jpg', rect_tube: 'teava-rectangulara-aluminiu.jpg', square_tube: 'teava-patrata-aluminiu.jpg', round_tube: 'teava-rotunda-aluminiu.jpg',
  flat_bar: 'placa-dreptunghiulara-aluminiu.jpg', square_bar: 'bara-patrata-aluminiu.jpg', hex_bar: 'bara-hexagonala-aluminiu.jpg', round_bar: 'bara-rotunda-aluminiu.jpg', coil: 'tabla-rulou-aluminiu.png',
};
for (const [s, f] of Object.entries(techMap)) {
  await sharp(path.join(src, 'calc_img', f)).flatten({ background: '#ffffff' }).resize(650, 300, { fit: 'contain', background: '#ffffff' })
    .png({ compressionLevel: 9 }).toFile(path.join(out, 'tech', `${s}.png`));
}
const iconMap = { thick_plate: 'plate', sheet: 'sheet', profile_u: 'u-profiles', profile_l: 'l-profiles', profile_t: 't-profiles', rect_tube: 'rectangular-tube', square_tube: 'square-tube', round_tube: 'round-tube', flat_bar: 'rectangular-bar', square_bar: 'square-bar', hex_bar: 'hexagonal-bar', round_bar: 'round-bar', coil: 'strip' };
for (const [s, f] of Object.entries(iconMap)) {
  fs.copyFileSync(path.join(src, 'calc_img', `icon-${f}.png`), path.join(out, 'tech', `${s}-icon.png`));
}

// Logo oficial (8000px) → 1200px și 480px
await sharp(path.join(src, 'logo_official.png')).resize({ width: 1200 }).png({ compressionLevel: 9 }).toFile(path.join(out, 'brand', 'color-metal-logo.png'));
await sharp(path.join(src, 'logo_official.png')).resize({ width: 480 }).png({ compressionLevel: 9 }).toFile(path.join(out, 'brand', 'color-metal-logo-sm.png'));
console.log('done');
