import { useEffect, useId, useState } from 'react';
import { cls, n } from '@/lib/format';

export interface RangeFieldProps {
  label: string;
  unit?: string;
  value: number | null;
  min: number;
  max: number;
  step?: number;
  presets?: number[];
  hint?: string;
  notice?: string | null;
  disabled?: boolean;
  onChange: (value: number | null) => void;
}

const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));

/**
 * Slider + input numeric sincronizate. Valoarea `null` înseamnă "neselectat":
 * slider-ul stă la minim (stil estompat) și input-ul este gol.
 */
export function RangeField({ label, unit = 'mm', value, min, max, step = 1, presets = [], hint, notice, disabled, onChange }: RangeFieldProps) {
  const id = useId();
  const [text, setText] = useState(value == null ? '' : String(value));

  useEffect(() => {
    setText(value == null ? '' : String(value));
  }, [value]);

  const commit = (raw: string) => {
    const trimmed = raw.trim().replace(',', '.');
    if (trimmed === '') {
      onChange(null);
      return;
    }
    const num = Number(trimmed);
    if (!Number.isFinite(num)) {
      setText(value == null ? '' : String(value));
      return;
    }
    const snapped = Math.round(num / step) * step;
    const next = clamp(snapped, min, max);
    onChange(next);
    setText(String(next));
  };

  const pct = value == null ? 0 : ((value - min) / (max - min)) * 100;

  return (
    <div className={cls('rounded-xl border border-line bg-white p-4 sm:p-5', disabled && 'opacity-60')}>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <label htmlFor={id} className="label">
            {label} <span className="font-normal text-muted">({unit})</span>
          </label>
          {hint && <p className="mt-0.5 text-xs text-muted">{hint}</p>}
        </div>
        <div className="flex items-center gap-2">
          <input
            id={id}
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            className={cls('input h-11 w-32 text-right text-base font-semibold tabular-nums', value == null && 'border-dashed')}
            placeholder={`${n(min)}–${n(max)}`}
            value={text}
            disabled={disabled}
            onChange={(e) => setText(e.target.value)}
            onBlur={(e) => commit(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === 'Return') commit((e.target as HTMLInputElement).value);
            }}
            aria-describedby={`${id}-range`}
          />
          <span className="text-sm text-muted">{unit}</span>
        </div>
      </div>

      <div className="mt-4">
        <input
          type="range"
          id={`${id}-range`}
          className={cls('cm-range', value == null && 'is-empty')}
          style={{ ['--pct' as string]: `${pct}%` }}
          min={min}
          max={max}
          step={step}
          value={value ?? min}
          disabled={disabled}
          onChange={(e) => onChange(clamp(Number(e.target.value), min, max))}
          aria-label={`${label} (${unit})`}
          aria-valuetext={value == null ? 'neselectat' : `${value} ${unit}`}
        />
        <div className="mt-1 flex justify-between text-[11px] text-muted tabular-nums">
          <span>min. {n(min)} {unit}</span>
          <span>max. {n(max)} {unit}</span>
        </div>
      </div>

      {presets.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2" role="group" aria-label={`Valori uzuale ${label}`}>
          {presets.map((p) => {
            const inRange = p >= min && p <= max;
            const active = value === p;
            return (
              <button
                key={p}
                type="button"
                disabled={disabled || !inRange}
                aria-pressed={active}
                onClick={() => onChange(active ? null : p)}
                className={cls(
                  'h-8 rounded-md border px-3 text-[13px] font-medium tabular-nums transition',
                  active ? 'border-ink bg-ink text-white' : 'border-line bg-white text-ink hover:border-ink/40',
                  !inRange && 'cursor-not-allowed opacity-35',
                )}
              >
                {n(p)}
              </button>
            );
          })}
        </div>
      )}

      {notice && <p className="mt-3 text-xs font-medium text-warning-ink">{notice}</p>}
    </div>
  );
}
