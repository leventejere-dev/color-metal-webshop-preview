import { useState, type ReactNode } from 'react';
import type { Shape } from '@/data/shapes';
import type { EloxColorId, MaterialId, SurfaceId } from '@/data/materials';
import { photoUrl, productPhotos } from '@/data/photos';
import { asset, cls } from '@/lib/format';
import { TechDrawing } from './TechDrawing';

/**
 * Previzualizarea produsului: desenul tehnic și fotografiile de produs Color Metal.
 * Miniaturile sunt interactive – clic pe ele schimbă imaginea mare.
 *
 * `material` / `elox` / `surface` = desenul ia culoarea materialului, respectiv a eloxării,
 * iar fotografiile urmează materialul și suprafața aleasă; `dims` = desenul cu notații (b, d, g, l).
 */
export function ProductPreview({
  shape,
  material,
  elox,
  surface,
  dims,
  title,
  subtitle,
  gallery,
  children,
}: {
  shape: Shape;
  material?: MaterialId;
  elox?: EloxColorId;
  surface?: SurfaceId;
  dims?: boolean;
  title?: string;
  subtitle?: string;
  gallery?: boolean;
  children?: ReactNode;
}) {
  const photos = gallery ? productPhotos(shape.id, material, surface) : [];
  const [view, setView] = useState(0); // 0 = desenul tehnic, 1..n = fotografii
  const photo = view > 0 ? photos[view - 1] : undefined;
  const thumb = 'flex h-12 w-16 shrink-0 items-center justify-center overflow-hidden rounded-md border bg-surface transition';
  const active = 'border-brand-gold ring-1 ring-brand-gold/40';
  const idle = 'border-line hover:border-ink/40';

  return (
    <div className="card p-4">
      <div className="flex h-44 items-center justify-center overflow-hidden rounded-xl bg-surface sm:h-52">
        {photo ? (
          <img src={asset(photoUrl(photo.file))} alt={photo.alt} className="h-full w-full object-cover" width={1200} height={900} />
        ) : (
          <span className="flex h-full w-full items-center justify-center p-4">
            <TechDrawing shape={shape} material={material} elox={elox} dims={dims} />
          </span>
        )}
      </div>

      {photos.length > 0 && (
        <div className="mt-2 flex items-center gap-2">
          <button type="button" onClick={() => setView(0)} aria-pressed={view === 0} title="Desen tehnic" className={cls(thumb, 'p-1', view === 0 ? active : idle)}>
            <TechDrawing shape={shape} material={material} elox={elox} dims={dims} />
          </button>
          {photos.map((ph, i) => (
            <button key={ph.file} type="button" onClick={() => setView(i + 1)} aria-pressed={view === i + 1} title={ph.alt} className={cls(thumb, view === i + 1 ? active : idle)}>
              <img src={asset(photoUrl(ph.file, true))} alt="" className="h-full w-full object-cover" width={360} height={270} loading="lazy" />
            </button>
          ))}
          <span className="ml-1 text-[11px] leading-tight text-muted">Fotografii Color Metal</span>
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
