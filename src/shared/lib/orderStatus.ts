/**
 * Order status keys match the backend API (`data.status`).
 * Canonical out-for-delivery key is `out_delivery` — never `out_for_delivery`.
 */

export const ORDER_STATUSES = [
  "pending",
  "waiting_approval",
  "preparing",
  "out_delivery",
  "delivered",
  "cancelled",
  "cancelled_by_admin",
  "rejected_by_delivery",
  "faild_deliver",
  "returned_by_user",
] as const;

export type ApiOrderStatus = (typeof ORDER_STATUSES)[number];

/** Stepper / tracking stages (happy path). */
export const ORDER_STEPPER_STAGES = [
  "pending",
  "preparing",
  "out_delivery",
  "delivered",
] as const;

export type OrderStepperStatus = (typeof ORDER_STEPPER_STAGES)[number];

export const ORDER_STEPPER_PRIORITY: Record<OrderStepperStatus, number> = {
  pending: 0,
  preparing: 1,
  out_delivery: 2,
  delivered: 3,
};

const STATUS_I18N_KEY: Record<ApiOrderStatus, string> = {
  pending: "orders.pending",
  waiting_approval: "orders.waiting_approval",
  preparing: "orders.preparing",
  out_delivery: "orders.out_delivery",
  delivered: "orders.delivered",
  cancelled: "orders.cancelled",
  cancelled_by_admin: "orders.cancelled_by_admin",
  rejected_by_delivery: "orders.rejected_by_delivery",
  faild_deliver: "orders.faild_deliver",
  returned_by_user: "orders.returned_by_user",
};

const STATUS_FALLBACK_LABEL: Record<ApiOrderStatus, string> = {
  pending: "Pending",
  waiting_approval: "Waiting approval",
  preparing: "Preparing",
  out_delivery: "Out for delivery",
  delivered: "Delivered",
  cancelled: "Cancelled",
  cancelled_by_admin: "Cancelled by admin",
  rejected_by_delivery: "Rejected by delivery",
  faild_deliver: "Failed delivery",
  returned_by_user: "Returned by user",
};

/** Normalize API / legacy UI keys to the canonical status string. */
export function normalizeOrderStatus(status: unknown): string {
  const raw = String(status ?? "")
    .toLowerCase()
    .trim()
    .replace(/-/g, "_");
  if (raw === "out_for_delivery") return "out_delivery";
  return raw;
}

export function isApiOrderStatus(status: string): status is ApiOrderStatus {
  return (ORDER_STATUSES as readonly string[]).includes(status);
}

export function isOrderStepperStatus(
  status: string,
): status is OrderStepperStatus {
  return (ORDER_STEPPER_STAGES as readonly string[]).includes(status);
}

/**
 * Prefer API `status_label`, then i18n map, then the raw status key.
 * Never coerce unknown keys to `pending`.
 */
export function getOrderStatusLabel(
  status: unknown,
  options?: {
    statusLabel?: string | null;
    t?: (key: string, fallback?: string) => string;
  },
): string {
  const fromApi = options?.statusLabel?.trim();
  if (fromApi) return fromApi;

  const key = normalizeOrderStatus(status);
  if (isApiOrderStatus(key)) {
    const i18nKey = STATUS_I18N_KEY[key];
    const fallback = STATUS_FALLBACK_LABEL[key];
    return options?.t?.(i18nKey, fallback) ?? fallback;
  }

  return key || String(status ?? "");
}

/** Map raw status onto a stepper stage when possible; otherwise return null. */
export function toOrderStepperStatus(
  status: unknown,
): OrderStepperStatus | null {
  const key = normalizeOrderStatus(status);
  return isOrderStepperStatus(key) ? key : null;
}

export function isOutDeliveryStatus(status: unknown): boolean {
  return normalizeOrderStatus(status) === "out_delivery";
}
