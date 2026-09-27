import { useQuery } from"@tanstack/react-query";
import { useCartStore } from"@/store/cart";
import { useCheckoutStore } from"@/store/checkout";
import { _OrderApi } from"../api/orderApi";
import type { OrderPreviewResponse } from"../types";
import { queryKeys } from"@/utils/queryKeys";
import { deliveryChoiceToSend } from"../lib/cartCheckout";

export interface OrderPreviewBenefits {
 pointCouponExchangeId?: number | null;
 pointFreeDeliveryExchangeId?: number | null;
 useSubscriptionDiscount?: boolean;
 useSubscriptionFreeDelivery?: boolean;
 promotionId?: number | null;
}

const PAYMENT_STORAGE_KEY ="tikmool_payment_method_id";

export function useOrderPreview(
 addressId: number | null,
 coupon?: string,
 benefits?: OrderPreviewBenefits,
 paymentMethodId?: string
): { data?: OrderPreviewResponse; isLoading: boolean; error: Error | null } {
 const cart_type = useCartStore((s) => s.cart_type);
 const recipe_id = useCartStore((s) => s.recipe_id);
 const admin_basket_id = useCartStore((s) => s.admin_basket_id);
 const admin_schedule_basket_id = useCartStore((s) => s.admin_schedule_basket_id);
 const basket_schedule_id = useCartStore((s) => s.basket_schedule_id);
 const getPreviewItems = useCartStore((s) => s.getPreviewItems);

 const previewItems = getPreviewItems();
 const deliveryChoice = useCheckoutStore((s) => s.deliveryChoice);
 const scheduledDeliveryAt = useCheckoutStore((s) => s.scheduledDeliveryAt);
 const earliestDeliveryAt = useCheckoutStore((s) => s.earliestDeliveryAt);
 const delivery = deliveryChoiceToSend(
 deliveryChoice,
 scheduledDeliveryAt,
 earliestDeliveryAt,
 );

 // Read from localStorage if not passed explicitly
 const resolvedPaymentMethodId =
 paymentMethodId || localStorage.getItem(PAYMENT_STORAGE_KEY) || undefined;

 const { data, isLoading, error } = useQuery({
 queryKey: queryKeys.orders.preview(
 addressId,
 previewItems,
 cart_type,
 recipe_id,
 admin_basket_id,
 coupon,
 {
 ...benefits,
 paymentMethodId: resolvedPaymentMethodId,
 admin_schedule_basket_id,
 basket_schedule_id,
 deliveryChoice: delivery.delivery_choice,
 scheduledDeliveryAt: delivery.scheduled_delivery_at ?? null,
 }
 ),
 queryFn: async () => {
 if (addressId == null || previewItems.length === 0) return null;
 const payload = {
 cart_type,
 address_id: addressId,
 is_instant_delivery: delivery.is_instant_delivery,
 delivery_choice: delivery.delivery_choice,
 ...(delivery.scheduled_delivery_at
 ? { scheduled_delivery_at: delivery.scheduled_delivery_at }
 : {}),
 items: previewItems,
 ...(coupon && { coupon }),
 ...(recipe_id != null && { recipe_id }),
 ...(admin_basket_id != null && { admin_basket_id }),
 ...(admin_schedule_basket_id != null && { admin_schedule_basket_id }),
 ...(basket_schedule_id != null && { basket_schedule_id }),
 ...(resolvedPaymentMethodId && { payment_method_id: resolvedPaymentMethodId }),
 ...(benefits?.pointCouponExchangeId != null && {
 point_coupon_exchange_id: benefits.pointCouponExchangeId,
 }),
 ...(benefits?.pointFreeDeliveryExchangeId != null && {
 point_free_delivery_exchange_id: benefits.pointFreeDeliveryExchangeId,
 }),
 ...(benefits?.useSubscriptionDiscount && {
 use_subscription_discount: true,
 }),
 ...(benefits?.useSubscriptionFreeDelivery && {
 use_subscription_free_delivery: true,
 }),
 ...(benefits?.promotionId != null && {
 promotion_id: benefits.promotionId,
 }),
 };
 return _OrderApi.postOrderPreview(payload);
 },
 enabled:
 addressId != null &&
 addressId > 0 &&
 previewItems.length > 0 &&
 previewItems.every((i) => i.shop_product_variant_id != null),
 staleTime: 1000 * 30,
 refetchOnMount:"always",
 });

 return { data: data ?? undefined, isLoading, error: error as Error | null };
}
