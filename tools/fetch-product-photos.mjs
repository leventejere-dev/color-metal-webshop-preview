/**
 * Preia fotografiile de produs de pe site-ul oficial Color Metal
 * (https://color-metal.ro/ro/produse/industriale – fotografii proprii Color Metal)
 * și le pregătește pentru webshop: fundal alb, piesa întreagă în cadru (nu se taie capetele).
 * Se folosesc doar fotografiile pe fundal alb – cele din catalogul furnizorului (fundal întunecat,
 * filigran) nu sunt preluate. Două dimensiuni, JPEG optimizat.
 *
 * Rulare: node tools/fetch-product-photos.mjs → public/assets/products/<nume>.jpg
 */
import sharp from 'sharp';
import fs from 'node:fs';
import path from 'node:path';

const BASE = 'https://color-metal.ro';
const OUT = path.resolve('public/assets/products');
fs.mkdirSync(OUT, { recursive: true });

/** nume local → calea fotografiei pe site-ul oficial */
const PHOTOS = {
  // plăci și table
  'placa-groasa-al': '/sites/default/files/2020-02/ColorMetal-EBE_0022.png',
  'placa-groasa-turnat': '/sites/default/files/2020-02/ColorMetal-EBE_0016_0.png',
  'tabla-lisa': '/sites/default/files/2020-02/ColorMetal-EBE_0038_tabla_lisa_1200x800.jpg',
  'tabla-stucco': '/sites/default/files/2020-02/ColorMetal-EBE_0029.png',
  'tabla-diamond': '/sites/default/files/product_image/2026-09/cm%20diamond.jpg',
  'tabla-quintet': '/sites/default/files/2020-02/ColorMetal-EBE_0036.png',
  'tabla-cu': '/sites/default/files/2020-02/ColorMetal-EBE_0037_0.png',
  'tabla-brass': '/sites/default/files/2020-02/ColorMetal-EBE_0060_1.png',
  // profile
  'profil-u': '/sites/default/files/product_image/2025-03/Profile%20U.jpg',
  'profil-l': '/sites/default/files/product_image/2025-03/Profile%20L.jpg',
  'profil-t': '/sites/default/files/product_image/2025-03/Profile%20T.jpg',
  // țevi
  'teava-rect-al': '/sites/default/files/product_image/2026-09/cm%20rect.png',
  'teava-patrat-al': '/sites/default/files/product_image/2026-09/cm%20patrat.jpg',
  'teava-rotund-al': '/sites/default/files/2020-07/ColorMetal-EBE_0143.jpg',
  // bare
  'bare-al': '/sites/default/files/2020-02/ColorMetal-EBE_0108_0.png',
  'bara-rotunda-cu': '/sites/default/files/2020-02/ColorMetal-EBE_0125_uj_0.png',
  'bara-lata-cu': '/sites/default/files/2020-02/ColorMetal-EBE_0126.png',
  'bara-rotunda-brass': '/sites/default/files/2020-10/Bara-rotunda-din-alama-Color-Metal.jpg',
  'bara-lata-brass': '/sites/default/files/2020-11/ColorMetal-EBE_0140_1.jpg',
  'bara-patrata-brass': '/sites/default/files/2020-11/ColorMetal-bare-patrate-alama_1.jpg',
  'bara-rotunda-bronze': '/sites/default/files/2022-02/DSC_2913-Edit_1.jpg',
};

const WHITE = { r: 255, g: 255, b: 255 };

/**
 * Culorile eloxării, pentru variantele colorate ale fotografiilor de aluminiu. Fiecare pixel al
 * piesei este mutat pe rampa culorii, păstrându-și luminozitatea – la fel ca la desenele tehnice –
 * astfel reflexiile și umbrele rămân intacte. Fundalul alb nu se atinge.
 */
const ELOX = {
  'elox-negru': { dark: [16, 16, 18], light: [134, 136, 140] },
  'elox-bronz': { dark: [44, 26, 17], light: [196, 144, 108] },
};

/** Fotografiile de aluminiu – doar acestea se eloxează. */
const ALUMINIUM = new Set([
  'placa-groasa-al', 'placa-groasa-turnat', 'tabla-lisa', 'tabla-stucco', 'tabla-diamond', 'tabla-quintet',
  'profil-u', 'profil-l', 'profil-t', 'teava-rect-al', 'teava-patrat-al', 'teava-rotund-al', 'bare-al',
]);

