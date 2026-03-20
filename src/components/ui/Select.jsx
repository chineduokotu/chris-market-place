import { ChevronDown } from 'lucide-react';
import { useId } from 'react';
import { cn } from '../../lib/cn';

export default function Select({
  id,
  label,
  error,
  helperText,
  className,
  wrapperClassName,
  children,
  ...props
}) {
  const generatedId = useId();
  const fieldId = id || generatedId;
  const helperId = helperText ? `${fieldId}-helper` : undefined;
  const errorId = error ? `${fieldId}-error` : undefined;
  const describedBy = [helperId, errorId].filter(Boolean).join(' ') || undefined;

  return (
    <div className={cn('space-y-2', wrapperClassName)}>
      {label ? (
        <label htmlFor={fieldId} className="text-sm font-semibold text-[var(--color-text)]">
          {label}
        </label>
      ) : null}
      <div className="relative">
        <select
          id={fieldId}
          aria-invalid={Boolean(error)}
          aria-describedby={describedBy}
          className={cn(
            'h-12 w-full appearance-none rounded-[var(--radius-control)] border bg-white px-4 pr-10 text-sm text-[var(--color-text)]',
            'border-[var(--color-border)] shadow-[inset_0_1px_2px_rgba(37,99,235,0.12)] transition-colors',
            'focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[color-mix(in_srgb,var(--color-primary)_22%,white)]',
            error ? 'border-[var(--color-error)]' : 'focus-visible:border-[var(--color-primary)]',
            className,
          )}
          {...props}
        >
          {children}
        </select>
        <ChevronDown
          size={18}
          className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
          aria-hidden
        />
      </div>
      {helperText ? (
        <p id={helperId} className="text-xs text-[var(--color-muted)]">
          {helperText}
        </p>
      ) : null}
      {error ? (
        <p id={errorId} className="text-xs font-semibold text-[var(--color-error)]">
          {error}
        </p>
      ) : null}
    </div>
  );
}
