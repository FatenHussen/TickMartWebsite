import { HiMinus, HiPlus, HiTrash } from "react-icons/hi";
import { useTranslation } from "react-i18next";
import { useLanguage } from "@/context/LanguageContext";
import { useCurrency } from "@/context/CurrencyContext";
import { toNum } from "../utils";
import type { CartItem } from "../types";

type CartItemCardProps = {
    item: CartItem;
    previewPrices?: Map<number, { price: number; priceBeforeDiscount?: number }>;
    /** When set, overrides previewPrices lookup (e.g. same variant, different extras) */
    previewPrice?: { price: number; priceBeforeDiscount?: number };
    /** Product name from preview orderItems (takes precedence over item.name) */
    displayName?: string;
    /** Variant values from preview orderItems (e.g. ["#fc0303", "Medium"]) */
    displayVariant?: string[];
    freeQuantity?: number;
    isExcludedFromCoupon?: boolean;
    /** When false, plus/minus and delete are disabled (e.g. when cart_type !== "default") */
    canEditQuantity?: boolean;
    onQuantityChange: (itemId: number | string, quantity: number) => void;
    onRemove: (itemId: number | string) => void;
    onMoveToWishlist?: (itemId: number | string) => void;
};

export default function CartItemCard({
    item,
    previewPrices,
    previewPrice,
    displayName,
    displayVariant,
    freeQuantity = 0,
    isExcludedFromCoupon = false,
    canEditQuantity = true,
    onQuantityChange,
    onRemove,
}: CartItemCardProps) {
    const { t } = useTranslation();
    const { isRTL } = useLanguage();
    const { formatPrice } = useCurrency();

    const preview =
        previewPrice ??
        (item.shop_product_variant_id != null
            ? previewPrices?.get(item.shop_product_variant_id)
            : undefined);
    const displayPrice = preview
        ? formatPrice(preview.price)
        : item.price;
    const displayOriginalPrice = preview?.priceBeforeDiscount != null && preview.priceBeforeDiscount > (preview.price ?? 0)
        ? formatPrice(preview.priceBeforeDiscount)
        : item.originalPrice;
    const priceNum = preview?.price ?? (item.priceNumeric ?? toNum(item.price));
    const priceBeforeNum = preview?.priceBeforeDiscount;
    const originalSubtotal = priceBeforeNum != null ? priceBeforeNum * item.quantity : undefined;
    const displaySubtotal = priceNum > 0 ? formatPrice(priceNum * item.quantity) : item.subtotal;
    const displayOriginalSubtotal = originalSubtotal != null && originalSubtotal > (priceNum * item.quantity)
        ? formatPrice(originalSubtotal)
        : undefined;
    const variantText = displayVariant?.length
        ? displayVariant.join(", ")
        : item.selectedAttributes && Object.keys(item.selectedAttributes).length > 0
            ? Object.entries(item.selectedAttributes)
                .map(([k, v]) => `${k}: ${v}`)
                .join(", ")
            : undefined;

    const handleDecrease = () => {
        onQuantityChange(item.id, Math.max(1, item.quantity - 1));
    };

    const handleIncrease = () => {
        onQuantityChange(item.id, item.quantity + 1);
    };

    return (
        <div
            className="bg-transparent rounded-2xl border border-summary p-4 relative"
            dir={isRTL ? "rtl" : "ltr"}
        >
            {/* Delete button - top right (hidden when canEditQuantity is false) */}
            {canEditQuantity && (
                <button
                    onClick={() => onRemove(item.id)}
                    className="absolute top-3 right-3 text-red-500 hover:text-red-600 transition-colors z-10"
                    aria-label="Remove item"
                >
                    <HiTrash className="w-5 h-5" />
                </button>
            )}

            <div className={canEditQuantity ? "flex gap-4 pr-8" : "flex gap-4"}>
                {/* Product Image */}
                <div className="w-24 h-24 rounded-lg overflow-hidden shrink-0 bg-custom-card">
                    {item.image ? (
                        <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="w-full h-full bg-custom-muted dark:bg-custom-hover flex items-center justify-center">
                            <span className="text-gray-light text-xs">No image</span>
                        </div>
                    )}
                </div>

                {/* Product Details - Middle Section */}
                <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-bold text-custom-primary mb-1">
                        {displayName ?? item.name}
                    </h3>
                    {item.store && (
                        <p className="text-sm text-custom-secondary mb-1">
                            {t("cart.store", "Store")}: {item.store}
                        </p>
                    )}
                    {variantText && (
                        <p className="text-sm text-custom-secondary mb-1">
                            {t("cart.variant", "Variant")}: {variantText}
                        </p>
                    )}
                    {freeQuantity > 0 && (
                        <p className="text-sm font-medium text-green-700 dark:text-green-400 mb-1">
                            {t("cart.free", "FREE")} × {freeQuantity}
                        </p>
                    )}
                    {isExcludedFromCoupon && (
                        <p className="text-xs text-amber-600 dark:text-amber-400 mb-1">
                            {t("cart.excludedFromCoupon", "Not eligible for coupon")}
                        </p>
                    )}
                    {item.description && (
                        <p className="text-sm text-custom-secondary mb-2">
                            {item.description}
                        </p>
                    )}

                    {/* Price before and after discount */}
                    <div className="mb-4">
                        {displayOriginalPrice && (
                            <span className="text-sm text-custom-secondary line-through mr-2">
                                {displayOriginalPrice}
                            </span>
                        )}
                        <span className="text-xl font-bold text-custom-primary">
                            {displayPrice}
                        </span>
                        <div className="mt-0.5">
                            {displayOriginalSubtotal != null && (
                                <span className="text-sm text-custom-secondary line-through mr-2">
                                    {t("cart.subtotal", "Subtotal")}: {displayOriginalSubtotal}
                                </span>
                            )}
                            <span className="text-sm font-semibold text-custom-primary">
                                {t("cart.subtotal", "Subtotal")}: {displaySubtotal}
                            </span>
                        </div>
                        {item.savingsText && !preview && (
                            <p className="text-sm text-green-600 mt-1 font-medium">
                                {item.savingsText}
                            </p>
                        )}
                    </div>
                </div>

                {/* Quantity Selector and Save for Later - Right Section */}
                <div className="flex items-center gap-4 shrink-0">
                    {/* Quantity Selector */}
                    <div className="flex items-center border border-custom-secondary rounded-lg bg-custom-card">
                        <button
                            type="button"
                            onClick={canEditQuantity ? handleDecrease : undefined}
                            disabled={!canEditQuantity}
                            className={canEditQuantity ? "p-2 hover:bg-custom-light transition-colors" : "p-2 opacity-50 cursor-not-allowed"}
                            aria-label="Decrease quantity"
                        >
                            <HiMinus className="w-4 h-4 text-custom-primary" />
                        </button>
                        <span className="px-4 py-2 text-custom-primary font-medium min-w-[2rem] text-center border-x border-custom-secondary">
                            {item.quantity}
                        </span>
                        <button
                            type="button"
                            onClick={canEditQuantity ? handleIncrease : undefined}
                            disabled={!canEditQuantity}
                            className={canEditQuantity ? "p-2 hover:bg-custom-light transition-colors" : "p-2 opacity-50 cursor-not-allowed"}
                            aria-label="Increase quantity"
                        >
                            <HiPlus className="w-4 h-4 text-custom-primary" />
                        </button>
                    </div>

                    {/* Save for later */}
                    {/* <button
                        onClick={() => onMoveToWishlist?.(item.id)}
                        className="text-sm text-primary-light hover:underline whitespace-nowrap"
                    >
                        Save for later
                    </button> */}
                </div>
            </div>
        </div>
    );
}
