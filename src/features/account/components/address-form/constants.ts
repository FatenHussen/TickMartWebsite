import type { CSSProperties } from "react";

export const DEFAULT_ADDRESS_LATITUDE = 33.5138;
export const DEFAULT_ADDRESS_LONGITUDE = 36.2765;

/** Light mode: expressive brand washes on the card surface. */
export const ADDRESS_FORM_HERO_BACKDROP_STYLE: CSSProperties = {
    opacity: 0.97,
    background: `
radial-gradient(ellipse 90% 80% at 0% 0%, color-mix(in srgb, var(--color-main) 28%, transparent), transparent 55%),
radial-gradient(ellipse 72% 58% at 100% 0%, color-mix(in srgb, var(--color-api-second) 38%, transparent), transparent 52%),
radial-gradient(ellipse 48% 42% at 82% 100%, color-mix(in srgb, var(--color-main) 17%, transparent), transparent 55%),
linear-gradient(168deg, var(--color-bg-card) 0%, color-mix(in srgb, var(--color-bg-card) 90%, var(--color-api-second)) 100%)
`,
};

/**
 * Dark mode: fixed cinematic foundation; API colors only as soft light washes (never full-bleed brand backgrounds).
 */
export const ADDRESS_PAGES_DARK_HERO_BACKDROP_STYLE: CSSProperties = {
    opacity: 1,
    background: `
radial-gradient(ellipse 88% 72% at 0% 0%, color-mix(in srgb, var(--color-main) 10%, transparent), transparent 58%),
radial-gradient(ellipse 68% 56% at 100% 0%, color-mix(in srgb, var(--color-api-second) 7%, transparent), transparent 52%),
radial-gradient(ellipse 42% 38% at 88% 100%, color-mix(in srgb, var(--color-main) 5%, transparent), transparent 56%),
linear-gradient(168deg, rgba(16, 17, 20, 0.88) 0%, rgba(11, 11, 12, 0.95) 100%)
`,
};
