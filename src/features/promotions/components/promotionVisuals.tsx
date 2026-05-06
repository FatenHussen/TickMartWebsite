import type { LucideIcon } from "lucide-react";
import {
    BadgePercent,
    Gift,
    Package,
    Percent,
    Sparkles,
    Truck,
    Zap,
} from "lucide-react";

/** Accent presets rotate by promotion index for visual variety (still on-brand). */
export const PROMO_CARD_VARIANTS = [
    {
        iconTint: "color-mix(in srgb, var(--color-main) 92%, white)",
        iconGlow: "color-mix(in srgb, var(--color-main) 45%, transparent)",
        meshFrom: "color-mix(in srgb, var(--color-main) 22%, transparent)",
        meshTo: "color-mix(in srgb, var(--color-api-second) 14%, transparent)",
        accentBar: "linear-gradient(180deg, var(--color-gradient-from), var(--color-gradient-to))",
    },
    {
        iconTint: "color-mix(in srgb, var(--color-api-second) 88%, white)",
        iconGlow: "color-mix(in srgb, var(--color-api-second) 40%, transparent)",
        meshFrom: "color-mix(in srgb, var(--color-api-second) 18%, transparent)",
        meshTo: "color-mix(in srgb, var(--color-main) 16%, transparent)",
        accentBar:
            "linear-gradient(180deg, color-mix(in srgb, var(--color-api-second) 95%, white), var(--color-main))",
    },
    {
        iconTint: "#fff",
        iconGlow: "color-mix(in srgb, var(--color-main) 38%, transparent)",
        meshFrom: "color-mix(in srgb, var(--color-main) 14%, transparent)",
        meshTo: "color-mix(in srgb, var(--color-primary-light, var(--color-api-second)) 20%, transparent)",
        accentBar: "linear-gradient(135deg, var(--color-gradient-from), var(--color-gradient-to))",
    },
] as const;

export function promotionTypeIcon(type: string): LucideIcon {
    switch (type) {
        case "simple_discount":
            return Percent;
        case "spend_x_discount":
            return BadgePercent;
        case "spend_x_get_gift":
            return Gift;
        case "spend_x_get_points":
            return Sparkles;
        case "free_shipping":
            return Truck;
        case "spend_x_get_free_shipping":
            return Package;
        default:
            return Zap;
    }
}

export function formatPromotionTypeLabel(type: string): string {
    return type
        .split("_")
        .filter(Boolean)
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" ");
}
