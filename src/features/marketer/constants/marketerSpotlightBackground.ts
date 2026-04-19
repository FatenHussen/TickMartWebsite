import type { CSSProperties } from "react";

/**
 * Layered gradient used on marketer hero / spotlight sections (Become Marketer + Dashboard).
 * Keeps visual parity when reused.
 */
export const MARKETER_SPOTLIGHT_BACKGROUND_STYLE: CSSProperties = {
    background: `
 radial-gradient(ellipse 90% 75% at 0% 0%, color-mix(in srgb, var(--color-main) 26%, transparent), transparent 56%),
 radial-gradient(ellipse 68% 58% at 100% 8%, color-mix(in srgb, var(--color-api-second) 34%, transparent), transparent 52%),
 radial-gradient(ellipse 52% 44% at 78% 100%, color-mix(in srgb, var(--color-main) 16%, transparent), transparent 56%),
 linear-gradient(168deg, var(--color-bg-card) 0%, color-mix(in srgb, var(--color-bg-card) 91%, var(--color-api-second)) 100%)
 `.trim(),
};
