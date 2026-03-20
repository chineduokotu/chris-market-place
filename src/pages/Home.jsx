import { useQuery } from '@tanstack/react-query';
import { Link, useSearchParams } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';
import {
  ArrowRight,
  Briefcase,
  Camera,
  Code,
  Dumbbell,
  Filter,
  GraduationCap,
  Hammer,
  Heart,
  Home as HomeIcon,
  MapPin,
  Music,
  Palette,
  Scissors,
  Search,
  ShoppingBag,
  Smartphone,
  Sparkles,
  Star,
  Truck,
  Utensils,
  Wrench,
  Zap,
} from 'lucide-react';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';
import ServiceCard from '../components/ServiceCard';
import { PageContainer } from '../components/layout/AppShell';
import {
  Badge,
  Button,
  Card,
  CardBody,
  CardHeader,
  CardSkeleton,
  Drawer,
  EmptyState,
  Input,
  Select,
} from '../components/ui';
import { setMeta } from '../lib/seo';

const iconMap = {
  'Home Cleaning': HomeIcon,
  Plumbing: Wrench,
  Electrical: Zap,
  Tutoring: GraduationCap,
  'Fitness Training': Dumbbell,
  Photography: Camera,
  'Web Development': Code,
  'Graphic Design': Palette,
  'Mobile Repair': Smartphone,
  'Repair Services': Wrench,
  Construction: Hammer,
  Tailoring: Scissors,
  Logistics: Truck,
  Catering: Utensils,
  'Health & Beauty': Heart,
  Entertainment: Music,
  Shopping: ShoppingBag,
};

const testimonials = [
  {
    name: 'Samantha, Business Owner',
    quote: 'I found a reliable designer in under 20 minutes. The platform flow is very clear.',
  },
  {
    name: 'David, Homeowner',
    quote: 'From search to messaging a provider, everything felt straightforward and fast.',
  },
];

