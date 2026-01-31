import { useQuery } from '@tanstack/react-query';
import { useSearchParams , Link } from 'react-router-dom';
import api from '../api/client';
import ServiceCard from '../components/ServiceCard';
import { Search, Grid3X3, LayoutList, SlidersHorizontal } from 'lucide-react';
import { useState } from 'react';

export default function ServiceList() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [viewMode, setViewMode] = useState('list'); // 'grid' or 'list'
  const categoryId = searchParams.get('category');

  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const response = await api.get('/categories');
      return response.data;
    },
  });

  const { data: servicesData, isLoading } = useQuery({
    queryKey: ['services', categoryId],
    queryFn: async () => {
      const params = categoryId ? { category_id: categoryId } : {};
      const response = await api.get('/services', { params });
      return response.data;
    },
  });

  const handleCategoryChange = (e) => {
    const value = e.target.value;
    if (value) {
      setSearchParams({ category: value });
    } else {
      setSearchParams({});
    }
  };

  const servicesCount = servicesData?.data?.length || 0;

  return (
    <div className="bg-slate-50 min-h-screen">
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            Find Professional Services
          </h1>
          <p className="text-blue-100 text-lg max-w-2xl">
            Browse through our curated list of professional services from verified providers.
          </p>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-4">
            {/* Left: Results count & Category filter */}
            <div className="flex items-center gap-4">
              <span className="text-sm text-slate-600">
                <strong className="text-slate-900">{servicesCount}</strong> services found
              </span>
              
              <div className="relative">
                <SlidersHorizontal className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <select
                  value={categoryId || ''}
                  onChange={handleCategoryChange}
                  className="pl-9 pr-8 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all appearance-none cursor-pointer"
                >
                  <option value="">All Categories</option>
                  {categories?.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Right: View toggle */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-500 mr-2">View:</span>
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'grid'
                    ? 'bg-blue-100 text-blue-600'
                    : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                }`}
                title="Grid view"
              >
                <Grid3X3 size={18} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'list'
                    ? 'bg-blue-100 text-blue-600'
                    : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                }`}
                title="List view"
              >
                <LayoutList size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isLoading ? (
          <div className={`grid gap-6 ${
            viewMode === 'grid' 
              ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
              : 'grid-cols-1'
          }`}>
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div
                key={i}
                className="bg-white rounded-xl border border-slate-200 overflow-hidden animate-pulse"
              >
                <div className="h-48 bg-slate-200"></div>
                <div className="p-5 space-y-3">
                  <div className="h-4 bg-slate-200 rounded w-3/4"></div>
                  <div className="h-3 bg-slate-200 rounded w-full"></div>
                  <div className="h-3 bg-slate-200 rounded w-2/3"></div>
                </div>
              </div>
            ))}
          </div>
        ) : servicesData?.data?.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl border border-slate-200">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="text-slate-400" size={28} />
            </div>
            <h3 className="text-xl font-semibold text-slate-900 mb-2">No services found</h3>
            <p className="text-slate-500 mb-6">
              Try adjusting your filters or check back later for new services.
            </p>
            <button
              onClick={() => setSearchParams({})}
              className="px-5 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          viewMode === 'grid' ? (
            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {servicesData?.data?.map((service) => (
                <ServiceCard key={service.id} service={service} />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden divide-y divide-slate-100 max-w-3xl">
              {servicesData?.data?.map((service) => (
                <Link
                  key={service.id} 
                  to={`/services/${service.id}`}
                  className="flex items-center gap-4 p-4 hover:bg-slate-50 transition-colors group"
                >
                  {/* Service Image Thumbnail */}
                  <div className="w-16 h-16 rounded-xl overflow-hidden bg-slate-100 flex-shrink-0">
                    {service.image ? (
                      <img
                        src={service.image}
                        alt={service.title}
                        loading="lazy"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200">
                        <svg className="w-8 h-8 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                    )}
                  </div>
                  
                  {/* Service Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-slate-900 group-hover:text-blue-600 transition-colors truncate">
                      {service.title}
                    </h3>
                    <p className="text-sm text-green-600 font-medium">
                      {service.category?.name || 'Uncategorized'}
                    </p>
                  </div>
                  
                  {/* Arrow indicator */}
                  <div className="text-slate-400 group-hover:text-blue-600 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                </Link>
              ))}
            </div>
          )
        )}
      </div>
    </div>
  );
}
