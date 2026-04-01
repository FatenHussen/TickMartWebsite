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
    promotionBadges?: string[];
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
    promotionBadges = [],
    onQuantityChange,
    onRemove,
    onMoveToWishlist,
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
            className="relative rounded-3xl border border-[#4CDAF6] bg-[#F4F9FF] p-4 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.25)] md:p-5"
            dir={isRTL ? "rtl" : "ltr"}
        >
            {/* Delete button - top right (hidden when canEditQuantity is false) */}
            {canEditQuantity && (
                <button
                    onClick={() => onRemove(item.id)}
                    className="absolute right-4 top-4 z-10 text-[#FF4D4F] transition-colors hover:text-red-600"
                    aria-label="Remove item"
                >
                    <HiTrash className="h-5 w-5" />
                </button>
            )}

            <div className={canEditQuantity ? "flex flex-col gap-4 pr-8 md:flex-row md:items-stretch md:gap-4" : "flex flex-col gap-4 md:flex-row md:items-stretch md:gap-4"}>
                {/* Product Image */}
                <div className="h-[126px] w-[126px] shrink-0 overflow-hidden rounded-2xl bg-white shadow-sm md:h-auto md:self-stretch">
                    {item.image ? (
                        <img
                            src={item.image}
                            alt={item.name}
                            className="h-full w-full object-cover"
                        />
                    ) : (
                        <div className="flex h-full w-full items-center justify-center bg-custom-muted dark:bg-custom-hover">
                            <span className="text-gray-light text-xs">No image</span>
                        </div>
                    )}
                </div>

                {/* Product Details - Middle Section */}
                <div className="min-w-0 flex-1">
                    <h3 className="mb-1 text-[17px] font-bold leading-7 text-[#1F2937]">
                        {displayName ?? item.name}
                    </h3>
                    {item.store && (
                        <p className="mb-1 text-sm text-custom-secondary">
                            {t("cart.store", "Store")}: {item.store}
                        </p>
                    )}
                    {variantText && (
                        <p className="mb-1 text-sm text-custom-secondary">
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
                        <p className="mb-3 text-sm leading-6 text-[#6B7280]">
                            {item.description}
                        </p>
                    )}

                    {promotionBadges.length > 0 && (
                        <div className="mb-3 flex flex-wrap items-center gap-2">
                            {promotionBadges.map((badge, index) => (
                                <span
                                    key={`${badge}-${index}`}
                                    className={`rounded-full px-3 py-1 text-sm font-medium leading-5 ${
                                        index % 2 === 0
                                            ? "bg-[#DDF8E8] text-[#16A34A]"
                                            : "bg-[#FDE8D0] text-[#FF5A1F]"
                                    }`}
                                >
                                    {badge}
                                </span>
                            ))}
                        </div>
                    )}

                    {/* Price before and after discount */}
                    <div className="space-y-1">
                        <div className="flex items-end gap-2">
                            {displayOriginalPrice && (
                                <span className="text-[14px] font-medium leading-5 text-[#9CA3AF] line-through">
                                    {displayOriginalPrice}
                                </span>
                            )}
                            <span className="text-[36px] font-extrabold leading-none text-[#111827] md:text-[40px]">
                                {displayPrice}
                            </span>
                        </div>
                        <div>
                            {displayOriginalSubtotal != null ? (
                                <span className="text-sm font-semibold text-[#16A34A]">
                                    {t("cart.youSave", "You save")}{" "}
                                    {formatPrice((originalSubtotal ?? 0) - priceNum * item.quantity)}
                                </span>
                            ) : (
                                <span className="text-sm font-semibold text-[#16A34A]">
                                    {item.savingsText || ""}
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                {/* Quantity Selector and Save for Later - Right Section */}
                <div className="flex shrink-0 flex-col items-end justify-center gap-4 md:min-w-[210px]">
                    {/* Quantity Selector */}
                    <div className="flex items-center rounded-full border border-[#E5E7EB] bg-white shadow-sm">
                        <button
                            type="button"
                            onClick={canEditQuantity ? handleDecrease : undefined}
                            disabled={!canEditQuantity}
                            className={canEditQuantity ? "p-3 text-[#64748B] transition-colors hover:bg-[#F8FAFC]" : "cursor-not-allowed p-3 opacity-50"}
                            aria-label="Decrease quantity"
                        >
                            <HiMinus className="h-4 w-4" />
                        </button>
                        <span className="min-w-[2.5rem] px-3 py-2 text-center text-2xl font-semibold leading-none text-[#111827]">
                            {item.quantity}
                        </span>
                        <button
                            type="button"
                            onClick={canEditQuantity ? handleIncrease : undefined}
                            disabled={!canEditQuantity}
                            className={canEditQuantity ? "p-3 text-[#64748B] transition-colors hover:bg-[#F8FAFC]" : "cursor-not-allowed p-3 opacity-50"}
                            aria-label="Increase quantity"
                        >
                            <HiPlus className="h-4 w-4" />
                        </button>
                    </div>

                    {/* Save for later */}
                    {onMoveToWishlist && (
                        <button
                            onClick={() => onMoveToWishlist(item.id)}
                            className="whitespace-nowrap text-base font-medium text-primary-light hover:underline"
                        >
                            {t("cart.saveForLater", "Save for later")}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
