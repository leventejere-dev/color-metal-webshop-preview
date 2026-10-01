import { Check, Ban } from 'lucide-react';
import { ORDER_STATUS_LABEL, type Order, type OrderStatus } from '@/lib/types';
import { cls, dateTimeRo } from '@/lib/format';

/** Etapele prin care trece o comandă, în ordine. */
const STEPS = [
  { key: 'plasata', label: 'Comandă plasată', text: 'Am primit comanda și am rezervat materialele.' },
  { key: 'confirmata', label: 'Plată confirmată', text: 'Plata a fost înregistrată; comanda intră în producție.' },
  { key: 'in_procesare', label: 'În debitare', text: 'Debităm și ambalăm piesele conform specificației.' },
  { key: 'livrata', label: 'Livrată', text: 'Coletul a ajuns la adresa de livrare.' },
] as const;

/** La ce etapă a ajuns comanda (indice în STEPS). */
const stepOf = (status: OrderStatus) =>
  ({ asteapta_plata: 0, confirmata: 1, in_procesare: 2, livrata: 3, anulata: 0 })[status];

/** Data cunoscută pentru o etapă (restul etapelor nu au dată înregistrată în sistem). */
const dateOf = (order: Order, i: number) => (i === 0 ? dateTimeRo(order.createdAt) : i === 1 && order.invoiceDate ? dateTimeRo(order.invoiceDate) : null);

/**
 * Starea comenzii, pas cu pas. `compact` = varianta orizontală, pentru lista de comenzi;
 * varianta implicită este cea verticală, cu explicații, pentru pagina comenzii.
 */
export function OrderTimeline({ order, compact }: { order: Order; compact?: boolean }) {
  const canceled = order.status === 'anulata';
  const delivered = order.status === 'livrata';
  // comanda livrată are toate etapele încheiate – ultima nu mai este „în curs”
  const current = delivered ? -1 : stepOf(order.status);
  const doneThrough = delivered ? STEPS.length : stepOf(order.status);

  if (canceled) {
    return (
      <div className={cls('flex items-center gap-2 rounded-lg border border-danger/30 bg-danger/5 px-3 py-2 text-sm text-danger', !compact && 'px-4 py-3')}>
        <Ban className="h-4 w-4 shrink-0" /> Comandă anulată
      </div>
    );
  }

  if (compact) {
    return (
      <ol className="flex items-start gap-0" aria-label={`Stare comandă: ${ORDER_STATUS_LABEL[order.status]}`}>
        {STEPS.map((s, i) => {
          const done = i < doneThrough;
          const now = i === current;
          return (
            <li key={s.key} className="flex min-w-0 flex-1 flex-col items-center text-center">
              <div className="flex w-full items-center">
                <span className={cls('h-0.5 flex-1', i === 0 ? 'bg-transparent' : done || now ? 'bg-brand-gold' : 'bg-line')} />
                <span
                  className={cls(
                    'flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 text-white transition',
                    done && 'border-brand-gold bg-brand-gold',
                    now && 'border-brand-gold bg-white ring-4 ring-brand-gold/20',
                    !done && !now && 'border-line bg-white',
                  )}
                >
                  {done && <Check className="h-3 w-3" strokeWidth={3} />}
                </span>
                <span className={cls('h-0.5 flex-1', i === STEPS.length - 1 ? 'bg-transparent' : done ? 'bg-brand-gold' : 'bg-line')} />
              </div>
              <span className={cls('mt-1.5 text-[11px] leading-tight', now ? 'font-semibold text-ink' : done ? 'text-ink-soft' : 'text-muted')}>{s.label}</span>
            </li>
          );
        })}
      </ol>
    );
  }

  return (
    <ol className="space-y-0" aria-label={`Stare comandă: ${ORDER_STATUS_LABEL[order.status]}`}>
      {STEPS.map((s, i) => {
        const done = i < doneThrough;
        const now = i === current;
        const date = done || now ? dateOf(order, i) : null;
        return (
          <li key={s.key} className="flex gap-3">
            <div className="flex flex-col items-center">
              <span
                className={cls(
                  'flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 text-white',
                  done && 'border-brand-gold bg-brand-gold',
                  now && 'border-brand-gold bg-white ring-4 ring-brand-gold/20',
                  !done && !now && 'border-line bg-white',
                )}
              >
                {done && <Check className="h-3.5 w-3.5" strokeWidth={3} />}
              </span>
              {i < STEPS.length - 1 && <span className={cls('w-0.5 flex-1', done ? 'bg-brand-gold' : 'bg-line')} />}
            </div>
            <div className={cls('pb-5', i === STEPS.length - 1 && 'pb-0')}>
              <p className={cls('text-sm', now ? 'font-semibold text-ink' : done ? 'font-medium text-ink-soft' : 'text-muted')}>
                {s.label}
                {now && <span className="ml-2 rounded-full bg-brand-gold-light px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-brand-gold-dark">acum</span>}
              </p>
              <p className={cls('mt-0.5 text-[13px] leading-6', done || now ? 'text-muted' : 'text-muted/70')}>{s.text}</p>
              {date && <p className="mt-0.5 text-xs text-muted">{date}</p>}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
