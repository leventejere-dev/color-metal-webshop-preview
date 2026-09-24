import type { Shape } from '@/data/shapes';
import { asset, cls } from '@/lib/format';

/**
 * Desenul tehnic al formei (ghid pentru alegerea dimensiunilor) – SVG vectorial, redesenat
 * după ilustrațiile calculatorului oficial de greutate Color Metal, cu aceleași notații
 * (b, d, g, l/L). Vezi `tools/generate-tech-drawings.mjs`.
 */
export function TechDrawing({ shape, className, priority }: { shape: Shape; className?: string; priority?: boolean }) {
  return (
    <img
      src={asset(shape.images.guide)}
      alt={`${shape.name} – desen tehnic cu notațiile dimensiunilor`}
      className={cls('h-full w-full object-contain', className)}
      loading={priority ? 'eager' : 'lazy'}
      width={1300}
      height={600}
      draggable={false}
    />
  );
}
