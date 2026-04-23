import { ChevronLeft, ChevronRight } from 'lucide-react';
import Button from '../ui/Button';

export default function AdminPagination({
  currentPage = 1,
  lastPage = 1,
  from = 0,
  to = 0,
  total = 0,
  onPageChange,
}) {
  if (!total || lastPage <= 1) {
    return null;
  }

  const canGoBack = currentPage > 1;
  const canGoForward = currentPage < lastPage;

  return (
    <div className="flex flex-col gap-3 rounded-[24px] border border-[var(--color-border)] bg-white px-4 py-3 shadow-[0_18px_40px_rgba(15,23,42,0.06)] md:flex-row md:items-center md:justify-between">
      <p className="text-sm font-semibold text-slate-500">
        Showing <span className="text-slate-900">{from}</span> to <span className="text-slate-900">{to}</span> of{' '}
        <span className="text-slate-900">{total}</span>
      </p>
      <div className="flex items-center gap-2">
        <Button size="sm" variant="secondary" disabled={!canGoBack} onClick={() => onPageChange(currentPage - 1)}>
          <ChevronLeft size={14} />
          Previous
        </Button>
        <div className="rounded-2xl bg-slate-50 px-3 py-2 text-sm font-black text-slate-700">
          Page {currentPage} of {lastPage}
        </div>
        <Button size="sm" variant="secondary" disabled={!canGoForward} onClick={() => onPageChange(currentPage + 1)}>
          Next
          <ChevronRight size={14} />
        </Button>
      </div>
    </div>
  );
}
