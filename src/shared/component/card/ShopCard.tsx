import { cn } from"@/shared/lib/utils";
import Rating from"../Rating";
import FavoriteButton from"../FavoriteButton";
import Badge from"../Badge";
import LazyImage from"../LazyImage";
import AnimatedButton from"@/shared/ui/AnimatedButton";
import {
 type ProductCardBadge,
 resolveProductCardBadgeLabel,
} from"./ProductCard";

const DEFAULT_STORE_IMAGE =
"https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400";

type ShopCardProps = {
 id: number | string;
 name: string;
 description?: string | null;
 image?: string | null;
 isOpenNow?: boolean;
 /** Extra top badges (same as ProductCard); "Open" is still controlled by `isOpenNow` */
 badge?: ProductCardBadge | ProductCardBadge[];
 rating?: number;
 deliveryPrice?: string | number | null;
 discountLabel?: string | null;
 /** Bottom animated rows; when omitted, Delivery + discount use AnimatedButton like ProductCard */
 bottomBadges?: ProductCardBadge[];
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
 badge,
 rating = 0,
 deliveryPrice,
 discountLabel,
 bottomBadges,
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

 const openBadge: ProductCardBadge[] = isOpenNow
 ? [{ label:"Open", className:"bg-green-500 text-white text-xs font-medium", align:"left" }]
 : [];
 const extraBadge = badge
 ? Array.isArray(badge)
 ? badge
 : [badge]
 : [];
 const allTop = [...openBadge, ...extraBadge].slice(0, 1);
 const leftBadges = allTop.filter((b) => (b.align ??"left") ==="left");
 const rightBadges = allTop.filter((b) => b.align ==="right");

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
 <LazyImage
 src={imageSrc}
 alt={name}
 className="h-full w-full object-cover"
 wrapperClassName="h-full w-full"
 />
 {leftBadges.length > 0 && (
 <div className="absolute left-3 top-3 z-10 flex flex-col gap-1">
 {leftBadges.map((b, idx) => (
 <Badge
 key={idx}
 label={resolveProductCardBadgeLabel(b)}
 type={b.type}
 imageSrc={b.image}
 imageAlt={resolveProductCardBadgeLabel(b)}
 className={cn("rounded-full px-2.5 py-0.5", b.className)}
 />
 ))}
 </div>
 )}
 <div className="absolute right-3 top-3 z-10 flex flex-col items-end gap-1">
 {rightBadges.map((b, idx) => (
 <Badge
 key={idx}
 label={resolveProductCardBadgeLabel(b)}
 type={b.type}
 imageSrc={b.image}
 imageAlt={resolveProductCardBadgeLabel(b)}
 className={cn("rounded-lg", b.className)}
 />
 ))}
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
 <div className="mt-auto flex w-full flex-col gap-2">
 {bottomBadges !== undefined
 ? bottomBadges.slice(0, 1).map((b, idx) => (
 <AnimatedButton
 key={idx}
 variant="primary"
 size="sm"
 type="button"
 onClick={(e) => e.stopPropagation()}
 className={cn(
"w-full justify-center bg-custom-accent text-xs font-semibold text-custom-inverse hover:opacity-90",
 b.className
 )}
 note={{ primary: b.label, secondary: b.label }}
 />
 ))
 : (
 <>
 <AnimatedButton
 variant="primary"
 size="sm"
 type="button"
 onClick={(e) => e.stopPropagation()}
 className="w-full justify-center bg-primary-light text-sm font-medium text-white"
 note={{
 primary:"Delivery",
 secondary: deliveryText ??"Order now",
 }}
 />
 {discountLabel && (
 <AnimatedButton
 variant="primary"
 size="sm"
 type="button"
 onClick={(e) => e.stopPropagation()}
 className="w-full justify-center bg-red-500 text-xs font-medium text-white hover:opacity-90"
 note={{
 primary: discountLabel,
 secondary: discountLabel,
 }}
 />
 )}
 </>
 )}
 </div>
 </div>
 </div>
 );
}
