import Rating from"./Rating";
import LazyImage from"./LazyImage";
import { cn } from"../lib/utils";
import FavoriteButton from"./FavoriteButton";

export type StoreCardProps = {
 name: string;
 type: string;
 location: string;
 rating: number;
 image: string;

 status?:"open"|"closed";
 statusLabel?: string; // translated"Open"/"Closed"

 deliveryFee?: string; //"$1.99 delivery"
 services?: string[]; // ["Delivery","Subscriptions"]
 discount?: string; //"30% OFF"
 isFavorite?: boolean;

 logoText?: string; // e.g."Grocerystore"
 onClick?: () => void;
 onToggleFavorite?: () => void;

 // translate service keys (optional)
 t?: (key: string) => string;
 className?: string;
};

function serviceToKey(service: string) {
 if (service ==="24/7") return"24_7";
 return service.toLowerCase().replace(/\s+/g,"_").replace(/-/g,"_");
}

export default function StoreCard({
 name,
 type,
 location,
 rating,
 image,
 status ="open",
 statusLabel ="Open",
 deliveryFee,
 services = [],
 discount,
 isFavorite = false,
 onClick,
 onToggleFavorite,
 t,
 className,
}: StoreCardProps) {
 const isOpen = status ==="open";

 return (
 <div
 role={onClick ?"button": undefined}
 tabIndex={onClick ? 0 : undefined}
 onClick={onClick}
 onKeyDown={(e) => {
 if (!onClick) return;
 if (e.key ==="Enter"|| e.key ==="") onClick();
 }}
 className={cn(
"group w-full overflow-hidden rounded-2xl bg-custom-primary shadow-sm ring-1 ring-black/5 transition hover:shadow-md",
 onClick &&"cursor-pointer",
 className
 )}
 >
 {/* Image */}
 <div className="relative h-52 w-full">
 <LazyImage
 src={image}
 alt={name}
 className="h-full w-full object-cover"
 wrapperClassName="h-full w-full"
 />

 {/* Status pill (top-left) - Green oval */}
 {isOpen && (
 <span className="absolute left-4 top-4 rounded-full bg-emerald-500 px-4 py-1.5 text-xs font-semibold text-white shadow-sm">
 {statusLabel}
 </span>
 )}

 {/* Favorite Button (top-right) */}
 <div className="absolute right-3 top-3 z-10">
 <FavoriteButton
 isFavorite={isFavorite}
 onToggle={(e) => {
 e.stopPropagation();
 onToggleFavorite?.();
 }}
 size="md"
 ariaLabel="Toggle favorite"
 />
 </div>

 {/* Rating badge (bottom-left) - Gray rectangular with yellow star */}
 <div className="absolute left-3 bottom-3 z-10 bg-blue-off rounded-sm">
 <Rating rating={rating} size="sm"className="px-2 py-1"/>
 </div>
 </div>

 {/* Body - Light green background */}
 <div className="bg-green-50 px-5 pb-5 pt-4">
 {/* Restaurant Name */}
 <h3 className="text-lg font-bold text-slate-900">{name}</h3>

 {/* Type and Location */}
 <p className="mt-1 text-sm text-slate-600">
 {type} <span className="mx-1">•</span> {location}
 </p>

 {/* Services and Discount badges */}
 <div className="flex flex-row justify-between mt-4">
 <div className="flex flex-wrap items-center gap-2">
 {/* Services badges - Light blue oval for Delivery */}
 {services.map((service) => {
 const key = serviceToKey(service);
 const label = t ? t(`home.${key}`) : service;

 return (
 <span
 key={service}
 className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700"
 >
 {label || service}
 </span>
 );
 })}

 {/* Discount badge - Light pink oval */}
 {discount && (
 <span className="rounded-full bg-pink-100 px-3 py-1 text-xs font-medium text-red-600">
 {discount}
 </span>
 )}

 {/* Discount badge - Red rectangular */}
 {discount && (
 <span className="rounded-lg bg-red-500 px-2.5 py-1 text-xs font-semibold text-white">
 {discount}
 </span>
 )}
 </div>

 {/* Delivery fee (bottom-right) */}
 {deliveryFee && (
 <div className="flex">
 <span className="text-sm font-medium text-slate-600">
 {deliveryFee}
 </span>
 </div>
 )}
 </div>
 </div>
 </div>
 );
}
