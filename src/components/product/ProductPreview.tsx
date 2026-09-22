import { useState, type ReactNode } from 'react';
import { Camera } from 'lucide-react';
import type { Shape } from '@/data/shapes';
import type { MaterialId } from '@/data/materials';
import { asset, cls } from '@/lib/format';
import { ShapeIcon } from './ShapeIcon';

/**
 * Previzualizarea produsului (coloana din dreapta, ca în webshopul actual): desenul 2D al formei,
 * iar sub el miniaturi mici – desenul, ghidul de dimensiuni (ilustrația oficială a calculatorului
 * de greutate) și două casete-substituent gri pentru fotografiile de produs.
 */
export function ProductPreview({ shape, material = 'AL', dims, title, subtitle, children }: { shape: Shape; material?: MaterialId; dims?: Record<string, number | undefined>; title?: string; subtitle?: string; children?: ReactNode }) {
  const [view, setView] = useState<'desen' | 'ghid'>('desen');
  const thumb = 'flex aspect-[4/3] items-center justify-center overflow-hidden rounded-md border bg-surface transition';
  return (
    <div className="card p-4">
      <div className="flex aspect-[4/3] items-center justify-center overflow-hidden rounded-xl bg-surface p-3">
        {view === 'desen' ? (
          <ShapeIcon type={shape.id} material={material} dims={dims} large className="max-h-full w-auto max-w-full" label={shape.name} />
        ) : (
          <img src={asset(shape.images.guide)} alt={`Ghid pentru alegerea dimensiunilor – ${shape.name}`} className="max-h-full w-full bg-white object-contain" />
        )}
      </div>

      <div className="mt-2 grid grid-cols-4 gap-1.5">
        <button type="button" onClick={() => setView('desen')} aria-pressed={view === 'desen'} title="Desen" className={cls(thumb, view === 'desen' ? 'border-brand-gold ring-1 ring-brand-gold/40' : 'border-line hover:border-ink/40')}>
          <ShapeIcon type={shape.id} material={material} className="!h-full !w-full" />
        </button>
        <button type="button" onClick={() => setView('ghid')} aria-pressed={view === 'ghid'} title="Ghid pentru alegerea dimensiunilor" className={cls(thumb, 'bg-white', view === 'ghid' ? 'border-brand-gold ring-1 ring-brand-gold/40' : 'border-line hover:border-ink/40')}>
          <img src={asset(shape.images.guide)} alt="" className="h-full w-full object-contain p-1" loading="lazy" />
        </button>
        {[0, 1].map((i) => (
          <div key={i} className={cls(thumb, 'border-dashed border-line bg-surface-2 text-muted/60')} title="Fotografie produs – în curând" aria-hidden="true">
            <Camera className="h-4 w-4" />
          </div>
        ))}
      </div>
      <p className="mt-1.5 text-center text-[11px] text-muted">{view === 'desen' ? 'Desen' : 'Ghid pentru alegerea dimensiunilor'}</p>

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
