import Button from './Button';

export default function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
  className = '',
}) {
  return (
    <div
      className={`rounded-[var(--radius-card)] border border-dashed border-[var(--color-border)] bg-white p-10 text-center ${className}`}
      role="status"
    >
      {Icon ? (
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[var(--color-primary-soft)] text-[var(--color-primary)]">
          <Icon size={24} aria-hidden />
        </div>
      ) : null}
      <h3 className="mb-2 text-lg font-bold text-[var(--color-text)]">{title}</h3>
      <p className="mx-auto mb-6 max-w-md text-sm text-[var(--color-muted)]">{description}</p>
      {actionLabel && onAction ? (
        <Button variant="secondary" onClick={onAction}>
          {actionLabel}
        </Button>
      ) : null}
    </div>
  );
}

