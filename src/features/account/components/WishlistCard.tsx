import { useTranslation } from"react-i18next";
import { HiHeart, HiStar } from"react-icons/hi";
import type { WishlistItem } from"../types";

type WishlistCardProps = {
 item: WishlistItem;
 onRemove?: (itemId: string | number) => void;
 onAddToCart?: (itemId: string | number) => void;
};

export default function WishlistCard({
 item,
 onRemove,
}: WishlistCardProps) {
 const { t } = useTranslation();

 return (
 <div className="bg-custom-card rounded-2xl overflow-hidden border border-custom-primary hover:shadow-lg transition-shadow group flex flex-col h-full">
 {/* Image Container */}
 <div className="relative aspect-square overflow-hidden">
 <img
 src={item.image}
 alt={item.name}
 className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
 />

 {/* New Badge */}
 {item.isNew && (
 <span className="absolute top-3 start-3 px-2.5 py-1 bg-primary text-white text-xs font-medium rounded-full">
 {t("wishlist.new")}
 </span>
 )}

 {/* Rating Badge */}
 <div className="absolute bottom-3 start-3 flex items-center gap-1 px-2 py-1 bg-custom-card/90 backdrop-blur-sm rounded-full">
 <HiStar className="w-3.5 h-3.5 text-yellow-400"/>
 <span className="text-xs font-medium text-custom-primary">{item.rating}</span>
 </div>

 {/* Remove from Wishlist Button */}
 <button
 type="button"
 onClick={() => onRemove?.(item.id)}
 className="absolute top-3 end-3 p-2 bg-custom-card rounded-full shadow-md hover:bg-custom-light transition-colors"
 aria-label={t("wishlist.removeFromWishlist")}
 >
 <HiHeart className="w-5 h-5 text-red-500"/>
 </button>
 </div>

 {/* Content */}
 <div className="p-4 flex flex-col flex-1">
 {/* Name & Category */}
 <h3 className="font-semibold text-custom-primary text-sm mb-0.5 line-clamp-1">
 {item.name}
 </h3>
 <p className="text-xs text-custom-secondary mb-2">{item.category}</p>

 {/* Price */}
 <div className="flex items-center gap-2 mb-1">
 <span className="text-base font-bold text-custom-primary">{item.price}</span>
 </div>

 {/* Original Price & Savings */}
 <div className="flex items-center gap-2 mb-2">
 {item.originalPrice && (
 <span className="text-xs text-custom-tertiary line-through">
 {item.originalPrice}
 </span>
 )}
 {item.savings && (
 <span className="text-xs text-primary font-medium">
 {t("wishlist.youSaved")} {item.savings}
 </span>
 )}
 <span className="text-xs text-custom-tertiary ms-auto">
 {item.soldCount.toLocaleString()} {t("wishlist.sold")}
 </span>
 </div>

 {/* Free Delivery Badge */}
 {item.hasFreeDelivery && (
 <span className="inline-block px-2.5 py-1 bg-primary/10 text-primary text-xs font-medium rounded-full">
 {t("wishlist.freeDelivery")}
 </span>
 )}
 </div>
 </div>
 );
}
