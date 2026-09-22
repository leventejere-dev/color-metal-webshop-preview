import type { Shape, ShapeId } from '@/data/shapes';

export type Dims = Record<string, number>;

/**
 * Aria secțiunii transversale (mm²) pentru fiecare formă.
 * Formulele sunt aliniate cu calculatorul oficial de greutate Color Metal
 * (excepție: bara hexagonală, unde folosim deschiderea de cheie SW – standardul comercial).
 */
export function sectionArea(shapeId: ShapeId, d: Dims): number {
  const w = d.width ?? 0;
  const h = d.height ?? 0;
  const t = d.thickness ?? 0;
  const a = d.side ?? 0;
  const D = d.outer_diameter ?? 0;
  switch (shapeId) {
    case 'thick_plate':
    case 'sheet':
    case 'coil':
    case 'flat_bar':
      return w * t;
    case 'profile_u':
      return w * t + 2 * (h - t) * t;
    case 'profile_l':
      return (w + h - t) * t;
    case 'profile_t':
      return w * t + (h - t) * t;
    case 'rect_tube':
      return w * h - (w - 2 * t) * (h - 2 * t);
    case 'square_tube':
      return a * a - (a - 2 * t) * (a - 2 * t);
    case 'round_tube':
      return (Math.PI / 4) * (D * D - (D - 2 * t) * (D - 2 * t));
    case 'square_bar':
      return a * a;
    case 'hex_bar':
      return (Math.sqrt(3) / 2) * a * a; // a = SW (deschidere cheie)
    case 'round_bar':
      return (Math.PI / 4) * D * D;
    default:
      return 0;
  }
}

/** Greutatea unei piese (kg): aria [mm²] × lungime [mm] × densitate [kg/dm³] / 1e6 */
export function pieceWeightKg(shapeId: ShapeId, dims: Dims, lengthMm: number, density: number): number {
  const area = sectionArea(shapeId, dims);
  return (area * lengthMm * density) / 1_000_000;
}

/** Etichetă compactă a dimensiunilor, ex. "40 × 20 × 2 mm, L 1000 mm" */
export function dimsLabel(shape: Shape, dims: Dims, ranges: Partial<Record<'length', number>>): string {
  const parts: string[] = [];
  if (shape.id === 'thick_plate' || shape.id === 'sheet') {
    parts.push(`${fmtNum(dims.width ?? 0)} × ${fmtNum(ranges.length ?? 0)} × ${fmtNum(dims.thickness ?? 0)} mm`);
    return parts.join(', ');
  }
  const section = shape.fields.map((f) => fmtNum(dims[f.key] ?? 0)).join(' × ');
  const prefix = shape.id === 'round_tube' ? 'Ø' : shape.id === 'round_bar' ? 'Ø' : shape.id === 'hex_bar' ? 'SW ' : '';
  parts.push(`${prefix}${section} mm`);
  if (ranges.length != null) parts.push(`L ${fmtNum(ranges.length)} mm`);
  return parts.join(', ');
}

export function fmtNum(n: number): string {
  return new Intl.NumberFormat('ro-RO', { maximumFractionDigits: 2 }).format(n);
}
