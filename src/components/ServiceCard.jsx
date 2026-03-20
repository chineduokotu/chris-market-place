import { Link } from "react-router-dom";
import { BadgeCheck, Crown, MapPin, User, BrainCircuit } from "lucide-react";

const priceFormatter = new Intl.NumberFormat("en-NG", {
  style: "currency",
  currency: "NGN",
  currencyDisplay: "narrowSymbol",
  maximumFractionDigits: 0,
});

export default function ServiceCard({ service }) {
  const location =
    service.location ||
    service.user?.location ||
    service.provider_location ||
    "Remote / Local";
  const imageUrl =
    service.image || service.image_url || service.thumbnail || null;
  const hasImage = Boolean(imageUrl);
  const price = Number(service.price);
  const showPrice = Number.isFinite(price) && price > 0;
  const description =
    service.description ||
    "Professional service listing with quick response and reliable delivery.";
  
  const isVerified = Boolean(
    service.is_verified ||
    service.verified ||
    service.user?.is_verified ||
    service.user?.verified ||
    service.user?.verification_level === "verified",
  );
  const isPromoted = Boolean(
    service.is_promoted || service.promoted || service.priority === "promoted",
  );

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-md border-[1.5px] border-green-600 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
      <Link to={`/services/${service.id}`} className="block">
        <div className="relative aspect-[3.5/4] w-full overflow-hidden bg-slate-100">
          {hasImage ? (
            <img
              src={imageUrl}
              alt={service.title}
              loading="lazy"
              decoding="async"
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.05]"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-[linear-gradient(180deg,#dbeafe_0%,#bfdbfe_50%,#eff6ff_100%)] px-4 text-center text-sm font-semibold text-slate-500">
              No image available
            </div>
          )}

          {/* Bottom-left dark box icon as seen in screenshot */}
          <div className="absolute bottom-3 left-3 flex h-8 w-8 items-center justify-center rounded-[10px] bg-[#0a0f1d] shadow-sm">
             <BrainCircuit size={16} className="text-white" />
          </div>
        </div>
      </Link>

      <div className="flex flex-1 flex-col p-3">
        <p className="flex items-baseline gap-1.5 text-lg font-bold text-green-600">
          <span className="underline decoration-2 underline-offset-2">
            {showPrice ? priceFormatter.format(price) : "Contact for price"}
          </span>
          {showPrice && (
            <span className="text-[13px] font-normal underline decoration-1 underline-offset-2">
              per service
            </span>
          )}
        </p>

        <Link to={`/services/${service.id}`} className="mt-1">
          <h3 className="line-clamp-2 text-[15px] font-normal leading-5 text-slate-900 underline decoration-1 underline-offset-2 hover:text-green-700">
            {service.title}
          </h3>
        </Link>

        <p className="mt-1.5 line-clamp-3 text-sm leading-[1.35rem] text-slate-500">
          {description}
        </p>

        <div className="mt-auto flex items-end justify-between pt-3">
          <p className="line-clamp-1 flex flex-1 items-center gap-1.5 text-[13px] text-slate-500">
            <MapPin size={14} className="shrink-0 text-slate-500" />
            <span>{location}</span>
          </p>

          <span className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded bg-slate-100/80 shadow-sm border border-slate-100">
            {isPromoted ? (
              <Crown size={14} className="text-amber-500 drop-shadow-sm" />
            ) : isVerified ? (
              <BadgeCheck size={14} className="text-emerald-500" />
            ) : null}
          </span>
        </div>
      </div>
    </article>
  );
}
