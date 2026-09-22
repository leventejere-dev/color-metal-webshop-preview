import type { MaterialId } from './materials';

export type ShapeId =
  | 'thick_plate'
  | 'sheet'
  | 'profile_u'
  | 'profile_l'
  | 'profile_t'
  | 'rect_tube'
  | 'square_tube'
  | 'round_tube'
  | 'flat_bar'
  | 'square_bar'
  | 'hex_bar'
  | 'round_bar'
  | 'coil';

export type ShapeCategory = 'placa' | 'profil' | 'teava' | 'bara' | 'rulou';
export type ToleranceGroup = 'profil' | 'bara' | 'placa';

export interface DimensionField {
  key: string;
  label: string;
  /** litera folosită în desenul tehnic */
  symbol: string;
  hint?: string;
}

export interface RangeSpec {
  key: 'length' | 'width';
  label: string;
  min: number;
  max: number;
  step: number;
  presets: number[];
}

export interface ShapeImages {
  close: string;
  context: string;
  card: string;
  tech: string;
  icon: string;
  closeAlt: string;
  contextAlt: string;
}

export interface Shape {
  id: ShapeId;
  slug: string;
  name: string;
  short: string;
  description: string;
  keywords: string[];
  category: ShapeCategory;
  materials: MaterialId[];
  /** câmpuri de secțiune (valori discrete, din catalog) */
  fields: DimensionField[];
  /** combinații reale (SKU-uri) – doar acestea pot fi comandate */
  variants: Record<string, number>[];
  /** câmpuri continue (slider + input) */
  ranges: RangeSpec[];
  tolerance: ToleranceGroup;
  unitLabel: string;
  images: ShapeImages;
}

const img = (id: ShapeId, closeAlt: string, contextAlt: string): ShapeImages => ({
  close: `/assets/products/${id}-close.jpg`,
  context: `/assets/products/${id}-context.jpg`,
  card: `/assets/products/${id}-card.jpg`,
  tech: `/assets/tech/${id}.png`,
  icon: `/assets/tech/${id}-icon.png`,
  closeAlt,
  contextAlt,
});

const LENGTHS = [500, 1000, 1500, 2000, 2500, 3000, 4000, 6000];

const lengthProfile: RangeSpec = { key: 'length', label: 'Lungime', min: 50, max: 6000, step: 1, presets: LENGTHS };
const lengthBar: RangeSpec = { key: 'length', label: 'Lungime', min: 25, max: 6000, step: 1, presets: LENGTHS };
const lengthCoil: RangeSpec = {
  key: 'length',
  label: 'Lungime (la metraj)',
  min: 1000,
  max: 50000,
  step: 1,
  presets: [1000, 2000, 5000, 10000, 20000, 50000],
};
const plateWidth: RangeSpec = { key: 'width', label: 'Lățime', min: 50, max: 1500, step: 1, presets: [100, 250, 500, 1000, 1250, 1500] };
const plateLength: RangeSpec = { key: 'length', label: 'Lungime', min: 50, max: 3000, step: 1, presets: [100, 250, 500, 1000, 2000, 3000] };

const F = {
  width: { key: 'width', label: 'Lățime', symbol: 'b' },
  height: { key: 'height', label: 'Înălțime', symbol: 'h' },
  thickness: { key: 'thickness', label: 'Grosime', symbol: 't' },
  side: { key: 'side', label: 'Latură', symbol: 'a' },
  sw: { key: 'side', label: 'Deschidere cheie (SW)', symbol: 's', hint: 'Distanța între două fețe paralele' },
  od: { key: 'outer_diameter', label: 'Diametru exterior', symbol: 'D' },
  d: { key: 'outer_diameter', label: 'Diametru', symbol: 'd' },
} satisfies Record<string, DimensionField>;

const CU_BRASS_AL: MaterialId[] = ['AL', 'CU', 'BRASS'];

