import type { MyBasketFilterType } from "../../hooks/useMyBaskets";

export type MyBasketSortBy = "next_delivery" | "created" | "name";

export const CARD_BORDER_CLASS = "border-border-accent-light";

export const SECONDARY_BUTTON_CLASS =
    "flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium border border-custom-primary bg-[var(--color-bg-primary)] text-custom-primary transition-colors duration-200 hover:bg-custom-light dark:border-[rgba(255,255,255,0.06)] dark:bg-[rgba(255,255,255,0.03)] dark:hover:bg-[color-mix(in_srgb,var(--color-main)_8%,rgba(16,17,20,0.6))] dark:hover:border-[color-mix(in_srgb,var(--color-main)_18%,transparent)]";

export const PRIMARY_ACTION_BUTTON_CLASS =
    "!bg-[var(--color-api-second)] hover:!bg-[var(--color-api-second-hover)] !text-white px-4 py-2.5 rounded-lg text-sm font-semibold border-0 shadow-none focus:ring-[var(--color-api-second)] dark:!shadow-[0_10px_32px_-14px_color-mix(in_srgb,var(--color-api-second)_38%,transparent)] dark:ring-1 dark:ring-white/[0.06]";

export const TYPE_FILTER_OPTIONS: { value: MyBasketFilterType; labelKey: string }[] = [
    { value: "all", labelKey: "baskets.filters.all" },
    { value: "subscription", labelKey: "baskets.filters.subscription" },
    { value: "custom", labelKey: "baskets.filters.custom" },
    { value: "user-schedule", labelKey: "baskets.filters.userSchedule" },
];

