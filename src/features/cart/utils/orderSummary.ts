import type {
  CartItem,
  CheckoutOrderSummary,
  OrderPreviewResponse,
  OrderSummary,
} from "../types";
import { toNum } from "../utils";

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
  formatPrice: (amount: number) => string
): OrderSummary {
  const couponDiscount = getPreviewCouponDiscountAmount(preview);
  const subtotalBeforeDiscount = toNum(preview.subtotal_before_discount);
  const productDiscount = getPreviewProductDiscountAmount(preview);
  const basketDiscountAmount = toNum(preview.basket_discount_amount);
  const deliveryPrice = toNum(preview.delivery_price);
  const subscriptionDiscount = toNum(preview.subscription_discount);
  const promotionDiscount = toNum(preview.promotion_discount);

  return {
    numOfItems: toNum(preview.total_quantity),
    subtotal: formatPrice(toNum(preview.subtotal)),
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
    ...(promotionDiscount > 0 && {
      promotionDiscount: formatDiscount(formatPrice, promotionDiscount),
    }),
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
  formatPrice: (amount: number) => string
): CheckoutOrderSummary {
  const couponDiscount = getPreviewCouponDiscountAmount(preview);
  const subtotalBeforeDiscount = toNum(preview.subtotal_before_discount);
  const subtotalAfterProductDiscount = toNum(preview.subtotal_after_product_discount);
  const deliveryPrice = toNum(preview.delivery_price);
  const basketDiscountAmount = toNum(preview.basket_discount_amount);

  return {
    items,
    itemsTotal: formatPrice(subtotalBeforeDiscount || subtotalAfterProductDiscount),
    subtotal: formatPrice(toNum(preview.subtotal)),
    deliveryFees: deliveryPrice === 0 ? "Free" : formatPrice(deliveryPrice),
    storeDiscounts: formatDiscount(formatPrice, basketDiscountAmount),
    couponDiscount: formatDiscount(formatPrice, couponDiscount),
    total: formatPrice(toNum(preview.total)),
  };
}
