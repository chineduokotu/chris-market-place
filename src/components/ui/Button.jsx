import { Loader2 } from 'lucide-react';
import { cn } from '../../lib/cn';

const variantClasses = {
  primary:
    'bg-[var(--color-primary)] text-[var(--color-text)] border-transparent hover:bg-[var(--color-primary-strong)] shadow-[0_10px_24px_rgba(37,99,235,0.22)]',
  secondary:
    'bg-white text-[var(--color-text)] border-[var(--color-border)] hover:border-[color-mix(in_srgb,var(--color-primary)_35%,white)] hover:bg-[var(--color-primary-soft)]',
  ghost:
    'bg-transparent text-[var(--color-muted)] border-transparent hover:bg-[var(--color-primary-soft)] hover:text-[var(--color-text)]',
  destructive:
    'bg-[var(--color-error)] text-[var(--color-text)] border-transparent hover:bg-[var(--color-primary-strong)]',
};

const sizeClasses = {
  sm: 'h-10 px-4 text-sm',
  md: 'h-11 px-5 text-sm',
  lg: 'h-12 px-6 text-base',
};

export default function Button({
  type = 'button',
  variant = 'primary',
  size = 'md',
  className,
  loading = false,
  disabled,
  children,
  ...props
}) {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-[var(--radius-control)] border font-semibold transition-all duration-200',
        'focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[color-mix(in_srgb,var(--color-primary)_22%,white)]',
        'disabled:cursor-not-allowed disabled:opacity-60',
        variantClasses[variant] || variantClasses.primary,
        sizeClasses[size] || sizeClasses.md,
        className,
      )}
      {...props}
    >
      {loading ? <Loader2 size={16} className="animate-spin" aria-hidden /> : null}
      {children}
    </button>
  );
}


