import { Link } from"react-router-dom";
import { useTranslation } from"react-i18next";
import Rating from"@/shared/component/Rating";
import FavoriteButton from"@/shared/component/FavoriteButton";
import Badge from "@/shared/component/Badge";
import { paths } from"@/app/routes/path/paths";
import type { FavoriteItem, FavoriteType } from"../types";
import { resolveListingCardPrices } from "@/shared/lib/formatApiPrice";

const badgeColorMap: Record<string, string> = {
 success:"bg-green-500 text-white",
 warning:"bg-yellow-500 text-white",
 danger:"bg-red-500 text-white",
 primary:"bg-primary text-white",
};

type WishlistProductCardProps = {
 item: FavoriteItem;
 type?: FavoriteType;
 onToggle: (id: number) => void;
};

function getDetailPath(type: FavoriteType | undefined, id: number): string {
 switch (type) {
 case"recipe":
 return paths.client.recipeDetails(id);
 case"basket":
 return paths.client.basketDetails(id);
 case"brand":
 return paths.client.brandDetails(id);
 case"shop":
 return paths.client.shopDetails(id);
 default:
 return paths.client.productDetails(id);
 }
}

export default function WishlistProductCard({
 item,
 type,
 onToggle,
}: WishlistProductCardProps) {
 const { t } = useTranslation();

 const detailPath = getDetailPath(type, item.id);

 const listing = resolveListingCardPrices(
 item,
 t("wishlist.youSaved", "You saved")
 );
 const priceDisplay = listing.price;
 const originalPrice = listing.originalPrice;
 const hasDiscount = listing.hasDiscount;
 const savingsText = listing.savings;

 const topBadge = item.top_badges?.[0] ?? item.budges?.[0];

 return (
 <div className="group flex h-full flex-col overflow-hidden rounded-3xl border border-custom-primary bg-custom-card transition-all duration-300 hover:shadow-lg dark:border-[rgba(255,255,255,0.06)] dark:bg-[rgba(16,17,20,0.75)] dark:shadow-[0_12px_40px_-20px_rgba(0,0,0,0.62)] dark:backdrop-blur-sm dark:hover:border-[rgba(255,255,255,0.09)] dark:hover:shadow-[0_20px_52px_-24px_rgba(0,0,0,0.72)]">
 <div className="relative aspect-[4/3] overflow-hidden">
 <Link to={detailPath} className="block h-full">
 <img
 src={item.image ??"https://via.placeholder.com/400?text=No+Image"}
 alt={item.name ?? item.title ??""}
 className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
 />
 </Link>

 {topBadge && (
 <div className="absolute left-3 top-3 z-10">
 <Badge
 label={topBadge.name}
 type={(topBadge as { type?: string }).type}
 imageSrc={topBadge.image}
 imageAlt={topBadge.name}
 className={badgeColorMap[topBadge.color] ??"bg-primary text-white"}
 />
 </div>
 )}

 <div className="absolute right-3 top-3 z-10">
 <FavoriteButton
 isFavorite={false}
 onToggle={(e) => {
 e.preventDefault();
 e.stopPropagation();
 onToggle(item.id);
 }}
 size="md"
 ariaLabel={t("wishlist.removeFromWishlist")}
 />
 </div>

 <div className="absolute left-3 bottom-3 z-10 bg-blue-off rounded-sm">
 <Rating
 rating={item.rating ?? 0}
 size="sm"
 className="px-2 py-1"
 />
 </div>
 </div>

 <div className="p-4 flex flex-col flex-1">
 <Link to={detailPath} className="hover:opacity-90">
 <h3 className="font-bold text-custom-primary text-sm mb-0.5 line-clamp-2 min-h-[2.5rem]">
 {item.name ?? item.title ??""}
 </h3>
 </Link>

 {item.category && (
 <p className="text-xs text-custom-secondary mb-2">
 {item.category}
 </p>
 )}

 {priceDisplay && (
 <p className="text-lg font-bold text-custom-primary mb-1">
 {priceDisplay}
 </p>
 )}

 <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mb-2">
 {originalPrice && hasDiscount && (
 <span className="text-sm text-custom-tertiary line-through">
 {originalPrice}
 </span>
 )}
 {savingsText && (
 <span className="text-sm font-medium text-green-600 dark:text-green-400">
 {savingsText}
 </span>
 )}
 {item.orders_count != null && item.orders_count > 0 && (
 <span className="text-sm text-custom-secondary ml-auto">
 {item.orders_count.toLocaleString()} {t("wishlist.sold")}
 </span>
 )}
 </div>

 {item.has_free_delivery && (
 <button
 type="button"
 className="mt-1 w-full rounded-lg bg-primary py-1.5 text-center text-xs font-semibold text-white dark:shadow-[0_8px_22px_-12px_color-mix(in_srgb,var(--color-main)_42%,transparent)] dark:ring-1 dark:ring-white/[0.08]"
 >
 {t("wishlist.freeDelivery")}
 </button>
 )}
 </div>
 </div>
 );
}
