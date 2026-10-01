export type MaterialId = 'AL' | 'CU' | 'BRASS' | 'BRONZE';
export type FinishId = 'natur' | 'eloxat';
/** La tablă, în locul finisajului natur/eloxat se alege suprafața. */
export type SurfaceId = 'lisa' | 'stucco' | 'striata-diamond' | 'striata-quintet';
export type EloxColorId = 'natur' | 'negru' | 'bronz';

export interface Material {
  id: MaterialId;
  label: string;
  density: number; // kg/dm³
  basePriceEurPerKg: number; // preț de bază demo (EUR/kg), fără adaos
  swatch: string;
  description: string;
  /** Finisaje disponibile. Pentru cupru/alamă/bronz nu se oferă tratament de suprafață. */
  finishes: FinishId[];
}

export const MATERIALS: Record<MaterialId, Material> = {
  AL: {
    id: 'AL',
    label: 'Aluminiu',
    density: 2.7,
    basePriceEurPerKg: 4.5,
    swatch: '#c9cbcf',
    description:
      'Ușor, rezistent la coroziune, ușor de prelucrat. Potrivit pentru construcții metalice, publicitate și industrie.',
    finishes: ['natur', 'eloxat'],
  },
  CU: {
    id: 'CU',
    label: 'Cupru',
    density: 8.96,
    basePriceEurPerKg: 9.5,
    swatch: '#b87333',
    description:
      'Conductivitate electrică și termică excelentă. Utilizat în instalații, electrotehnică și aplicații decorative.',
    finishes: [],
  },
  BRASS: {
    id: 'BRASS',
    label: 'Alamă',
    density: 8.5,
    basePriceEurPerKg: 7.6,
    swatch: '#c9ae5d',
    description:
      'Aliaj cupru–zinc cu prelucrabilitate foarte bună. Pentru piese strunjite, fitinguri și elemente decorative.',
    finishes: [],
  },
  BRONZE: {
    id: 'BRONZE',
    label: 'Bronz',
    density: 8.8,
    basePriceEurPerKg: 8.4,
    swatch: '#8c7853',
    description:
      'Aliaj cupru–staniu cu rezistență ridicată la uzură. Pentru bucșe, lagăre și piese solicitate mecanic.',
    finishes: [],
  },
};

export const MATERIAL_ORDER: MaterialId[] = ['AL', 'CU', 'BRASS', 'BRONZE'];

export const FINISHES: Record<FinishId, { label: string; description: string }> = {
  natur: { label: 'Natur', description: 'Suprafață naturală, fără tratament' },
  eloxat: { label: 'Eloxat', description: 'Strat de oxid protector, aspect uniform' },
};

export const ELOX_COLORS: { id: EloxColorId; label: string; swatch: string }[] = [
  { id: 'natur', label: 'Natur (argintiu)', swatch: '#d8d8d8' },
  { id: 'negru', label: 'Negru', swatch: '#202020' },
  { id: 'bronz', label: 'Bronz', swatch: '#8a5a44' },
];

/**
 * Suprafețele tablei. Modelele în relief (stucco, striată) se execută doar pe aluminiu;
 * tabla de cupru și de alamă este lisă.
 */
export const SURFACES: { id: SurfaceId; label: string; note: string; alOnly?: boolean }[] = [
  { id: 'lisa', label: 'Lisă', note: 'Suprafață netedă, laminată – pentru confecții metalice, placări și prelucrări.' },
  { id: 'stucco', label: 'Stucco', note: 'Relief fin, mat – ascunde urmele și zgârieturile; izolații și placări.', alOnly: true },
  { id: 'striata-diamond', label: 'Striată Diamond', note: 'Model romb, antiderapant – podele, trepte și platforme.', alOnly: true },
  { id: 'striata-quintet', label: 'Striată Quintet', note: 'Model cu cinci bare, antiderapant – rampe și podele industriale.', alOnly: true },
];

export const SURFACE_BY_ID = Object.fromEntries(SURFACES.map((s) => [s.id, s])) as Record<SurfaceId, (typeof SURFACES)[number]>;
