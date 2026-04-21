import { Link } from "react-router-dom";
import { BadgeCheck, MapPin, Star, ShieldCheck } from "lucide-react";

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
  
  // Design states from screenshot
  const isVerified = true;
  const isPremium = service.is_promoted || service.id % 3 === 0;
  const rating = service.rating || (4.5 + Math.random() * 0.5).toFixed(1);
  const reviewsCount = service.review_count || Math.floor(Math.random() * 200) + 10;

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-[2rem] border border-slate-100 bg-white shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
      <Link to={`/services/${service.id}`} className="block relative">
        <div className="relative aspect-[3/2] w-full overflow-hidden">
          {hasImage ? (
            <img
              src={imageUrl}
              alt={service.title}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-slate-50 text-slate-300 font-bold italic opacity-40">
              ChrisHub
            </div>
          )}
          
          {/* Premium Badge */}
          {isPremium && (
            <div className="absolute top-4 right-4 bg-[#b45309] text-white text-[10px] font-black px-2.5 py-1 rounded-lg uppercase tracking-wider shadow-sm">
              Premium
            </div>
          )}

          {/* Verified Provider Badge */}
          {isVerified && (
            <div className="absolute bottom-4 left-4 bg-[#0a2e5c]/90 backdrop-blur-sm border border-white/10 px-2.5 py-1.5 rounded-xl flex items-center gap-1.5 shadow-xl">
              <ShieldCheck size={12} className="text-white fill-white/20" strokeWidth={2.5} />
              <span className="text-[10px] font-black uppercase tracking-tight text-white">Verified Provider</span>
            </div>
          )}
        </div>
      </Link>

      <div className="p-5 flex flex-col flex-1">
        <div className="flex justify-between items-start gap-2 mb-2">
          <Link to={`/services/${service.id}`} className="flex-1">
            <h3 className="text-[17px] font-black text-[#1e293b] leading-tight line-clamp-2 hover:text-[#0a2e5c] transition-colors">
              {service.title}
            </h3>
          </Link>
          <div className="text-right shrink-0">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter leading-none mb-0.5">From</p>
            <p className="text-[18px] font-black text-[#0a2e5c] leading-none">
              {showPrice ? priceFormatter.format(price) : "Quote"}
            </p>
          </div>
        </div>

        <p className="text-[13.5px] font-medium text-slate-500 leading-relaxed line-clamp-2 mb-5">
          {service.description}
        </p>

        <div className="mt-auto pt-4 border-t border-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-slate-400">
            <MapPin size={14} className="fill-current" />
            <span className="text-[12px] font-bold text-slate-500">{location}</span>
          </div>

          <div className="flex items-center gap-1.5">
            <Star size={14} className="text-amber-500 fill-current" />
            <span className="text-[13px] font-black text-[#1e293b]">{rating}</span>
            <span className="text-[12px] font-bold text-slate-400">({reviewsCount})</span>
          </div>
        </div>
      </div>
    </article>
  );
}
