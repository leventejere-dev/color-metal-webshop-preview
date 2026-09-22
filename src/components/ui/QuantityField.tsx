import { Minus, Plus } from 'lucide-react';
import { cls } from '@/lib/format';

export function QuantityField({
  value,
  onChange,
  min = 1,
  max = 999,
  size = 'md',
  label,
}: {
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
  size?: 'sm' | 'md';
  label?: string;
}) {
  const set = (v: number) => onChange(Math.max(min, Math.min(max, Math.round(v) || min)));
  const h = size === 'sm' ? 'h-9' : 'h-11';
  return (
    <div className={cls('inline-flex items-stretch overflow-hidden rounded-lg border border-line bg-white', h)} role="group" aria-label={label ?? 'Cantitate'}>
      <button type="button" onClick={() => set(value - 1)} disabled={value <= min} className="px-3 text-ink hover:bg-surface disabled:opacity-40" aria-label="Scade cantitatea">
        <Minus className="h-4 w-4" />
      </button>
      <input
        type="number"
        inputMode="numeric"
        min={min}
        max={max}
        value={value}
        onChange={(e) => set(Number(e.target.value))}
        onBlur={(e) => set(Number(e.target.value))}
        className="w-14 border-x border-line text-center text-sm font-semibold tabular-nums focus:outline-none"
        aria-label={label ?? 'Cantitate'}
      />
      <button type="button" onClick={() => set(value + 1)} disabled={value >= max} className="px-3 text-ink hover:bg-surface disabled:opacity-40" aria-label="Crește cantitatea">
        <Plus className="h-4 w-4" />
      </button>
    </div>
  );
}
