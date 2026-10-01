/**
 * Fotografiile de produs – fotografii proprii Color Metal, preluate din catalogul oficial
 * (https://color-metal.ro/ro/produse/industriale). Vezi `tools/fetch-product-photos.mjs`.
 *
 * Fotografiile urmează materialul ales, iar la tablă suprafața aleasă (lisă, stucco, striată).
 */
import type { ShapeId } from './shapes';
import type { MaterialId, SurfaceId } from './materials';

export interface ProductPhoto {
  /** numele fișierului din public/assets/products (fără extensie) */
  file: string;
  alt: string;
}

const p = (file: string, alt: string): ProductPhoto => ({ file, alt });

/** Fotografiile implicite (aluminiu). */
const DEFAULT_PHOTOS: Record<ShapeId, ProductPhoto[]> = {
  thick_plate: [p('placa-groasa-al', 'Plăci groase din aluminiu'), p('placa-groasa-turnat', 'Placă din aluminiu turnat')],
  sheet: [p('tabla-lisa', 'Tablă lisă din aluminiu')],
  profile_u: [p('profil-u', 'Profile U din aluminiu'), p('profile-speciale', 'Profile speciale din aluminiu')],
  profile_l: [p('profil-l', 'Profile L din aluminiu'), p('profile-speciale', 'Profile speciale din aluminiu')],
  profile_t: [p('profil-t', 'Profile T din aluminiu'), p('profile-speciale', 'Profile speciale din aluminiu')],
  rect_tube: [p('teava-rect-al', 'Țevi rectangulare din aluminiu')],
  square_tube: [p('teava-patrat-al', 'Țevi pătrate din aluminiu')],
  round_tube: [p('teava-rotund-al', 'Țevi rotunde din aluminiu')],
  flat_bar: [p('bare-al', 'Bare din aluminiu')],
  square_bar: [p('bare-al', 'Bare din aluminiu')],
  round_bar: [p('bare-al', 'Bare din aluminiu')],
};

/** Fotografii pentru celelalte materiale. */
const BY_MATERIAL: Partial<Record<ShapeId, Partial<Record<MaterialId, ProductPhoto[]>>>> = {
  thick_plate: {
    CU: [p('placa-groasa-cu', 'Plăci din cupru')],
    BRASS: [p('placa-groasa-brass', 'Plăci din alamă')],
  },
  sheet: {
    CU: [p('tabla-cu', 'Tablă din cupru')],
    BRASS: [p('tabla-brass', 'Tablă din alamă')],
  },
  flat_bar: {
    CU: [p('bara-lata-cu', 'Bare rectangulare din cupru')],
    BRASS: [p('bara-lata-brass', 'Bare rectangulare din alamă')],
  },
  square_bar: {
    CU: [p('bara-patrata-cu', 'Bare pătrate din cupru')],
    BRASS: [p('bara-patrata-brass', 'Bare pătrate din alamă')],
  },
  round_bar: {
    CU: [p('bara-rotunda-cu', 'Bare rotunde din cupru')],
    BRASS: [p('bara-rotunda-brass', 'Bare rotunde din alamă')],
    BRONZE: [p('bara-rotunda-bronze', 'Bare din bronz')],
  },
};

/** La tablă (aluminiu), fotografia urmează suprafața aleasă. */
const SHEET_BY_SURFACE: Record<SurfaceId, ProductPhoto> = {
  lisa: p('tabla-lisa', 'Tablă lisă din aluminiu'),
  stucco: p('tabla-stucco', 'Tablă stucco din aluminiu'),
  'striata-diamond': p('tabla-diamond', 'Tablă striată Diamond din aluminiu'),
  'striata-quintet': p('tabla-quintet', 'Tablă striată Quintet din aluminiu'),
};

/** Fotografiile potrivite pentru combinația aleasă. */
export function productPhotos(shapeId: ShapeId, material?: MaterialId, surface?: SurfaceId): ProductPhoto[] {
  if (shapeId === 'sheet' && (!material || material === 'AL')) return [SHEET_BY_SURFACE[surface ?? 'lisa']];
  if (material) {
    const forMaterial = BY_MATERIAL[shapeId]?.[material];
    if (forMaterial) return forMaterial;
  }
  return DEFAULT_PHOTOS[shapeId] ?? [];
}

export const photoUrl = (file: string, small?: boolean) => `/assets/products/${file}${small ? '-sm' : ''}.jpg`;
