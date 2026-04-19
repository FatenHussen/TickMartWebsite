import type { CSSProperties } from "react";

/** Default map pin (Damascus area) — matches original form defaults */
export const DEFAULT_ADDRESS_LATITUDE = 33.5138;
export const DEFAULT_ADDRESS_LONGITUDE = 36.2765;

/**
 * Layered hero background (API theme variables). Kept in one place for reuse / tweaks.
 */
export const ADDRESS_FORM_HERO_BACKDROP_STYLE: CSSProperties = {
    opacity: 0.97,
    background: `
radial-gradient(ellipse 90% 80% at 0% 0%, color-mix(in srgb, var(--color-main) 28%, transparent), transparent 55%),
radial-gradient(ellipse 72% 58% at 100% 0%, color-mix(in srgb, var(--color-api-second) 38%, transparent), transparent 52%),
radial-gradient(ellipse 48% 42% at 82% 100%, color-mix(in srgb, var(--color-main) 17%, transparent), transparent 55%),
linear-gradient(168deg, var(--color-bg-card) 0%, color-mix(in srgb, var(--color-bg-card) 90%, var(--color-api-second)) 100%)
`,
};
