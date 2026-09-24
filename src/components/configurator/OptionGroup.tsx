import { useEffect, useState } from 'react';
import { Info } from 'lucide-react';
import { cls, n } from '@/lib/format';

export const UNAVAILABLE_MSG = 'Opțiunea nu este disponibilă pentru dimensiunea selectată.';

export interface OptionGroupProps {
  label: string;
  /** litera corespunzătoare din desenul tehnic (b, d, g) */
  symbol?: string;
  unit?: string;
  hint?: string;
  values: number[];
  selected: number | undefined;
  isAvailable: (v: number) => boolean;
  onSelect: (v: number | undefined) => void;
}

/**
 * Grup de opțiuni discrete. Regulile de interacțiune:
 *  – nimic nu este preselectat;
 *  – clic pe opțiunea activă o deselectează;
 *  – opțiunile incompatibile rămân vizibile, estompate și nu pot fi selectate
 *    (un clic pe ele afișează doar explicația).
 */
export function OptionGroup({ label, symbol, unit = 'mm', hint, values, selected, isAvailable, onSelect }: OptionGroupProps) {
  const [msg, setMsg] = useState<string | null>(null);

  useEffect(() => {
    if (!msg) return;
    const t = window.setTimeout(() => setMsg(null), 3200);
    return () => window.clearTimeout(t);
  }, [msg]);

  return (
    <div className="rounded-xl border border-line bg-white p-4 sm:p-5">
      <p className="label">
        {label}
        {symbol && <span className="ml-1.5 rounded bg-surface-2 px-1.5 py-0.5 font-mono text-[11px] font-semibold text-ink-soft" title="Notația din desen">{symbol}</span>}{' '}
        <span className="font-normal text-muted">({unit})</span>
        {hint && <span className="ml-2 text-xs font-normal text-muted">{hint}</span>}
      </p>

      <div className="mt-3 flex flex-wrap gap-2" role="group" aria-label={label}>
        {values.map((v) => {
          const active = selected === v;
          const available = isAvailable(v);
          return (
            <button
              key={v}
              type="button"
              aria-pressed={active}
              aria-disabled={!available}
              aria-label={!available ? `${n(v)} ${unit} – ${UNAVAILABLE_MSG}` : `${n(v)} ${unit}`}
              title={!available ? UNAVAILABLE_MSG : undefined}
              onClick={() => {
                if (!available) {
                  setMsg(UNAVAILABLE_MSG);
                  return;
                }
                onSelect(active ? undefined : v);
              }}
              className={cls(
                'h-10 min-w-[3.25rem] rounded-lg border px-3.5 text-sm font-semibold tabular-nums transition',
                active && 'border-ink bg-ink text-white shadow-sm',
                !active && available && 'border-line bg-white text-ink hover:border-ink/50',
                !available && 'cursor-not-allowed border-dashed border-line/80 bg-surface text-muted/50',
              )}
            >
              {n(v)}
            </button>
          );
        })}
      </div>

      {msg && (
        <p className="mt-3 flex items-start gap-1.5 text-xs font-medium text-warning-ink" role="status">
          <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" /> {msg}
        </p>
      )}
    </div>
  );
}
