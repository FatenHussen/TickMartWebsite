import type { CustomOrderImage, CustomOrderPricedItem, CustomOrderStatus } from "../types";

export const MAX_CUSTOM_ORDER_IMAGES = 5;
export const MIN_CUSTOM_ORDER_DESCRIPTION = 10;
export const MAX_CUSTOM_ORDER_IMAGE_SIZE_MB = 5;

const ALLOWED_MIME = ["image/jpeg", "image/png", "image/jpg", "image/webp"] as const;

export function resolveCustomOrderImageUrl(
  image: CustomOrderImage | string | undefined | null
): string | null {
  if (!image) return null;
  if (typeof image === "string") return image;
  return image.url || null;
}

export function getItemUnitPrice(item: CustomOrderPricedItem): number {
  return (
    item.unit_price ??
    item.price_after_discount ??
    item.price ??
    0
  );
}

export function getItemLineTotal(item: CustomOrderPricedItem): number {
  if (typeof item.total_price === "number") return item.total_price;
  return getItemUnitPrice(item) * (item.quantity || 1);
}

export function isCancelledStatus(status: string): boolean {
  return status === "cancelled" || status === "cancelled_by_admin";
}

export function statusTranslationKey(status: string): string {
  const known: CustomOrderStatus[] = [
    "pending_pricing",
    "waiting_approval",
    "approved",
    "cancelled",
    "cancelled_by_admin",
  ];
  if (known.includes(status as CustomOrderStatus)) {
    return `customOrder.status.${status}`;
  }
  return "customOrder.status.unknown";
}

export function mergeCustomOrderImages(previous: File[], incoming: FileList | null): File[] {
  if (!incoming) return previous;
  const maxBytes = MAX_CUSTOM_ORDER_IMAGE_SIZE_MB * 1024 * 1024;
  const valid = Array.from(incoming).filter((file) => {
    if (file.size > maxBytes) return false;
    if (!(ALLOWED_MIME as readonly string[]).includes(file.type)) return false;
    return /\.(jpe?g|png|webp)$/i.test(file.name);
  });
  return [...previous, ...valid].slice(0, MAX_CUSTOM_ORDER_IMAGES);
}

export function getLinkedOrderId(order: {
  id?: number;
  order_id?: number;
} | null | undefined): number | null {
  if (!order) return null;
  return order.order_id ?? order.id ?? null;
}
