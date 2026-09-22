import { useState } from 'react';
import type { Shape } from '@/data/shapes';
import { asset, cls } from '@/lib/format';

/**
 * Galerie produs: fotografie de detaliu, fotografie de context și ilustrația tehnică oficială.
 * Fotografiile aparțin formei de produs – nu se schimbă cu dimensiunile selectate.
 */
export function ProductGallery({ shape, compact }: { shape: Shape; compact?: boolean }) {
  const slides = [
    { src: shape.images.close, alt: shape.images.closeAlt, label: 'Detaliu', contain: false },
    { src: shape.images.context, alt: shape.images.contextAlt, label: 'Context', contain: false },
    { src: shape.images.tech, alt: `Ilustrație tehnică – ${shape.name}`, label: 'Desen tehnic', contain: true },
  ];
  const [idx, setIdx] = useState(0);
  const cur = slides[idx];
  return (
    <div>
      <div className={cls('overflow-hidden rounded-xl border border-line bg-surface', compact ? 'aspect-[16/10]' : 'aspect-[4/3]')}>
        <img key={cur.src} src={asset(cur.src)} alt={cur.alt} className={cls('h-full w-full', cur.contain ? 'bg-white object-contain p-6' : 'object-cover')} />
      </div>
      <div className="mt-3 grid grid-cols-3 gap-2">
        {slides.map((s, i) => (
          <button
            key={s.src}
            type="button"
            onClick={() => setIdx(i)}
            aria-pressed={i === idx}
            className={cls('overflow-hidden rounded-lg border bg-surface text-left transition', i === idx ? 'border-brand-gold ring-2 ring-brand-gold/30' : 'border-line hover:border-ink/40')}
          >
            <img src={asset(s.src)} alt="" className={cls('aspect-[4/3] w-full', s.contain ? 'bg-white object-contain p-2' : 'object-cover')} loading="lazy" />
            <span className="block px-2 py-1 text-[11px] font-medium text-muted">{s.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