export const SHAPES: Shape[] = [
  {
    id: 'thick_plate',
    slug: 'placa-groasa',
    name: 'Placă groasă',
    short: 'Placă tăiată la dimensiune',
    description:
      'Plăci laminate cu grosimi de la 8 mm, debitate la dimensiunea cerută. Ideale pentru piese frezate, matrițe, plăci de bază și construcții mecanice.',
    keywords: ['placa', 'placă', 'plate', 'laminat', 'frezare', 'grosime'],
    category: 'placa',
    materials: CU_BRASS_AL,
    fields: [F.thickness],
    variants: [
      { width: 1000, height: 2000, thickness: 8 },
      { width: 1000, height: 2000, thickness: 10 },
      { width: 1000, height: 2000, thickness: 12 },
      { width: 1000, height: 2000, thickness: 15 },
      { width: 1000, height: 2000, thickness: 20 },
      { width: 1250, height: 2500, thickness: 10 },
      { width: 1250, height: 2500, thickness: 12 },
      { width: 1250, height: 2500, thickness: 15 },
      { width: 1250, height: 2500, thickness: 20 },
      { width: 1250, height: 2500, thickness: 25 },
      { width: 1250, height: 2500, thickness: 30 },
      { width: 1500, height: 3000, thickness: 15 },
      { width: 1500, height: 3000, thickness: 20 },
      { width: 1500, height: 3000, thickness: 25 },
      { width: 1500, height: 3000, thickness: 30 },
      { width: 1500, height: 3000, thickness: 40 },
      { width: 1500, height: 3000, thickness: 50 },
    ],
    ranges: [plateWidth, plateLength],
    tolerance: 'placa',
    unitLabel: 'buc',
    images: img('thick_plate', 'Măsurarea grosimii unei plăci metalice cu micrometrul', 'Depozit cu plăci și profile din aluminiu'),
  },
  {
    id: 'sheet',
    slug: 'tabla',
    name: 'Tablă',
    short: 'Tablă tăiată la dimensiune',
    description:
      'Table subțiri (1,5–6 mm) debitate la dimensiune, pentru carcase, panouri, placări, ambutisare și publicitate.',
    keywords: ['tabla', 'tablă', 'sheet', 'foaie', 'panou', 'subțire'],
    category: 'placa',
    materials: CU_BRASS_AL,
    fields: [F.thickness],
    variants: [
      { width: 500, height: 1000, thickness: 1.5 },
      { width: 500, height: 1000, thickness: 2 },
      { width: 500, height: 1000, thickness: 3 },
      { width: 1000, height: 2000, thickness: 1.5 },
      { width: 1000, height: 2000, thickness: 2 },
      { width: 1000, height: 2000, thickness: 3 },
      { width: 1000, height: 2000, thickness: 4 },
      { width: 1250, height: 2500, thickness: 2 },
      { width: 1250, height: 2500, thickness: 3 },
      { width: 1250, height: 2500, thickness: 4 },
      { width: 1250, height: 2500, thickness: 5 },
      { width: 1500, height: 3000, thickness: 2 },
      { width: 1500, height: 3000, thickness: 3 },
      { width: 1500, height: 3000, thickness: 4 },
      { width: 1500, height: 3000, thickness: 5 },
      { width: 1500, height: 3000, thickness: 6 },
    ],
    ranges: [plateWidth, plateLength],
    tolerance: 'placa',
    unitLabel: 'buc',
    images: img('sheet', 'Măsurarea unei table metalice cu șublerul', 'Depozit cu table și semifabricate din aluminiu'),
  },
  {
    id: 'profile_u',
    slug: 'profil-u',
    name: 'Profil U',
    short: 'Canal U tăiat la lungime',
    description:
      'Profile U extrudate din aluminiu, tăiate la lungimea dorită. Pentru cadre, ghidaje, structuri de mobilier și construcții ușoare.',
    keywords: ['profil u', 'canal', 'u', 'channel', 'extrudat', 'profil'],
    category: 'profil',
    materials: ['AL'],
    fields: [F.width, F.height, F.thickness],
    variants: [
      { width: 20, height: 20, thickness: 2 },
      { width: 20, height: 20, thickness: 3 },
      { width: 25, height: 25, thickness: 2 },
      { width: 25, height: 25, thickness: 3 },
      { width: 30, height: 30, thickness: 2 },
      { width: 30, height: 30, thickness: 3 },
      { width: 30, height: 30, thickness: 4 },
      { width: 40, height: 20, thickness: 2 },
      { width: 40, height: 20, thickness: 3 },
      { width: 40, height: 30, thickness: 3 },
      { width: 40, height: 30, thickness: 4 },
      { width: 40, height: 40, thickness: 3 },
      { width: 40, height: 40, thickness: 4 },
      { width: 40, height: 40, thickness: 5 },
      { width: 50, height: 30, thickness: 3 },
      { width: 50, height: 30, thickness: 4 },
      { width: 50, height: 50, thickness: 4 },
      { width: 50, height: 50, thickness: 5 },
      { width: 50, height: 50, thickness: 6 },
      { width: 60, height: 40, thickness: 4 },
      { width: 60, height: 40, thickness: 5 },
      { width: 60, height: 40, thickness: 6 },
      { width: 80, height: 40, thickness: 5 },
      { width: 80, height: 40, thickness: 6 },
      { width: 100, height: 50, thickness: 6 },
      { width: 100, height: 50, thickness: 8 },
    ],
    ranges: [lengthProfile],
    tolerance: 'profil',
    unitLabel: 'buc',
    images: img('profile_u', 'Profile U stivuite – detaliu', 'Profile U pregătite pentru livrare'),
  },
  {
    id: 'profile_l',
    slug: 'profil-l',
    name: 'Profil L',
    short: 'Colțare L tăiate la lungime',
    description:
      'Colțare (cornier) din aluminiu cu aripi egale, debitate la lungime. Pentru rame, protecții de muchii, structuri și montaje.',
    keywords: ['profil l', 'cornier', 'colțar', 'coltar', 'angle', 'l'],
    category: 'profil',
    materials: ['AL'],
    fields: [F.width, F.height, F.thickness],
    variants: [
      { width: 20, height: 20, thickness: 2 },
      { width: 20, height: 20, thickness: 3 },
      { width: 25, height: 25, thickness: 2 },
      { width: 25, height: 25, thickness: 3 },
      { width: 30, height: 30, thickness: 2 },
      { width: 30, height: 30, thickness: 3 },
      { width: 30, height: 30, thickness: 4 },
      { width: 40, height: 40, thickness: 3 },
      { width: 40, height: 40, thickness: 4 },
      { width: 40, height: 40, thickness: 5 },
      { width: 50, height: 50, thickness: 4 },
      { width: 50, height: 50, thickness: 5 },
      { width: 50, height: 50, thickness: 6 },
      { width: 60, height: 60, thickness: 5 },
      { width: 60, height: 60, thickness: 6 },
      { width: 80, height: 80, thickness: 6 },
      { width: 80, height: 80, thickness: 8 },
      { width: 100, height: 100, thickness: 8 },
      { width: 100, height: 100, thickness: 10 },
    ],
    ranges: [lengthProfile],
    tolerance: 'profil',
    unitLabel: 'buc',
    images: img('profile_l', 'Profile L din aluminiu stivuite – detaliu', 'Corniere stivuite în depozit'),
  },
  {
    id: 'profile_t',
    slug: 'profil-t',
    name: 'Profil T',
    short: 'Profil T pentru construcții metalice',
    description:
      'Profile T din aluminiu, tăiate la lungime. Pentru rigidizări, cadre de panouri, tavane și structuri ușoare.',
    keywords: ['profil t', 't', 'tee', 'rigidizare', 'profil'],
    category: 'profil',
    materials: ['AL'],
    fields: [F.width, F.height, F.thickness],
    variants: [
      { width: 20, height: 20, thickness: 2 },
      { width: 20, height: 20, thickness: 3 },
      { width: 30, height: 30, thickness: 3 },
      { width: 30, height: 30, thickness: 4 },
      { width: 40, height: 40, thickness: 3 },
      { width: 40, height: 40, thickness: 4 },
      { width: 40, height: 40, thickness: 5 },
      { width: 50, height: 50, thickness: 4 },
      { width: 50, height: 50, thickness: 5 },
      { width: 50, height: 50, thickness: 6 },
      { width: 60, height: 60, thickness: 5 },
      { width: 60, height: 60, thickness: 6 },
      { width: 80, height: 80, thickness: 6 },
      { width: 80, height: 80, thickness: 8 },
    ],
    ranges: [lengthProfile],
    tolerance: 'profil',
    unitLabel: 'buc',
    images: img('profile_t', 'Raft cu profile metalice (T, L, platbandă)', 'Profile și bare metalice expuse în depozit'),
  },
  {
    id: 'rect_tube',
    slug: 'teava-rectangulara',
    name: 'Țeavă rectangulară',
    short: 'Tub rectangular cu grosime aleasă',
    description:
      'Țevi rectangulare din aluminiu, debitate la lungime. Pentru cadre, structuri de mobilier, balustrade și construcții ușoare.',
    keywords: ['teava', 'țeavă', 'rectangular', 'tub', 'dreptunghiular', 'tube'],
    category: 'teava',
    materials: ['AL'],
    fields: [F.width, F.height, F.thickness],
    variants: [
      { width: 20, height: 10, thickness: 1.5 },
      { width: 20, height: 10, thickness: 2 },
      { width: 25, height: 15, thickness: 1.5 },
      { width: 25, height: 15, thickness: 2 },
      { width: 30, height: 15, thickness: 2 },
      { width: 30, height: 15, thickness: 3 },
      { width: 40, height: 20, thickness: 2 },
      { width: 40, height: 20, thickness: 3 },
      { width: 40, height: 30, thickness: 2 },
      { width: 40, height: 30, thickness: 3 },
      { width: 40, height: 30, thickness: 4 },
      { width: 50, height: 30, thickness: 3 },
      { width: 50, height: 30, thickness: 4 },
      { width: 60, height: 40, thickness: 3 },
      { width: 60, height: 40, thickness: 4 },
      { width: 60, height: 40, thickness: 5 },
      { width: 80, height: 40, thickness: 4 },
      { width: 80, height: 40, thickness: 5 },
      { width: 80, height: 40, thickness: 6 },
      { width: 100, height: 50, thickness: 5 },
      { width: 100, height: 50, thickness: 6 },
    ],
    ranges: [lengthProfile],
    tolerance: 'profil',
    unitLabel: 'buc',
    images: img('rect_tube', 'Țevi rectangulare și pătrate stivuite – detaliu', 'Perete cu țevi și tuburi metalice de diverse secțiuni'),
  },
  {
    id: 'square_tube',
    slug: 'teava-patrata',
    name: 'Țeavă pătrată',
    short: 'Tub pătrat tăiat la lungime',
    description:
      'Țevi pătrate din aluminiu cu grosimi de perete de la 1,5 mm, debitate la lungime. Pentru cadre, suporturi și structuri publicitare.',
    keywords: ['teava', 'țeavă', 'patrata', 'pătrată', 'tub', 'square', 'tube'],
    category: 'teava',
    materials: ['AL'],
    fields: [F.side, F.thickness],
    variants: [
      { side: 20, thickness: 1.5 },
      { side: 20, thickness: 2 },
      { side: 25, thickness: 1.5 },
      { side: 25, thickness: 2 },
      { side: 30, thickness: 2 },
      { side: 30, thickness: 3 },
      { side: 40, thickness: 2 },
      { side: 40, thickness: 3 },
      { side: 40, thickness: 4 },
      { side: 50, thickness: 3 },
      { side: 50, thickness: 4 },
      { side: 50, thickness: 5 },
      { side: 60, thickness: 4 },
      { side: 60, thickness: 5 },
      { side: 60, thickness: 6 },
      { side: 80, thickness: 5 },
      { side: 80, thickness: 6 },
      { side: 100, thickness: 6 },
      { side: 100, thickness: 8 },
    ],
    ranges: [lengthProfile],
    tolerance: 'profil',
    unitLabel: 'buc',
    images: img('square_tube', 'Țevi pătrate stivuite – detaliu', 'Pachete de țevi cu secțiune pătrată în depozit'),
  },
  {
    id: 'round_tube',
    slug: 'teava-rotunda',
    name: 'Țeavă rotundă',
    short: 'Tub rotund cu diametru ales',
    description:
      'Țevi rotunde din aluminiu, debitate la lungime. Pentru balustrade, instalații, structuri tubulare și piese strunjite.',
    keywords: ['teava', 'țeavă', 'rotunda', 'rotundă', 'tub', 'round', 'pipe', 'tube'],
    category: 'teava',
    materials: ['AL'],
    fields: [F.od, F.thickness],
    variants: [
      { outer_diameter: 16, thickness: 1.5 },
      { outer_diameter: 20, thickness: 1.5 },
      { outer_diameter: 20, thickness: 2 },
      { outer_diameter: 25, thickness: 1.5 },
      { outer_diameter: 25, thickness: 2 },
      { outer_diameter: 30, thickness: 2 },
      { outer_diameter: 30, thickness: 3 },
      { outer_diameter: 40, thickness: 2 },
      { outer_diameter: 40, thickness: 3 },
      { outer_diameter: 50, thickness: 3 },
      { outer_diameter: 50, thickness: 4 },
      { outer_diameter: 60, thickness: 4 },
      { outer_diameter: 80, thickness: 5 },
      { outer_diameter: 100, thickness: 6 },
    ],
    ranges: [lengthProfile],
    tolerance: 'profil',
    unitLabel: 'buc',
    images: img('round_tube', 'Țevi rotunde stivuite – detaliu', 'Rafturi cu țevi rotunde în depozit'),
  },
  {
    id: 'flat_bar',
    slug: 'bara-lata',
    name: 'Bară lată',
    short: 'Platbandă / bară dreptunghiulară',
    description:
      'Platbandă (bară lată) debitată la lungime. Disponibilă în aluminiu, cupru și alamă – pentru bare colectoare, elemente de fixare, piese frezate și decor.',
    keywords: ['bara', 'bară', 'lata', 'lată', 'platbanda', 'platbandă', 'flat', 'dreptunghiular'],
    category: 'bara',
    materials: CU_BRASS_AL,
    fields: [F.width, F.thickness],
    variants: [
      { width: 10, thickness: 2 },
      { width: 10, thickness: 3 },
      { width: 15, thickness: 2 },
      { width: 15, thickness: 3 },
      { width: 20, thickness: 3 },
      { width: 20, thickness: 4 },
      { width: 20, thickness: 5 },
      { width: 25, thickness: 3 },
      { width: 25, thickness: 4 },
      { width: 25, thickness: 5 },
      { width: 30, thickness: 4 },
      { width: 30, thickness: 5 },
      { width: 30, thickness: 6 },
      { width: 40, thickness: 4 },
      { width: 40, thickness: 5 },
      { width: 40, thickness: 6 },
      { width: 40, thickness: 8 },
      { width: 50, thickness: 5 },
      { width: 50, thickness: 6 },
      { width: 50, thickness: 8 },
      { width: 50, thickness: 10 },
      { width: 60, thickness: 6 },
      { width: 60, thickness: 8 },
      { width: 60, thickness: 10 },
      { width: 80, thickness: 8 },
      { width: 80, thickness: 10 },
    ],
    ranges: [lengthBar],
    tolerance: 'bara',
    unitLabel: 'buc',
    images: img('flat_bar', 'Pachete de bare late (platbandă) în depozit', 'Stive de platbandă în hala de depozitare'),
  },
  {
    id: 'square_bar',
    slug: 'bara-patrata',
    name: 'Bară pătrată',
    short: 'Bară plină pătrată',
    description:
      'Bare pline cu secțiune pătrată, debitate la lungime. În aluminiu, cupru sau alamă – pentru piese prelucrate mecanic, chei, axe și elemente de fixare.',
    keywords: ['bara', 'bară', 'patrata', 'pătrată', 'plina', 'plină', 'square', 'bar'],
    category: 'bara',
    materials: CU_BRASS_AL,
    fields: [F.side],
    variants: [{ side: 10 }, { side: 15 }, { side: 20 }, { side: 25 }, { side: 30 }, { side: 40 }, { side: 50 }, { side: 60 }],
    ranges: [lengthBar],
    tolerance: 'bara',
    unitLabel: 'buc',
    images: img('square_bar', 'Bare pline pătrate stivuite – detaliu', 'Stive de bare metalice în hala de depozitare'),
  },
  {
    id: 'hex_bar',
    slug: 'bara-hexagonala',
    name: 'Bară hexagonală',
    short: 'Bară plină hexagonală',
    description:
      'Bare hexagonale pline (specificate prin deschiderea de cheie), debitate la lungime. În aluminiu, cupru sau alamă – ideale pentru piulițe, fitinguri și piese strunjite.',
    keywords: ['bara', 'bară', 'hexagonala', 'hexagonală', 'hex', 'sw', 'plină'],
    category: 'bara',
    materials: CU_BRASS_AL,
    fields: [F.sw],
    variants: [{ side: 10 }, { side: 15 }, { side: 20 }, { side: 25 }, { side: 30 }, { side: 40 }, { side: 50 }],
    ranges: [lengthBar],
    tolerance: 'bara',
    unitLabel: 'buc',
    images: img('hex_bar', 'Bare hexagonale și rotunde pe rafturi – detaliu', 'Rafturi cu bare hexagonale, rotunde și late'),
  },
  {
    id: 'round_bar',
    slug: 'bara-rotunda',
    name: 'Bară rotundă',
    short: 'Bară plină rotundă',
    description:
      'Bare rotunde pline debitate la lungime. Disponibile în aluminiu, cupru, alamă și bronz – pentru axe, bolțuri, bucșe și piese strunjite.',
    keywords: ['bara', 'bară', 'rotunda', 'rotundă', 'rund', 'round', 'ax', 'plină', 'bronz'],
    category: 'bara',
    materials: ['AL', 'CU', 'BRASS', 'BRONZE'],
    fields: [F.d],
    variants: [
      { outer_diameter: 8 },
      { outer_diameter: 10 },
      { outer_diameter: 12 },
      { outer_diameter: 15 },
      { outer_diameter: 20 },
      { outer_diameter: 25 },
      { outer_diameter: 30 },
      { outer_diameter: 40 },
      { outer_diameter: 50 },
      { outer_diameter: 60 },
    ],
    ranges: [lengthBar],
    tolerance: 'bara',
    unitLabel: 'buc',
    images: img('round_bar', 'Bare rotunde din aluminiu – detaliu', 'Rafturi cu bare rotunde în depozit'),
  },
  {
    id: 'coil',
    slug: 'banda-rulou',
    name: 'Bandă rulou',
    short: 'Bandă rulou, livrată la metraj',
    description:
      'Bandă din aluminiu în rulou, cu grosimi de 0,5–2 mm, livrată la metraj. Pentru acoperișuri, tinichigerie, ambalaje industriale și placări.',
    keywords: ['banda', 'bandă', 'rulou', 'coil', 'metraj', 'rola', 'rolă'],
    category: 'rulou',
    materials: ['AL'],
    fields: [F.width, F.thickness],
    variants: [
      { width: 500, thickness: 0.5 },
      { width: 500, thickness: 0.7 },
      { width: 500, thickness: 0.8 },
      { width: 500, thickness: 1 },
      { width: 500, thickness: 1.5 },
      { width: 500, thickness: 2 },
      { width: 1000, thickness: 0.5 },
      { width: 1000, thickness: 0.7 },
      { width: 1000, thickness: 0.8 },
      { width: 1000, thickness: 1 },
      { width: 1000, thickness: 1.5 },
      { width: 1000, thickness: 2 },
      { width: 1250, thickness: 0.5 },
      { width: 1250, thickness: 0.7 },
      { width: 1250, thickness: 0.8 },
      { width: 1250, thickness: 1 },
      { width: 1250, thickness: 1.5 },
      { width: 1250, thickness: 2 },
    ],
    ranges: [lengthCoil],
    tolerance: 'placa',
    unitLabel: 'buc',
    images: img('coil', 'Rulou de bandă metalică – detaliu', 'Rulouri de bandă metalică în depozit'),
  },
];

