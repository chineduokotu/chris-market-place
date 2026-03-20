import { Link } from "react-router-dom";
import { BadgeCheck, MapPin, ShieldCheck, User } from "lucide-react";

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
  const providerName =
    service.user?.name || service.provider_name || "Service Provider";
  const description =
    service.description ||
    "Professional service listing with quick response and reliable delivery.";
  const categoryName = service.category?.name || "General Service";
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
    <article className="group flex h-full flex-col overflow-hidden rounded-[20px] border border-[color-mix(in_srgb,var(--color-primary)_35%,white)] bg-white shadow-[0_14px_32px_rgba(15,23,42,0.08)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_42px_rgba(37,99,235,0.16)]">
      <Link to={`/services/${service.id}`} className="block">
        <div className="relative aspect-[4/5] w-full overflow-hidden bg-slate-100">
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

          <div className="absolute inset-x-0 top-0 p-3">
            <div className="flex items-start justify-between gap-2">
              <div className="max-w-[70%] rounded-full bg-black/45 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-white/90 backdrop-blur-sm">
                {categoryName}
              </div>
              {isVerified ? (
                <span className="inline-flex items-center gap-1 rounded-full bg-white/92 px-2.5 py-1 text-[10px] font-bold uppercase text-slate-900 shadow-sm">
                  <ShieldCheck size={10} className="text-sky-600" />
                  Verified
                </span>
              ) : null}
            </div>
          </div>

          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/65 via-black/15 to-transparent p-3 pt-10">
            <p className="line-clamp-1 text-[11px] font-semibold text-white/85">
              {providerName}
            </p>
            <h3 className="line-clamp-2 text-sm font-extrabold leading-5 text-white drop-shadow-sm sm:text-base">
              {service.title}
            </h3>
          </div>

          <div className="absolute left-3 top-14 inline-flex items-center gap-1">
            {isPromoted ? (
              <span className=" bg-amber-400 px-2 py-1 text-[10px] font-bold uppercase text-slate-900 shadow-sm">
                Promoted
              </span>
            ) : null}
          </div>
        </div>
      </Link>

      <div className="flex flex-1 flex-col gap-2.5 p-2.5 sm:p-3">
        <p className="text-[15px] font-black leading-none text-emerald-600 sm:text-lg">
          {showPrice ? priceFormatter.format(price) : "Contact for price"}
        </p>

        <Link to={`/services/${service.id}`}>
          <h3 className="line-clamp-2 text-[15px] font-extrabold leading-6 text-slate-900 transition-colors group-hover:text-[var(--color-primary)]">
            {service.title}
          </h3>
        </Link>

        <p className="line-clamp-3 text-sm leading-6 text-slate-500">
          {description}
        </p>

        <div className="mt-auto flex items-end justify-between gap-2 pt-0.5">
          <p className="line-clamp-2 inline-flex flex-1 items-center gap-1.5 text-xs font-semibold text-slate-500">
            <MapPin size={13} className="shrink-0" />
            <span>{location}</span>
          </p>

          <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-[10px] bg-[var(--color-primary-soft)] text-slate-400">
            {isVerified ? <BadgeCheck size={15} className="text-emerald-500" /> : <User size={15} />}
          </span>
        </div>

        <div className="flex items-center justify-between border-t border-slate-100 pt-2">
          <span className="line-clamp-1 text-[11px] font-bold uppercase tracking-[0.14em] text-slate-400">
            {categoryName}
          </span>

          <span
            className={`inline-flex items-center gap-1 text-[11px] font-semibold ${isVerified ? "text-emerald-600" : "text-slate-400"}`}
          >
            {isVerified ? (
              <>
                <BadgeCheck size={12} />
                Verified
              </>
            ) : (
              "Profile"
            )}
          </span>
        </div>
      </div>
    </article>
  );
}
