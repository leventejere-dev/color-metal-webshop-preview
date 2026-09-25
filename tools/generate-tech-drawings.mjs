/**
 * Generează „ghidul pentru alegerea dimensiunilor” – desenele tehnice 3D ale celor 13 forme,
 * în SVG vectorial (calitate maximă la orice rezoluție, spre deosebire de imaginile de
 * 325×150 px din calculatorul oficial de greutate).
 *
 * Notațiile sunt identice cu cele din calculatorul Color Metal:
 *   b = grosime / înălțime, d = lățime / diametru / latură / deschidere de cheie,
 *   g = grosimea peretelui, l (L la profile) = lungime.
 *
 * Rulare: node tools/generate-tech-drawings.mjs   → public/assets/tech/<forma>.svg
 */
import fs from 'node:fs';
import path from 'node:path';

const OUT = path.resolve('public/assets/tech');
fs.mkdirSync(OUT, { recursive: true });

/* ------------------------------------------------------------------ proiecție */
const AW = [0.9, 0.44]; // lățimea secțiunii – spre dreapta-jos
const AH = [0, -1]; // înălțimea – în sus
const AL = [0.975, -0.22]; // lungimea – spre dreapta-sus
const VIEW = norm3([1.0833, 0.6967, -1]); // direcția privitorului
const LIGHT = norm3([-0.42, 0.78, -0.55]); // lumina: stânga-sus-față

function norm3(v) {
  const m = Math.hypot(v[0], v[1], v[2]) || 1;
  return [v[0] / m, v[1] / m, v[2] / m];
}
const dot3 = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const P = (w, h, l) => [w * AW[0] + h * AH[0] + l * AL[0], w * AW[1] + h * AH[1] + l * AL[1]];
const add2 = (a, b) => [a[0] + b[0], a[1] + b[1]];
const sub2 = (a, b) => [a[0] - b[0], a[1] - b[1]];
const mul2 = (a, k) => [a[0] * k, a[1] * k];
const norm2 = (a) => {
  const m = Math.hypot(a[0], a[1]) || 1;
  return [a[0] / m, a[1] / m];
};
const perp2 = (a) => [-a[1], a[0]];
const f = (n) => (Math.round(n * 100) / 100).toString();
const pts = (arr) => arr.map((p) => `${f(p[0])},${f(p[1])}`).join(' ');

const INK = '#1a1a1a';
const EDGE0 = '#6f747a';
let EDGE = EDGE0;

/**
 * Paleta materialului: `null` = aluminiu (gri metalic, culorile originale). Pentru celelalte
 * materiale fiecare gri al piesei este mutat pe rampa culorii, păstrându-și luminozitatea –
 * așa rămân intacte umbrele, muchiile și reflexiile, dar desenul are culoarea materialului ales.
 */
const PALETTES = {
  al: null,
  cu: { dark: [86, 38, 18], light: [255, 196, 148] },
  brass: { dark: [102, 76, 22], light: [255, 236, 168] },
  bronze: { dark: [74, 54, 30], light: [226, 196, 150] },
};
let PAL = null;
/** Cotele (săgeți + literele b, d, g, l/L) se desenează doar în varianta „--dim”. */
let ANNOTATE = true;

function col(c) {
  if (!PAL) return c;
  let r, g, b;
  if (c[0] === '#') {
    r = parseInt(c.slice(1, 3), 16);
    g = parseInt(c.slice(3, 5), 16);
    b = parseInt(c.slice(5, 7), 16);
  } else {
    [r, g, b] = c.match(/\d+/g).map(Number);
  }
  const u = Math.max(0, Math.min(1, (0.299 * r + 0.587 * g + 0.114 * b - 55) / 190));
  const m = (i) => Math.round(PAL.dark[i] + (PAL.light[i] - PAL.dark[i]) * u);
  return `rgb(${m(0)},${m(1)},${m(2)})`;
}

/** Gri metalic (sau culoarea materialului) în funcție de orientarea feței. */
function shade(n3) {
  const t = Math.max(0, dot3(norm3(n3), LIGHT));
  const k = 0.34 + 0.66 * Math.pow(t, 0.85);
  const c = Math.round(112 + k * 128);
  return col(`rgb(${Math.min(Math.round(c * 0.985), 255)},${Math.min(Math.round(c * 0.995), 255)},${Math.min(c, 255)})`);
}

