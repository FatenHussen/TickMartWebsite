import { HiMinus, HiPlus, HiTrash } from"react-icons/hi";
import { useTranslation } from"react-i18next";
import { useLanguage } from"@/context/LanguageContext";
import { cn } from"@/shared/lib/utils";
import type { CartItem } from"../types";

type CartItemTableRowProps = {
 item: CartItem;
 onQuantityChange: (itemId: number | string, quantity: number) => void;
 onRemove: (itemId: number | string) => void;
 onMoveToWishlist?: (itemId: number | string) => void;
};

export default function CartItemTableRow({
 item,
 onQuantityChange,
 onRemove,
 onMoveToWishlist,
}: CartItemTableRowProps) {
 const { t } = useTranslation();
 const { isRTL } = useLanguage();

 const handleDecrease = () => {
 if (item.quantity > 1) {
 onQuantityChange(item.id, item.quantity - 1);
 }
 };

 const handleIncrease = () => {
 onQuantityChange(item.id, item.quantity + 1);
 };

 return (
 <tr className="border-b border-custom-secondary hover:bg-custom-hover transition-colors">
 {/* Product */}
 <td className="py-4 px-4">
 <div className="flex items-start gap-4">
 {/* Image */}
 <div className="w-20 h-20 rounded-lg bg-custom-tertiary overflow-hidden shrink-0">
 <img
 src={item.image}
 alt={item.name}
 className="w-full h-full object-cover"
 />
 </div>

 {/* Product Details */}
 <div className="min-w-0 flex-1">
 <h3 className="font-semibold text-custom-primary text-base mb-1">
 {item.name}
 </h3>
 <div className="text-sm text-custom-secondary space-y-0.5">
 {item.category && item.store && (
 <div>
 {item.category} • {item.store}
 </div>
 )}
 <div className="flex flex-wrap gap-2">
 {item.size && <span>{item.size}</span>}
 {item.color && <span>• {item.color}</span>}
 {item.type && <span>• {item.type}</span>}
 </div>
 </div>
 {/* Actions */}
 <div className="flex items-center gap-4 mt-2">
 {onMoveToWishlist && (
 <button
 type="button"
 onClick={() => onMoveToWishlist(item.id)}
 className="text-sm font-medium text-custom-accent hover:underline"
 >
 {t("cart.moveToWishlist")}
 </button>
 )}
 {item.hasFreeDelivery && (
 <span className="text-sm font-medium"style={{ color: 'var(--color-green)' }}>
 {t("cart.freeDelivery")}
 </span>
 )}
 </div>
 </div>
 </div>
 </td>

 {/* Price */}
 <td className="py-4 px-4">
 <div className={cn(isRTL ?"text-left":"text-right")}>
 {item.originalPrice && (
 <div className="text-sm text-custom-tertiary line-through mb-1">
 {item.originalPrice}
 </div>
 )}
 <div className="font-semibold text-custom-primary text-base">
 {item.price}
 </div>
 {item.savingsText && (
 <div className="text-sm mt-1"style={{ color: 'var(--color-green)' }}>
 {item.savingsText}
 </div>
 )}
 </div>
 </td>

 {/* Quantity */}
 <td className="py-4 px-4">
 <div className="flex items-center justify-center gap-2">
 <button
 type="button"
 onClick={handleDecrease}
 disabled={item.quantity <= 1}
 className="w-8 h-8 rounded-full border border-custom-secondary bg-custom-primary flex items-center justify-center hover:bg-custom-hover disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
 aria-label={t("cart.decreaseQuantity")}
 >
 <HiMinus className="w-4 h-4 text-custom-secondary"/>
 </button>
 <span className="w-8 text-center text-sm font-medium text-custom-primary">
 {item.quantity}
 </span>
 <button
 type="button"
 onClick={handleIncrease}
 className="w-8 h-8 rounded-full border border-custom-secondary bg-custom-primary flex items-center justify-center hover:bg-custom-hover transition-colors"
 aria-label={t("cart.increaseQuantity")}
 >
 <HiPlus className="w-4 h-4 text-custom-secondary"/>
 </button>
 </div>
 </td>

 {/* Subtotal */}
 <td className="py-4 px-4">
 <div className={cn("font-semibold text-custom-primary", isRTL ?"text-left":"text-right")}>
 {item.subtotal}
 </div>
 </td>

 {/* Actions (Delete) */}
 <td className="py-4 px-4">
 <button
 type="button"
 onClick={() => onRemove(item.id)}
 className={cn("flex items-center justify-center w-8 h-8 text-custom-secondary hover:text-custom-primary hover:bg-custom-hover rounded-full transition-colors", isRTL ?"mr-auto":"ml-auto")}
 aria-label={t("cart.removeItem")}
 >
 <HiTrash className="w-5 h-5"/>
 </button>
 </td>
 </tr>
 );
}

