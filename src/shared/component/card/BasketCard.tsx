import Button from"@/shared/ui/Button";
import AnimatedButton from"@/shared/ui/AnimatedButton";
import FavoriteButton from"@/shared/component/FavoriteButton";
import Rating from"@/shared/component/Rating";
import { cn } from"@/shared/lib/utils";

export type BasketCardProps = {
 id: number;
 name: string;
 description: string;
 price: string;
 originalPrice?: string;
 rating?: number;
 image: string;
 saveAmount?: string; //"Save $12"
 savings?: string; //"You saved $180"
 offerEndingDate?: string; //"Offer ending date: 11/1/2022"
 isFavorite?: boolean;
 onToggleFavorite?: (id: number) => void;
 onAddToCart?: (id: number) => void;
 onClick?: (id: number) => void;
 t?: (key: string) => string;
 className?: string;
};

export default function BasketCard({
 id,
 name,
 description,
 price,
 originalPrice,
 rating,
 image,
 saveAmount,
 savings,
 offerEndingDate,
 isFavorite = false,
 onToggleFavorite,
 onAddToCart,
 onClick,
 t,
 className,
}: BasketCardProps) {
 return (
 <div
 className={cn(
"relative overflow-hidden rounded-2xl bg-custom-primary shadow-sm transition hover:shadow-md flex flex-col h-full",
 onClick &&"cursor-pointer",
 className
 )}
 onClick={() => onClick?.(id)}
 role={onClick ?"button": undefined}
 tabIndex={onClick ? 0 : undefined}
 onKeyDown={(e) => {
 if (!onClick) return;
 if (e.key ==="Enter"|| e.key ==="") onClick(id);
 }}
 >
 {/* Image */}
 <div className="relative h-48 w-full">
 <img
 src={image}
 alt={name}
 className="h-full w-full object-cover"
 loading="lazy"
 />

 {/* Save Badge (top-left) - Yellow */}
 {saveAmount && (
 <span className="absolute left-3 top-3 z-10 rounded-lg bg-yellow-400 px-3 py-1.5 text-xs font-semibold text-slate-900 shadow-sm">
 {saveAmount}
 </span>
 )}

 {/* Favorite (top-right) */}
 <div className="absolute right-3 top-3 z-10">
 <FavoriteButton
 isFavorite={isFavorite}
 onToggle={(e) => {
 e.stopPropagation();
 onToggleFavorite?.(id);
 }}
 size="md"
 ariaLabel="Toggle favorite"
 />
 </div>
 </div>

 {/* Body - Light green background */}
 <div className="bg-green-50 px-4 pb-4 pt-4 flex flex-col flex-1">
 {/* Title */}
 <h3 className="text-base font-bold text-slate-900 line-clamp-1">
 {name}
 </h3>

 {/* Description */}
 <p className="mt-1 text-sm text-slate-700 line-clamp-1">
 {description}
 </p>

 {/* Rating */}
 {rating != null && (
 <div className="mt-2">
 <Rating rating={typeof rating === "number" ? rating.toFixed(1) : rating} size="sm" />
 </div>
 )}

 {/* Price Section */}
 <div className="mt-3">
 <div className="flex items-baseline gap-2">
 <span className="text-lg font-bold text-slate-900">{price}</span>
 </div>

 {/* Original Price and Savings */}
 {originalPrice && savings && (
 <p className="mt-1 text-sm font-medium text-green-600">
 {originalPrice} {savings}
 </p>
 )}
 </div>

 {/* Offer Ending Date */}
 {offerEndingDate && (
 <p className="mt-2 text-xs text-red-600 font-medium">
 {offerEndingDate}
 </p>
 )}

 {/* Buttons */}
 <div className="mt-auto space-y-2">
 {/* Add to Cart Button - Yellow */}
 <Button
 variant="primary"
 size="md"
 fullWidth
 className="rounded-lg bg-yellow-400 hover:bg-yellow-500 text-slate-900 font-semibold"
 onClick={(e) => {
 e.stopPropagation();
 onAddToCart?.(id);
 }}
 >
 {t ? t("home.addToCart") :"Add to Cart"}
 </Button>

 {/* Special Offer Today Button - Light blue */}
 <AnimatedButton
 variant="primary"
 size="sm"
 onClick={(e) => e.stopPropagation()}
 className="bg-blue-500 hover:bg-blue-600 text-xs font-semibold px-4 w-full"
 note={{
 primary:"Special Offer Today",
 secondary:"Order Now",
 }}
 />
 </div>
 </div>
 </div>
 );
}
