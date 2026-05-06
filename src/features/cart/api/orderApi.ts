import _axios from"@/app/middleware/interceptor";
import { apiRoutes } from"@/utils/apiRoutes";
import type {
 OrderPreviewPayload,
 OrderPreviewResponse,
 OrderCreatePayload,
 CouponPreviewResponse,
 CartType,
 ActiveOrder,
 ActiveOrderResponse,
 OrderPreviewOrderItem,
} from"../types";
import { toNum } from"../utils";

/** Map internal cart_type to API value (basket -> admin_cart) */
function toApiCartType(cartType: CartType): string {
 if (cartType ==="basket") return"admin_cart";
 return cartType;
}

/**
 * Align preview JSON keys with what the app reads (snake_case vs camelCase,
 * `order_items` vs `orderItems`, etc.).
 */
function aliasPreviewResponseKeys(r: Record<string, unknown>): void {
 if (!Array.isArray(r.orderItems) && Array.isArray(r.order_items)) {
 r.orderItems = r.order_items;
 }
 if (r.subtotal_before_discount == null && r.subtotalBeforeDiscount != null) {
 r.subtotal_before_discount = r.subtotalBeforeDiscount;
 }
 if (r.subtotal_after_product_discount == null && r.subtotalAfterProductDiscount != null) {
 r.subtotal_after_product_discount = r.subtotalAfterProductDiscount;
 }
 if (r.total_quantity == null && r.totalQuantity != null) {
 r.total_quantity = r.totalQuantity;
 }
 if (r.total == null && r.totalAmount != null) {
 r.total = r.totalAmount;
 }
 if (!Array.isArray(r.available_promotions) && Array.isArray(r.availablePromotions)) {
 r.available_promotions = r.availablePromotions;
 }
 if (r.non_discount_promotions == null && r.nonDiscountPromotions != null) {
 r.non_discount_promotions = r.nonDiscountPromotions;
 }
 if (!Array.isArray(r.excluded_items) && Array.isArray(r.excludedItems)) {
 r.excluded_items = r.excludedItems;
 }
 if (r.automatic_promotions == null && r.automaticPromotions != null) {
 r.automatic_promotions = r.automaticPromotions;
 }
}

