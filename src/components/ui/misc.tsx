import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { cls } from '@/lib/format';

export function PageHeader({ eyebrow, title, intro, actions, className }: { eyebrow?: string; title: string; intro?: ReactNode; actions?: ReactNode; className?: string }) {
  return (
    <div className={cls('flex flex-col gap-4 md:flex-row md:items-end md:justify-between', className)}>
      <div className="max-w-2xl">
        {eyebrow && <p className="eyebrow mb-2">{eyebrow}</p>}
        <h1 className="text-2xl font-semibold text-ink sm:text-3xl">{title}</h1>
        {intro && <div className="mt-2 text-[15px] leading-6 text-muted">{intro}</div>}
      </div>
      {actions}
    </div>
  );
}

export function Breadcrumbs({ items }: { items: { label: string; to?: string }[] }) {
  return (
    <nav aria-label="Navigare" className="mb-4 flex flex-wrap items-center gap-1 text-xs text-muted">
      <Link to="/" className="hover:text-ink">
        Acasă
      </Link>
      {items.map((it, i) => (
        <span key={i} className="flex items-center gap-1">
          <ChevronRight className="h-3.5 w-3.5" />
          {it.to ? (
            <Link to={it.to} className="hover:text-ink">
              {it.label}
            </Link>
          ) : (
            <span className="text-ink">{it.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}

export function EmptyState({ icon, title, text, action }: { icon?: ReactNode; title: string; text?: string; action?: ReactNode }) {
  return (
    <div className="card flex flex-col items-center px-6 py-12 text-center">
      {icon && <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-surface text-muted">{icon}</div>}
      <h3 className="text-lg font-semibold">{title}</h3>
      {text && <p className="mt-1 max-w-md text-sm text-muted">{text}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

export function Notice({ kind = 'info', children, className }: { kind?: 'info' | 'warning' | 'success' | 'danger'; children: ReactNode; className?: string }) {
  return (
    <div
      className={cls(
        'rounded-lg border px-4 py-3 text-sm leading-6',
        kind === 'info' && 'border-line bg-surface text-ink-soft',
        kind === 'warning' && 'border-brand-gold/40 bg-warning-bg text-warning-ink',
        kind === 'success' && 'border-success/30 bg-success/5 text-success',
        kind === 'danger' && 'border-danger/30 bg-danger/5 text-danger',
        className,
      )}
    >
      {children}
    </div>
  );
}

export function Badge({ children, tone = 'neutral' }: { children: ReactNode; tone?: 'neutral' | 'gold' | 'success' | 'warning' | 'danger' }) {
  return (
    <span
      className={cls(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide',
        tone === 'neutral' && 'bg-surface-2 text-ink-soft',
        tone === 'gold' && 'bg-brand-gold-light text-brand-gold-dark',
        tone === 'success' && 'bg-success/10 text-success',
        tone === 'warning' && 'bg-warning-bg text-warning-ink',
        tone === 'danger' && 'bg-danger/10 text-danger',
      )}
    >
      {children}
    </span>
  );
}

export function SummaryRow({ label, value, strong, className }: { label: ReactNode; value: ReactNode; strong?: boolean; className?: string }) {
  return (
    <div className={cls('flex items-baseline justify-between gap-4 py-1.5 text-sm', strong ? 'font-semibold text-ink' : 'text-ink-soft', className)}>
      <span className={cls(!strong && 'text-muted')}>{label}</span>
      <span className="text-right tabular-nums">{value}</span>
    </div>
  );
}
