import { cn } from"../../lib/utils";
import FavoriteButton from"@/shared/component/FavoriteButton";
import Rating from"@/shared/component/Rating";
import AnimatedButton from"../../ui/AnimatedButton";
import Badge from"@/shared/component/Badge";
import {
 type ProductCardBadge,
 resolveProductCardBadgeLabel,
} from"./ProductCard";

export type BestSellersCardProps = {
 id: number;
 name: string;
 price: string;
 originalPrice?: string;
 rating: number;
 image: string;
 category?: string; // e.g.,"Clothes"
 /** Top badges (left/right) — same shape as ProductCard */
 badge?: ProductCardBadge | ProductCardBadge[];
 /** @deprecated Prefer `badge`; kept for sliders that still pass these */
 badges?: Array<{ label: string; className?: string }>;
 /** @deprecated Prefer `badge` with align:"right" */
 topRightBadge?: { label: string; className?: string };
 /** Bottom animated label rows (same as ProductCard `bottomBadges`) */
 bottomBadges?: ProductCardBadge[];
 isFavorite?: boolean;
 sold?: number; // Quantity sold like 1238
 savings?: string; // Savings text like"You saved $180"
 /** Legacy single bottom animated row when `bottomBadges` is omitted */
 buttonText?: string;
 buttonTextSecond?: string;

 onToggleFavorite?: (id: number) => void;
 onClick?: (id: number) => void;

 t?: (key: string) => string;
 className?: string;
};

export default function BestSellersCard({
 id,
 name,
 price,
 originalPrice,
 rating,
 image,
 category,
 badge,
 badges = [],
 topRightBadge,
 bottomBadges,
 isFavorite = false,
 sold,
 savings,
 buttonText,
 buttonTextSecond,
 onToggleFavorite,
 onClick,
 t,
 className,
}: BestSellersCardProps) {
 const legacyTop: ProductCardBadge[] = [
 ...badges.map((b) => ({ ...b, align: "left" as const })),
 ...(topRightBadge
 ? [{ ...topRightBadge, align: "right" as const }]
 : []),
 ];
 const explicitTop =
 badge !== undefined
 ? Array.isArray(badge)
 ? badge
 : [badge]
 : null;
 const allTopBadges = explicitTop ?? legacyTop;
 const leftBadges = allTopBadges.filter((b) => (b.align ?? "left") === "left");
 const rightBadges = allTopBadges.filter((b) => b.align === "right");

 const resolvedBottomBadges: ProductCardBadge[] | undefined =
 bottomBadges !== undefined
 ? bottomBadges
 : buttonText
 ? [
 {
 label: buttonText,
 className:
"bg-blue-500 hover:bg-blue-600 text-xs font-semibold text-white",
 },
 ]
 : undefined;

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
 {/* Image Section */}
 <div className="relative h-64 w-full">
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
 label={resolveProductCardBadgeLabel(b, t)}
 className={cn(b.className ||"bg-blue-500 text-white")}
 />
 ))}
 </div>
 )}

 {/* Top-right badges */}
 {rightBadges.length > 0 && (
 <div className="absolute right-3 top-3 z-10 flex flex-col items-end gap-1">
 {rightBadges.map((b, idx) => (
 <Badge
 key={idx}
 label={resolveProductCardBadgeLabel(b, t)}
 className={cn(b.className ||"bg-yellow-400 text-black")}
 />
 ))}
 </div>
 )}

 {/* Rating badge (bottom-left) - White with yellow star */}
 <div className="absolute left-3 bottom-3 z-10 bg-custom-card rounded-lg px-2.5 py-1 shadow-sm">
 <Rating
 rating={rating}
 size="sm"
 className="[&>span:first-child]:text-yellow-500 [&>span:last-child]:text-slate-800 [&>span:last-child]:font-semibold gap-1.5"
 />
 </div>

 {/* Favorite Button (bottom-right) */}
 <div className="absolute right-3 bottom-3 z-10">
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

 {/* Info Section - Light blue-gray background */}
 <div className="bg-[#E4F0FB] px-4 pb-4 pt-4 flex flex-col flex-1">
 {/* Product Name */}
 <h3 className="text-base font-bold text-slate-900 line-clamp-2">
 {name}
 </h3>

 {/* Category */}
 {category && (
 <p className="mt-1 text-xs text-slate-500 line-clamp-1">{category}</p>
 )}

 {/* Price Section */}
 <div className="mt-3">
 <div className="flex items-baseline gap-2">
 <span className="text-lg font-bold text-slate-900">{price}</span>
 {originalPrice && (
 <span className="text-sm text-slate-500 line-through">
 {originalPrice}
 </span>
 )}
 </div>

 {/* Savings */}
 {savings && (
 <p className="mt-1 text-sm font-medium text-green-600">{savings}</p>
 )}
 </div>

 {/* Sold Quantity */}
 {sold !== undefined && (
 <p className="mt-2 text-xs text-slate-500">
 {sold.toLocaleString()} {t ? t("home.sold") :"Sold"}
 </p>
 )}

 {/* Bottom animated badges (same pattern as ProductCard) */}
 {resolvedBottomBadges && resolvedBottomBadges.length > 0 && (
 <div className="mt-auto flex w-full flex-col gap-2 pt-3">
 {resolvedBottomBadges.map((b, idx) => {
 const primary = resolveProductCardBadgeLabel(b, t);
 const secondary =
 buttonTextSecond && idx === 0 && bottomBadges === undefined
 ? buttonTextSecond
 : primary;
 return (
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
 primary,
 secondary,
 }}
 />
 );
 })}
 </div>
 )}
 </div>
 </div>
 );
}
