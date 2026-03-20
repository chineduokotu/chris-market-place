import { useEffect, useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link, useSearchParams } from 'react-router-dom';
import { Filter, Search } from 'lucide-react';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';
import Drawer from '../components/ui/Drawer';
import ServiceGrid from '../components/ServiceGrid';
import { setMeta } from '../lib/seo';

const SORT_OPTIONS = [
  { value: 'recent', label: 'Most Recent' },
];

function normalizeList(payload) {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.data)) return payload.data;
  return [];
}

function parsePage(value) {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 1;
}

function extractPagination(payload, fallbackPage, itemCount, perPage) {
  const currentPage = Number(payload?.current_page ?? payload?.meta?.current_page ?? fallbackPage);
  const lastPage = Number(payload?.last_page ?? payload?.meta?.last_page ?? 1);
  const total = Number(payload?.total ?? payload?.meta?.total ?? itemCount);
  const from = Number(payload?.from ?? payload?.meta?.from ?? (itemCount > 0 ? (currentPage - 1) * perPage + 1 : 0));
  const to = Number(payload?.to ?? payload?.meta?.to ?? (itemCount > 0 ? from + itemCount - 1 : 0));

  return {
    currentPage: Number.isFinite(currentPage) && currentPage > 0 ? currentPage : 1,
    lastPage: Number.isFinite(lastPage) && lastPage > 0 ? lastPage : 1,
    total: Number.isFinite(total) && total >= 0 ? total : itemCount,
    from,
    to,
  };
}