/* ------------------------------------------------- acumulator de puncte (bbox) */
let BOX = null;
const track = (p) => {
  if (!BOX) BOX = [p[0], p[1], p[0], p[1]];
  BOX[0] = Math.min(BOX[0], p[0]);
  BOX[1] = Math.min(BOX[1], p[1]);
  BOX[2] = Math.max(BOX[2], p[0]);
  BOX[3] = Math.max(BOX[3], p[1]);
};
const trackAll = (arr) => arr.forEach(track);

/* ------------------------------------------------------------------ desen: corp */
function prism(section, len, holes = []) {
  const area = section.reduce((s, p, i) => {
    const q = section[(i + 1) % section.length];
    return s + (p[0] * q[1] - q[0] * p[1]);
  }, 0);
  const ccw = area > 0;
  const faces = [];
  const pushSide = (poly, inner) => {
    const sign = inner ? -1 : 1;
    for (let i = 0; i < poly.length; i++) {
      const a = poly[i];
      const b = poly[(i + 1) % poly.length];
      const dw = b[0] - a[0];
      const dh = b[1] - a[1];
      let n = ccw ? [dh, -dw, 0] : [-dh, dw, 0];
      n = [n[0] * sign, n[1] * sign, 0];
      if (dot3(norm3(n), VIEW) <= 0.001) continue;
      const quad = [P(a[0], a[1], 0), P(b[0], b[1], 0), P(b[0], b[1], len), P(a[0], a[1], len)];
      faces.push({ quad, fill: shade(n), depth: (a[0] + b[0]) * VIEW[0] + (a[1] + b[1]) * VIEW[1] });
    }
  };
  pushSide(section, false);
  for (const h of holes) pushSide(h, true);
  faces.sort((x, y) => x.depth - y.depth);

  let svg = '';
  for (const fc of faces) {
    trackAll(fc.quad);
    svg += `<polygon points="${pts(fc.quad)}" fill="${fc.fill}" stroke="${EDGE}" stroke-width="1" stroke-linejoin="round"/>`;
  }
  const front = section.map((p) => P(p[0], p[1], 0));
  trackAll(front);
  const holePaths = holes.map((hp) => hp.map((p) => P(p[0], p[1], 0)));
  const d = [front, ...holePaths].map((poly) => `M${poly.map((p) => `${f(p[0])},${f(p[1])}`).join('L')}Z`).join('');
  svg += `<path d="${d}" fill-rule="evenodd" fill="${shade([0, 0, -1])}" stroke="${EDGE}" stroke-width="1" stroke-linejoin="round"/>`;
  return svg;
}

function circlePts(r, cw, ch, len, steps = 200) {
  const out = [];
  for (let i = 0; i < steps; i++) {
    const t = (i / steps) * Math.PI * 2;
    out.push(P(cw + r * Math.cos(t), ch + r * Math.sin(t), len));
  }
  return out;
}

