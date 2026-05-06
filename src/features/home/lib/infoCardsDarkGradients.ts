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
  "linear-gradient(152deg, #1e1f28 0%, #181a22 42%, #101116 100%)",
  "linear-gradient(168deg, #1b1c25 0%, #16171f 50%, #0e0f14 100%)",
  "linear-gradient(128deg, #202128 0%, #17181f 45%, #0c0d11 100%)",
];

const POINTS_BRAND_RADIAL: [string, string, string] = [
  "radial-gradient(ellipse 85% 70% at 92% 4%, color-mix(in srgb, var(--color-primary) 16%, transparent) 0%, transparent 58%)",
  "radial-gradient(ellipse 75% 65% at 6% 88%, color-mix(in srgb, var(--color-api-second) 12%, transparent) 0%, transparent 55%)",
  "radial-gradient(ellipse 90% 60% at 50% 0%, color-mix(in srgb, var(--color-primary) 12%, transparent) 0%, transparent 50%), radial-gradient(ellipse 60% 50% at 0% 100%, color-mix(in srgb, var(--color-api-second) 10%, transparent) 0%, transparent 50%)",
];

const READABILITY_VIGNETTE =
  "linear-gradient(to top, rgba(0,0,0,0.42) 0%, rgba(0,0,0,0.12) 38%, transparent 62%)";

export function getPointsTileDarkCardStyle(variant: 0 | 1 | 2): CSSProperties {
  const v = variant;
  return {
    ...darkCardShell,
    background: POINTS_TILE_BASE[v],
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
      "linear-gradient(155deg, #1d1e26 0%, #181922 38%, #12131a 72%, #0e0f14 100%)",
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
      "linear-gradient(175deg, rgba(22,23,30,0.97) 0%, #14151c 48%, #0b0c10 100%)",
    boxShadow: "inset 0 1px 0 0 rgba(255,255,255,0.06)",
  };
}
