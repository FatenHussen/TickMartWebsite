import type {
  CartItem,
  CheckoutOrderSummary,
  OrderPreviewResponse,
  OrderSummary,
} from "../types";
import { toNum } from "../utils";
import { buildAutomaticRewardLines } from "./automaticPromotions";

export type PreviewSummaryLabels = {
  language: string;
  discountLabel: string;
  freeShippingLabel: string;
  freeShippingValue: string;
};

function formatDiscount(formatPrice: (amount: number) => string, amount: number): string {
  return amount > 0 ? `-${formatPrice(amount)}` : formatPrice(0);
}

export function getPreviewCouponDiscountAmount(preview: OrderPreviewResponse): number {
  const normalizedCouponDiscount = toNum(preview.coupon_discount);
  if (normalizedCouponDiscount > 0) return normalizedCouponDiscount;

  const legacyCouponDiscount = preview.coupon?.applied
    ? toNum(preview.coupon.discount)
    : 0;
  return legacyCouponDiscount;
}

export function getPreviewProductDiscountAmount(preview: OrderPreviewResponse): number {
  const subtotalBeforeDiscount = toNum(preview.subtotal_before_discount);
  const subtotalAfterProductDiscount = toNum(preview.subtotal_after_product_discount);
  return Math.max(0, subtotalBeforeDiscount - subtotalAfterProductDiscount);
}

export function mapPreviewToCartSummary(
  preview: OrderPreviewResponse,
  formatPrice: (amount: number) => string,
  labels?: PreviewSummaryLabels,
): OrderSummary {
  const couponDiscount = getPreviewCouponDiscountAmount(preview);
  const subtotalBeforeDiscount = toNum(preview.subtotal_before_discount);
  const productDiscount = getPreviewProductDiscountAmount(preview);
  const basketDiscountAmount = toNum(preview.basket_discount_amount);
  const deliveryPrice = toNum(preview.delivery_price);
  const subscriptionDiscount = toNum(preview.subscription_discount);
  const promotionDiscount = toNum(preview.promotion_discount);
  const rewardLines = labels
    ? buildAutomaticRewardLines({
        automatic: preview.automatic_promotions,
        promotionDiscount,
        deliveryPrice,
        language: labels.language,
        formatAmount: formatPrice,
        discountLabel: labels.discountLabel,
        freeShippingLabel: labels.freeShippingLabel,
        freeShippingValue: labels.freeShippingValue,
      })
    : [];
  const automaticDiscountShown = rewardLines.some((line) =>
    line.id.startsWith("automatic-discount"),
  );
  const discountAmount =
    productDiscount +
    basketDiscountAmount +
    couponDiscount +
    subscriptionDiscount +
    promotionDiscount;
  const grossSubtotal =
    subtotalBeforeDiscount > 0
      ? subtotalBeforeDiscount
      : toNum(preview.subtotal);

  return {
    numOfItems: toNum(preview.total_quantity),
    subtotal: formatPrice(toNum(preview.subtotal)),
    invoiceSubtotal: formatPrice(grossSubtotal),
    discountTotal: formatDiscount(formatPrice, discountAmount),
    ...(productDiscount > 0 && {
      subtotalBeforeDiscount: formatPrice(subtotalBeforeDiscount),
      productDiscount: formatDiscount(formatPrice, productDiscount),
    }),
    shipping: deliveryPrice === 0 ? "Free" : formatPrice(deliveryPrice),
    shippingIsFree: deliveryPrice === 0,
    storeDiscounts: formatDiscount(formatPrice, basketDiscountAmount),
    basketDiscount:
      basketDiscountAmount > 0
        ? formatDiscount(formatPrice, basketDiscountAmount)
        : undefined,
    tax: "0%",
    couponDiscount: formatDiscount(formatPrice, couponDiscount),
    ...(subscriptionDiscount > 0 && {
      subscriptionDiscount: formatDiscount(formatPrice, subscriptionDiscount),
    }),
    ...(promotionDiscount > 0 &&
      !automaticDiscountShown && {
        promotionDiscount: formatDiscount(formatPrice, promotionDiscount),
      }),
    ...(rewardLines.length > 0 && { rewardLines }),
    ...((preview.coupon?.excluded_items?.length ?? 0) > 0 && {
      excludedItemsCount: preview.coupon!.excluded_items.length,
    }),
    total: formatPrice(toNum(preview.total)),
    ...(preview.coupon && {
      couponFeedback: {
        valid: preview.coupon.valid,
        applied: preview.coupon.applied,
        fail_reasons: preview.coupon.fail_reasons ?? [],
      },
    }),
  };
}

export function mapPreviewToCheckoutSummary(
  preview: OrderPreviewResponse,
  items: CartItem[],
  formatPrice: (amount: number) => string,
  labels?: PreviewSummaryLabels,
): CheckoutOrderSummary {
  const couponDiscount = getPreviewCouponDiscountAmount(preview);
  const subtotalBeforeDiscount = toNum(preview.subtotal_before_discount);
  const subtotalAfterProductDiscount = toNum(preview.subtotal_after_product_discount);
  const productDiscount = getPreviewProductDiscountAmount(preview);
  const deliveryPrice = toNum(preview.delivery_price);
  const basketDiscountAmount = toNum(preview.basket_discount_amount);
  const subscriptionDiscount = toNum(preview.subscription_discount);
  const promotionDiscount = toNum(preview.promotion_discount);
  const rewardLines = labels
    ? buildAutomaticRewardLines({
        automatic: preview.automatic_promotions,
        promotionDiscount,
        deliveryPrice,
        language: labels.language,
        formatAmount: formatPrice,
        discountLabel: labels.discountLabel,
        freeShippingLabel: labels.freeShippingLabel,
        freeShippingValue: labels.freeShippingValue,
      })
    : [];
  const automaticDiscountShown = rewardLines.some((line) =>
    line.id.startsWith("automatic-discount"),
  );

  return {
    items,
    itemsTotal: formatPrice(subtotalBeforeDiscount || subtotalAfterProductDiscount),
    subtotal: formatPrice(toNum(preview.subtotal)),
    deliveryFees: deliveryPrice === 0 ? "Free" : formatPrice(deliveryPrice),
    shippingIsFree: deliveryPrice === 0,
    storeDiscounts: formatDiscount(formatPrice, basketDiscountAmount),
    couponDiscount: formatDiscount(formatPrice, couponDiscount),
    ...(productDiscount > 0 && {
      productDiscount: formatDiscount(formatPrice, productDiscount),
    }),
    ...(subscriptionDiscount > 0 && {
      subscriptionDiscount: formatDiscount(formatPrice, subscriptionDiscount),
    }),
    ...(promotionDiscount > 0 &&
      !automaticDiscountShown && {
        promotionDiscount: formatDiscount(formatPrice, promotionDiscount),
      }),
    ...(rewardLines.length > 0 && { rewardLines }),
    total: formatPrice(toNum(preview.total)),
    numOfItems: toNum(preview.total_quantity),
    pointsEarned:
      typeof preview.automatic_promotions?.points_expected === "number"
        ? preview.automatic_promotions.points_expected
        : typeof preview.automatic_promotions?.points_awarded === "number"
          ? preview.automatic_promotions.points_awarded
          : undefined,
  };
}