/** Cilindru plin sau țeavă, de-a lungul axei de lungime. */
function cylinder(r, len, id, rInner = 0, cw = 0, ch = 0) {
  const side = perp2(norm2(AL));
  const front = circlePts(r, cw, ch, 0);
  const back = circlePts(r, cw, ch, len);
  trackAll(front);
  trackAll(back);
  const proj = (p) => p[0] * side[0] + p[1] * side[1];
  let iMin = 0;
  let iMax = 0;
  front.forEach((p, i) => {
    if (proj(p) < proj(front[iMin])) iMin = i;
    if (proj(p) > proj(front[iMax])) iMax = i;
  });
  const arc = (from, to) => {
    const out = [];
    const n = front.length;
    for (let i = from; ; i = (i + 1) % n) {
      out.push(i);
      if (i === to) break;
    }
    return out;
  };
  const idxA = arc(iMin, iMax);
  const idxB = arc(iMax, iMin);
  const depth = (idx) => idx.reduce((s, i) => s + front[i][0] * VIEW[0] + front[i][1] * VIEW[1], 0) / idx.length;
  const visible = depth(idxA) > depth(idxB) ? idxA : idxB;
  const hidden = visible === idxA ? idxB : idxA;

  const g1 = add2(P(cw, ch, 0), mul2(side, -r));
  const g2 = add2(P(cw, ch, 0), mul2(side, r));
  const grad = (gid, stops) =>
    `<defs><linearGradient id="${gid}" gradientUnits="userSpaceOnUse" x1="${f(g1[0])}" y1="${f(g1[1])}" x2="${f(g2[0])}" y2="${f(g2[1])}">${stops}</linearGradient></defs>`;

  let svg = grad(id, `<stop offset="0" stop-color="${col('#8f9399')}"/><stop offset="0.32" stop-color="${col('#e2e5e8')}"/><stop offset="0.68" stop-color="${col('#b6babf')}"/><stop offset="1" stop-color="${col('#7f8389')}"/>`);
  svg += `<path d="M${visible.map((i) => `${f(front[i][0])},${f(front[i][1])}`).join('L')}L${[...visible].reverse().map((i) => `${f(back[i][0])},${f(back[i][1])}`).join('L')}Z" fill="url(#${id})" stroke="${EDGE}" stroke-width="1" stroke-linejoin="round"/>`;

  if (rInner > 0) {
    // golul țevii: fund întunecat + peretele interior, decupate pe conturul găurii
    const fin = circlePts(rInner, cw, ch, 0);
    const bin = circlePts(rInner, cw, ch, len * 0.55);
    const holePath = `M${fin.map((p) => `${f(p[0])},${f(p[1])}`).join('L')}Z`;
    svg += `<clipPath id="${id}c"><path d="${holePath}"/></clipPath>`;
    svg += grad(`${id}h`, `<stop offset="0" stop-color="${col('#4a4f55')}"/><stop offset="1" stop-color="${col('#6b7177')}"/>`);
    svg += grad(`${id}i`, `<stop offset="0" stop-color="${col('#a6abb1')}"/><stop offset="1" stop-color="${col('#83888e')}"/>`);
    svg += `<g clip-path="url(#${id}c)"><path d="${holePath}" fill="url(#${id}h)"/>` +
      `<path d="M${hidden.map((i) => `${f(fin[i][0])},${f(fin[i][1])}`).join('L')}L${[...hidden].reverse().map((i) => `${f(bin[i][0])},${f(bin[i][1])}`).join('L')}Z" fill="url(#${id}i)"/></g>`;
  }

  // fața frontală (inel sau disc)
  svg += grad(`${id}f`, `<stop offset="0" stop-color="${col('#6f747a')}"/><stop offset="0.55" stop-color="${col('#a0a5ab')}"/><stop offset="1" stop-color="${col('#7b8086')}"/>`);
  const face = `M${front.map((p) => `${f(p[0])},${f(p[1])}`).join('L')}Z`;
  const inner = rInner > 0 ? `M${circlePts(rInner, cw, ch, 0).map((p) => `${f(p[0])},${f(p[1])}`).join('L')}Z` : '';
  svg += `<path d="${face}${inner}" fill-rule="evenodd" fill="url(#${id}f)" stroke="${EDGE}" stroke-width="1"/>`;
  return svg;
}

/* ------------------------------------------------------ desen: cote (dimensiuni) */
const ARROW = 13;
const TXT = 40;

function arrow(at, dir) {
  const d = norm2(dir);
  const p = perp2(d);
  const base = add2(at, mul2(d, -ARROW));
  const poly = [at, add2(base, mul2(p, ARROW * 0.3)), add2(base, mul2(p, -ARROW * 0.3))];
  trackAll(poly);
  return `<polygon points="${pts(poly)}" fill="${INK}"/>`;
}
function line(a, b, w = 1.6) {
  track(a);
  track(b);
  return `<line x1="${f(a[0])}" y1="${f(a[1])}" x2="${f(b[0])}" y2="${f(b[1])}" stroke="${INK}" stroke-width="${w}"/>`;
}
function label(text, at, size = TXT) {
  track([at[0] - size * 0.5, at[1] - size * 0.6]);
  track([at[0] + size * 0.5, at[1] + size * 0.6]);
  return `<text x="${f(at[0])}" y="${f(at[1])}" font-family="Arial, Helvetica, sans-serif" font-size="${size}" fill="${INK}" text-anchor="middle" dominant-baseline="central">${text}</text>`;
}

