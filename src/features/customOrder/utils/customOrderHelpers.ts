import type {
  CustomOrderImage,
  CustomOrderNestedAddress,
  CustomOrderPricedItem,
  CustomOrderRequest,
  CustomOrderStatus,
} from "../types";

export const MAX_CUSTOM_ORDER_IMAGES = 5;
export const MIN_CUSTOM_ORDER_DESCRIPTION = 10;
export const MAX_CUSTOM_ORDER_IMAGE_SIZE_MB = 5;

const ALLOWED_MIME = ["image/jpeg", "image/png", "image/jpg", "image/webp"] as const;

export type CustomOrderImageRejectReason =
  | "too_large"
  | "invalid_type"
  | "limit";

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

export function mergeCustomOrderImages(
  previous: File[],
  incoming: FileList | null
): { files: File[]; rejected: CustomOrderImageRejectReason[] } {
  if (!incoming || incoming.length === 0) {
    return { files: previous, rejected: [] };
  }

  const maxBytes = MAX_CUSTOM_ORDER_IMAGE_SIZE_MB * 1024 * 1024;
  const rejected: CustomOrderImageRejectReason[] = [];
  const valid: File[] = [];

  for (const file of Array.from(incoming)) {
    if (file.size > maxBytes) {
      rejected.push("too_large");
      continue;
    }
    if (!(ALLOWED_MIME as readonly string[]).includes(file.type)) {
      rejected.push("invalid_type");
      continue;
    }
    if (!/\.(jpe?g|png|webp)$/i.test(file.name)) {
      rejected.push("invalid_type");
      continue;
    }
    valid.push(file);
  }

  const room = Math.max(0, MAX_CUSTOM_ORDER_IMAGES - previous.length);
  if (valid.length > room) {
    rejected.push("limit");
  }

  return {
    files: [...previous, ...valid.slice(0, room)],
    rejected: [...new Set(rejected)],
  };
}

export function getLinkedOrderId(order: {
  id?: number;
  order_id?: number;
} | null | undefined): number | null {
  if (!order) return null;
  return order.order_id ?? order.id ?? null;
}

export function formatCustomOrderDate(
  value: string | null | undefined,
  language: string
): string | null {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  const locale = language.startsWith("ar") ? "ar" : "en-GB";
  return date.toLocaleString(locale, {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function todayDateInputValue(now = new Date()): string {
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function toCustomOrderExpectedAtIso(
  date: string,
  time: string
): string | null {
  if (!date) return null;
  const parsed = new Date(`${date}T${time || "12:00"}`);
  if (Number.isNaN(parsed.getTime())) return null;
  return parsed.toISOString();
}

export function getCustomOrderDisplayTotal(
  item: CustomOrderRequest
): number | null {
  if (typeof item.order?.total === "number") return item.order.total;
  if (typeof item.approximate_total === "number") return item.approximate_total;
  if (typeof item.order?.approximate_total === "number") {
    return item.order.approximate_total;
  }
  return null;
}

function localizedAreaName(
  name: string | { ar?: string; en?: string } | undefined,
  language: string
): string | undefined {
  if (!name) return undefined;
  if (typeof name === "string") return name;
  return language.startsWith("ar")
    ? name.ar || name.en
    : name.en || name.ar;
}

export function formatCustomOrderAddress(
  address: CustomOrderNestedAddress | null | undefined,
  language: string
): string | null {
  if (!address) return null;
  const areaName = localizedAreaName(address.area?.name, language);
  const parts = [
    address.label,
    address.street_name,
    address.building_number,
    areaName,
  ].filter((part): part is string => Boolean(part && String(part).trim()));
  if (parts.length === 0) return null;
  return parts.join(", ");
}
