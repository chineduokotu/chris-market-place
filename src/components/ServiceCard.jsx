import { Link } from 'react-router-dom';
import { Star, MapPin, ArrowUpRight, Clock, Briefcase } from 'lucide-react';

export default function ServiceCard({ service, variant = 'default' }) {
  const hasImage = !!service.image;
  const priceValue = Number(service.price);
  const hasPrice = Number.isFinite(priceValue) && priceValue > 0;
  const location = service.location || service.user?.location || 'Remote / Local';

  const isCompact = variant === 'compact';

  return (
    <div className={`group bg-white rounded-lg border border-slate-100 hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col h-full cursor-pointer ${isCompact ? 'max-w-[180px]' : ''}`}>
      {/* Image Section - Jiji Pattern */}
      <div className={`relative overflow-hidden bg-slate-50 ${isCompact ? 'aspect-square' : 'aspect-[4/3]'}`}>
        {hasImage ? (
          <img
            src={service.image}
            alt={service.title}
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-slate-50">
            <Briefcase size={isCompact ? 24 : 32} className="text-slate-200" />
          </div>
        )}

        {/* Category Badge - Jiji Pattern */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          <span className="text-[9px] font-bold text-white bg-slate-800/80 backdrop-blur-sm px-2 py-1 rounded shadow-sm uppercase tracking-tighter">
            {service.category?.name || 'Service'}
          </span>
        </div>
      </div>

      {/* Content Section */}
      <div className={`${isCompact ? 'p-2' : 'p-3'} flex flex-col flex-1`}>
        {/* Title */}
        <Link to={`/services/${service.id}`}>
          <h3 className={`${isCompact ? 'text-[11px]' : 'text-sm'} font-semibold text-slate-800 hover:text-black transition-colors line-clamp-2 mb-1 leading-tight`}>
            {service.title}
          </h3>
        </Link>

        {/* Call to Action - Jiji Green */}
        <div className={`${isCompact ? 'text-[10px]' : 'text-xs'} font-black text-black mt-1.5 uppercase tracking-wider`}>
          Request Service!
        </div>

        {/* Location & Meta */}
        <div className="mt-auto pt-2 flex items-center justify-between text-[10px] text-slate-500 font-medium">
          <div className="flex items-center gap-1">
            <MapPin size={isCompact ? 10 : 12} />
            <span className="line-clamp-1">{location}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
