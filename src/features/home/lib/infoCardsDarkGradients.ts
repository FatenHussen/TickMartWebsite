import type { CSSProperties } from "react";

/**
 * Dark InfoCards: creative multi-stop gradients with low-opacity API tints.
 * Vignette + solid charcoal stops keep copy readable (not “muddy” mid-tones).
 */

const darkCardShell: Pick<CSSProperties, "boxShadow" | "border"> = {
  border: "1px solid rgba(255,255,255,0.12)",
  boxShadow:
    "0 1px 0 0 rgba(255,255,255,0.07), 0 20px 48px -18px rgba(0,0,0,0.7), inset 0 1px 0 0 rgba(255,255,255,0.1)",
};

/** Three distinct tile personalities — same system, different angles / stops */
const POINTS_TILE_BASE: [string, string, string] = [
  "linear-gradient(152deg, #2A2520 0%, #24201C 48%, #1C1916 100%)",
  "linear-gradient(168deg, #26221D 0%, #221E1A 50%, #1A1714 100%)",
  "linear-gradient(128deg, #2C2722 0%, #24201C 45%, #1C1916 100%)",
];

const POINTS_BRAND_RADIAL: [string, string, string] = [
  "radial-gradient(ellipse 85% 70% at 92% 4%, color-mix(in srgb, var(--color-primary) 16%, transparent) 0%, transparent 58%)",
  "radial-gradient(ellipse 75% 65% at 6% 88%, color-mix(in srgb, var(--color-api-second) 12%, transparent) 0%, transparent 55%)",
  "radial-gradient(ellipse 90% 60% at 50% 0%, color-mix(in srgb, var(--color-primary) 12%, transparent) 0%, transparent 50%), radial-gradient(ellipse 60% 50% at 0% 100%, color-mix(in srgb, var(--color-api-second) 10%, transparent) 0%, transparent 50%)",
];

const READABILITY_VIGNETTE =
  "linear-gradient(to top, rgba(23,20,18,0.35) 0%, rgba(23,20,18,0.08) 38%, transparent 62%)";

export function getPointsTileDarkCardStyle(variant: 0 | 1 | 2): CSSProperties {
  const v = variant;
  return {
    ...darkCardShell,
    background: POINTS_TILE_BASE[v],
  };
}

const LIGHT_TILE_BASE: [string, string, string] = [
  "radial-gradient(ellipse 80% 65% at 100% -8%, color-mix(in srgb, #ff9f00 16%, transparent) 0%, transparent 58%), linear-gradient(165deg, #fbf6ee 0%, #f4ead8 52%, #efe4d2 100%)",
  "radial-gradient(ellipse 80% 65% at 100% -8%, color-mix(in srgb, #ff9f00 12%, transparent) 0%, transparent 58%), linear-gradient(165deg, #faf4eb 0%, #f3e8d6 55%, #eee3d0 100%)",
  "radial-gradient(ellipse 80% 65% at 100% -8%, color-mix(in srgb, #ff9f00 10%, transparent) 0%, transparent 58%), linear-gradient(165deg, #f8f2e8 0%, #f2e7d4 55%, #ece0cc 100%)",
];

export function getPointsTileLightCardStyle(variant: 0 | 1 | 2): CSSProperties {
  return {
    background: LIGHT_TILE_BASE[variant],
    border: "1px solid color-mix(in srgb, #ff9f00 18%, var(--color-border-primary))",
    boxShadow: "0 8px 24px -16px rgba(28, 25, 23, 0.14)",
  };
}

/** Absolutely stacked under content — brand wash + bottom scrim */
export function getPointsTileDarkGradientOverlayStyle(variant: 0 | 1 | 2): CSSProperties {
  const v = variant;
  return {
    background: [POINTS_BRAND_RADIAL[v], READABILITY_VIGNETTE].join(", "),
  };
}

/** Order tracking — wide card, matches tile language */
export function getOrderCardDarkStyle(): CSSProperties {
  return {
    ...darkCardShell,
    background:
      "linear-gradient(155deg, #2A2520 0%, #24201C 40%, #1C1916 100%)",
  };
}

export function getOrderCardDarkAmbientStyle(): CSSProperties {
  return {
    background: [
      "radial-gradient(ellipse 78% 85% at 102% -8%, color-mix(in srgb, var(--color-primary) 14%, transparent) 0%, transparent 56%)",
      "radial-gradient(ellipse 62% 70% at -6% 108%, color-mix(in srgb, var(--color-api-second) 11%, transparent) 0%, transparent 52%)",
      READABILITY_VIGNETTE,
    ].join(", "),
  };
}

export function getOrderStepperPanelDarkStyle(): CSSProperties {
  return {
    background:
      "linear-gradient(175deg, #2A2520 0%, #221E1A 50%, #1C1916 100%)",
    boxShadow: "inset 0 1px 0 0 rgba(255,255,255,0.06)",
  };
}
