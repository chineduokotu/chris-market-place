import { Link } from 'react-router-dom';
import { Star, Clock, MapPin, ArrowUpRight } from 'lucide-react';

export default function ServiceCard({ service }) {
  // Use service image or show placeholder icon
  const hasImage = !!service.image;

  return (
    <div className="group bg-white rounded-xl border border-slate-200 hover:border-blue-300 hover:shadow-lg transition-all duration-300 overflow-hidden">
      {/* Image Section */}
      <div className="relative h-48 overflow-hidden bg-slate-100">
        {hasImage ? (
          <img
            src={service.image}
            alt={service.title}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200">
            <svg className="w-16 h-16 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}
        {service.category && (
          <span className="absolute top-3 left-3 text-xs font-semibold text-white bg-blue-600 px-3 py-1 rounded-full shadow-md">
            {service.category.name}
          </span>
        )}
        {/* Featured Badge (optional - shown for top services) */}
        {service.is_featured && (
          <span className="absolute top-3 right-3 text-xs font-semibold text-amber-700 bg-amber-100 px-2 py-1 rounded-full">
            Featured
          </span>
        )}
      </div>

      {/* Content Section */}
      <div className="p-5">
        {/* Title */}
        <Link to={`/services/${service.id}`}>
          <h3 className="text-lg font-semibold text-slate-900 hover:text-blue-600 transition-colors line-clamp-2 mb-2">
            {service.title}
          </h3>
        </Link>

        {/* Description */}
        <p className="text-slate-500 text-sm leading-relaxed line-clamp-2 mb-4">
          {service.description}
        </p>

        {/* Meta Info */}
        <div className="flex items-center gap-4 text-sm text-slate-500 mb-4">
          <div className="flex items-center gap-1">
            <Star size={14} className="text-amber-400 fill-amber-400" />
            <span className="font-medium text-slate-700">4.9</span>
            <span className="text-slate-400">(128)</span>
          </div>
          {service.location && (
            <div className="flex items-center gap-1">
              <MapPin size={14} />
              <span>{service.location}</span>
            </div>
          )}
        </div>

        {/* Divider */}
        <div className="border-t border-slate-100 pt-4">
          <div className="flex items-center justify-between">
            {/* Provider Info */}
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xs font-bold">
                {(service.user?.name || 'P').charAt(0).toUpperCase()}
              </div>
              <span className="text-sm text-slate-600 font-medium">
                {service.user?.name || 'Service Provider'}
              </span>
            </div>

            {/* View Button */}
            <Link
              to={`/services/${service.id}`}
              className="flex items-center gap-1 text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors"
            >
              View
              <ArrowUpRight size={16} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
