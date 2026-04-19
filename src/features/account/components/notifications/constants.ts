/**
 * Push enable CTA: API `second_color` (`--color-api-second`) with white label — matches account CTAs (e.g. PackageCard).
 */
export const ENABLE_PUSH_BUTTON_CLASSES =
  "px-4 py-2 text-sm font-medium text-white rounded-lg transition-colors disabled:opacity-50 bg-[var(--color-api-second)] hover:bg-[var(--color-api-second-hover)]";

/** Decorative shell for the notifications route — soft brand orbs (matches other account “spotlight” surfaces). */
export const NOTIFICATIONS_PAGE_SHELL_CLASS =
  "relative overflow-hidden rounded-3xl bg-custom-card/40 p-1 shadow-[0_8px_30px_-12px_color-mix(in_srgb,var(--color-main)_14%,transparent)] backdrop-blur-[2px] dark:bg-custom-card/30 sm:p-1.5";

export const NOTIFICATIONS_DECO_TOP_ORB_CLASS =
  "pointer-events-none absolute -end-24 -top-28 h-72 w-72 rounded-full bg-[var(--color-api-second)] opacity-[0.14] blur-3xl dark:opacity-[0.18]";

export const NOTIFICATIONS_DECO_BOTTOM_ORB_CLASS =
  "pointer-events-none absolute -start-20 bottom-0 h-64 w-64 rounded-full bg-[color-mix(in_srgb,var(--color-main)_22%,transparent)] opacity-60 blur-3xl";
