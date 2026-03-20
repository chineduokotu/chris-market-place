import { AlertCircle, Search } from 'lucide-react';
import ServiceCard from './ServiceCard';

function ServiceCardSkeleton() {
  return (
    <article className="overflow-hidden rounded-[20px] border border-[var(--color-border)] bg-white">
      <div className="aspect-[4/5] animate-pulse bg-slate-100" />
      <div className="space-y-2 p-2.5 sm:p-3">
        <div className="h-4 w-1/2 animate-pulse rounded bg-slate-100" />
        <div className="h-4 w-5/6 animate-pulse rounded bg-slate-100" />
        <div className="h-3 w-full animate-pulse rounded bg-slate-100" />
        <div className="h-3 w-4/5 animate-pulse rounded bg-slate-100" />
        <div className="h-3 w-2/3 animate-pulse rounded bg-slate-100" />
      </div>
    </article>
  );
}

export default function ServiceGrid({
  services = [],
  isLoading = false,
  isFetching = false,
  isError = false,
  onClearFilters,
}) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 gap-3 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 12 }).map((_, index) => (
          <ServiceCardSkeleton key={index} />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-xl border border-dashed border-red-200 bg-red-50 p-8 text-center">
        <div className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-full bg-white text-red-500">
          <AlertCircle size={20} />
        </div>
        <h3 className="text-base font-bold text-slate-900">Unable to load listings</h3>
        <p className="mt-1 text-sm text-slate-600">Please refresh or try another filter combination.</p>
      </div>
    );
  }

  if (!services.length) {
    return (
      <div className="rounded-xl border border-dashed border-[var(--color-border)] bg-white p-10 text-center">
        <div className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-full bg-[var(--color-primary-soft)] text-[var(--color-primary)]">
          <Search size={20} />
        </div>
        <h3 className="text-base font-bold text-slate-900">No services found</h3>
        <p className="mt-1 text-sm text-slate-600">Try broadening your search or clearing active filters.</p>
        {onClearFilters ? (
          <button
            type="button"
            className="mt-4 rounded-lg border border-[var(--color-border)] px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100"
            onClick={onClearFilters}
          >
            Clear filters
          </button>
        ) : null}
      </div>
    );
  }

  return (
    <div>
      {isFetching ? <p className="mb-2 text-xs font-semibold text-slate-500">Updating listings...</p> : null}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {services.map((service) => (
          <ServiceCard key={service.id} service={service} />
        ))}
      </div>
    </div>
  );
}
