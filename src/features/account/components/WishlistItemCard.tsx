import { Link } from"react-router-dom";
import { useTranslation } from"react-i18next";
import { cn } from"@/shared/lib/utils";
import Rating from"@/shared/component/Rating";
import FavoriteButton from"@/shared/component/FavoriteButton";
import Badge from"@/shared/component/Badge";
import type { FavoriteType, WishlistDisplayItem } from"../types";
import AnimatedButton from"@/shared/ui/AnimatedButton";

// Match ProductCard / BestSellersCard badge styling: rounded-lg, text-white
const badgeColorMap: Record<string, string> = {
 success:"bg-green-500 text-white",
 warning:"bg-yellow-400 text-black",
 danger:"bg-red-500 text-white",
 primary:"bg-blue-500 text-white",
 default:"bg-blue-500 text-white",
};

type WishlistItemCardProps = {
 item: WishlistDisplayItem;
 type: FavoriteType;
 onToggle: (id: number) => void;
};

export default function WishlistItemCard({
 item,
 onToggle,
}: WishlistItemCardProps) {
 const { t } = useTranslation();

 return (
 <div className="bg-custom-card rounded-2xl overflow-hidden border border-custom-primary hover:shadow-lg transition-shadow group">
 <div className="relative aspect-square overflow-hidden">
 <Link to={item.detailPath} className="block h-full">
 <img
 src={item.image}
 alt={item.name}
 className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
 />
 </Link>
 {/* Top-left badges - same layout as ProductCard: flex flex-col gap-2 */}
 {(item.topBadges?.length > 0 || item.showNew) && (
 <div className="absolute left-3 top-3 z-10 flex flex-col gap-2">
 {item.showNew && (
 <Badge
 label={t("wishlist.new")}
 className={cn(
"text-white",
 badgeColorMap.primary ||"bg-blue-500"
 )}
 />
 )}
 {(item.topBadges ?? [])
 .filter((b) => !(item.showNew && (b.name.toLowerCase() ==="new"|| b.name ==="جديد")))
 .map((badge) =>
 badge.image ? (
 <img
 key={badge.id}
 src={badge.image}
 alt={badge.name}
 className="h-6 w-auto rounded-lg object-contain"
 />
 ) : (
 <Badge
 key={badge.id}
 label={badge.name}
 className={cn(
"text-white",
 badgeColorMap[badge.color] ?? badgeColorMap.default
 )}
 />
 )
 )}
 </div>
 )}
 <div className="absolute right-3 top-3 z-10">
 <FavoriteButton
 isFavorite
 onToggle={(e) => {
 e.preventDefault();
 e.stopPropagation();
 onToggle(item.id);
 }}
 size="md"
 ariaLabel={t("wishlist.removeFromWishlist")}
 />
 </div>
 {item.rating != null && item.rating > 0 && (
 <div className="absolute left-3 bottom-3 z-10 bg-blue-off rounded-sm px-2 py-1">
 <Rating rating={item.rating} size="sm"className="px-2 py-1"/>
 </div>
 )}
 </div>
 <Link to={item.detailPath} className="block p-4 hover:opacity-90">
 <h3 className="font-semibold text-custom-primary text-sm mb-0.5 line-clamp-1">
 {item.name}
 </h3>
 {item.category && (
 <p className="text-xs text-custom-secondary mb-2">
 {item.category}
 </p>
 )}
 <div className="flex items-baseline gap-2">
 <span className="text-lg font-bold text-custom-primary">
 {item.priceDisplay}
 </span>
 {item.originalPrice && (
 <span className="text-sm text-custom-tertiary line-through">
 {item.originalPrice}
 </span>
 )}
 </div>
 <div className="flex flex-wrap items-center justify-between gap-2 mt-2">
 {item.savingsAmount && (
 <span className="text-sm font-medium text-green-600 dark:text-green-400">
 {t("wishlist.youSaved")} {item.savingsAmount}
 </span>
 )}
 {item.soldCount != null && item.soldCount > 0 && (
 <span className="text-sm text-custom-secondary">
 {item.soldCount.toLocaleString()} {t("wishlist.sold")}
 </span>
 )}
 </div>
 {/* Bottom badges - Featured, Sale, etc. + AnimatedButton */}
 <div className="flex flex-col gap-2 mt-2">
 
 {item.button && (
 <AnimatedButton
 variant="primary"
 size="sm"
 onClick={(e) => e.stopPropagation()}
 className="bg-blue-500 hover:bg-blue-600 text-xs font-semibold px-4 w-full"
 note={{
 primary: item.button.primary,
 secondary: item.button.secondary,
 }}
 />
 )}
 </div>
 </Link>
 </div>
 );
}
