import type { RangeSpec, Shape } from '@/data/shapes';

export type Selection = Record<string, number | undefined>;
export type RangeValues = Partial<Record<'length', number | null>>;

/** Plăcile și tablele se debitează din formate de stoc (lățime × lungime); lungimea maximă depinde de format. */
export const isPlate = (shape: Shape) => shape.id === 'thick_plate' || shape.id === 'sheet';

/** Toate valorile distincte ale unui câmp (sortate crescător). */
export function fieldValues(shape: Shape, key: string): number[] {
  return Array.from(new Set(shape.variants.map((v) => v[key]).filter((x): x is number => x != null))).sort((a, b) => a - b);
}

/**
 * O valoare este disponibilă dacă există cel puțin o combinație reală care o conține
 * ȘI respectă toate celelalte selecții curente (la plăci: și lungimea aleasă ≤ formatul de stoc).
 */
export function isAvailable(shape: Shape, key: string, value: number, sel: Selection, ranges: RangeValues): boolean {
  return shape.variants.some((v) => {
    if (v[key] !== value) return false;
    for (const f of shape.fields) {
      if (f.key === key) continue;
      const s = sel[f.key];
      if (s != null && v[f.key] !== s) return false;
    }
    if (isPlate(shape) && ranges.length != null && v.height < ranges.length) return false;
    return true;
  });
}

/** Limitele lungimii, în funcție de selecțiile discrete (la plăci: formatul de stoc). */
export function rangeBounds(shape: Shape, spec: RangeSpec, sel: Selection): { min: number; max: number } {
  if (!isPlate(shape)) return { min: spec.min, max: spec.max };
  const matching = shape.variants.filter((v) => shape.fields.every((f) => sel[f.key] == null || v[f.key] === sel[f.key]));
  const pool = matching.length ? matching : shape.variants;
  const max = Math.max(...pool.map((v) => v.height));
  return { min: spec.min, max: Math.min(spec.max, max) };
}

export function isComplete(shape: Shape, sel: Selection, ranges: RangeValues): boolean {
  return shape.fields.every((f) => sel[f.key] != null) && shape.ranges.every((r) => ranges[r.key] != null);
}

/** Dimensiunile de secțiune selectate (folosite la calculul greutății). */
export function effectiveDims(shape: Shape, sel: Selection): Record<string, number> {
  const d: Record<string, number> = {};
  for (const f of shape.fields) if (sel[f.key] != null) d[f.key] = sel[f.key] as number;
  return d;
}
