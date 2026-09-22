import { forwardRef, type InputHTMLAttributes, type ReactNode, type SelectHTMLAttributes, type TextareaHTMLAttributes } from 'react';
import { cls } from '@/lib/format';

interface FieldWrapProps {
  label?: string;
  hint?: string;
  error?: string;
  required?: boolean;
  className?: string;
  children: ReactNode;
  htmlFor?: string;
}

export function FieldWrap({ label, hint, error, required, className, children, htmlFor }: FieldWrapProps) {
  return (
    <div className={cls('flex flex-col gap-1.5', className)}>
      {label && (
        <label htmlFor={htmlFor} className="label">
          {label}
          {required && <span className="text-danger"> *</span>}
        </label>
      )}
      {children}
      {error ? <p className="text-xs text-danger">{error}</p> : hint ? <p className="text-xs text-muted">{hint}</p> : null}
    </div>
  );
}

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  hint?: string;
  error?: string;
  wrapClassName?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input({ label, hint, error, wrapClassName, className, id, required, ...rest }, ref) {
  const inputId = id ?? (label ? `f_${label.replace(/\W+/g, '_').toLowerCase()}` : undefined);
  return (
    <FieldWrap label={label} hint={hint} error={error} required={required} className={wrapClassName} htmlFor={inputId}>
      <input ref={ref} id={inputId} className={cls('input', error && 'border-danger focus:border-danger focus:ring-danger/20', className)} required={required} {...rest} />
    </FieldWrap>
  );
});

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  hint?: string;
  error?: string;
}

export function Textarea({ label, hint, error, className, id, ...rest }: TextareaProps) {
  const inputId = id ?? (label ? `f_${label.replace(/\W+/g, '_').toLowerCase()}` : undefined);
  return (
    <FieldWrap label={label} hint={hint} error={error} htmlFor={inputId}>
      <textarea id={inputId} className={cls('input min-h-[110px] resize-y', className)} {...rest} />
    </FieldWrap>
  );
}

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  hint?: string;
  error?: string;
}

export function Select({ label, hint, error, className, id, children, ...rest }: SelectProps) {
  const inputId = id ?? (label ? `f_${label.replace(/\W+/g, '_').toLowerCase()}` : undefined);
  return (
    <FieldWrap label={label} hint={hint} error={error} htmlFor={inputId}>
      <select id={inputId} className={cls('input', className)} {...rest}>
        {children}
      </select>
    </FieldWrap>
  );
}

export function Checkbox({ label, className, ...rest }: InputHTMLAttributes<HTMLInputElement> & { label: ReactNode }) {
  return (
    <label className={cls('flex cursor-pointer items-start gap-3 text-sm text-ink-soft', className)}>
      <input type="checkbox" className="mt-0.5 h-4 w-4 shrink-0 rounded border-line accent-brand-bronze" {...rest} />
      <span>{label}</span>
    </label>
  );
}