export const SHAPE_BY_SLUG = Object.fromEntries(SHAPES.map((s) => [s.slug, s])) as Record<string, Shape>;
export const SHAPE_BY_ID = Object.fromEntries(SHAPES.map((s) => [s.id, s])) as Record<ShapeId, Shape>;

export const CATEGORIES: { id: ShapeCategory; label: string }[] = [
  { id: 'placa', label: 'Plăci și table' },
  { id: 'profil', label: 'Profile' },
  { id: 'teava', label: 'Țevi' },
  { id: 'bara', label: 'Bare' },
  { id: 'rulou', label: 'Bandă rulou' },
];

export const TOLERANCES: Record<ToleranceGroup, { value: string; title: string; text: string }> = {
  profil: {
    value: '-0 / +3 mm',
    title: 'Toleranță la lungime pentru profile și țevi: -0 / +3 mm',
    text: 'Debitarea se face cu adaos pozitiv: piesa nu este niciodată mai scurtă decât lungimea comandată, dar poate fi cu până la 3 mm mai lungă.',
  },
  bara: {
    value: '-0 / +5 mm',
    title: 'Toleranță la lungime pentru bare: -0 / +5 mm',
    text: 'Barele late și rotunde se debitează cu adaos pozitiv: lungimea livrată este cel puțin cea comandată și cel mult cu 5 mm mai mare.',
  },
  placa: {
    value: '-0 / +3 mm',
    title: 'Toleranță la debitare: -0 / +3 mm pe fiecare dimensiune',
    text: 'Dimensiunile comandate reprezintă minimul garantat; adaosul de debitare este de cel mult 3 mm.',
  },
};
