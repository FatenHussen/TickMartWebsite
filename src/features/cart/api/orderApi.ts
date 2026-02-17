import _axios from "@/app/middleware/interceptor";
import { apiRoutes } from "@/utils/apiRoutes";
import type {
  OrderPreviewPayload,
  OrderPreviewResponse,
  OrderCreatePayload,
  CouponPreviewResponse,
  CartType,
} from "../types";

/** Map internal cart_type to API value (basket -> admin_cart) */
function toApiCartType(cartType: CartType): string {
  return cartType === "basket" ? "admin_cart" : cartType;
}

export const _OrderApi = {
  postOrderPreview: async (
    payload: OrderPreviewPayload
  ): Promise<OrderPreviewResponse> => {
    const body: Record<string, unknown> = {
      cart_type: toApiCartType(payload.cart_type),
      address_id: payload.address_id,
      is_instant_delivery: payload.is_instant_delivery,
      items: payload.items,
    };
    if (payload.coupon) body.coupon = payload.coupon;
    if (payload.recipe_id != null) body.recipe_id = payload.recipe_id;
    if (payload.admin_basket_id != null)
      body.admin_basket_id = payload.admin_basket_id;

    const res = await _axios.post<OrderPreviewResponse | { data: OrderPreviewResponse }>(
      apiRoutes.orders.preview,
      body
    );
    const data = res.data as { data?: OrderPreviewResponse } & OrderPreviewResponse;
    return (data?.data ?? data) as OrderPreviewResponse;
  },

  postOrder: async (payload: OrderCreatePayload): Promise<{ id: number }> => {
    const body: Record<string, unknown> = {
      address_id: payload.address_id,
      cart_type: toApiCartType(payload.cart_type),
      is_instant_delivery: payload.is_instant_delivery,
      items: payload.items,
    };
    if (payload.coupon) body.coupon = payload.coupon;
    if (payload.recipe_id != null) body.recipe_id = payload.recipe_id;
    if (payload.admin_basket_id != null)
      body.admin_basket_id = payload.admin_basket_id;
    if (payload.affiliate_id) body.affiliate_id = payload.affiliate_id;
    if (payload.payment_method_id)
      body.payment_method_id = payload.payment_method_id;
    if (payload.notes) body.notes = payload.notes;

    const res = await _axios.post(apiRoutes.orders.create, body);
    const raw = res.data as Record<string, unknown>;
    const data = (raw?.data ?? raw) as Record<string, unknown>;
    const order = data?.order as Record<string, unknown> | undefined;
    const id =
      (data?.id as number | undefined) ??
      (data?.order_id as number | undefined) ??
      (order?.id as number | undefined) ??
      (order?.order_id as number | undefined);
    if (id == null)
      throw new Error("Order created but no order ID in response");
    return { id: Number(id) };
  },

  postCouponPreview: async (
    coupon: string,
    items: { shop_product_variant_id: number; quantity: number }[]
  ): Promise<{ coupon: CouponPreviewResponse }> => {
    const res = await _axios.post<{ coupon: CouponPreviewResponse }>(
      apiRoutes.orders.couponPreview,
      { coupon, items }
    );
    return res.data;
  },
};
