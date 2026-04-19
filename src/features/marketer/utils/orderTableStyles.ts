const ORDER_STATUS_BADGE_MAP: Record<string, string> = {
    delivered: "bg-status-success-bg text-success",
    pending: "bg-warning-bg text-warning-dark",
    cancelled: "bg-status-error-bg text-error",
    preparing: "bg-accent-light-bg text-accent-primary",
    out_delivery: "bg-warning-bg text-warning-dark",
};

const FALLBACK_STATUS_BADGE = "bg-custom-tertiary text-custom-secondary";

export function getOrderStatusBadgeClassNames(status: string): string {
    return ORDER_STATUS_BADGE_MAP[status] ?? FALLBACK_STATUS_BADGE;
}

const COUPON_SOURCE_BADGE =
    "bg-[color-mix(in_srgb,var(--color-api-second)_22%,var(--color-bg-card))] text-[var(--color-main)] ring-1 ring-[color-mix(in_srgb,var(--color-api-second)_35%,transparent)]";

const LINK_SOURCE_BADGE =
    "bg-[color-mix(in_srgb,var(--color-api-second)_12%,var(--color-bg-muted))] text-[var(--color-api-second)] ring-1 ring-[color-mix(in_srgb,var(--color-api-second)_22%,transparent)]";

export function getAffiliateSourceBadgeClassNames(source: string): string {
    return source === "coupon" ? COUPON_SOURCE_BADGE : LINK_SOURCE_BADGE;
}

/** Pagination prev/next on Recent Orders table */
export const ORDERS_TABLE_PAGINATION_NAV_CLASS =
    "inline-flex items-center justify-center rounded-xl border border-custom-primary p-2.5 text-text-primary transition-all duration-200 enabled:hover:border-[var(--color-api-second)] enabled:hover:bg-[color-mix(in_srgb,var(--color-api-second)_10%,var(--color-bg-card))] disabled:cursor-not-allowed disabled:opacity-35";
