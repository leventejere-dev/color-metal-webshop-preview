import type { ReactNode } from 'react';
import { Camera } from 'lucide-react';
import type { Shape } from '@/data/shapes';
import { TechDrawing } from './TechDrawing';

/**
 * Previzualizarea produsului: desenul tehnic cu notațiile dimensiunilor și, pe pagina produsului,
 * două locuri rezervate pentru fotografiile de produs Color Metal.
 */
export function ProductPreview({ shape, title, subtitle, photoSlots, children }: { shape: Shape; title?: string; subtitle?: string; photoSlots?: boolean; children?: ReactNode }) {
  return (
    <div className="card p-4">
      <div className="flex h-44 items-center justify-center overflow-hidden rounded-xl bg-surface px-3 sm:h-52">
        <TechDrawing shape={shape} />
      </div>

      {photoSlots && (
        <>
          <div className="mt-2 grid grid-cols-2 gap-2">
            {[0, 1].map((i) => (
              <div
                key={i}
                className="flex aspect-[4/3] flex-col items-center justify-center gap-1 rounded-lg border border-dashed border-line bg-surface-2/60 text-muted"
                title="Loc rezervat pentru fotografia produsului"
              >
                <Camera className="h-5 w-5 opacity-60" />
                <span className="text-[11px] font-medium opacity-70">Fotografie produs</span>
              </div>
            ))}
          </div>
          <p className="mt-1.5 text-center text-[11px] text-muted">Fotografiile produsului se adaugă ulterior.</p>
        </>
      )}

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
