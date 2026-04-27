/**
 * Basket details (`/basket/:id`) — surfaces and CTAs tied to API palette:
 * `main_color`, `second_color`, `text_color` (via CSS variables).
 */

export const BASKET_HERO_PANEL =
    "rounded-2xl border border-[color-mix(in_srgb,var(--color-main)_14%,var(--color-border-primary))] bg-[color-mix(in_srgb,var(--color-main)_6%,var(--color-bg-card))] shadow-[var(--shadow-card-neutral)]";

export const BASKET_ACCENT_SECTION =
    "rounded-2xl border border-[color-mix(in_srgb,var(--color-main)_16%,var(--color-border-primary))] bg-custom-accent-light shadow-sm";

export const BASKET_CARD_ELEVATED =
    "rounded-2xl border border-custom-primary/10 bg-custom-card shadow-[var(--shadow-card-neutral)]";

export const BASKET_PRIMARY_CTA =
    "rounded-xl font-semibold text-white shadow-sm transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-main)]/35 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-bg-card)] bg-[var(--color-api-second)] hover:bg-[var(--color-api-second-hover)] disabled:opacity-50 disabled:cursor-not-allowed";

export const BASKET_GHOST_ICON_BTN =
    "rounded-full bg-[var(--color-api-second)] text-white shadow-sm transition-colors hover:bg-[var(--color-api-second-hover)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-main)]/30";

export const BASKET_CHIP_MAIN =
    "inline-flex items-center rounded-full px-4 py-2 text-sm font-semibold bg-[color-mix(in_srgb,var(--color-main)_12%,var(--color-bg-card))] text-custom-primary";

export const BASKET_CHIP_SECOND =
    "inline-flex items-center rounded-full px-4 py-2 text-sm font-semibold bg-[color-mix(in_srgb,var(--color-api-second)_14%,var(--color-bg-card))] text-custom-primary";

export const BASKET_BADGE_OFFER =
    "inline-flex shrink-0 rounded-full px-3 py-1 text-xs font-semibold text-white bg-[var(--color-api-second)] shadow-sm";

export const BASKET_BADGE_NEUTRAL =
    "inline-flex items-center rounded-full px-3 py-1 text-xs font-medium text-custom-primary bg-[color-mix(in_srgb,var(--color-main)_10%,var(--color-bg-card))] ring-1 ring-[color-mix(in_srgb,var(--color-main)_18%,transparent)]";

export const BASKET_SPINNER =
    "animate-spin rounded-full border-2 border-[color-mix(in_srgb,var(--color-main)_25%,transparent)] border-t-[var(--color-main)]";
