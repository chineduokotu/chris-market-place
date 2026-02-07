import { useQuery } from '@tanstack/react-query';
import { Link, useSearchParams } from 'react-router-dom';
import { useEffect, useState, useMemo } from 'react';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';
import {
  Briefcase, ArrowRight, Shield, Star, CheckCircle, Search, MapPin, Quote, Filter, X,
  Home as HomeIcon, Droplets, Zap, GraduationCap, Dumbbell, Camera, Code, Palette, Smartphone,
  Wrench, Hammer, Scissors, Truck, Utensils, Heart, Music, ShoppingBag
} from 'lucide-react';
import ServiceCard from '../components/ServiceCard';
import { setMeta } from '../lib/seo';


export default function Home() {
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('search') || '');
  const [showFilters, setShowFilters] = useState(false);

  // Sync state with search params
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

  const { data: categories, isLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const response = await api.get('/categories');
      return response.data;
    },
  });

  const { data: servicesData, isLoading: servicesLoading } = useQuery({
    queryKey: ['services'],
    queryFn: async () => {
      const response = await api.get('/services');
      return response.data;
    },
  });

  const category = searchParams.get('category');
  const searchQuery = searchParams.get('search');

  const filteredServices = useMemo(() => {
    // Defensive extraction of real services from API response
    const apiServices = Array.isArray(servicesData?.data) ? servicesData.data : [];

    let results = [...apiServices];

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      results = results.filter((s) =>
        s.title?.toLowerCase().includes(q) || s.description?.toLowerCase().includes(q)
      );
    }

    if (category) {
      results = results.filter((s) => s.category_id?.toString() === category);
    }

    return results;
  }, [servicesData, searchQuery, category]);

  // Map category names to relevant icons
  const getCategoryIcon = (name) => {
    const iconMap = {
      'Home Cleaning': HomeIcon,
      'Plumbing': Droplets,
      'Electrical': Zap,
      'Tutoring': GraduationCap,
      'Fitness Training': Dumbbell,
      'Photography': Camera,
      'Web Development': Code,
      'Graphic Design': Palette,
      'Mobile Repair': Smartphone,
      'Repair Services': Wrench,
      'Construction': Hammer,
      'Tailoring': Scissors,
      'Logistics': Truck,
      'Catering': Utensils,
      'Health & Beauty': Heart,
      'Entertainment': Music,
      'Shopping': ShoppingBag
    };
    return iconMap[name] || Briefcase;
  };

  const handleSearch = (event) => {
    event.preventDefault();
    const params = new URLSearchParams(searchParams);
    if (query.trim()) {
      params.set('search', query.trim());
    } else {
      params.delete('search');
    }
    setSearchParams(params);
  };

  const updateParams = (updates) => {
    const params = new URLSearchParams(searchParams);
    Object.entries(updates).forEach(([key, value]) => {
      if (value) params.set(key, value);
      else params.delete(key);
    });
    setSearchParams(params);
  };

  if ((isLoading || servicesLoading)) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-10 w-10 border-2 border-slate-200 border-t-black"></div>
      </div>
    );
  }

  return (
    <div className="bg-white">
      {/* Hero Section - Search Centric (Jiji Style) with Background Image */}
      <section className="relative py-12 md:py-24 overflow-hidden">
        {/* Background Image & Overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src="/assets/images/hero-bg.jpg"
            alt="Hero Background"
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=2000&q=80";
            }}
          />
          <div className="absolute inset-0 bg-black/70"></div>
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-8 tracking-tight drop-shadow-sm">
            The best way to find <span className="opacity-100 text-[#4ade80]">trusted services</span>
          </h1>

          <form onSubmit={handleSearch} className="relative max-w-2xl mx-auto" role="search">
            <div className="flex bg-white rounded-2xl overflow-hidden shadow-2xl shadow-black/20 p-1">
              <div className="flex-1 flex items-center px-4 py-2 gap-3">
                <Search size={22} className="text-slate-400" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="What service do you need?"
                  className="w-full bg-transparent border-none outline-none text-slate-800 placeholder:text-slate-400 font-semibold text-lg h-12"
                />
              </div>
              <button
                type="submit"
                className="bg-black hover:bg-slate-900 text-white px-8 md:px-10 rounded-xl font-bold transition-all active:scale-95 shadow-md flex items-center justify-center"
              >
                Search
              </button>
            </div>

            <div className="mt-8 flex flex-wrap justify-center items-center gap-3 text-sm font-semibold text-white/90">
              <span className="opacity-70 uppercase tracking-widest text-[10px] bg-white/10 px-2 py-1 rounded">Popular:</span>
              <button type="button" onClick={() => setQuery('Cleaning')} className="hover:text-[#4ade80] transition-colors bg-white/5 hover:bg-white/10 px-3 py-1 rounded-full backdrop-blur-sm border border-white/10">Cleaning</button>
              <button type="button" onClick={() => setQuery('Plumbing')} className="hover:text-[#4ade80] transition-colors bg-white/5 hover:bg-white/10 px-3 py-1 rounded-full backdrop-blur-sm border border-white/10">Plumbing</button>
              <button type="button" onClick={() => setQuery('Tutoring')} className="hover:text-[#4ade80] transition-colors bg-white/5 hover:bg-white/10 px-3 py-1 rounded-full backdrop-blur-sm border border-white/10">Tutoring</button>
            </div>
          </form>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12 relative">
        <div className="lg:grid lg:grid-cols-[260px_1fr] gap-8 items-start">

          {/* Left Sidebar - Persistent Categories (Jiji Style) */}
          <aside className="hidden lg:flex flex-col gap-4 sticky top-24 z-20">
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
              <div className="p-4 border-b border-slate-50 bg-slate-50/50">
                <h2 className="text-xs font-black uppercase tracking-widest text-slate-500">Categories</h2>
              </div>
              <div className="p-2 space-y-1">
                <button
                  onClick={() => updateParams({ category: '' })}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all duration-200 group ${!category ? 'bg-slate-50 text-[#000000]' : 'text-slate-600 hover:bg-slate-50'
                    }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-1.5 rounded-lg transition-colors ${!category ? 'bg-white shadow-sm' : 'bg-slate-100 group-hover:bg-white'}`}>
                      <Briefcase size={16} />
                    </div>
                    <span className="text-sm font-bold">All Categories</span>
                  </div>
                  <ArrowRight size={14} className={!category ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'} />
                </button>

                {categories?.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => updateParams({ category: cat.id.toString() })}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all duration-200 group ${category === cat.id.toString() ? 'bg-slate-50 text-[#000000]' : 'text-slate-600 hover:bg-slate-50'
                      }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-1.5 rounded-lg transition-colors ${category === cat.id.toString() ? 'bg-white shadow-sm' : 'bg-slate-100 group-hover:bg-white'}`}>
                        {(() => {
                          const Icon = getCategoryIcon(cat.name);
                          return <Icon size={16} />;
                        })()}
                      </div>
                      <span className="text-sm font-bold">{cat.name}</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-500">
                      <span className="text-[10px] font-bold">{cat.services_count}</span>
                      <ArrowRight size={14} className={category === cat.id.toString() ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'} />
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Sub-sidebar for Filters */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
              <h3 className="text-xs font-black uppercase tracking-widest text-slate-500 mb-4">Location</h3>
              <div className="flex items-center gap-2 px-3 py-2.5 bg-slate-50 rounded-xl border border-slate-100 group focus-within:border-slate-100 focus-within:bg-white transition-all">
                <MapPin size={16} className="text-slate-300" />
                <input
                  type="text"
                  placeholder="Searching city..."
                  className="bg-transparent border-none outline-none text-sm font-bold text-slate-700 w-full placeholder:text-slate-300"
                />
              </div>
            </div>
          </aside>

          {/* Main Feed Content - Added min-w-0 to handle horizontal scrolls correctly */}
          <main className="flex-1 min-w-0 space-y-10">

            {/* Mobile-only Category Scroll (Jiji style) */}
            <div className="lg:hidden">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-black uppercase tracking-widest text-slate-500">Categories</h3>
                <button
                  onClick={() => updateParams({ category: '' })}
                  className="text-[10px] font-bold text-[#000000] uppercase tracking-wider"
                >
                  All Categories
                </button>
              </div>
              <div className="flex overflow-x-auto gap-3 pb-2 no-scrollbar -mx-4 px-4">
                {categories?.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => updateParams({ category: cat.id.toString() })}
                    className={`flex flex-col items-center min-w-[70px] transition-all ${category === cat.id.toString() ? 'scale-105' : 'opacity-70 hover:opacity-100'
                      }`}
                  >
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-2 shadow-sm ${category === cat.id.toString() ? 'bg-[#000000] text-white' : 'bg-white text-slate-500 border border-slate-100'
                      }`}>
                      {(() => {
                        const Icon = getCategoryIcon(cat.name);
                        return <Icon size={20} />;
                      })()}
                    </div>
                    <span className={`text-[10px] font-bold text-center w-full truncate px-1 uppercase tracking-tight ${category === cat.id.toString() ? 'text-[#000000]' : 'text-slate-500'
                      }`}>
                      {cat.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>


            {/* Feed Header */}
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-6" id="marketplace-heading">
              <div>
                <h2 className="text-2xl font-black text-slate-900 tracking-tight leading-none">
                  {searchQuery ? `Results for "${searchQuery}"` : category ? `${categories?.find(c => c.id.toString() === category)?.name}` : 'Featured Services'}
                </h2>
                <p className="text-slate-500 text-sm font-medium mt-2">
                  Browse {filteredServices.length} professional listings
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-100 text-slate-700 text-xs font-bold rounded-xl hover:bg-slate-50 shadow-sm transition-all md:hidden"
                >
                  <Filter size={14} /> Filters
                </button>
                <select
                  className="px-4 py-2.5 bg-white border border-slate-100 rounded-xl text-xs font-bold text-slate-600 outline-none focus:border-[#000000] shadow-sm cursor-pointer hover:bg-slate-50"
                  defaultValue="recent"
                >
                  <option value="recent">Most Recent</option>
                  <option value="price_low">Price: Low to High</option>
                  <option value="price_high">Price: High to Low</option>
                </select>
              </div>
            </header>

            {/* Service Grid Area */}
            <div className="min-h-[400px]">
              {isLoading || servicesLoading ? (
                <div className="flex items-center justify-center h-64">
                  <div className="animate-spin rounded-full h-8 w-8 border-2 border-slate-200 border-t-black"></div>
                </div>
              ) : filteredServices.length === 0 ? (
                <div className="rounded-[2.5rem] border border-dashed border-slate-200 p-20 text-center bg-slate-50/30">
                  <div className="w-16 h-16 bg-white rounded-full shadow-sm flex items-center justify-center mx-auto mb-6">
                    <Search className="text-slate-200" size={32} />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2 text-center">No service found</h3>
                  <p className="text-slate-300 max-w-xs mx-auto text-sm leading-relaxed text-center">
                    Try adjusting your search filters or browse other categories to find what you need.
                  </p>
                  <button
                    onClick={() => setSearchParams({})}
                    className="mt-8 px-6 py-2.5 bg-white border border-slate-100 text-slate-900 font-bold rounded-xl hover:bg-slate-50 transition-all text-xs shadow-sm mx-auto flex"
                  >
                    Clear all filters
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
                  {filteredServices.map((service) => (
                    <ServiceCard key={service.id} service={service} />
                  ))}
                </div>
              )}
            </div>
          </main>
        </div>
      </div>


      {/* Features / Value Proposition Section */}
      {!user && (
        <section className="py-24 lg:py-28 bg-slate-900 text-white rounded-[2rem] sm:rounded-[3rem] mx-4 sm:mx-6 lg:mx-8 mb-24 overflow-hidden relative" aria-labelledby="features-heading">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-full opacity-10 pointer-events-none" aria-hidden>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-black/10 via-transparent to-transparent"></div>
          </div>

          <div className="max-w-7xl mx-auto px-6 sm:px-8 relative z-10">
            <div className="grid lg:grid-cols-2 gap-16 lg:gap-20 items-center">
              <div>
                <h2 id="features-heading" className="text-3xl sm:text-4xl font-bold leading-tight mb-8 tracking-tight">
                  The best way to get <br />
                  <span className="text-white">your work done.</span>
                </h2>
                <ul className="space-y-6 list-none m-0 p-0">
                  {[
                    { title: "Safe & Secure", desc: "All transactions are protected by our secure payment system.", icon: Shield },
                    { title: "Verified Pros", desc: "Work with background-checked professionals you can trust.", icon: Shield },
                    { title: "24/7 Support", desc: "Our dedicated support team is here to help you anytime.", icon: CheckCircle }
                  ].map((item, idx) => (
                    <li key={idx} className="flex gap-4">
                      <div className="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center shrink-0" aria-hidden>
                        <item.icon className="text-black" size={24} />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg mb-1 text-white">{item.title}</h3>
                        <p className="text-slate-300 text-sm leading-relaxed">{item.desc}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="relative">
                <div className="aspect-square bg-black rounded-3xl rotate-3 absolute inset-0 opacity-20"></div>
                <div className="aspect-square bg-white/5 backdrop-blur-3xl rounded-3xl relative z-10 p-8 flex items-center justify-center border border-white/10">
                  <div className="text-center">
                    <div className="text-6xl font-black mb-4">98%</div>
                    <div className="text-slate-300 font-medium">Customer satisfaction rate</div>
                    <div className="mt-12 flex justify-center">
                      <Link to="/register" className="inline-block px-8 py-4 bg-white text-slate-900 font-bold rounded-xl hover:bg-slate-100 active:scale-[0.98] transition-all duration-200">
                        Get Started Now
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
