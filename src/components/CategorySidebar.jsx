import { Briefcase } from 'lucide-react';

export default function CategorySidebar({
  categories = [],
  activeCategory = '',
  onSelectCategory,
  isLoading = false,
}) {
  const baseButtonClass =
    'w-full truncate rounded-lg px-3 py-2 text-left text-sm font-semibold transition-colors';

  return (
    <aside className="sticky top-24 hidden h-fit rounded-xl border border-[var(--color-border)] bg-white p-2 md:block">
      <h2 className="px-2 pb-2 text-xs font-bold uppercase tracking-wide text-slate-500">Categories</h2>
      <div className="space-y-1">
        <button
          type="button"
          onClick={() => onSelectCategory?.('')}
          className={`${baseButtonClass} ${
            !activeCategory ? 'bg-[var(--color-primary-soft)] text-[var(--color-primary)]' : 'text-slate-700 hover:bg-slate-100'
          }`}
        >
          <span className="inline-flex items-center gap-2">
            <Briefcase size={14} />
            All Categories
          </span>
        </button>

        {isLoading ? (
          <div className="space-y-1 px-1 py-1">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <div key={item} className="h-8 animate-pulse rounded-md bg-slate-100" />
            ))}
          </div>
        ) : (
          categories.map((category) => {
            const categoryId = String(category.id);
            const active = activeCategory === categoryId;
            return (
              <button
                type="button"
                key={category.id}
                onClick={() => onSelectCategory?.(categoryId)}
                className={`${baseButtonClass} ${
                  active ? 'bg-[var(--color-primary-soft)] text-[var(--color-primary)]' : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <span className="inline-flex w-full items-center justify-between gap-2">
                  <span className="truncate">{category.name}</span>
                  <span className="text-xs text-slate-500">{category.services_count ?? 0}</span>
                </span>
              </button>
            );
          })
        )}
      </div>
    </aside>
  );
}
