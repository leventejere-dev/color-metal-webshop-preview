import { CURRENCY_LABEL } from '@/config/pricing';

const ron = new Intl.NumberFormat('ro-RO', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const kg3 = new Intl.NumberFormat('ro-RO', { minimumFractionDigits: 3, maximumFractionDigits: 3 });
const num = new Intl.NumberFormat('ro-RO', { maximumFractionDigits: 2 });

/** 9.6 → "9,60 lei" */
export const money = (value: number) => `${ron.format(value)} ${CURRENCY_LABEL}`;
export const kg = (value: number) => `${kg3.format(value)} kg`;
export const n = (value: number) => num.format(value);
export const mm = (value: number) => `${num.format(value)} mm`;

export const dateRo = (iso: string) =>
  new Intl.DateTimeFormat('ro-RO', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(new Date(iso));

export const dateTimeRo = (iso: string) =>
  new Intl.DateTimeFormat('ro-RO', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }).format(
    new Date(iso),
  );

export const cls = (...parts: (string | false | null | undefined)[]) => parts.filter(Boolean).join(' ');

/** Path helper for files under /public (respects the Vite base path on GitHub Pages). */
export const asset = (p: string) => `${import.meta.env.BASE_URL.replace(/\/$/, '')}${p}`;
