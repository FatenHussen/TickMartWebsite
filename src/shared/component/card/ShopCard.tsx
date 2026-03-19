import { cn } from"@/shared/lib/utils";
import Rating from"../Rating";
import FavoriteButton from"../FavoriteButton";

const DEFAULT_STORE_IMAGE =
"https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400";

type ShopCardProps = {
 id: number | string;
 name: string;
 description?: string | null;
 image?: string | null;
 isOpenNow?: boolean;
 rating?: number;
 deliveryPrice?: string | number | null;
 discountLabel?: string | null;
 isFavorite?: boolean;
 onFavorite?: (id: number | string) => void;
 onClick?: () => void;
 className?: string;
};

export default function ShopCard({
 id,
 name,
 description,
 image,
 isOpenNow = false,
 rating = 0,
 deliveryPrice,
 discountLabel,
 isFavorite = false,
 onFavorite,
 onClick,
 className,
}: ShopCardProps) {
 const imageSrc = image || DEFAULT_STORE_IMAGE;
 const deliveryText =
 deliveryPrice != null && deliveryPrice !==""
 ? typeof deliveryPrice ==="number"
 ? `£${deliveryPrice.toFixed(2)} delivery`
 : String(deliveryPrice)
 : null;

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
"overflow-hidden rounded-xl bg-custom-card shadow-sm transition-shadow hover:shadow-md flex flex-col h-full",
 onClick &&"cursor-pointer",
 className
 )}
 >
 {/* Image area */}
 <div className="relative aspect-[4/3] w-full overflow-hidden bg-custom-muted">
 <img
 src={imageSrc}
 alt={name}
 className="h-full w-full object-cover"
 loading="lazy"
 />
 {/* Open badge - top left */}
 {isOpenNow && (
 <span className="absolute left-3 top-3 rounded-full bg-green-500 px-2.5 py-0.5 text-xs font-medium text-white">
 Open
 </span>
 )}
 {/* Favorite - top right */}
 <div className="absolute right-3 top-3 z-10">
 <FavoriteButton
 isFavorite={isFavorite}
 onToggle={(e) => {
 e.stopPropagation();
 onFavorite?.(id);
 }}
 size="sm"
 ariaLabel="Toggle favorite"
 />
 </div>
 {/* Rating badge - bottom left */}
 <div className="absolute bottom-3 left-3 rounded-lg bg-gray-800/80 px-2 py-1">
 <Rating
 rating={rating}
 size="sm"
 className="text-white [&>span:last-child]:text-white"
 />
 </div>
 </div>

 {/* Info area - light green background */}
 <div className="rounded-b-xl bg-[#e8f5e9] p-4 flex flex-col flex-1">
 <h3 className="mb-1 text-base font-bold text-custom-primary">{name}</h3>
 {description && (
 <p className="mb-3 text-sm text-custom-secondary">{description}</p>
 )}
 <div className="flex flex-wrap items-center justify-between gap-2">
 <div className="flex flex-wrap items-center gap-2">
 <span className="rounded-lg bg-primary-light px-3 py-1 text-sm font-medium text-white">
 Delivery
 </span>
 {discountLabel && (
 <span className="rounded-lg bg-red-500 px-2.5 py-1 text-xs font-medium text-white">
 {discountLabel}
 </span>
 )}
 </div>
 {deliveryText && (
 <span className="text-sm font-medium text-custom-primary">
 {deliveryText}
 </span>
 )}
 </div>
 </div>
 </div>
 );
}
