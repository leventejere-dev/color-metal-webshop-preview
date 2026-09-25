import { useState, type ReactNode } from 'react';
import { Camera } from 'lucide-react';
import type { Shape } from '@/data/shapes';
import type { EloxColorId, MaterialId } from '@/data/materials';
import { cls } from '@/lib/format';
import { TechDrawing } from './TechDrawing';

type View = 'desen' | 0 | 1;

/**
 * Previzualizarea produsului: desenul tehnic și, opțional, două locuri rezervate pentru
 * fotografiile de produs Color Metal. Miniaturile sunt interactive – clic pe ele schimbă
 * imaginea mare (simulează galeria de produs de mai târziu).
 *
 * `material` / `elox` = culoarea piesei urmează materialul, respectiv eloxarea aleasă;
 * `dims` = desenul cu notații (b, d, g, l).
 */
export function ProductPreview({ shape, material, elox, dims, title, subtitle, photoSlots, children }: { shape: Shape; material?: MaterialId; elox?: EloxColorId; dims?: boolean; title?: string; subtitle?: string; photoSlots?: boolean; children?: ReactNode }) {
  const [view, setView] = useState<View>('desen');
  const thumb = 'flex h-12 w-16 shrink-0 items-center justify-center overflow-hidden rounded-md border bg-surface transition';
  const active = 'border-brand-gold ring-1 ring-brand-gold/40';
  const idle = 'border-line hover:border-ink/40';

  return (
    <div className="card p-4">
      <div className="flex h-44 items-center justify-center overflow-hidden rounded-xl bg-surface p-4 sm:h-52">
        {view === 'desen' ? (
          <TechDrawing shape={shape} material={material} elox={elox} dims={dims} />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-line bg-surface-2/50 text-muted">
            <Camera className="h-7 w-7 opacity-60" />
            <p className="text-sm font-medium">Fotografie produs {view + 1}</p>
            <p className="text-[11px] opacity-80">Loc rezervat – aici va apărea fotografia Color Metal.</p>
          </div>
        )}
      </div>

      {photoSlots && (
        <div className="mt-2 flex items-center gap-2">
          <button type="button" onClick={() => setView('desen')} aria-pressed={view === 'desen'} title="Desen tehnic" className={cls(thumb, 'p-1', view === 'desen' ? active : idle)}>
            <TechDrawing shape={shape} material={material} elox={elox} dims={dims} />
          </button>
          {[0, 1].map((i) => (
            <button
              key={i}
              type="button"
              onClick={() => setView(i as View)}
              aria-pressed={view === i}
              title={`Fotografie produs ${i + 1} (loc rezervat)`}
              className={cls(thumb, 'border-dashed text-muted', view === i ? active : idle)}
            >
              <Camera className="h-4 w-4 opacity-60" />
            </button>
          ))}
          <span className="ml-1 text-[11px] leading-tight text-muted">Fotografiile produsului se adaugă ulterior.</span>
        </div>
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