/** One preview line: accept snake_case or camelCase field names from the API */
function normalizePreviewOrderItemRow(raw: unknown): OrderPreviewOrderItem {
 const it = raw as Record<string, unknown>;
 const shop_product_variant_id = Number(
 it.shop_product_variant_id ?? it.shopProductVariantId ?? 0
 );
 const quantity = Number(it.quantity ?? 0);
 const unit_price = it.unit_price ?? it.unitPrice;
 const final_price = it.final_price ?? it.finalPrice;
 const price = it.price ?? unit_price;
 const price_after_discount = it.price_after_discount ?? final_price ?? price;

 return {
 shop_product_variant_id,
 quantity,
 product_name: (it.product_name ?? it.productName) as string | undefined,
 product_image: (it.product_image ?? it.productImage) as string | undefined,
 price: price as number | string,
 unit_price: unit_price as number | string | undefined,
 final_price: final_price as number | string | undefined,
 product_discount: it.product_discount as number | string | undefined,
 price_after_discount: price_after_discount as number | string | undefined,
 subtotal: (it.subtotal ?? it.lineSubtotal) as number | string | undefined,
 total: (it.total ?? it.lineTotal) as number | string | undefined,
 extras_total: (it.extras_total ?? it.extrasTotal) as number | string | undefined,
 variant: Array.isArray(it.variant) ? (it.variant as string[]) : undefined,
 shop_name: (it.shop_name ?? it.shopName) as string | undefined,
 image: (it.image ?? it.product_image ?? it.productImage) as string | undefined,
 extras: (it.extras as OrderPreviewOrderItem["extras"]) ?? undefined,
 note: it.note as string | undefined,
 };
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
 if (payload.admin_schedule_basket_id != null)
 body.admin_schedule_basket_id = payload.admin_schedule_basket_id;
 if (payload.basket_schedule_id != null)
 body.basket_schedule_id = payload.basket_schedule_id;
 if (payload.point_coupon_exchange_id != null)
 body.point_coupon_exchange_id = payload.point_coupon_exchange_id;
 if (payload.point_free_delivery_exchange_id != null)
 body.point_free_delivery_exchange_id = payload.point_free_delivery_exchange_id;
 if (payload.use_subscription_discount != null)
 body.use_subscription_discount = payload.use_subscription_discount;
 if (payload.use_subscription_free_delivery != null)
 body.use_subscription_free_delivery = payload.use_subscription_free_delivery;
 if (payload.promotion_id != null)
 body.promotion_id = payload.promotion_id;
 if (payload.payment_method_id != null)
 body.payment_method_id = payload.payment_method_id;

 const res = await _axios.post<OrderPreviewResponse | { data: OrderPreviewResponse }>(
 apiRoutes.orders.preview,
 body
 );
 const raw = res.data as { data?: OrderPreviewResponse } & OrderPreviewResponse;
 const result = (raw?.data ?? raw) as OrderPreviewResponse;

 // ── Normalize API response ──────────────────────────────────────────────
 // The backend has 3 response formats depending on API version:
 // • OLD (preview / preview+points / preview+package): flat root fields, no discounts obj
 // • MID (new / new:default): discounts obj but NO basket/external keys, delivery_price at root
 // • NEW (new3/8+): discounts.basket + discounts.external, delivery nested as { price }

 const r = result as unknown as Record<string, unknown>;
 aliasPreviewResponseKeys(r);
 const d = r.discounts as Record<string, unknown> | null | undefined;
 const isNewFormat = d != null && 'basket' in d; // new3/8+ format
 const isMidFormat = d != null && !isNewFormat; // intermediate format
 const isStringDiscounts = d != null && typeof (d.delivery_price ?? d.coupon_discount) === 'string';

 // ── 0. Parse string values from root (new API returns "$55.00" etc) ─────
 if (typeof result.subtotal_before_discount === 'string') {
 r.subtotal_before_discount = toNum(result.subtotal_before_discount);
 }
 if (typeof result.subtotal_after_product_discount === 'string') {
 r.subtotal_after_product_discount = toNum(result.subtotal_after_product_discount);
 }
 if (typeof result.total === 'string') {
 r.total = toNum(result.total);
 }

 // ── 1. delivery_price ───────────────────────────────────────────────────
 if (result.delivery_price == null || typeof result.delivery_price === 'string') {
 const nested = r.delivery as { price?: number | string } | undefined;
 const fromNested = nested?.price;
 const fromDiscounts = d?.delivery_price;
 result.delivery_price = toNum(fromNested ?? fromDiscounts ?? result.delivery_price ?? 0);
 }

 // ── 2. discount breakdown ───────────────────────────────────────────────
 if (isNewFormat) {
 // Latest format: discounts.basket / external / coupon / points / subscription / promotion
 const basket = d!.basket as { percent?: string | number; amount?: number } | undefined;
 const external = d!.external as { amount?: number; source?: string | null } | undefined;
 const couponD = d!.coupon as { provided?: boolean; applied?: boolean; code?: string | null; discount?: number } | undefined;
 const points = d!.points as { coupon_discount?: number; free_delivery_applied?: boolean } | undefined;
 const subRaw = d!.subscription;
 const sub = Array.isArray(subRaw) ? null : subRaw as { discount_amount?: number } | undefined;
 const promo = d!.promotion as { discount_amount?: number } | undefined;
 const src = external?.source ?? null;

 if (result.basket_discount_amount == null) result.basket_discount_amount = Number(basket?.amount ?? 0) || 0;
 if (result.basket_discount_percent == null) result.basket_discount_percent = parseFloat(String(basket?.percent ?? 0)) || 0;
 if (result.coupon_discount == null) result.coupon_discount = src === 'coupon' ? Number(couponD?.discount ?? 0) : 0;
 if (result.coupon_discount_from_points == null) result.coupon_discount_from_points = Number(points?.coupon_discount ?? 0);
 if (result.free_delivery_from_points == null) result.free_delivery_from_points = points?.free_delivery_applied ?? false;
 if (result.subscription_discount == null) result.subscription_discount = src === 'subscription' ? Number(sub?.discount_amount ?? 0) : 0;
 if (result.promotion_discount == null) result.promotion_discount = src === 'promotion' ? Number(promo?.discount_amount ?? 0) : 0;

 if (!result.coupon) {
 result.coupon = {
 provided: couponD?.provided ?? false,
 valid: couponD?.applied ?? false,
 applied: couponD?.applied ?? false,
 code: couponD?.code ?? null,
 discount: couponD?.discount ?? 0,
 excluded_items: [],
 fail_reasons: [],
 };
 }
 } else if (isMidFormat) {
 // Intermediate format: discounts.coupon / points / subscription / promotion (no basket/external)
 const couponD = d!.coupon as { provided?: boolean; applied?: boolean; code?: string | null; discount?: number } | undefined;
 const points = d!.points as { coupon_discount?: number; free_delivery_applicable?: boolean } | undefined;
 const subRaw = d!.subscription;
 const sub = Array.isArray(subRaw) ? null : subRaw as { discount_amount?: number } | undefined;
 const promo = d!.promotion as { discount_amount?: number } | undefined;

 if (result.coupon_discount == null) result.coupon_discount = Number(couponD?.discount ?? 0);
 if (result.coupon_discount_from_points == null) result.coupon_discount_from_points = Number(points?.coupon_discount ?? 0);
 if (result.free_delivery_from_points == null) result.free_delivery_from_points = points?.free_delivery_applicable ?? false;
 if (result.subscription_discount == null) result.subscription_discount = Number(sub?.discount_amount ?? 0);
 if (result.promotion_discount == null) result.promotion_discount = Number(promo?.discount_amount ?? 0);

 if (!result.coupon) {
 result.coupon = {
 provided: couponD?.provided ?? false,
 valid: couponD?.applied ?? false,
 applied: couponD?.applied ?? false,
 code: couponD?.code ?? null,
 discount: couponD?.discount ?? 0,
 excluded_items: [],
 fail_reasons: [],
 };
 }
 } else {
 // Old format: root coupon / point_exchanges / subscription objects
 const pe = r.point_exchanges as { coupon_discount?: number; free_delivery_applicable?: boolean } | undefined;
 const sub = r.subscription as { discount_amount_applied?: number; discount_amount?: number } | undefined;

 if (result.coupon_discount == null) result.coupon_discount = result.coupon?.applied ? (result.coupon.discount ?? 0) : 0;
 if (result.coupon_discount_from_points == null) result.coupon_discount_from_points = Number(pe?.coupon_discount ?? 0);
 if (result.free_delivery_from_points == null) result.free_delivery_from_points = pe?.free_delivery_applicable ?? false;
 if (result.subscription_discount == null) result.subscription_discount = Number(sub?.discount_amount_applied ?? sub?.discount_amount ?? 0);
 if (result.promotion_discount == null) result.promotion_discount = 0;
 }

 // ── 3. subtotal — always show items price after per-product discounts ───
 const subBefore = toNum(r.subtotal_before_discount ?? result.subtotal_before_discount);
 const subAfter = toNum(r.subtotal_after_product_discount ?? result.subtotal_after_product_discount);
 result.subtotal = subAfter || subBefore || toNum(result.subtotal);

 // ── 4. basket discount fallback ─────────────────────────────────────────
 if (result.basket_discount_amount == null) {
 result.basket_discount_amount = Math.max(0, subBefore - subAfter);
 }
 if (result.basket_discount_percent == null) result.basket_discount_percent = 0;

 // ── 5. ensure coupon object always exists ───────────────────────────────
 if (!result.coupon) {
 const totalCoupon = (result.coupon_discount ?? 0) + (result.coupon_discount_from_points ?? 0);
 result.coupon = {
 provided: totalCoupon > 0,
 valid: totalCoupon > 0,
 applied: totalCoupon > 0,
 code: null,
 discount: totalCoupon,
 excluded_items: Array.isArray(r.excluded_items) ? r.excluded_items as number[] : [],
 fail_reasons: [],
 };
 } else if (Array.isArray(r.excluded_items) && (result.coupon.excluded_items?.length ?? 0) === 0) {
 result.coupon.excluded_items = r.excluded_items as number[];
 }

 // ── 6. Parse string values from discounts (e.g. "$0.00", "$10.00") ───────
 if (isStringDiscounts && d) {
 const couponDisc = d.coupon_discount;
 const basketDisc = d.basketDiscount ?? d.basket_discount_amount;
 const couponPointsDisc = d.coupon_discount_from_points;
 const subscriptionDisc = d.subscription_discount;
 const promotionDisc = d.promotion_discount;
 const deliveryPrice = d.delivery_price;
 const freeDeliveryFromPoints = d.free_delivery_from_points;
 const excludedItems = d.excluded_items;
 if (typeof couponDisc === 'string') result.coupon_discount = toNum(couponDisc);
 if (typeof basketDisc === 'string') result.basket_discount_amount = toNum(basketDisc);
 if (typeof couponPointsDisc === 'string') result.coupon_discount_from_points = toNum(couponPointsDisc);
 if (typeof subscriptionDisc === 'string') result.subscription_discount = toNum(subscriptionDisc);
 if (typeof promotionDisc === 'string') result.promotion_discount = toNum(promotionDisc);
 if (typeof deliveryPrice === 'string') result.delivery_price = toNum(deliveryPrice);
 if (typeof freeDeliveryFromPoints === 'boolean') result.free_delivery_from_points = freeDeliveryFromPoints;
 if (Array.isArray(excludedItems)) {
 result.excluded_items = excludedItems as number[];
 if (result.coupon && (result.coupon.excluded_items?.length ?? 0) === 0) {
 result.coupon.excluded_items = excludedItems as number[];
 }
 }
 }

 // Some APIs return flat numeric discounts (not nested coupon/points objects)
 if (d) {
 if (result.coupon_discount == null) result.coupon_discount = toNum(d.coupon_discount);
 if (result.coupon_discount_from_points == null) {
 result.coupon_discount_from_points = toNum(d.coupon_discount_from_points);
 }
 if (result.subscription_discount == null) {
 result.subscription_discount = toNum(d.subscription_discount);
 }
 if (result.promotion_discount == null) {
 result.promotion_discount = toNum(d.promotion_discount);
 }
 if (result.free_delivery_from_points == null && typeof d.free_delivery_from_points === "boolean") {
 result.free_delivery_from_points = d.free_delivery_from_points;
 }
 if ((result.excluded_items?.length ?? 0) === 0 && Array.isArray(d.excluded_items)) {
 result.excluded_items = d.excluded_items as number[];
 }
 }

 // Normalize order lines: unify keys, then price + price_after_discount
 if (Array.isArray(result.orderItems)) {
 result.orderItems = result.orderItems.map((item) => {
 const o = normalizePreviewOrderItemRow(item);
 return {
 ...o,
 price: o.price ?? o.unit_price,
 price_after_discount:
 o.price_after_discount ?? o.final_price ?? o.price ?? o.unit_price,
 };
 });
 }

 return result;
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
 if (payload.admin_schedule_basket_id != null)
 body.admin_schedule_basket_id = payload.admin_schedule_basket_id;
 if (payload.basket_schedule_id != null)
 body.basket_schedule_id = payload.basket_schedule_id;
 if (payload.affiliate_id) body.affiliate_id = payload.affiliate_id;
 if (payload.payment_method_id)
 body.payment_method_id = payload.payment_method_id;
 if (payload.notes) body.notes = payload.notes;
 if (payload.point_coupon_exchange_id != null)
 body.point_coupon_exchange_id = payload.point_coupon_exchange_id;
 if (payload.point_free_delivery_exchange_id != null)
 body.point_free_delivery_exchange_id = payload.point_free_delivery_exchange_id;
 if (payload.use_subscription_discount != null)
 body.use_subscription_discount = payload.use_subscription_discount;
 if (payload.use_subscription_free_delivery != null)
 body.use_subscription_free_delivery = payload.use_subscription_free_delivery;
 if (payload.promotion_id != null)
 body.promotion_id = payload.promotion_id;

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

 getActiveOrder: async (): Promise<ActiveOrder | null> => {
 try {
 const res = await _axios.get<ActiveOrderResponse>(apiRoutes.orders.active);
 return res.data?.data ?? null;
 } catch {
 return null;
 }
 },

 cancelOrder: async (orderId: number | string): Promise<void> => {
 await _axios.post(apiRoutes.orders.cancel(orderId));
 },

 reorder: async (orderId: number | string): Promise<{ id: number }> => {
 const res = await _axios.post(apiRoutes.orders.reorder(orderId));
 const raw = res.data as Record<string, unknown>;
 const data = (raw?.data ?? raw) as Record<string, unknown>;
 const id = (data?.id as number | undefined) ?? (data?.order_id as number | undefined);
 if (id == null) throw new Error("Reorder failed: no order ID in response");
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
