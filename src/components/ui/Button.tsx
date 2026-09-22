import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { cls } from '@/lib/format';

type Variant = 'primary' | 'secondary' | 'ghost' | 'dark' | 'danger';
type Size = 'sm' | 'md' | 'lg';

const base =
  'inline-flex items-center justify-center gap-2 rounded-lg font-semibold transition-colors duration-150 select-none disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-gold';

const variants: Record<Variant, string> = {
  primary: 'bg-brand-bronze text-white hover:bg-brand-bronze-dark shadow-sm',
  secondary: 'border border-line bg-white text-ink hover:border-ink/40 hover:bg-surface',
  ghost: 'text-ink hover:bg-surface',
  dark: 'bg-ink text-white hover:bg-ink-soft',
  danger: 'border border-danger/30 bg-white text-danger hover:bg-danger/5',
};

const sizes: Record<Size, string> = {
  sm: 'h-9 px-3 text-[13px]',
  md: 'h-11 px-5 text-sm',
  lg: 'h-12 px-6 text-[15px]',
};

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  full?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = 'primary', size = 'md', loading, full, className, children, disabled, ...rest },
  ref,
) {
  return (
    <button ref={ref} className={cls(base, variants[variant], sizes[size], full && 'w-full', className)} disabled={disabled || loading} {...rest}>
      {loading && <Loader2 className="h-4 w-4 animate-spin" />}
      {children}
    </button>
  );
});

export function ButtonLink({
  to,
  variant = 'primary',
  size = 'md',
  full,
  className,
  children,
  external,
}: {
  to: string;
  variant?: Variant;
  size?: Size;
  full?: boolean;
  className?: string;
  children: ReactNode;
  external?: boolean;
}) {
  const c = cls(base, variants[variant], sizes[size], full && 'w-full', className);
  if (external) {
    return (
      <a href={to} target="_blank" rel="noreferrer" className={c}>
        {children}
      </a>
    );
  }
  return (
    <Link to={to} className={c}>
      {children}
    </Link>
  );
}
