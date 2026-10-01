/**
 * Preia fotografiile de produs de pe site-ul oficial Color Metal
 * (https://color-metal.ro/ro/produse/industriale – fotografii proprii Color Metal)
 * și le pregătește pentru webshop: decupate 4:3, două dimensiuni, JPEG optimizat.
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
  'placa-groasa-cu': '/sites/default/files/2020-08/%28c%29kme_mansfeld_sheets_plates%20%28005%29%20placi%20cupru.jpg',
  'placa-groasa-brass': '/sites/default/files/2020-08/%28c%29kme_mansfeld_sheets_plates%20%28001%29%20placi%20alama_1.jpg',
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
  'profile-speciale': '/sites/default/files/2020-02/ColorMetal-EBE_0162.png',
  // țevi
  'teava-rect-al': '/sites/default/files/product_image/2026-09/cm%20rect.png',
  'teava-patrat-al': '/sites/default/files/product_image/2026-09/cm%20patrat.jpg',
  'teava-rotund-al': '/sites/default/files/2020-07/ColorMetal-EBE_0143.jpg',
  // bare
  'bare-al': '/sites/default/files/2020-02/ColorMetal-EBE_0108_0.png',
  'bara-rotunda-cu': '/sites/default/files/2020-02/ColorMetal-EBE_0125_uj_0.png',
  'bara-lata-cu': '/sites/default/files/2020-02/ColorMetal-EBE_0126.png',
  'bara-patrata-cu': '/sites/default/files/2020-08/Hexagonale%2C%20patrate%202_0.jpg',
  'bara-rotunda-brass': '/sites/default/files/2020-10/Bara-rotunda-din-alama-Color-Metal.jpg',
  'bara-lata-brass': '/sites/default/files/2020-11/ColorMetal-EBE_0140_1.jpg',
  'bara-patrata-brass': '/sites/default/files/2020-11/ColorMetal-bare-patrate-alama_1.jpg',
  'bara-rotunda-bronze': '/sites/default/files/2022-02/DSC_2913-Edit_1.jpg',
};

let ok = 0;
for (const [name, rel] of Object.entries(PHOTOS)) {
  const url = BASE + rel;
  const res = await fetch(url);
  if (!res.ok) {
    console.warn('EȘEC', res.status, name, url);
    continue;
  }
  const buf = Buffer.from(await res.arrayBuffer());
  await sharp(buf).resize(1200, 900, { fit: 'cover', position: 'centre' }).jpeg({ quality: 80, mozjpeg: true }).toFile(path.join(OUT, `${name}.jpg`));
  await sharp(buf).resize(360, 270, { fit: 'cover', position: 'centre' }).jpeg({ quality: 72, mozjpeg: true }).toFile(path.join(OUT, `${name}-sm.jpg`));
  ok++;
}
console.log('fetch-product-photos:', ok, 'fotografii →', OUT);
