import type { MyBasketFilterType } from "../../hooks/useMyBaskets";

export type MyBasketSortBy = "next_delivery" | "created" | "name";

export const CARD_BORDER_CLASS = "border-border-accent-light";

export const SECONDARY_BUTTON_CLASS =
    "flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium border border-border-light bg-bg-primary text-custom-primary hover:bg-[var(--color-bg-muted)] dark:bg-transparent dark:border-custom-primary dark:hover:bg-custom-card";

export const API_SECONDARY_PRIMARY_BUTTON_CLASS =
    "!bg-[var(--color-api-second)] hover:!bg-[var(--color-api-second-hover)] !text-white px-4 py-2.5 rounded-lg text-sm font-semibold border-0 shadow-none";

export const TYPE_FILTER_OPTIONS: { value: MyBasketFilterType; labelKey: string }[] = [
    { value: "all", labelKey: "baskets.filters.all" },
    { value: "subscription", labelKey: "baskets.filters.subscription" },
    { value: "custom", labelKey: "baskets.filters.custom" },
    { value: "user-schedule", labelKey: "baskets.filters.userSchedule" },
];

