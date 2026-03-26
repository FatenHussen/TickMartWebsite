import Button from"@/shared/ui/Button";
import AnimatedButton from"@/shared/ui/AnimatedButton";
import FavoriteButton from"@/shared/component/FavoriteButton";
import Rating from"@/shared/component/Rating";
import Badge from"@/shared/component/Badge";
import { cn } from"@/shared/lib/utils";
import type { ProductCardBadge } from"./ProductCard";

export type BasketCardProps = {
 id: number;
 name: string;
 description: string;
 price: string;
 originalPrice?: string;
 rating?: number;
 image: string;
 /** Top-left savings label — rendered as a Badge (same family as ProductCard top badges) */
 saveAmount?: string; //"Save $12"
 /** Extra top badges (left/right), same shape as ProductCard */
 badge?: ProductCardBadge | ProductCardBadge[];
 savings?: string; //"You saved $180"
 offerEndingDate?: string; //"Offer ending date: 11/1/2022"
 /** Bottom animated rows — same as ProductCard `bottomBadges`. If omitted, shows default promo row */
 bottomBadges?: ProductCardBadge[];
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
 badge,
 savings,
 offerEndingDate,
 bottomBadges,
 isFavorite = false,
 onToggleFavorite,
 onAddToCart,
 onClick,
 t,
 className,
}: BasketCardProps) {
 const saveAsBadge: ProductCardBadge[] = saveAmount
 ? [
 {
 label: saveAmount,
 className:
"bg-yellow-400 text-slate-900 shadow-sm text-xs font-semibold",
 align: "left",
 },
 ]
 : [];
 const extraBadges = badge
 ? Array.isArray(badge)
 ? badge
 : [badge]
 : [];
 const allTopBadges = [...saveAsBadge, ...extraBadges];
 const leftBadges = allTopBadges.filter((b) => (b.align ?? "left") === "left");
 const rightBadges = allTopBadges.filter((b) => b.align === "right");

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

 {/* Top-left badges */}
 {leftBadges.length > 0 && (
 <div className="absolute left-3 top-3 z-10 flex flex-col gap-1">
 {leftBadges.map((b, idx) => (
 <Badge
 key={idx}
 label={b.label}
 className={cn(b.className ||"bg-yellow-400 text-slate-900")}
 />
 ))}
 </div>
 )}

 {/* Top-right badges + favorite */}
 <div className="absolute right-3 top-3 z-10 flex flex-col items-end gap-1">
 {rightBadges.map((b, idx) => (
 <Badge
 key={`rb-${idx}`}
 label={b.label}
 className={cn(b.className ||"bg-blue-500 text-white")}
 />
 ))}
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

 {/* Buttons + bottom animated badges (ProductCard pattern) */}
 <div className="mt-auto flex flex-col gap-2">
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

 {bottomBadges !== undefined
 ? bottomBadges.map((b, idx) => (
 <AnimatedButton
 key={idx}
 variant="primary"
 size="sm"
 type="button"
 onClick={(e) => e.stopPropagation()}
 className={cn(
"w-full justify-center text-xs font-semibold",
 b.className
 )}
 note={{
 primary: b.label,
 secondary: b.label,
 }}
 />
 ))
 : (
 <AnimatedButton
 variant="primary"
 size="sm"
 type="button"
 onClick={(e) => e.stopPropagation()}
 className="w-full justify-center bg-blue-500 hover:bg-blue-600 text-xs font-semibold text-white"
 note={{
 primary:"Special Offer Today",
 secondary:"Order Now",
 }}
 />
 )}
 </div>
 </div>
 </div>
 );
}
