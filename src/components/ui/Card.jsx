import { cn } from '../../lib/cn';

export function Card({ className, hoverable = false, children, ...props }) {
  return (
    <article
      className={cn(
        'rounded-[var(--radius-card)] border border-[var(--color-border)] bg-[var(--color-surface)] shadow-[var(--shadow-soft)]',
        hoverable ? 'transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[var(--shadow-soft-hover)]' : '',
        className,
      )}
      {...props}
    >
      {children}
    </article>
  );
}

export function CardHeader({ className, children, ...props }) {
  return (
    <header className={cn('border-b border-[var(--color-border)] px-6 py-5', className)} {...props}>
      {children}
    </header>
  );
}

export function CardBody({ className, children, ...props }) {
  return (
    <div className={cn('px-6 py-5', className)} {...props}>
      {children}
    </div>
  );
}

export function CardFooter({ className, children, ...props }) {
  return (
    <footer className={cn('border-t border-[var(--color-border)] px-6 py-4', className)} {...props}>
      {children}
    </footer>
  );
}

