import { cn } from '../../lib/cn';

export default function Skeleton({ className, circle = false }) {
  return (
    <div
      aria-hidden
      className={cn(
        'animate-pulse bg-slate-200/70',
        circle ? 'rounded-full' : 'rounded-[var(--radius-control)]',
        className,
      )}
    />
  );
}

export function CardSkeleton() {
  return (
    <div className="rounded-[var(--radius-card)] border border-[var(--color-border)] bg-white p-4">
      <Skeleton className="mb-4 aspect-[4/3] w-full rounded-[14px]" />
      <Skeleton className="mb-2 h-4 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
    </div>
  );
}

export function ListSkeleton() {
  return (
    <div className="space-y-3">
      {[1, 2, 3].map((row) => (
        <div
          key={row}
          className="rounded-[var(--radius-card)] border border-[var(--color-border)] bg-white p-4"
        >
          <Skeleton className="mb-3 h-4 w-1/3" />
          <Skeleton className="h-4 w-full" />
        </div>
      ))}
    </div>
  );
}

export function ChatSkeleton() {
  return (
    <div className="space-y-3 p-4">
      <Skeleton className="h-10 w-2/3" />
      <Skeleton className="ml-auto h-10 w-1/2" />
      <Skeleton className="h-10 w-3/4" />
    </div>
  );
}