/** Cotă între A și B, deplasată cu `off`; `outside` = săgeți în exterior (distanțe mici). */
function dim(A, B, off, text, { outside = false, labelOff = 34, ext = true, labelAt = 0.5 } = {}) {
  if (!ANNOTATE) return ''; // varianta fără notații (carduri, pagina de material)
  const a = add2(A, off);
  const b = add2(B, off);
  const dir = norm2(sub2(b, a));
  let svg = '';
  if (ext) {
    const e = mul2(norm2(off), 12);
    svg += line(add2(A, e), add2(a, mul2(norm2(off), 10)), 1.2);
    svg += line(add2(B, e), add2(b, mul2(norm2(off), 10)), 1.2);
  }
  if (outside) {
    const out = mul2(dir, ARROW * 2.1);
    svg += line(sub2(a, out), add2(b, out));
    svg += arrow(a, mul2(dir, -1));
    svg += arrow(b, dir);
  } else {
    svg += line(a, b);
    svg += arrow(a, mul2(dir, -1));
    svg += arrow(b, dir);
  }
  const mid = add2(a, mul2(sub2(b, a), labelAt));
  const lp = perp2(dir);
  const sideSign = lp[0] * off[0] + lp[1] * off[1] >= 0 ? -1 : 1;
  svg += label(text, add2(mid, mul2(lp, labelOff * sideSign)));
  return svg;
}

function shadow(center, rx, ry) {
  track([center[0] - rx, center[1] - ry]);
  track([center[0] + rx, center[1] + ry]);
  return `<defs><radialGradient id="sh"><stop offset="0" stop-color="#101418" stop-opacity="0.18"/><stop offset="1" stop-color="#101418" stop-opacity="0"/></radialGradient></defs><ellipse cx="${f(center[0])}" cy="${f(center[1])}" rx="${f(rx)}" ry="${f(ry)}" fill="url(#sh)"/>`;
}

/* ---------------------------------------------------------------- compunere SVG */
const PAD = 18;
// înălțimea de referință: textele și grosimile se normalizează după ea, astfel încât toate
// desenele să arate identic când sunt afișate la aceeași înălțime (fără cadre goale în jur)
const H_REF = 430;

/** viewBox strâns pe conținut (fără spații goale) + normalizarea textelor/grosimilor. */
function svgDoc(body, name) {
  const [x0, y0, x1, y1] = BOX;
  const w = x1 - x0 + 2 * PAD;
  const h = y1 - y0 + 2 * PAD;
  const k = h / H_REF; // desen mai înalt → text/linii proporțional mai mari
  const fixed = body
    .replace(/stroke-width="([d.]+)"/g, (_m, v) => `stroke-width="${f(Number(v) * k)}"`)
    .replace(/font-size="([d.]+)"/g, (_m, v) => `font-size="${f(Number(v) * k)}"`);
  BOX = null;
  const alt = ANNOTATE ? `Ghid dimensiuni – ${name}` : `Desen tehnic – ${name}`;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${f(x0 - PAD)} ${f(y0 - PAD)} ${f(w)} ${f(h)}" role="img" aria-label="${alt}">${fixed}</svg>`;
}

/* ------------------------------------------------------------------- desenele */
const LEN = 480;

