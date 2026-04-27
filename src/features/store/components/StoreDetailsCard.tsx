import {
 StoreHero,
 StoreHeader,
 StoreContacts,
 StorePerks,
 StoreSchedule,
} from"./index";
import { HiBadgeCheck, HiCash, HiSparkles, HiStar } from"react-icons/hi";
import type { StoreMeta } from"../data/mockData";
import type { StoreContactItem } from"../types";

export type { StoreContactItem };

export type StoreDetailsCardProps = {
 store: StoreMeta;
 contacts?: StoreContactItem[]; // optional override
  onFavoriteClick?: () => void;
};

export default function StoreDetailsCard({
 store,
 contacts,
  onFavoriteClick,
}: StoreDetailsCardProps) {
 const defaultContacts: StoreContactItem[] = [
    {
      type:"call",
      label:"Call",
      value: store.phone,
      onClick: () => {
        window.location.href = `tel:${store.phone}`;
      },
    },
    {
      type:"mobile",
      label:"Mobile",
      value: store.mobile,
      onClick: () => {
        window.location.href = `tel:${store.mobile}`;
      },
    },
    {
      type:"email",
      label:"Email",
      value: store.email,
      onClick: () => {
        window.location.href = `mailto:${store.email}`;
      },
    },
    { type:"accepting", label:"Accepting orders" },
 ];

 const finalContacts = contacts ?? defaultContacts;
  const summaryCards = [
    {
      key:"rating",
      label:"Average rating",
      value: store.rating.toFixed(1),
      caption: `${store.ratingsCount ?? 0} reviews`,
      icon: HiStar,
    },
    {
      key:"pricing",
      label:"Pricing",
      value: store.pricingTier ||"Not specified",
      caption: store.isRecommended ?"Recommended":"Standard",
      icon: HiCash,
    },
    {
      key:"status",
      label:"Status",
      value: store.status ==="open"?"Open now":"Closed",
      caption: store.isActive ?"Verified listing":"Inactive listing",
      icon: HiBadgeCheck,
    },
  ];

 return (
 <div
 className="overflow-hidden rounded-3xl border bg-custom-card shadow-xl"
 style={{
 borderColor:"var(--color-border-accent-light)",
 boxShadow:"0 24px 50px -24px var(--color-shadow-accent)",
 }}
 >
 <StoreHero
 heroImage={store.heroImage}
 storeName={store.name}
 tags={store.tags}
 />

 <div
 className="relative space-y-6 p-6 md:p-8"
 style={{
 background:
 "linear-gradient(145deg, color-mix(in srgb, var(--color-main) 12%, white) 0%, color-mix(in srgb, var(--color-api-second) 20%, white) 100%)",
 }}
 >
 <StoreHeader
 logo={store.logo}
 name={store.name}
 category={store.category}
 rating={store.rating}
 city={store.city}
 address={store.address}
        isFavorite={store.isFavorite}
        onFavoriteClick={onFavoriteClick}
 />

 {store.description && (
 <p className="max-w-4xl text-sm leading-6 text-custom-secondary">
 {store.description}
 </p>
 )}

 <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
 {summaryCards.map((card) => {
 const Icon = card.icon;

 return (
 <div
 key={card.key}
 className="rounded-2xl border p-4"
 style={{
 borderColor:"var(--color-border-accent-light)",
 backgroundColor:"color-mix(in srgb, var(--color-main) 8%, white)",
 }}
 >
 <div className="mb-2 inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/80 text-primary-light">
 <Icon className="h-4 w-4" />
 </div>
 <p className="text-xs font-semibold uppercase tracking-[0.18em] text-custom-tertiary">
 {card.label}
 </p>
 <p className="mt-1 text-lg font-bold capitalize text-custom-primary">
 {card.value}
 </p>
 <p className="text-xs text-custom-secondary">{card.caption}</p>
 </div>
 );
 })}
 </div>

 <div className="flex flex-wrap gap-2">
 {store.paymentMethods?.map((method) => (
 <span
 key={method}
 className="inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-semibold text-custom-primary"
 style={{
 borderColor:"var(--color-border-accent-light)",
 backgroundColor:"color-mix(in srgb, var(--color-api-second) 18%, white)",
 }}
 >
 <HiSparkles className="h-3.5 w-3.5 text-primary-light" />
 {method}
 </span>
 ))}
 {store.isServiceProvider && (
 <span className="inline-flex items-center rounded-full border border-emerald-300 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
 Service provider
 </span>
 )}
 {store.isRestaurant && (
 <span className="inline-flex items-center rounded-full border border-orange-300 bg-orange-50 px-3 py-1 text-xs font-semibold text-orange-700">
 Restaurant
 </span>
 )}
 </div>

      <div className="flex flex-col gap-6">
        <div className="space-y-4">
 <StoreContacts contacts={finalContacts} />
          <StoreSchedule
            schedule={store.schedule}
            workingHours={store.workingHours}
            status={store.status}
          />
 </div>
 </div>

 <StorePerks perks={store.perks} />
 {store.services?.length ? (
 <div className="rounded-2xl border border-custom-primary/15 bg-white/75 p-4">
 <h3 className="mb-3 text-sm font-semibold uppercase tracking-[0.15em] text-custom-tertiary">
 Services
 </h3>
 <div className="flex flex-wrap gap-2">
 {store.services.map((service, index) => (
 <span
 key={`${service.label}-${index}`}
 className="rounded-full border border-primary-light/25 bg-custom-card px-3 py-1 text-xs font-semibold text-custom-primary"
 >
 {service.label}
 </span>
 ))}
 </div>
 </div>
 ) : null}
 </div>
 </div>
 );
}