export default function Home() {
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('search') || '');
  const [showFilters, setShowFilters] = useState(false);

  const category = searchParams.get('category');
  const searchQuery = searchParams.get('search');

  useEffect(() => {
    setQuery(searchParams.get('search') || '');
  }, [searchParams]);

  useEffect(() => {
    setMeta({
      title: 'ChrisHub | Find trusted services and ads',
      description: 'Discover professional services, compare advertisements, and book with confidence on our unified marketplace.',
      url: window.location.href,
    });
  }, []);

  const {
    data: categories,
    isLoading: categoriesLoading,
    isError: categoriesError,
  } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const response = await api.get('/categories');
      return response.data;
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    retry: 1,
  });

  const {
    data: servicesData,
    isLoading: servicesLoading,
    isError: servicesError,
  } = useQuery({
    queryKey: ['services'],
    queryFn: async () => {
      const response = await api.get('/services');
      return response.data;
    },
    staleTime: 60 * 1000,
    gcTime: 15 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    retry: 1,
  });

  const filteredServices = useMemo(() => {
    const apiServices = Array.isArray(servicesData?.data) ? servicesData.data : [];
    let results = [...apiServices];

    if (searchQuery) {
      const term = searchQuery.toLowerCase();
      results = results.filter(
        (service) =>
          service.title?.toLowerCase().includes(term) || service.description?.toLowerCase().includes(term),
      );
    }

    if (category) {
      results = results.filter((service) => service.category_id?.toString() === category);
    }

    return results;
  }, [servicesData, searchQuery, category]);

  const getCategoryIcon = (name) => iconMap[name] || Briefcase;

  const updateParams = (updates) => {
    const next = new URLSearchParams(searchParams);
    Object.entries(updates).forEach(([key, value]) => {
      if (value) next.set(key, value);
      else next.delete(key);
    });
    setSearchParams(next);
  };

  const handleSearch = (event) => {
    event.preventDefault();
    updateParams({ search: query.trim() || '' });
  };

  return (
    <div className="space-y-10 pb-14">
      <section className="hero-glow border-b border-[var(--color-border)] bg-white pb-10 pt-8">
        <PageContainer>
          <div className="grid gap-8 lg:grid-cols-[1.35fr,0.65fr] lg:items-center">
            <div className="space-y-5">
              <Badge variant="featured" className="w-fit">
                <Sparkles size={12} />
                Trusted Marketplace
              </Badge>
              <h1 className="text-[clamp(2rem,4vw,2.65rem)] font-extrabold leading-[1.08] text-[var(--color-text)]">
                Find the right service provider in one clear flow.
              </h1>
              <p className="max-w-2xl text-base leading-7 text-[var(--color-muted)]">
                Search by need, compare trusted options, review provider profiles, and start messaging instantly.
              </p>

              <form onSubmit={handleSearch} className="space-y-3">
                <div className="flex flex-col gap-3 sm:flex-row">
                  <Input
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="What service do you need?"
                    aria-label="Search services"
                    className="sm:flex-1"
                  />
                  <Button type="submit" className="sm:min-w-36">
                    <Search size={16} />
                    Search
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {['Cleaning', 'Plumbing', 'Tutoring'].map((term) => (
                    <button
                      key={term}
                      type="button"
                      onClick={() => {
                        setQuery(term);
                        updateParams({ search: term });
                      }}
                      className="rounded-full border border-[var(--color-border)] bg-white px-3 py-1.5 text-xs font-semibold text-[var(--color-muted)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]"
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </form>
            </div>

            <Card className="overflow-hidden">
              <CardBody className="space-y-4">
                <h2 className="text-base font-bold text-[var(--color-text)]">How the flow works</h2>
                <ul className="space-y-3 text-sm text-[var(--color-muted)]">
                  <li>1. Search services or browse categories</li>
                  <li>2. Review service details and provider credibility</li>
                  <li>3. Message providers and move work forward</li>
                </ul>
                <Link to="/how-it-works" className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--color-primary)]">
                  See full process
                  <ArrowRight size={14} />
                </Link>
              </CardBody>
            </Card>
          </div>
        </PageContainer>
      </section>

      <PageContainer className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-[var(--color-text)]">Discover Services</h2>
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-[var(--radius-control)] border border-[var(--color-border)] bg-white px-3 py-2 text-sm font-semibold text-[var(--color-muted)] md:hidden"
              onClick={() => setShowFilters(true)}
              aria-label="Open category filters"
            >
              <Filter size={14} />
              Filters
            </button>
            <Select aria-label="Sort services" defaultValue="recent" className="w-40">
              <option value="recent">Most Recent</option>
              <option value="price_low">Price Low-High</option>
              <option value="price_high">Price High-Low</option>
            </Select>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-[250px,1fr]">
          <aside className="hidden md:block">
            <Card>
              <CardHeader>
                <h3 className="text-sm font-bold text-[var(--color-text)]">Categories</h3>
              </CardHeader>
              <CardBody className="space-y-2">
                <button
                  type="button"
                  onClick={() => updateParams({ category: '' })}
                  className={`flex w-full items-center justify-between rounded-[10px] px-3 py-2 text-sm font-semibold ${
                    !category ? 'bg-[var(--color-primary-soft)] text-[var(--color-primary)]' : 'text-[var(--color-muted)] hover:bg-slate-100'
                  }`}
                >
                  <span className="inline-flex items-center gap-2">
                    <Briefcase size={14} />
                    All Categories
                  </span>
                </button>
                {(categories || []).map((cat) => {
                  const Icon = getCategoryIcon(cat.name);
                  const active = category === cat.id.toString();
                  return (
                    <button
                      type="button"
                      key={cat.id}
                      onClick={() => updateParams({ category: cat.id.toString() })}
                      className={`flex w-full items-center justify-between rounded-[10px] px-3 py-2 text-sm font-semibold ${
                        active ? 'bg-[var(--color-primary-soft)] text-[var(--color-primary)]' : 'text-[var(--color-muted)] hover:bg-slate-100'
                      }`}
                    >
                      <span className="inline-flex min-w-0 items-center gap-2">
                        <Icon size={14} />
                        <span className="truncate">{cat.name}</span>
                      </span>
                      <span className="text-xs">{cat.services_count ?? 0}</span>
                    </button>
                  );
                })}
              </CardBody>
            </Card>
          </aside>

          <section aria-label="Services results" className="space-y-4">
            {(categoriesLoading || servicesLoading) && (
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {[1, 2, 3, 4, 5, 6].map((item) => (
                  <CardSkeleton key={item} />
                ))}
              </div>
            )}

            {(categoriesError || servicesError) && !categoriesLoading && !servicesLoading ? (
              <EmptyState
                icon={Search}
                title="Unable to load listings"
                description="There was a problem loading categories or services. Please refresh and try again."
              />
            ) : null}

            {!categoriesLoading && !servicesLoading && !servicesError ? (
              filteredServices.length > 0 ? (
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                  {filteredServices.map((service) => (
                    <ServiceCard key={service.id} service={service} />
                  ))}
                </div>
              ) : (
                <EmptyState
                  icon={Search}
                  title="No services found"
                  description="Try another keyword or switch category filters to see more results."
                  actionLabel="Clear filters"
                  onAction={() => setSearchParams({})}
                />
              )
            ) : null}
          </section>
        </div>
      </PageContainer>

      <PageContainer className="space-y-6">
        <section className="grid gap-4 md:grid-cols-3">
          {[
            { title: 'Verified providers', text: 'Trust signals and provider details help you choose quickly.' },
            { title: 'Clear communication', text: 'Message directly inside the platform for safer conversations.' },
            { title: 'Simple booking flow', text: 'From discovery to request tracking, everything is organized.' },
          ].map((item) => (
            <Card key={item.title}>
              <CardBody className="space-y-2">
                <h3 className="text-base font-bold text-[var(--color-text)]">{item.title}</h3>
                <p className="text-sm">{item.text}</p>
              </CardBody>
            </Card>
          ))}
        </section>

        <section className="grid gap-4 md:grid-cols-2">
          {testimonials.map((item) => (
            <Card key={item.name}>
              <CardBody className="space-y-3">
                <Star size={16} className="text-[var(--color-primary)]" />
                <p className="text-sm leading-6 text-[var(--color-text)]">“{item.quote}”</p>
                <p className="text-xs font-semibold text-[var(--color-muted)]">{item.name}</p>
              </CardBody>
            </Card>
          ))}
        </section>

        {!user ? (
          <Card className="overflow-hidden border-none bg-slate-900">
            <CardBody className="flex flex-col gap-5 p-8 text-[var(--color-text)] md:flex-row md:items-center md:justify-between">
              <div className="space-y-2">
                <h2 className="text-2xl font-extrabold text-[var(--color-text)]">Ready to offer your services?</h2>
                <p className="max-w-xl text-slate-300">
                  Create your profile, publish services, and connect with clients looking for trusted experts.
                </p>
              </div>
              <Link to="/register">
                <Button className="min-w-40">Become a Provider</Button>
              </Link>
            </CardBody>
          </Card>
        ) : null}
      </PageContainer>

      <Drawer isOpen={showFilters} onClose={() => setShowFilters(false)} title="Filter categories">
        <div className="space-y-2">
          <Button
            variant={!category ? 'primary' : 'secondary'}
            className="w-full justify-start"
            onClick={() => {
              updateParams({ category: '' });
              setShowFilters(false);
            }}
          >
            All Categories
          </Button>
          {(categories || []).map((cat) => {
            const Icon = getCategoryIcon(cat.name);
            const active = category === cat.id.toString();
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => {
                  updateParams({ category: cat.id.toString() });
                  setShowFilters(false);
                }}
                className={`flex w-full items-center justify-between rounded-[10px] border px-3 py-2 text-left text-sm font-semibold ${
                  active
                    ? 'border-[var(--color-primary)] bg-[var(--color-primary-soft)] text-[var(--color-primary)]'
                    : 'border-[var(--color-border)] bg-white text-[var(--color-muted)]'
                }`}
              >
                <span className="inline-flex items-center gap-2">
                  <Icon size={14} />
                  {cat.name}
                </span>
                <span>{cat.services_count ?? 0}</span>
              </button>
            );
          })}
        </div>
      </Drawer>
    </div>
  );
}


