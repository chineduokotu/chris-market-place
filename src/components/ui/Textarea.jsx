import { useId } from 'react';
import { cn } from '../../lib/cn';

export default function Textarea({
  id,
  label,
  error,
  helperText,
  className,
  wrapperClassName,
  rows = 4,
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
      <textarea
        id={fieldId}
        rows={rows}
        aria-invalid={Boolean(error)}
        aria-describedby={describedBy}
        className={cn(
          'w-full rounded-[var(--radius-control)] border bg-white px-4 py-3 text-sm text-[var(--color-text)] placeholder:text-slate-400',
          'border-[var(--color-border)] shadow-[inset_0_1px_2px_rgba(37,99,235,0.12)] transition-colors',
          'focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[color-mix(in_srgb,var(--color-primary)_22%,white)]',
          error ? 'border-[var(--color-error)]' : 'focus-visible:border-[var(--color-primary)]',
          className,
        )}
        {...props}
      />
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
