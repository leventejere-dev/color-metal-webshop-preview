import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';
import { CheckCircle2, Info, TriangleAlert, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cls } from '@/lib/format';

type ToastKind = 'success' | 'info' | 'warning';
interface Toast {
  id: number;
  kind: ToastKind;
  text: string;
  cta?: { label: string; to: string };
}

interface ToastApi {
  toast: (text: string, opts?: { kind?: ToastKind; cta?: Toast['cta'] }) => void;
}

const Ctx = createContext<ToastApi | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<Toast[]>([]);

  const dismiss = useCallback((id: number) => setItems((l) => l.filter((t) => t.id !== id)), []);

  const toast = useCallback<ToastApi['toast']>((text, opts) => {
    const id = Date.now() + Math.random();
    setItems((l) => [...l, { id, text, kind: opts?.kind ?? 'success', cta: opts?.cta }]);
    window.setTimeout(() => dismiss(id), 4200);
  }, [dismiss]);

  const value = useMemo(() => ({ toast }), [toast]);

  return (
    <Ctx.Provider value={value}>
      {children}
      <div className="pointer-events-none fixed inset-x-0 top-4 z-[90] flex flex-col items-center gap-2 px-4 sm:items-end sm:px-6" aria-live="polite">
        {items.map((t) => (
          <div
            key={t.id}
            className={cls(
              'pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-xl border bg-white px-4 py-3 shadow-[var(--shadow-card)]',
              t.kind === 'success' && 'border-success/30',
              t.kind === 'warning' && 'border-brand-gold/50',
              t.kind === 'info' && 'border-line',
            )}
          >
            {t.kind === 'success' && <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-success" />}
            {t.kind === 'warning' && <TriangleAlert className="mt-0.5 h-5 w-5 shrink-0 text-brand-gold-dark" />}
            {t.kind === 'info' && <Info className="mt-0.5 h-5 w-5 shrink-0 text-muted" />}
            <div className="min-w-0 flex-1 text-sm text-ink">
              <p>{t.text}</p>
              {t.cta && (
                <Link to={t.cta.to} onClick={() => dismiss(t.id)} className="mt-1 inline-block font-semibold text-brand-bronze underline-offset-2 hover:underline">
                  {t.cta.label}
                </Link>
              )}
            </div>
            <button onClick={() => dismiss(t.id)} className="rounded p-1 text-muted hover:bg-surface hover:text-ink" aria-label="Închide">
              <X className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </Ctx.Provider>
  );
}

export function useToast(): ToastApi {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useToast în afara ToastProvider');
  return ctx;
}
