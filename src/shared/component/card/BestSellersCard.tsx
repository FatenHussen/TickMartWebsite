import { cn } from"../../lib/utils";
import Button from"@/shared/ui/Button";
import FavoriteButton from"@/shared/component/FavoriteButton";
import Rating from"@/shared/component/Rating";
import AnimatedButton from"../../ui/AnimatedButton";
import Badge from"@/shared/component/Badge";

export type BestSellersCardProps = {
 id: number;
 name: string;
 price: string;
 originalPrice?: string;
 rating: number;
 image: string;
 category?: string; // e.g.,"Clothes"
 badges?: Array<{ label: string; className?: string }>; // Top-left badges (e.g.,"New","Recommended")
 topRightBadge?: { label: string; className?: string }; // Top-right badge (e.g.,"Most Ordered")
 isFavorite?: boolean;
 sold?: number; // Quantity sold like 1238
 savings?: string; // Savings text like"You saved $180"
 buttonText?: string; // Button text like"Special Offer Today"
 buttonTextSecond?: string; // Second value for animated button

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
 badges = [],
 topRightBadge,
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

 {/* Top-left badges - Stacked */}
 {badges.length > 0 && (
 <div className="absolute left-3 top-3 z-10 flex flex-col gap-2">
 {badges.map((badge, idx) => (
 <Badge
 key={idx}
 label={t ? t(`home.${badge.label}`) : badge.label}
 className={cn(
"text-white",
 badge.className ||"bg-blue-500"
 )}
 />
 ))}
 </div>
 )}

 {/* Top-right badge - Yellow"Most Ordered"*/}
 {topRightBadge && (
 <Badge
 label={t ? t(`home.${topRightBadge.label}`) : topRightBadge.label}
 className={cn(
"absolute right-3 top-3 z-10 text-black",
 topRightBadge.className ||"bg-yellow-400"
 )}
 />
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

 {/* Button */}
 {buttonText && (
 <div className="mt-auto">
 {buttonTextSecond ? (
 <AnimatedButton
 variant="primary"
 size="sm"
 onClick={(e) => e.stopPropagation()}
 className="bg-blue-500 hover:bg-blue-600 text-xs font-semibold px-4 w-full"
 note={{
 primary: buttonText,
 secondary: buttonTextSecond,
 }}
 />
 ) : (
 <Button
 variant="primary"
 size="sm"
 onClick={(e) => e.stopPropagation()}
 className="w-full bg-blue-500 hover:bg-blue-600 text-xs font-semibold px-4"
 >
 {buttonText}
 </Button>
 )}
 </div>
 )}
 </div>
 </div>
 );
}
