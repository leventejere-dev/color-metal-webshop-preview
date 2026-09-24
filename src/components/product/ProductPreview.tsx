import type { ReactNode } from 'react';
import type { Shape } from '@/data/shapes';
import { TechDrawing } from './TechDrawing';

/** Previzualizarea produsului: desenul tehnic cu notațiile dimensiunilor. */
export function ProductPreview({ shape, title, subtitle, children }: { shape: Shape; title?: string; subtitle?: string; children?: ReactNode }) {
  return (
    <div className="card p-4">
      <div className="flex aspect-[13/6] items-center justify-center overflow-hidden rounded-xl bg-surface px-2">
        <TechDrawing shape={shape} priority />
      </div>
      {(title || subtitle) && (
        <div className="mt-3 border-t border-line pt-3 text-center">
          {title && <p className="font-semibold">{title}</p>}
          {subtitle && <p className="text-sm text-muted">{subtitle}</p>}
        </div>
      )}
      {children}
    </div>
  );
}
