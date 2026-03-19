import { useTranslation } from "react-i18next";
import { useLanguage } from "@/context/LanguageContext";
import { HiGift } from "react-icons/hi";
import type { NonDiscountPromotion, OrderPreviewOrderItem, CartItem } from "../types";

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
    <div className="rounded-2xl border border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20 px-4 py-4">
      {/* Promotion header */}
      <div className="flex items-start gap-3 mb-4">
        <HiGift className="w-6 h-6 shrink-0 text-green-600 dark:text-green-500" />
        <div>
          <p className="font-semibold text-green-800 dark:text-green-400">
            {promotion.promotion_title}
          </p>
          <p className="text-sm text-green-700 dark:text-green-500 mt-0.5">
            {t("cart.freeItemsAdded", "Free items will be added to your order:")}
          </p>
        </div>
      </div>

      {/* Items to offer - product cards */}
      <div className="space-y-3" dir={isRTL ? "rtl" : "ltr"}>
        {promotion.free_items.map((fi) => {
          const orderItem = orderItemsByVariant.get(fi.shop_product_variant_id);
          const cartItem = cartItems.find(
            (i) => i.shop_product_variant_id === fi.shop_product_variant_id
          );
          const image = orderItem?.image ?? cartItem?.image ?? "";
          const productName =
            orderItem?.product_name ?? cartItem?.name ?? t("cart.freeItem", "Free item");
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
              className="flex gap-4 items-center p-3 rounded-xl bg-white dark:bg-custom-card border border-green-200 dark:border-green-800"
            >
              {/* Product image */}
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden shrink-0 bg-custom-muted flex items-center justify-center">
                {image ? (
                  <img
                    src={image}
                    alt={productName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <HiGift className="w-8 h-8 sm:w-10 sm:h-10 text-green-500" />
                )}
              </div>
              {/* Product details */}
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-custom-primary truncate">{productName}</p>
                {store && (
                  <p className="text-sm text-custom-secondary">
                    {t("cart.store", "Store")}: {store}
                  </p>
                )}
                {variantText && (
                  <p className="text-sm text-custom-secondary">
                    {t("cart.variant", "Variant")}: {variantText}
                  </p>
                )}
              </div>
              {/* FREE label */}
              <div className="shrink-0 text-base sm:text-lg font-bold text-green-700 dark:text-green-400">
                {t("cart.free", "FREE")} × {fi.free_quantity}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
