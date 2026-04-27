import { useTranslation } from "react-i18next";
import { useLanguage } from "@/context/LanguageContext";
import { HiGift } from "react-icons/hi";
import type {
    NonDiscountPromotion,
    OrderPreviewOrderItem,
    CartItem,
} from "../types";

interface NonDiscountPromotionBannerProps {
    promotion: NonDiscountPromotion;
    orderItemsByVariant?: Map<number, OrderPreviewOrderItem>;
    cartItems?: CartItem[];
}

export default function NonDiscountPromotionBanner({
    promotion,
    orderItemsByVariant = new Map(),
    cartItems = [],
}: NonDiscountPromotionBannerProps) {
    const { t } = useTranslation();
    const { isRTL } = useLanguage();

    return (
        <div
            className="rounded-2xl px-4 py-4 border"
            style={{
                backgroundColor:
                    "color-mix(in srgb, var(--color-success) 8%, var(--color-bg-card))",
                borderColor:
                    "color-mix(in srgb, var(--color-success) 30%, transparent)",
            }}
        >
            {/* Header */}
            <div className="flex items-start gap-3 mb-4">
                <span
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-white"
                    style={{
                        background:
                            "linear-gradient(135deg, var(--color-success) 0%, var(--color-success-light, var(--color-success)) 100%)",
                        boxShadow:
                            "0 4px 12px -4px color-mix(in srgb, var(--color-success) 40%, transparent)",
                    }}
                >
                    <HiGift className="w-5 h-5" />
                </span>
                <div className="min-w-0 flex-1">
                    <p
                        className="font-semibold"
                        style={{ color: "var(--color-success)" }}
                    >
                        {promotion.promotion_title}
                    </p>
                    <p className="text-sm text-custom-secondary mt-0.5">
                        {t(
                            "cart.freeItemsAdded",
                            "Free items will be added to your order:",
                        )}
                    </p>
                </div>
            </div>

            {/* Free items */}
            <div className="space-y-2.5" dir={isRTL ? "rtl" : "ltr"}>
                {promotion.free_items.map((fi) => {
                    const orderItem = orderItemsByVariant.get(
                        fi.shop_product_variant_id,
                    );
                    const cartItem = cartItems.find(
                        (i) =>
                            i.shop_product_variant_id ===
                            fi.shop_product_variant_id,
                    );
                    const image = orderItem?.image ?? cartItem?.image ?? "";
                    const productName =
                        orderItem?.product_name ??
                        cartItem?.name ??
                        t("cart.freeItem", "Free item");
                    const store = orderItem?.shop_name ?? cartItem?.store;
                    const variantText = orderItem?.variant?.length
                        ? orderItem.variant.join(", ")
                        : cartItem?.selectedAttributes
                          ? Object.entries(cartItem.selectedAttributes)
                                .map(([k, v]) => `${k}: ${v}`)
                                .join(", ")
                          : undefined;

                    return (
                        <div
                            key={fi.shop_product_variant_id}
                            className="flex gap-3 items-center p-3 rounded-xl bg-custom-card border"
                            style={{
                                borderColor:
                                    "color-mix(in srgb, var(--color-success) 22%, transparent)",
                            }}
                        >
                            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden shrink-0 bg-custom-tertiary flex items-center justify-center">
                                {image ? (
                                    <img
                                        src={image}
                                        alt={productName}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <HiGift
                                        className="w-8 h-8"
                                        style={{
                                            color: "var(--color-success)",
                                        }}
                                    />
                                )}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="font-semibold text-[color:var(--color-text)] truncate">
                                    {productName}
                                </p>
                                {store && (
                                    <p className="text-sm text-custom-secondary truncate">
                                        {t("cart.store", "Store")}: {store}
                                    </p>
                                )}
                                {variantText && (
                                    <p className="text-sm text-custom-secondary truncate">
                                        {t("cart.variant", "Variant")}:{" "}
                                        {variantText}
                                    </p>
                                )}
                            </div>
                            <div
                                className="shrink-0 text-base sm:text-lg font-bold whitespace-nowrap"
                                style={{ color: "var(--color-success)" }}
                            >
                                {t("cart.free", "FREE")} × {fi.free_quantity}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
