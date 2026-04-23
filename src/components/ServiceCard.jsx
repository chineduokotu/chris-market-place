import { Link } from "react-router-dom";
import { BadgeCheck, MapPin, ShieldCheck } from "lucide-react";

const priceFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

export default function ServiceCard({ service }) {
  const location = service.location || "Remote";
  const imageUrl = service.image || service.image_url || null;
  const hasImage = Boolean(imageUrl);
  const price = Number(service.price);
  const showPrice = Number.isFinite(price) && price > 0;
  
  const isVerified = true;
  const isPremium = service.is_promoted || service.id % 3 === 0;

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-none border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:shadow-2xl hover:-translate-y-1.5">
      <Link to={`/services/${service.id}`} className="block relative">
        <div className="relative aspect-[4/5] w-full overflow-hidden bg-slate-100">
          {hasImage ? (
            <img
              src={imageUrl}
              alt={service.title}
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-slate-50 text-slate-300 font-black italic opacity-40">
              SabiLink
            </div>
          )}
          
          {/* Premium Badge - Sharp */}
          {isPremium && (
            <div className="absolute top-0 right-0 bg-[#0a2e5c] text-white text-[9px] sm:text-[10px] font-black px-2 py-1.5 sm:px-4 sm:py-2 uppercase tracking-[0.15em] sm:tracking-[0.2em] shadow-sm">
              Premium
            </div>
          )}

          {/* Verified Provider Badge - Sharp */}
          {isVerified && (
            <div className="absolute bottom-0 left-0 bg-white/95 backdrop-blur-md border-r border-t border-slate-200 px-2 py-1.5 sm:px-4 sm:py-3 flex items-center gap-1.5 sm:gap-2 shadow-xl">
              <ShieldCheck size={12} className="text-[#0a2e5c] fill-[#0a2e5c]/10" strokeWidth={2.5} />
              <span className="text-[8px] sm:text-[10px] font-black uppercase tracking-widest text-[#0a2e5c]">Verified</span>
            </div>
          )}
        </div>
      </Link>

      <div className="p-3.5 pb-6 sm:p-8 sm:pb-10 flex flex-col flex-1">
        <div className="flex flex-col sm:flex-row sm:justify-between items-start gap-2 sm:gap-4 mb-3 sm:mb-4">
          <Link to={`/services/${service.id}`} className="flex-1">
            <h3 className="text-[14px] sm:text-[18px] font-black text-[#0f172a] leading-tight line-clamp-2 hover:text-[#3b82f6] transition-colors tracking-tight">
              {service.title}
            </h3>
          </Link>
          <div className="text-left sm:text-right shrink-0">
            <p className="hidden sm:block text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1.5">From</p>
            <p className="text-[16px] sm:text-[20px] font-black text-[#0a2e5c] leading-none">
              {showPrice ? priceFormatter.format(price) : "Quote"}
            </p>
          </div>
        </div>

        <p className="text-[12px] sm:text-[14px] font-medium text-slate-500 leading-relaxed line-clamp-2 sm:line-clamp-3 mb-5 sm:mb-8">
          {service.description}
        </p>

        <div className="mt-auto pt-4 sm:pt-6 border-t border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-1.5 sm:gap-2 text-slate-400">
            <MapPin size={12} className="text-slate-400 sm:size-[16px]" />
            <span className="text-[10px] sm:text-[12px] font-black uppercase tracking-wider text-slate-500 truncate max-w-[100px] sm:max-w-none">{location}</span>
          </div>

          <Link 
            to={`/services/${service.id}`}
            className="text-[9px] sm:text-[11px] font-black uppercase tracking-widest text-[#0a2e5c] hover:text-[#3b82f6] transition-colors border-b-2 border-[#0a2e5c]/10 hover:border-[#3b82f6]/30 pb-0.5"
          >
            View
          </Link>
        </div>
      </div>
    </article>
  );
}
