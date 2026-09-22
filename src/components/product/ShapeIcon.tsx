import type { ShapeId } from '@/data/shapes';
import type { MaterialId } from '@/data/materials';
import { cls } from '@/lib/format';

/**
 * Desenele 2D simple ale formelor – portare fidelă a componentei `ShapeIcon` din webshopul actual
 * (aceeași geometrie, aceleași culori: fundal #F4F4F4, contur #4B4B4B, umplere după material).
 * `dims` face desenul să urmărească dimensiunile selectate (previzualizare live în configurator).
 */
const MATERIAL_FILL: Record<string, string> = { CU: '#B87333', BRASS: '#C6A664', BRONZE: '#8A5A44' };
const STROKE = '#4B4B4B';
const BG = '#F4F4F4';

const num = (v: unknown, fallback: number) => {
  const n = Number(v);
  return Number.isFinite(n) && n > 0 ? n : fallback;
};

export interface ShapeIconProps {
  type: ShapeId;
  dims?: Record<string, number | undefined>;
  material?: MaterialId;
  large?: boolean;
  className?: string;
  label?: string;
}

export function ShapeIcon({ type, dims = {}, material = 'AL', large, className, label }: ShapeIconProps) {
  const fill = MATERIAL_FILL[material] ?? '#D7D7D7';
  const sw = large ? 10 : 8; // grosimea liniei la profile
  const w = num(dims.width ?? dims.side ?? dims.outer_diameter, 70);
  const h = num(dims.height ?? dims.side ?? dims.outer_diameter, 45);
  const t = Math.max(3, num(dims.thickness, 6));
  const L = Math.min(120, Math.max(45, w));
  const R = Math.min(90, Math.max(28, h));

  let body: React.ReactNode;
  switch (type) {
    case 'coil':
      body = (
        <g transform="translate(30 28)">
          <circle cx={38} cy={38} r={32} fill={fill} stroke={STROKE} strokeWidth={3} />
          <circle cx={38} cy={38} r={17} fill={BG} />
          <path d="M64 55 H120" stroke={fill} strokeWidth={18} strokeLinecap="square" />
          <path d="M64 66 H126" stroke={STROKE} strokeWidth={3} />
        </g>
      );
      break;
    case 'sheet':
      body = <rect x={35} y={61} width={110} height={Math.max(6, t * 2)} fill={fill} stroke={STROKE} strokeWidth={3} />;
      break;
    case 'thick_plate':
      body = <rect x={42} y={55} width={96} height={Math.max(16, t * 2)} fill={fill} stroke={STROKE} strokeWidth={3} />;
      break;
    case 'flat_bar':
      body = <rect x={38} y={52} width={104} height={28} fill={fill} stroke={STROKE} strokeWidth={3} />;
      break;
    case 'square_bar':
      body = <rect x={58} y={33} width={66} height={66} fill={fill} stroke={STROKE} strokeWidth={3} />;
      break;
    case 'round_bar':
      body = <circle cx={90} cy={65} r={38} fill={fill} stroke={STROKE} strokeWidth={3} />;
      break;
    case 'hex_bar':
      body = <polygon points="90,25 124,45 124,85 90,105 56,85 56,45" fill={fill} stroke={STROKE} strokeWidth={3} />;
      break;
    case 'rect_tube':
      body = (
        <g>
          <rect x={(180 - L) / 2} y={(130 - R) / 2} width={L} height={R} fill={fill} stroke={STROKE} strokeWidth={3} />
          <rect x={(180 - L) / 2 + t * 1.2} y={(130 - R) / 2 + t * 1.2} width={Math.max(10, L - t * 2.4)} height={Math.max(10, R - t * 2.4)} fill={BG} stroke={STROKE} strokeWidth={2} />
        </g>
      );
      break;
    case 'square_tube':
      body = (
        <g>
          <rect x={48} y={25} width={84} height={84} fill={fill} stroke={STROKE} strokeWidth={3} />
          <rect x={48 + t * 1.5} y={25 + t * 1.5} width={Math.max(20, 84 - t * 3)} height={Math.max(20, 84 - t * 3)} fill={BG} stroke={STROKE} strokeWidth={2} />
        </g>
      );
      break;
    case 'round_tube':
      body = (
        <g>
          <circle cx={90} cy={65} r={42} fill={fill} stroke={STROKE} strokeWidth={3} />
          <circle cx={90} cy={65} r={Math.max(16, 42 - t * 2)} fill={BG} stroke={STROKE} strokeWidth={2} />
        </g>
      );
      break;
    case 'profile_l':
      body = <path d="M55 30 V88 H132" fill="none" stroke={fill} strokeWidth={sw} strokeLinecap="square" strokeLinejoin="miter" />;
      break;
    case 'profile_t':
      body = <path d="M45 35 H135 M90 35 V100" fill="none" stroke={fill} strokeWidth={sw} strokeLinecap="square" />;
      break;
    case 'profile_u':
      body = <path d="M45 28 V95 H135 V28" fill="none" stroke={fill} strokeWidth={sw} strokeLinecap="square" strokeLinejoin="miter" />;
      break;
  }

  return (
    <svg viewBox="0 0 180 130" className={cls(large ? 'mx-auto h-auto w-full' : 'mx-auto h-20 w-28', className)} role="img" aria-label={label ?? `Desen ${type}`}>
      <rect x={0} y={0} width={180} height={130} rx={18} fill={BG} />
      {body}
    </svg>
  );
}