/** Varianta eloxată a unei fotografii: piesa în culoarea eloxării, fundalul alb neatins. */
async function eloxed(file, palette) {
  const { data, info } = await sharp(file).raw().toBuffer({ resolveWithObject: true });
  const ch = info.channels;
  for (let i = 0; i < data.length; i += ch) {
    const r = data[i], g = data[i + 1], b = data[i + 2];
    if (r > 243 && g > 243 && b > 243) continue; // fundalul alb rămâne alb
    const lum = 0.299 * r + 0.587 * g + 0.114 * b;
    const u = Math.max(0, Math.min(1, (lum - 28) / 200));
    data[i] = Math.round(palette.dark[0] + (palette.light[0] - palette.dark[0]) * u);
    data[i + 1] = Math.round(palette.dark[1] + (palette.light[1] - palette.dark[1]) * u);
    data[i + 2] = Math.round(palette.dark[2] + (palette.light[2] - palette.dark[2]) * u);
  }
  return sharp(data, { raw: { width: info.width, height: info.height, channels: ch } });
}

/** Fotografia, pe fundal alb, încadrată întreagă (cu o margine mică) într-un cadru 4:3. */
async function frame(src, width, height, file, quality) {
  const margin = Math.round(width * 0.04);
  const inner = await sharp(src)
    .resize(width - 2 * margin, height - 2 * margin, { fit: 'inside', withoutEnlargement: false })
    .toBuffer();
  const m = await sharp(inner).metadata();
  await sharp({ create: { width, height, channels: 3, background: WHITE } })
    .composite([{ input: inner, left: Math.round((width - m.width) / 2), top: Math.round((height - m.height) / 2) }])
    .jpeg({ quality, mozjpeg: true })
    .toFile(file);
}

let ok = 0;
for (const [name, rel] of Object.entries(PHOTOS)) {
  const url = BASE + rel;
  const res = await fetch(url);
  if (!res.ok) {
    console.warn('EȘEC', res.status, name, url);
    continue;
  }
  const buf = Buffer.from(await res.arrayBuffer());
  // fotografiile decupate sunt PNG cu fundal transparent: fără asta, JPEG le-ar face fundalul negru
  const flat = await sharp(buf).flatten({ background: WHITE }).png().toBuffer();
  const meta = await sharp(flat).metadata();

  // tăiem marginea albă uniformă, ca piesa să umple cadrul; dacă detecția dă greș, păstrăm originalul
  let src = flat;
  try {
    const t = await sharp(flat).trim({ background: WHITE, threshold: 12 }).toBuffer();
    const tm = await sharp(t).metadata();
    if (tm.width * tm.height > 0.12 * meta.width * meta.height) src = t;
  } catch {
    /* fotografie fără margine uniformă – rămâne neschimbată */
  }

  // imaginea mare: piesa întreagă, cu margine; miniatura: decupată strâns, ca piesa să se vadă
  // și la 64×48 px (altfel un profil subțire pe alb pare o casetă goală)
  await frame(src, 1200, 900, path.join(OUT, `${name}.jpg`), 82);
  await sharp(src)
    .resize(360, 270, { fit: 'cover', position: 'centre' })
    .flatten({ background: WHITE })
    .jpeg({ quality: 74, mozjpeg: true })
    .toFile(path.join(OUT, `${name}-sm.jpg`));

  // variantele eloxate (negru, bronz) ale fotografiilor de aluminiu
  if (ALUMINIUM.has(name)) {
    for (const [suffix, palette] of Object.entries(ELOX)) {
      await (await eloxed(path.join(OUT, `${name}.jpg`), palette)).jpeg({ quality: 82, mozjpeg: true }).toFile(path.join(OUT, `${name}--${suffix}.jpg`));
      await (await eloxed(path.join(OUT, `${name}-sm.jpg`), palette)).jpeg({ quality: 74, mozjpeg: true }).toFile(path.join(OUT, `${name}--${suffix}-sm.jpg`));
    }
  }
  ok++;
}
console.log('fetch-product-photos:', ok, 'fotografii →', OUT);
