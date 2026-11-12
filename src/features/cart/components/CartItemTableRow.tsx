import { HiMinus, HiPlus, HiTrash } from"react-icons/hi";
import { useTranslation } from"react-i18next";
import { useLanguage } from"@/context/LanguageContext";
import { cn } from"@/shared/lib/utils";
import PriceBlock from "@/shared/component/PriceBlock";
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

 /**
  * Prefer the structured attribute map set at add-to-cart. Older lines (and
  * recipe / basket lines) only carry the flat size / color / type strings.
  */
 const variantPairs: [string, string][] = (() => {
 const selected = item.selectedAttributes;
 if (selected && Object.keys(selected).length > 0) {
 return Object.entries(selected).filter(
 (pair): pair is [string, string] => Boolean(pair[1]),
 );
 }
 return (
 [
 [t("product.size","المقاس"), item.size],
 [t("product.color","اللون"), item.color],
 [t("product.type","النوع"), item.type],
 ] as const
 )
 .filter((pair): pair is readonly [string, string] => Boolean(pair[1]))
 .map(([label, value]) => {
 // Legacy values sometimes already read "Size: 8" — avoid "Size: Size: 8".
 const text = value.includes(":")
 ? value.slice(value.indexOf(":") + 1).trim()
 : value;
 return [label, text] as [string, string];
 });
 })();

 const handleDecrease = () => {
 if (item.quantity > 1) {
 onQuantityChange(item.id, item.quantity - 1);
 }
 };

 /** Never let the line exceed the stock the API reported for this variant. */
 const atStockLimit =
 item.availableQuantity != null && item.quantity >= item.availableQuantity;

 const handleIncrease = () => {
 if (atStockLimit) return;
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

 {/* SKU / variants / model / available stock */}
 <td className="py-4 px-4 align-top">
 <div className={cn("text-sm text-custom-secondary space-y-1", isRTL ?"text-right":"text-left")}>
 {variantPairs.length > 0 && (
 <div className="flex flex-wrap gap-1">
 {variantPairs.map(([label, value]) => (
 <span
 key={`${label}-${value}`}
 className="inline-flex items-center rounded-md bg-custom-tertiary px-2 py-0.5 text-xs font-medium text-custom-primary"
 >
 {label}: {value}
 </span>
 ))}
 </div>
 )}
 {item.sku && (
 <div className="text-xs">
 <span className="font-medium text-custom-primary">
 {t("product.sku","SKU")}:
 </span>{" "}
 <span dir="ltr">{item.sku}</span>
 </div>
 )}
 {item.model && (
 <div className="text-xs">
 <span className="font-medium text-custom-primary">
 {t("cart.modelNumber","رقم الموديل")}:
 </span>{" "}
 <span dir="ltr">{item.model}</span>
 </div>
 )}
 {item.availableQuantity != null && (
 <div className="text-xs">
 <span className="font-medium text-custom-primary">
 {t("cart.availableQuantity","العدد المتوفر")}:
 </span>{" "}
 <span>{item.availableQuantity}</span>
 </div>
 )}
 {variantPairs.length === 0 &&
 !item.sku &&
 !item.model &&
 item.availableQuantity == null && (
 <span className="text-xs text-custom-secondary">—</span>
 )}
 </div>
 </td>

 {/* Price */}
 <td className="py-4 px-4">
 <PriceBlock
 price={item.price}
 originalPrice={item.originalPrice}
 savings={item.savingsText}
 size="sm"
 align="end"
 />
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
 disabled={atStockLimit}
 className="w-8 h-8 rounded-full border border-custom-secondary bg-custom-primary flex items-center justify-center hover:bg-custom-hover disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
 aria-label={t("cart.increaseQuantity")}
 title={atStockLimit ? t("cart.stockLimitReached","لا يوجد كمية اضافية متوفرة") : undefined}
 >
 <HiPlus className="w-4 h-4 text-custom-secondary"/>
 </button>
 </div>
 </td>

 {/* Subtotal */}
 <td className="py-4 px-4">
 <div className={cn(isRTL ?"text-left":"text-right")}>
 <div className="font-semibold text-custom-primary">
 {item.subtotal}
 </div>
 {/* Show the calculation so the line total is self-explanatory. */}
 {item.quantity > 1 && (
 <div className="mt-0.5 text-xs text-custom-secondary"dir="ltr">
 {item.price} × {item.quantity}
 </div>
 )}
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

