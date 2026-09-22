import type { Shape } from '@/data/shapes';
import type { Dims } from '@/lib/geometry';
import { n } from '@/lib/format';

/**
 * Previzualizare tehnică live: secțiunea transversală desenată din dimensiunile selectate.
 * Fără selecție se afișează o formă generică, cu linie întreruptă.
 */
export function TechPreview({ shape, dims, width, className }: { shape: Shape; dims: Dims; width?: number | null; className?: string }) {
  const complete = shape.fields.every((f) => dims[f.key] != null) && (shape.ranges.some((r) => r.key === 'width') ? width != null : true);
  const d = complete ? { ...dims, ...(width != null ? { width } : {}) } : placeholderDims(shape);
  const stroke = complete ? '#1a1a1a' : '#8e9095';
  const fill = complete ? '#e9e5da' : '#f3f3f1';
  const dash = complete ? undefined : '6 4';
  const S = 200; // zona de desen (px)

  let content: React.ReactNode = null;
  const w = d.width ?? 0, h = d.height ?? 0, t = d.thickness ?? 0, a = d.side ?? 0, D = d.outer_diameter ?? 0;
  const common = { stroke, strokeWidth: 2, fill, strokeDasharray: dash, strokeLinejoin: 'round' as const };

  switch (shape.id) {
    case 'thick_plate':
    case 'sheet':
    case 'coil':
    case 'flat_bar': {
      const ratio = Math.max(t / Math.max(w, 1), 0.06);
      const W = S, H = Math.max(10, Math.min(S * 0.6, S * ratio));
      content = <rect x={(S - W) / 2 + 100 - S / 2} y={100 - H / 2} width={W} height={H} rx={2} {...common} />;
      break;
    }
    case 'profile_u': {
      const k = S * 0.85 / Math.max(w, h);
      const W = w * k, H = h * k, T = Math.max(3, t * k);
      const x = 100 - W / 2, y = 100 - H / 2;
      const p = `M${x},${y} h${T} v${H - T} h${W - 2 * T} v${-(H - T)} h${T} v${H} h${-W} z`;
      content = <path d={p} {...common} />;
      break;
    }
    case 'profile_l': {
      const k = S * 0.85 / Math.max(w, h);
      const W = w * k, H = h * k, T = Math.max(3, t * k);
      const x = 100 - W / 2, y = 100 - H / 2;
      const p = `M${x},${y} h${T} v${H - T} h${W - T} v${T} h${-W} z`;
      content = <path d={p} {...common} />;
      break;
    }
    case 'profile_t': {
      const k = S * 0.85 / Math.max(w, h);
      const W = w * k, H = h * k, T = Math.max(3, t * k);
      const x = 100 - W / 2, y = 100 - H / 2;
      const p = `M${x},${y} h${W} v${T} h${-(W - T) / 2} v${H - T} h${-T} v${-(H - T)} h${-(W - T) / 2} z`;
      content = <path d={p} {...common} />;
      break;
    }
    case 'rect_tube': {
      const k = S * 0.85 / Math.max(w, h);
      const W = w * k, H = h * k, T = Math.max(3, t * k);
      content = (
        <g>
          <rect x={100 - W / 2} y={100 - H / 2} width={W} height={H} rx={3} {...common} />
          <rect x={100 - W / 2 + T} y={100 - H / 2 + T} width={W - 2 * T} height={H - 2 * T} rx={2} {...common} fill="#fff" />
        </g>
      );
      break;
    }
    case 'square_tube': {
      const W = S * 0.85, T = Math.max(3, (t / Math.max(a, 1)) * W);
      content = (
        <g>
          <rect x={100 - W / 2} y={100 - W / 2} width={W} height={W} rx={3} {...common} />
          <rect x={100 - W / 2 + T} y={100 - W / 2 + T} width={W - 2 * T} height={W - 2 * T} rx={2} {...common} fill="#fff" />
        </g>
      );
      break;
    }
    case 'round_tube': {
      const R = S * 0.42, T = Math.max(3, (t / Math.max(D, 1)) * 2 * R);
      content = (
        <g>
          <circle cx={100} cy={100} r={R} {...common} />
          <circle cx={100} cy={100} r={R - T} {...common} fill="#fff" />
        </g>
      );
      break;
    }
    case 'square_bar': {
      const W = S * 0.8;
      content = <rect x={100 - W / 2} y={100 - W / 2} width={W} height={W} rx={3} {...common} />;
      break;
    }
    case 'hex_bar': {
      const r = S * 0.45; // raza cercului circumscris
      const pts = Array.from({ length: 6 }, (_, i) => {
        const ang = (Math.PI / 3) * i;
        return `${100 + r * Math.cos(ang)},${100 + r * Math.sin(ang)}`;
      }).join(' ');
      content = <polygon points={pts} {...common} />;
      break;
    }
    case 'round_bar': {
      content = <circle cx={100} cy={100} r={S * 0.42} {...common} />;
      break;
    }
  }

  const caption = complete ? shape.fields.map((f) => `${f.symbol} = ${n(dims[f.key] ?? 0)} mm`).concat(width != null ? [`b = ${n(width)} mm`] : []).join(' · ') : 'Selectează dimensiunile pentru a actualiza secțiunea';

  return (
    <figure className={className}>
      <div className="flex items-center justify-center rounded-xl bg-surface p-4">
        <svg viewBox="0 0 200 200" className="h-44 w-44 sm:h-52 sm:w-52" role="img" aria-label={`Secțiune ${shape.name}`}>
          {content}
        </svg>
      </div>
      <figcaption className="mt-2 text-center text-xs text-muted">{caption}</figcaption>
    </figure>
  );
}

function placeholderDims(shape: Shape): Dims {
  switch (shape.id) {
    case 'thick_plate':
    case 'sheet':
    case 'coil':
    case 'flat_bar':
      return { width: 100, thickness: 10 };
    case 'profile_u':
    case 'profile_l':
    case 'profile_t':
    case 'rect_tube':
      return { width: 60, height: 40, thickness: 4 };
    case 'square_tube':
      return { side: 40, thickness: 3 };
    case 'round_tube':
      return { outer_diameter: 40, thickness: 3 };
    case 'square_bar':
    case 'hex_bar':
      return { side: 20 };
    case 'round_bar':
      return { outer_diameter: 20 };
  }
}
