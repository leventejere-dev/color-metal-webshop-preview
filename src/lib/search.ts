import { CATEGORIES, SHAPES, type Shape } from '@/data/shapes';
import { MATERIALS } from '@/data/materials';

/** normalizare fără diacritice, pentru căutare tolerantă (ex. "teava" găsește "țeavă") */
export const norm = (s: string) =>
  s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/ș|ş/g, 's')
    .replace(/ț|ţ/g, 't')
    .trim();

function haystack(shape: Shape): string {
  const cat = CATEGORIES.find((c) => c.id === shape.category)?.label ?? '';
  const mats = shape.materials.map((m) => MATERIALS[m].label).join(' ');
  return norm([shape.name, shape.short, shape.description, shape.keywords.join(' '), cat, mats].join(' '));
}

/** Căutare după nume, formă, material și descriere. Rezultatele sunt ordonate după relevanță. */
export function searchShapes(query: string): Shape[] {
  const q = norm(query);
  if (!q) return [];
  const terms = q.split(/\s+/).filter(Boolean);
  const scored = SHAPES.map((shape) => {
    const name = norm(shape.name);
    const hay = haystack(shape);
    let score = 0;
    for (const t of terms) {
      if (name === t) score += 10;
      else if (name.startsWith(t)) score += 6;
      else if (name.includes(t)) score += 4;
      else if (hay.includes(t)) score += 1;
      else return { shape, score: -1 }; // toți termenii trebuie să se potrivească
    }
    return { shape, score };
  }).filter((r) => r.score >= 0);
  scored.sort((a, b) => b.score - a.score);
  return scored.map((r) => r.shape);
}
