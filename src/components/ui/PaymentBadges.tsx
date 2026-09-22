import { cls } from '@/lib/format';

/**
 * Siglele metodelor de plată, desenate în CSS/SVG (fără fișiere externe):
 * NETOPIA Payments (procesatorul webshopului actual), Visa și Mastercard.
 */
export function NetopiaBadge({ className }: { className?: string }) {
  return (
    <span className={cls('inline-flex h-8 items-center gap-1.5 rounded-md border border-line bg-white px-2.5', className)} aria-label="NETOPIA Payments">
      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#1c3f95] text-[11px] font-bold text-white">N</span>
      <span className="text-[13px] font-bold tracking-tight text-[#1c3f95]">NETOPIA</span>
      <span className="text-[10px] uppercase tracking-wider text-muted">payments</span>
    </span>
  );
}

export function VisaBadge({ className }: { className?: string }) {
  return (
    <span className={cls('inline-flex h-8 items-center rounded-md border border-line bg-white px-3', className)} aria-label="Visa">
      <span className="text-[17px] font-black italic tracking-tight text-[#1a1f71]">VISA</span>
    </span>
  );
}

export function MastercardBadge({ className }: { className?: string }) {
  return (
    <span className={cls('inline-flex h-8 items-center rounded-md border border-line bg-white px-2.5', className)} aria-label="Mastercard">
      <svg viewBox="0 0 38 24" className="h-5 w-8" aria-hidden="true">
        <circle cx="14" cy="12" r="10" fill="#eb001b" />
        <circle cx="24" cy="12" r="10" fill="#f79e1b" fillOpacity="0.9" />
      </svg>
    </span>
  );
}

export function PaymentBadges({ className }: { className?: string }) {
  return (
    <div className={cls('flex flex-wrap items-center gap-2', className)}>
      <NetopiaBadge />
      <VisaBadge />
      <MastercardBadge />
    </div>
  );
}
