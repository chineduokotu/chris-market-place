import { cn } from '../../lib/cn';

export default function AdminFilters({ className, children }) {
  return (
    <div
      className={cn(
        'grid gap-3 rounded-[24px] border border-[var(--color-border)] bg-white/90 p-4 shadow-[0_18px_40px_rgba(15,23,42,0.06)] backdrop-blur',
        className,
      )}
    >
      {children}
    </div>
  );
}