export default function HomePage() {
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);

  const q = searchParams.get('q') || '';
  const category = searchParams.get('category') || searchParams.get('category_id') || '';
  const location = searchParams.get('location') || '';
  const verified = searchParams.get('verified') === '1';
  const sort = searchParams.get('sort') || 'recent';
  const page = parsePage(searchParams.get('page'));
  const perPage = 12;

  const [searchInput, setSearchInput] = useState(q);
  const [locationInput, setLocationInput] = useState(location);

  useEffect(() => {
    setSearchInput(q);
  }, [q]);

  useEffect(() => {
    setLocationInput(location);
  }, [location]);

  useEffect(() => {
    setMeta({
      title: 'ChrisHub Marketplace | Browse Services',
      description: 'Browse and filter active service listings from verified and local providers.',
      url: window.location.href,
    });
  }, []);

  const updateParams = (updates, resetPage = true) => {
    const next = new URLSearchParams(searchParams);

    Object.entries(updates).forEach(([key, value]) => {
      const shouldDelete = value === '' || value === null || value === undefined || value === false;
      if (shouldDelete) next.delete(key);
      else next.set(key, String(value));
    });

    if (resetPage) next.delete('page');
    setSearchParams(next);
  };

  const clearAllFilters = () => {
    setSearchInput('');
    setLocationInput('');
    setSearchParams({});
  };

  const handleCategoryChange = (value) => {
    const next = new URLSearchParams(searchParams);
    next.delete('category_id');

    if (!value) next.delete('category');
    else next.set('category', value);

    next.delete('page');
    setSearchParams(next);
  };

  const serviceQueryParams = useMemo(() => {
    const params = {
      sort,
      page,
      per_page: perPage,
    };

    if (q) params.q = q;
    if (category) params.category_id = category;
    if (location) params.location = location;
    if (verified) params.verified = 1;

    return params;
  }, [q, category, location, verified, sort, page]);

  const {
    data: categoriesPayload,
  } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const response = await api.get('/categories');
      return response.data;
    },
    staleTime: 5 * 60 * 1000,
  });

  const {
    data: servicesPayload,
    isLoading: servicesLoading,
    isError: servicesError,
    isFetching: servicesFetching,
  } = useQuery({
    queryKey: ['services', serviceQueryParams],
    queryFn: async () => {
      const response = await api.get('/services', { params: serviceQueryParams });
      return response.data;
    },
    placeholderData: (previousData) => previousData,
  });

  const categories = useMemo(() => normalizeList(categoriesPayload), [categoriesPayload]);
  const services = useMemo(() => normalizeList(servicesPayload), [servicesPayload]);
  const pagination = useMemo(
    () => extractPagination(servicesPayload, page, services.length, perPage),
    [servicesPayload, page, services.length],
  );

  const visiblePages = useMemo(() => {
    const pages = new Set([
      1,
      pagination.currentPage - 1,
      pagination.currentPage,
      pagination.currentPage + 1,
      pagination.lastPage,
    ]);

    return [...pages]
      .filter((pageNumber) => pageNumber >= 1 && pageNumber <= pagination.lastPage)
      .sort((a, b) => a - b);
  }, [pagination.currentPage, pagination.lastPage]);

  const onSubmitSearch = (event) => {
    event.preventDefault();
    updateParams({ q: searchInput.trim() });
  };

  const applyLocationFilter = () => {
    const nextLocation = locationInput.trim();
    if (nextLocation === location) return;
    updateParams({ location: nextLocation });
  };

  const changePage = (nextPage) => {
    if (nextPage < 1 || nextPage > pagination.lastPage) return;
    const next = new URLSearchParams(searchParams);
    if (nextPage === 1) next.delete('page');
    else next.set('page', String(nextPage));
    setSearchParams(next);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[var(--color-background)]">
      <header className="sticky top-0 z-40 border-b border-[var(--color-border)] bg-white/95 backdrop-blur">
        <div className="container-app py-2">
          <div className="flex items-center gap-3">
            <Link to="/" className="inline-flex shrink-0 items-center gap-2" aria-label="ChrisHub homepage">
              <div
                className="flex h-9 w-9 items-center justify-center rounded-lg text-sm font-extrabold text-[var(--color-text)]"
                style={{ background: 'var(--color-primary-gradient)' }}
              >
                C
              </div>
              <span className="hidden text-lg font-extrabold text-slate-900 sm:block">ChrisHub</span>
            </Link>

            <form onSubmit={onSubmitSearch} className="hidden flex-1 md:flex">
              <div className="relative w-full">
                <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="search"
                  value={searchInput}
                  onChange={(event) => setSearchInput(event.target.value)}
                  placeholder="Search services..."
                  className="h-11 w-full rounded-lg border border-[var(--color-border)] bg-white pl-9 pr-24 text-sm font-semibold text-slate-700 outline-none focus:border-[var(--color-primary)]"
                  aria-label="Search services"
                />
                <button
                  type="submit"
                  className="absolute right-1.5 top-1/2 -translate-y-1/2 rounded-md bg-[var(--color-primary)] px-3 py-1.5 text-xs font-bold text-[var(--color-text)] hover:bg-[var(--color-primary-strong)]"
                >
                  Search
                </button>
              </div>
            </form>

            <div className="ml-auto flex items-center gap-2">
              <Link
                to={user ? '/profile' : '/login'}
                className="rounded-lg border border-[var(--color-border)] px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-100 sm:text-sm"
              >
                {user ? 'Profile' : 'Login'}
              </Link>
              <Link
                to={user ? '/dashboard' : '/register'}
                className="rounded-lg bg-[var(--color-primary)] px-3 py-2 text-xs font-bold text-[var(--color-text)] hover:bg-[var(--color-primary-strong)] sm:text-sm"
              >
                Post a Service
              </Link>
            </div>
          </div>

          <form onSubmit={onSubmitSearch} className="mt-2 md:hidden">
            <div className="relative">
              <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="search"
                value={searchInput}
                onChange={(event) => setSearchInput(event.target.value)}
                placeholder="Search services..."
                className="h-10 w-full rounded-lg border border-[var(--color-border)] bg-white pl-9 pr-3 text-sm font-semibold text-slate-700 outline-none focus:border-[var(--color-primary)]"
                aria-label="Search services mobile"
              />
            </div>
          </form>
        </div>
      </header>

      <div className="container-app py-3">
        <div className="mb-3 rounded-xl border border-[var(--color-border)] bg-white p-2">
          <div className="flex flex-wrap items-center gap-2">
            <select
              value={sort}
              onChange={(event) => updateParams({ sort: event.target.value })}
              className="h-9 rounded-lg border border-[var(--color-border)] bg-white px-2 text-xs font-semibold text-slate-700 outline-none sm:text-sm"
              aria-label="Sort services"
            >
              {SORT_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>

            <div className="flex h-9 flex-1 min-w-44 items-center rounded-lg border border-[var(--color-border)] bg-white px-2">
              <input
                type="text"
                value={locationInput}
                onChange={(event) => setLocationInput(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter') {
                    event.preventDefault();
                    applyLocationFilter();
                  }
                }}
                onBlur={applyLocationFilter}
                placeholder="Location"
                className="w-full bg-transparent text-xs font-semibold text-slate-700 outline-none sm:text-sm"
                aria-label="Filter by location"
              />
            </div>

            <select
              value={category}
              onChange={(event) => handleCategoryChange(event.target.value)}
              className="h-9 min-w-40 flex-1 rounded-lg border border-[var(--color-border)] bg-white px-2 text-xs font-semibold text-slate-700 outline-none md:max-w-56 md:flex-none"
              aria-label="Filter by category"
            >
              <option value="">All Categories</option>
              {categories.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>

            <label className="inline-flex h-9 items-center gap-2 rounded-lg border border-[var(--color-border)] px-3 text-xs font-bold text-slate-700 sm:text-sm">
              <input
                type="checkbox"
                checked={verified}
                onChange={(event) => updateParams({ verified: event.target.checked ? '1' : '' })}
                className="h-4 w-4 accent-[var(--color-primary)]"
              />
              Verified only
            </label>

            <button
              type="button"
              className="ml-auto inline-flex h-9 items-center gap-1 rounded-lg border border-[var(--color-border)] px-3 text-xs font-bold text-slate-700 hover:bg-slate-100 md:hidden sm:text-sm"
              onClick={() => setIsFilterDrawerOpen(true)}
            >
              <Filter size={14} />
              Filters
            </button>
          </div>
        </div>

        <section>
          <ServiceGrid
            services={services}
            isLoading={servicesLoading}
            isFetching={servicesFetching}
            isError={servicesError}
            onClearFilters={clearAllFilters}
          />

          {pagination.lastPage > 1 ? (
            <div className="mt-4 flex flex-wrap items-center justify-between gap-2 rounded-xl border border-[var(--color-border)] bg-white p-3">
              <p className="text-xs font-semibold text-slate-500">
                Showing {pagination.from}-{pagination.to} of {pagination.total}
              </p>

              <div className="inline-flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => changePage(pagination.currentPage - 1)}
                  disabled={pagination.currentPage <= 1}
                  className="h-8 rounded-md border border-[var(--color-border)] px-2 text-xs font-bold text-slate-700 disabled:opacity-40"
                >
                  Prev
                </button>

                {visiblePages.map((pageNumber) => (
                  <button
                    key={pageNumber}
                    type="button"
                    onClick={() => changePage(pageNumber)}
                    className={`h-8 min-w-8 rounded-md border px-2 text-xs font-bold ${
                      pageNumber === pagination.currentPage
                        ? 'border-[var(--color-primary)] bg-[var(--color-primary)] text-[var(--color-text)]'
                        : 'border-[var(--color-border)] bg-white text-slate-700'
                    }`}
                  >
                    {pageNumber}
                  </button>
                ))}

                <button
                  type="button"
                  onClick={() => changePage(pagination.currentPage + 1)}
                  disabled={pagination.currentPage >= pagination.lastPage}
                  className="h-8 rounded-md border border-[var(--color-border)] px-2 text-xs font-bold text-slate-700 disabled:opacity-40"
                >
                  Next
                </button>
              </div>
            </div>
          ) : null}
        </section>
      </div>

      <Drawer isOpen={isFilterDrawerOpen} onClose={() => setIsFilterDrawerOpen(false)} title="Filters">
        <div className="space-y-3">
          <div>
            <label htmlFor="mobile-sort" className="mb-1 block text-xs font-bold uppercase tracking-wide text-slate-500">
              Sort
            </label>
            <select
              id="mobile-sort"
              value={sort}
              onChange={(event) => updateParams({ sort: event.target.value })}
              className="h-10 w-full rounded-lg border border-[var(--color-border)] bg-white px-3 text-sm font-semibold text-slate-700"
            >
              {SORT_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="mobile-category" className="mb-1 block text-xs font-bold uppercase tracking-wide text-slate-500">
              Category
            </label>
            <select
              id="mobile-category"
              value={category}
              onChange={(event) => handleCategoryChange(event.target.value)}
              className="h-10 w-full rounded-lg border border-[var(--color-border)] bg-white px-3 text-sm font-semibold text-slate-700"
            >
              <option value="">All Categories</option>
              {categories.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="mobile-location" className="mb-1 block text-xs font-bold uppercase tracking-wide text-slate-500">
              Location
            </label>
            <input
              id="mobile-location"
              type="text"
              value={locationInput}
              onChange={(event) => setLocationInput(event.target.value)}
              onBlur={applyLocationFilter}
              onKeyDown={(event) => {
                if (event.key === 'Enter') {
                  event.preventDefault();
                  applyLocationFilter();
                }
              }}
              className="h-10 w-full rounded-lg border border-[var(--color-border)] bg-white px-3 text-sm font-semibold text-slate-700"
              placeholder="Enter location"
            />
          </div>

          <label className="inline-flex items-center gap-2 rounded-lg border border-[var(--color-border)] px-3 py-2 text-sm font-semibold text-slate-700">
            <input
              type="checkbox"
              checked={verified}
              onChange={(event) => updateParams({ verified: event.target.checked ? '1' : '' })}
              className="h-4 w-4 accent-[var(--color-primary)]"
            />
            Verified only
          </label>

          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => {
                clearAllFilters();
                setIsFilterDrawerOpen(false);
              }}
              className="col-span-2 h-10 rounded-lg border border-[var(--color-border)] text-sm font-bold text-slate-700"
            >
              Clear
            </button>
          </div>
        </div>
      </Drawer>
    </div>
  );
}

