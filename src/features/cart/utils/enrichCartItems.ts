import type { CartItem, OrderPreviewOrderItem, OrderPreviewResponse } from "../types";
import { toNum } from "../utils";

/** Build preview prices map from orderItems (price = before, price_after_discount = after) */
export function buildPreviewPricesMap(
  orderItems: OrderPreviewOrderItem[] | undefined
): Map<number, { price: number; priceBeforeDiscount?: number }> {
  const map = new Map<number, { price: number; priceBeforeDiscount?: number }>();
  if (!orderItems?.length) return map;
  orderItems.forEach((it) => {
    if (it?.shop_product_variant_id != null) {
      const priceBefore = toNum(it.price);
      const priceAfter = toNum(it.price_after_discount ?? it.price);
      map.set(it.shop_product_variant_id, {
        price: priceAfter || priceBefore,
        priceBeforeDiscount: priceBefore > 0 ? priceBefore : undefined,
      });
    }
  });
  return map;
}

/** Build orderItems by variant map */
export function buildOrderItemsByVariant(
  orderItems: OrderPreviewOrderItem[] | undefined
): Map<number, OrderPreviewOrderItem> {
  const m = new Map<number, OrderPreviewOrderItem>();
  if (!orderItems?.length) return m;
  orderItems.forEach((it) => m.set(it.shop_product_variant_id, it));
  return m;
}

export type EnrichedCartItem = CartItem & {
  _displayName?: string;
  _displayPrice?: string;
  _displayOriginalPrice?: string;
  _displaySubtotal?: string;
  _freeQuantity?: number;
  _isExcludedFromCoupon?: boolean;
};

/** Enrich cart items with preview data (name, prices from orderItems) */
export function enrichCartItemsWithPreview(
  items: CartItem[],
  preview: OrderPreviewResponse | undefined,
  formatPrice: (n: number) => string
): EnrichedCartItem[] {
  if (!preview) return items as EnrichedCartItem[];

  const orderItemsByVariant = buildOrderItemsByVariant(
    preview.orderItems as OrderPreviewOrderItem[] | undefined
  );
  const previewPricesMap = buildPreviewPricesMap(
    preview.orderItems as OrderPreviewOrderItem[] | undefined
  );
  const excludedSet = new Set(
    preview.coupon?.excluded_items ?? preview.excluded_items ?? []
  );
  const promo = preview.non_discount_promotions as
    | { free_items?: { shop_product_variant_id: number; free_quantity: number }[] }
    | null
    | undefined;
  const freeItemsByVariant = new Map<number, number>();
  promo?.free_items?.forEach((fi) => {
    freeItemsByVariant.set(
      fi.shop_product_variant_id,
      (freeItemsByVariant.get(fi.shop_product_variant_id) ?? 0) + fi.free_quantity
    );
  });

  return items.map((item) => {
    const orderItem =
      item.shop_product_variant_id != null
        ? orderItemsByVariant.get(item.shop_product_variant_id)
        : undefined;
    const previewPrices =
      item.shop_product_variant_id != null
        ? previewPricesMap.get(item.shop_product_variant_id)
        : undefined;

    const priceAfterDiscount = orderItem
      ? toNum(orderItem.price_after_discount ?? orderItem.price)
      : previewPrices?.price;
    const priceBeforeDiscount = orderItem
      ? toNum(orderItem.price)
      : previewPrices?.priceBeforeDiscount;

    const displayPrice =
      priceAfterDiscount != null
        ? formatPrice(priceAfterDiscount)
        : item.price;
    const hasDiscount =
      priceBeforeDiscount != null &&
      priceBeforeDiscount > 0 &&
      (priceAfterDiscount ?? 0) < priceBeforeDiscount;
    const displayOriginalPrice = hasDiscount
      ? formatPrice(priceBeforeDiscount!)
      : item.originalPrice;
    const priceNum =
      priceAfterDiscount ??
      (item.priceNumeric ?? toNum(item.price));
    const displaySubtotal = formatPrice(priceNum * item.quantity);

    const variantStr = orderItem?.variant?.length
      ? orderItem.variant.join(", ")
      : undefined;

    return {
      ...item,
      name: orderItem?.product_name ?? item.name,
      size: variantStr ?? item.size,
      price: displayPrice,
      originalPrice: displayOriginalPrice,
      subtotal: displaySubtotal,
      _displayName: orderItem?.product_name,
      _displayPrice: displayPrice,
      _displayOriginalPrice: displayOriginalPrice,
      _displaySubtotal: displaySubtotal,
      _freeQuantity:
        item.shop_product_variant_id != null
          ? freeItemsByVariant.get(item.shop_product_variant_id)
          : undefined,
      _isExcludedFromCoupon:
        item.shop_product_variant_id != null
          ? excludedSet.has(item.shop_product_variant_id)
          : false,
    } as EnrichedCartItem;
  });
}

/** CartItem-like object for free-only items (display in tables) */
export type FreeDisplayItem = CartItem & { _isFree?: boolean };

/** Get free-only items (in free_items but not in cart) as CartItem-like for display */
export function getFreeOnlyDisplayItems(
  preview: OrderPreviewResponse | undefined,
  cartItems: CartItem[],
  freeLabel: string = "FREE"
): FreeDisplayItem[] {
  const promo = preview?.non_discount_promotions as
    | {
        promotion_title?: string;
        free_items?: { shop_product_variant_id: number; free_quantity: number }[];
      }
    | null
    | undefined;
  const orderItems = preview?.orderItems as OrderPreviewOrderItem[] | undefined;
  const orderItemsByVariant = buildOrderItemsByVariant(orderItems);

  if (!promo?.free_items?.length) return [];

  const cartVariantIds = new Set(
    cartItems
      .map((i) => i.shop_product_variant_id)
      .filter((id): id is number => id != null)
  );

  return promo.free_items
    .filter((fi) => !cartVariantIds.has(fi.shop_product_variant_id))
    .map((fi) => {
      const orderItem = orderItemsByVariant.get(fi.shop_product_variant_id);
      return {
        id: `free-${fi.shop_product_variant_id}`,
        name: orderItem?.product_name ?? "Free item",
        quantity: fi.free_quantity,
        price: freeLabel,
        subtotal: freeLabel,
        image: "",
        storeId: 0,
        _isFree: true,
      } as FreeDisplayItem;
    });
}
