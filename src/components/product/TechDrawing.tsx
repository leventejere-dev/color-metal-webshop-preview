import type { Shape } from '@/data/shapes';
import type { MaterialId } from '@/data/materials';
import { asset, cls } from '@/lib/format';

const MATERIAL_FILE: Record<MaterialId, string> = { AL: '', CU: '--cu', BRASS: '--brass', BRONZE: '--bronze' };

/**
 * Desenul tehnic al formei – SVG vectorial, redesenat după ilustrațiile calculatorului oficial
 * de greutate Color Metal. Vezi `tools/generate-tech-drawings.mjs`.
 *
 * `material` colorează piesa în culoarea materialului ales (aluminiu = gri metalic).
 * `dims` afișează cotele și literele (b, d, g, l/L) – doar la pasul de alegere a dimensiunilor,
 * unde notațiile chiar ajută; în rest desenul rămâne curat.
 */
export function TechDrawing({ shape, material, dims, className }: { shape: Shape; material?: MaterialId; dims?: boolean; className?: string }) {
  const tint = material && shape.materials.includes(material) ? MATERIAL_FILE[material] : '';
  const src = asset(`/assets/tech/${shape.id}${tint}${dims ? '--dim' : ''}.svg`);
  return (
    <img
      src={src}
      alt={dims ? `${shape.name} – desen tehnic cu notațiile dimensiunilor` : `${shape.name} – desen tehnic`}
      className={cls('h-full w-auto max-w-full object-contain', className)}
      draggable={false}
    />
  );
}
