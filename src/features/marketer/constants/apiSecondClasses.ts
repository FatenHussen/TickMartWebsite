/**
 * Shared Tailwind / CSS variable class strings for API `second_color` (`--color-api-second`).
 * Used across marketer views for consistent CTAs and surfaces.
 */

export const API_SECOND_SURFACE =
    "text-white bg-[var(--color-api-second)] hover:bg-[var(--color-api-second-hover)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-main)]/35 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-bg-card)]";

/** Become-a-marketer primary actions (rounded-lg). */
export const API_SECOND_CTA_CLASS = `inline-flex items-center justify-center px-5 py-2.5 rounded-lg font-medium shadow-sm transition-colors ${API_SECOND_SURFACE} disabled:opacity-50 disabled:cursor-not-allowed`;

export const API_SECOND_CTA_WIDE_CLASS = `flex w-full items-center justify-center rounded-full py-3 px-6 font-semibold shadow-sm transition-opacity hover:opacity-90 ${API_SECOND_SURFACE}`;

/** Dashboard header / toolbar style (rounded-xl). */
export const API_SECOND_DASHBOARD_BTN = `inline-flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-medium shadow-sm transition-colors ${API_SECOND_SURFACE}`;

export const API_SECOND_FORM_SUBMIT_BTN = `flex-1 py-3 rounded-xl font-medium transition-colors disabled:opacity-60 ${API_SECOND_SURFACE}`;