function buildDrawings() {
const drawings = {};

/** Cote standard pentru o secțiune dreptunghiulară (b = grosime/înălțime, d = lățime). */
function boxDims({ d, b, lenLabel = 'l', dLabel = 'd', bLabel = 'b' }) {
  const bOff = -Math.max(70, Math.min(122, b * 2.4));
  let s = dim(P(0, b, 0), P(0, 0, 0), [bOff, 0], bLabel, { labelOff: 36 });
  s += dim(P(0, 0, 0), P(d, 0, 0), [-26, 96], dLabel, { labelOff: 38 });
  s += dim(P(d, 0, 0), P(d, 0, LEN), [58, 122], lenLabel, { labelOff: 40, labelAt: 0.56 });
  return s;
}

function slab(d, b, name) {
  const section = [
    [0, 0],
    [d, 0],
    [d, b],
    [0, b],
  ];
  let s = shadow(add2(P(d / 2, 0, LEN / 2), [0, 26]), 430, 52);
  s += prism(section, LEN);
  s += boxDims({ d, b });
  return svgDoc(s, name);
}
drawings.thick_plate = slab(190, 42, 'Placă groasă');
drawings.flat_bar = slab(120, 34, 'Bară lată');
drawings.sheet = slab(210, 13, 'Tablă');

{
  const a = 96;
  const section = [
    [0, 0],
    [a, 0],
    [a, a],
    [0, a],
  ];
  let s = shadow(add2(P(a / 2, 0, LEN / 2), [0, 26]), 380, 46);
  s += prism(section, LEN);
  s += boxDims({ d: a, b: a, dLabel: 'd', bLabel: 'd' });
  drawings.square_bar = svgDoc(s, 'Bară pătrată');
}

{
  const a = 96;
  const g = 12;
  const section = [
    [0, 0],
    [a, 0],
    [a, a],
    [0, a],
  ];
  const hole = [
    [g, g],
    [a - g, g],
    [a - g, a - g],
    [g, a - g],
  ];
  let s = shadow(add2(P(a / 2, 0, LEN / 2), [0, 26]), 380, 46);
  s += prism(section, LEN, [hole]);
  s += boxDims({ d: a, b: a, dLabel: 'd', bLabel: 'd' });
  s += dim(P(0, a, 0), P(g, a, 0), [0, -150], 'g', { outside: true, labelOff: 34 });
  drawings.square_tube = svgDoc(s, 'Țeavă pătrată');
}

{
  const d = 128;
  const b = 84;
  const g = 13;
  const section = [
    [0, 0],
    [d, 0],
    [d, b],
    [0, b],
  ];
  const hole = [
    [g, g],
    [d - g, g],
    [d - g, b - g],
    [g, b - g],
  ];
  let s = shadow(add2(P(d / 2, 0, LEN / 2), [0, 26]), 400, 50);
  s += prism(section, LEN, [hole]);
  s += boxDims({ d, b });
  s += dim(P(0, b, 0), P(g, b, 0), [0, -150], 'g', { outside: true, labelOff: 34 });
  drawings.rect_tube = svgDoc(s, 'Țeavă rectangulară');
}

function profile(section, d, b, g, name, gAt) {
  let s = shadow(add2(P(d / 2, 0, LEN / 2), [0, 26]), 400, 50);
  s += prism(section, LEN);
  s += boxDims({ d, b, lenLabel: 'L' });
  s += dim(gAt[0], gAt[1], [0, -150], 'g', { outside: true, labelOff: 34 });
  return svgDoc(s, name);
}

{
  const d = 132;
  const b = 104;
  const g = 15;
  drawings.profile_u = profile(
    [
      [0, 0],
      [d, 0],
      [d, b],
      [d - g, b],
      [d - g, g],
      [g, g],
      [g, b],
      [0, b],
    ],
    d,
    b,
    g,
    'Profil U',
    [P(0, b, 0), P(g, b, 0)],
  );
  drawings.profile_l = profile(
    [
      [0, 0],
      [d, 0],
      [d, g],
      [g, g],
      [g, b],
      [0, b],
    ],
    d,
    b,
    g,
    'Profil L',
    [P(0, b, 0), P(g, b, 0)],
  );
}

{
  const d = 136;
  const b = 104;
  const g = 16;
  const section = [
    [0, b - g],
    [(d - g) / 2, b - g],
    [(d - g) / 2, 0],
    [(d + g) / 2, 0],
    [(d + g) / 2, b - g],
    [d, b - g],
    [d, b],
    [0, b],
  ];
  let s = shadow(add2(P(d / 2, 0, LEN / 2), [0, 26]), 400, 50);
  s += prism(section, LEN);
  s += dim(P(0, b, 0), P(0, 0, 0), [-118, 0], 'b', { labelOff: 36 });
  s += dim(P(0, b, 0), P(d, b, 0), [-34, -150], 'd', { labelOff: 40 });
  s += dim(P(0, b, 0), P(0, b - g, 0), [-62, 0], 'g', { outside: true, labelOff: 28 });
  s += dim(P(d, 0, 0), P(d, 0, LEN), [58, 122], 'L', { labelOff: 40, labelAt: 0.56 });
  drawings.profile_t = svgDoc(s, 'Profil T');
}

{
  const d = 104; // deschiderea de cheie (între fețe paralele)
  const R = d / Math.sqrt(3);
  const section = [];
  for (let i = 0; i < 6; i++) {
    const t = (Math.PI / 3) * i;
    section.push([R * Math.cos(t), R * Math.sin(t)]);
  }
  let s = shadow(add2(P(0, -R, LEN / 2), [0, 26]), 380, 46);
  s += prism(section, LEN);
  s += dim(P(0, d / 2, 0), P(0, -d / 2, 0), [-128, 0], 'd', { labelOff: 36 });
  s += dim(P(R, -d / 2, 0), P(R, -d / 2, LEN), [54, 112], 'l', { labelOff: 40, labelAt: 0.56 });
  drawings.hex_bar = svgDoc(s, 'Bară hexagonală');
}

{
  const r = 58;
  let s = shadow(add2(P(0, -r, LEN / 2), [0, 24]), 380, 44);
  s += cylinder(r, LEN, 'c1');
  s += dim(P(0, r, 0), P(0, -r, 0), [-128, 0], 'd', { labelOff: 36 });
  s += dim(P(r, -r, 0), P(r, -r, LEN), [54, 108], 'l', { labelOff: 40, labelAt: 0.56 });
  drawings.round_bar = svgDoc(s, 'Bară rotundă');
}

{
  const r = 68;
  const wall = 14;
  let s = shadow(add2(P(0, -r, LEN / 2), [0, 24]), 380, 44);
  s += cylinder(r, LEN, 'c2', r - wall);
  s += dim(P(0, r, 0), P(0, -r, 0), [-134, 0], 'd', { labelOff: 36 });
  s += dim(P(0, r, 0), P(0, r - wall, 0), [0, -132], 'b', { outside: true, labelOff: 30 });
  s += dim(P(r, -r, 0), P(r, -r, LEN), [54, 108], 'l', { labelOff: 40, labelAt: 0.56 });
  drawings.round_tube = svgDoc(s, 'Țeavă rotundă');
}

{
  // rulou pe axa lungimii (d = lățimea benzii) + banda desfășurată pe direcția lățimii (l)
  const R = 132;
  const hole = 17;
  const W = 250;
  const STRIP = 300;
  const t = 14;
  const y0 = -R;
  const quad = (a, b, c, e, fill) => {
    const poly = [a, b, c, e];
    trackAll(poly);
    return `<polygon points="${pts(poly)}" fill="${fill}" stroke="${EDGE}" stroke-width="1" stroke-linejoin="round"/>`;
  };
  let s = shadow(add2(P(STRIP / 2, -R, W / 2), [0, 26]), 380, 48);
  s += quad(P(0, y0 + t, 0), P(STRIP, y0 + t, 0), P(STRIP, y0 + t, W), P(0, y0 + t, W), shade([0, 1, 0]));
  s += quad(P(0, y0, 0), P(STRIP, y0, 0), P(STRIP, y0 + t, 0), P(0, y0 + t, 0), shade([0, 0, -1]));
  s += quad(P(STRIP, y0, 0), P(STRIP, y0, W), P(STRIP, y0 + t, W), P(STRIP, y0 + t, 0), shade([1, 0, 0]));
  s += cylinder(R, W, "c3");
  const h = circlePts(hole, 0, 0, 0);
  s += `<path d="M${h.map((p) => `${f(p[0])},${f(p[1])}`).join("L")}Z" fill="${col('#474c52')}"/>`;
  s += dim(P(0, R, 0), P(0, R, W), [20, -92], "d", { labelOff: 36 });
  s += dim(P(STRIP, -R, 0), P(STRIP, -R + t, 0), [80, 0], "b", { outside: true, labelOff: 30 });
  s += dim(P(0, -R, 0), P(STRIP, -R, 0), [-14, 108], "l", { labelOff: 40, labelAt: 0.58 });
  drawings.coil = svgDoc(s, 'Bandă rulou');
}

  return drawings;
}

