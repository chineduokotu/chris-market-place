import { useEffect, useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link, useSearchParams } from 'react-router-dom';
import { Filter, Search, MapPin, Layers, Plus } from 'lucide-react';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';
import Drawer from '../components/ui/Drawer';
import ServiceGrid from '../components/ServiceGrid';
import { setMeta } from '../lib/seo';
import { groupCategories } from '../lib/category';

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
    isLoading: categoriesLoading,
    isError: categoriesError,
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
  const groupedCategories = useMemo(() => groupCategories(categories), [categories]);
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
                className="flex h-9 w-9 items-center justify-center rounded-lg text-sm font-extrabold text-white"
                style={{ background: 'var(--color-primary-gradient)' }}
              >
                C
              </div>
              <span className="text-lg font-extrabold text-slate-900">ChrisHub</span>
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
                  className="absolute right-1.5 top-1/2 -translate-y-1/2 rounded-md bg-[#0a2e5c] px-3 py-1.5 text-xs font-bold text-white hover:bg-[#061d3b]"
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
                className="rounded-lg bg-[#0a2e5c] px-3 py-2 text-xs font-bold !text-white hover:bg-[#061d3b] sm:text-sm"
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

      <div className="container-app py-6">
        {/* New Hero Section */}
        <section className="relative overflow-hidden rounded-[2.5rem] bg-[var(--color-primary-soft)] px-6 py-16 md:px-12 md:py-20 mb-8">
          <div className="relative z-10 max-w-2xl">
            <h1 className="text-4xl md:text-5xl font-black text-[#1e293b] leading-[1.1] mb-8 tracking-tight">
              Find the perfect expert for any task.
            </h1>

            <div className="space-y-6">
              {/* Search Bar */}
              <form onSubmit={onSubmitSearch} className="relative group">
                <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#0a2e5c] transition-colors">
                  <Search size={20} />
                </div>
                <input
                  type="text"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder="What service do you need today?"
                  className="w-full h-16 pl-14 pr-32 bg-white rounded-2xl shadow-sm border border-transparent focus:border-[#0a2e5c] focus:ring-4 focus:ring-blue-50 outline-none text-[15px] font-bold text-slate-700 transition-all"
                />
                <button
                  type="submit"
                  className="absolute right-2 top-2 bottom-2 px-8 bg-[#0a2e5c] text-white font-black rounded-xl hover:bg-[#061d3b] transition-colors"
                >
                  Search
                </button>
              </form>

              {/* Pill Filters */}
              <div className="flex flex-wrap items-center gap-3">
                <div className="relative">
                  <select
                    value={sort}
                    onChange={(e) => updateParams({ sort: e.target.value })}
                    className="appearance-none h-11 pl-4 pr-10 bg-white border border-slate-100 rounded-full text-[13px] font-black text-slate-600 outline-none cursor-pointer hover:border-[#0a2e5c] transition-all"
                  >
                    {SORT_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                    <Filter size={14} />
                  </div>
                </div>

                <div className="relative flex-1 min-w-[140px] max-w-[180px]">
                  <MapPin size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={locationInput}
                    onChange={(e) => setLocationInput(e.target.value)}
                    onBlur={applyLocationFilter}
                    placeholder="Location"
                    className="w-full h-11 pl-10 pr-4 bg-white border border-slate-100 rounded-full text-[13px] font-black text-slate-700 outline-none focus:border-[#0a2e5c] transition-all"
                  />
                </div>

                <div className="relative flex-1 min-w-[160px] max-w-[220px]">
                  <Layers size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold" />
                  <select
                    value={category}
                    onChange={(e) => handleCategoryChange(e.target.value)}
                    disabled={categoriesLoading || categoriesError}
                    className="appearance-none w-full h-11 pl-10 pr-4 bg-white border border-slate-100 rounded-full text-[13px] font-black text-slate-600 outline-none cursor-pointer hover:border-[#0a2e5c] transition-all"
                  >
                    <option value="">
                      {categoriesLoading
                        ? 'Loading categories...'
                        : categoriesError
                          ? 'Unable to load categories'
                          : 'All Categories'}
                    </option>
                    {!categoriesLoading && !categoriesError && categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center gap-3 ml-2">
                  <span className="text-[13px] font-black text-slate-500">Verified only</span>
                  <button
                    type="button"
                    onClick={() => updateParams({ verified: !verified ? '1' : '' })}
                    className={`relative w-12 h-6 rounded-full transition-colors ${verified ? 'bg-[#0a2e5c]' : 'bg-slate-300'}`}
                  >
                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${verified ? 'left-7' : 'left-1'}`} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>



        {/* Services Section */}
        <section>
          <ServiceGrid
            services={services}
            isLoading={servicesLoading}
            isError={servicesError}
            isFetching={servicesFetching}
            onClearFilters={clearAllFilters}
          />

          {pagination.lastPage > 1 ? (
            <div className="mt-8 flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
              <p className="text-sm font-bold text-slate-400">
                Showing <span className="text-[#1e293b]">{pagination.from}-{pagination.to}</span> of <span className="text-[#1e293b]">{pagination.total}</span> listings
              </p>

              <div className="inline-flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => changePage(pagination.currentPage - 1)}
                  disabled={pagination.currentPage <= 1}
                  className="h-10 px-4 rounded-xl border border-slate-100 text-[13px] font-black text-slate-700 disabled:opacity-30 hover:bg-slate-50 transition-colors"
                >
                  Previous
                </button>

                <div className="flex items-center gap-1">
                  {visiblePages.map((pageNumber) => (
                    <button
                      key={pageNumber}
                      type="button"
                      onClick={() => changePage(pageNumber)}
                      className={`h-10 min-w-[40px] rounded-xl text-[13px] font-black transition-all ${
                        pageNumber === pagination.currentPage
                          ? 'bg-[#0a2e5c] text-white shadow-lg shadow-blue-100'
                          : 'text-slate-500 hover:bg-slate-50'
                      }`}
                    >
                      {pageNumber}
                    </button>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() => changePage(pagination.currentPage + 1)}
                  disabled={pagination.currentPage >= pagination.lastPage}
                  className="h-10 px-4 rounded-xl border border-slate-100 text-[13px] font-black text-slate-700 disabled:opacity-30 hover:bg-slate-50 transition-colors"
                >
                  Next
                </button>
              </div>
            </div>
          ) : null}
        </section>
      </div>
    </div>
  );
}

