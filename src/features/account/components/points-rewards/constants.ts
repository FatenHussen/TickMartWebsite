import { cn } from "@/shared/lib/utils";

/** Shared shell for dashboard-style cards */
export const dashboardCardClass = cn(
    "rounded-2xl border border-custom-primary/10 bg-custom-card shadow-sm",
    "transition-shadow duration-300 hover:shadow-md",
);

export const primaryGradientButtonClass = cn(
    "rounded-xl bg-gradient-to-r from-primary-light to-[var(--color-ui-orange-500)]",
    "font-semibold text-white shadow-sm",
    "transition-all duration-200 hover:opacity-95 hover:shadow-md active:scale-[0.99]",
);

/** CTA using API `second_color` — `themeColors` sets `--color-api-second` / `--color-api-second-hover`. */
/** Section shell without border — shadow elevation (Points history, Exchange history, etc.). */
export const historySectionShellClass = cn(
    "border-0",
    "shadow-[0_2px_6px_rgba(15,23,42,0.04),0_14px_40px_rgba(15,23,42,0.08)]",
    "dark:shadow-[0_2px_8px_rgba(0,0,0,0.35),0_16px_44px_rgba(0,0,0,0.4)]",
    "transition-shadow duration-300",
    "hover:shadow-[0_4px_10px_rgba(15,23,42,0.06),0_18px_48px_rgba(15,23,42,0.12)]",
    "dark:hover:shadow-[0_4px_12px_rgba(0,0,0,0.45),0_20px_52px_rgba(0,0,0,0.45)]",
);

export const redeemApiSecondButtonClass = cn(
    "!text-white !bg-[var(--color-api-second)] hover:!bg-[var(--color-api-second-hover)]",
    "shadow-sm transition-colors",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-main)]/35",
    "focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-bg-card)]",
);