/* ------------------------------------------------------------------ variantele */
// Materialele disponibile pentru fiecare formă (identic cu src/data/shapes.ts).
const SHAPE_MATERIALS = {
  thick_plate: ['al', 'cu', 'brass'],
  sheet: ['al', 'cu', 'brass'],
  flat_bar: ['al', 'cu', 'brass'],
  square_bar: ['al', 'cu', 'brass'],
  hex_bar: ['al', 'cu', 'brass'],
  round_bar: ['al', 'cu', 'brass', 'bronze'],
};

// <forma>.svg = aluminiu, fără notații (carduri, pagina de material)
// <forma>--dim.svg = aluminiu, cu notații (pasul de alegere a dimensiunilor)
// <forma>--cu.svg, <forma>--cu--dim.svg … = aceleași, în culoarea materialului
let count = 0;
for (const [mat, pal] of Object.entries(PALETTES)) {
  for (const annotate of [false, true]) {
    PAL = pal;
    ANNOTATE = annotate;
    EDGE = col(EDGE0);
    for (const [id, svg] of Object.entries(buildDrawings())) {
      if (!(SHAPE_MATERIALS[id] ?? ['al']).includes(mat)) continue;
      fs.writeFileSync(path.join(OUT, `${id}${mat === 'al' ? '' : `--${mat}`}${annotate ? '--dim' : ''}.svg`), svg);
      count++;
    }
  }
}
console.log('generate-tech-drawings:', count, 'desene →', OUT);
