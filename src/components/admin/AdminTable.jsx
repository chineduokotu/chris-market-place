import EmptyState from '../ui/EmptyState';
import Skeleton from '../ui/Skeleton';

export default function AdminTable({
  columns,
  isLoading,
  emptyTitle = 'Nothing here yet',
  emptyDescription = 'There are no records to display right now.',
  children,
}) {
  if (isLoading) {
    return (
      <div className="rounded-none border border-[var(--color-border)] bg-white p-5 shadow-[0_18px_40px_rgba(15,23,42,0.06)]">
        <div className="space-y-3">
          {[1, 2, 3, 4].map((row) => (
            <Skeleton key={row} className="h-12 w-full rounded-none" />
          ))}
        </div>
      </div>
    );
  }

  if (!children) {
    return <EmptyState title={emptyTitle} description={emptyDescription} className="bg-white" />;
  }

  return (
    <div className="overflow-hidden rounded-none border border-[var(--color-border)] bg-white shadow-[0_18px_40px_rgba(15,23,42,0.06)]">
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse">
          <thead className="bg-slate-50/90">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className="px-5 py-4 text-left text-xs font-black uppercase tracking-[0.22em] text-slate-500"
                >
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">{children}</tbody>
        </table>
      </div>
    </div>
  );
}
