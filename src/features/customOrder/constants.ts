export const CUSTOM_ORDER_LIST_PAGE_SIZE = 15;

export const CUSTOM_ORDER_STATUS_FILTERS = [
  "all",
  "pending_pricing",
  "waiting_approval",
  "approved",
  "cancelled",
] as const;

export type CustomOrderStatusFilter =
  (typeof CUSTOM_ORDER_STATUS_FILTERS)[number];

export function parseCustomOrderStatusFilter(
  value: string | null | undefined
): CustomOrderStatusFilter {
  if (
    value &&
    (CUSTOM_ORDER_STATUS_FILTERS as readonly string[]).includes(value)
  ) {
    return value as CustomOrderStatusFilter;
  }
  return "all";
}
