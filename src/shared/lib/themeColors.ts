import type { AppSettingsColorPalette } from "@/features/account/api/settingsApi";
import { lighten, darken, withAlpha, shade, mixHex } from "./colorUtils";

/** CSS variable name → value */
export type CSSVariableMap = Record<string, string>;

/** Warm paper — 60% of light UI. Brand orange stays on CTAs, not the canvas. */
const LIGHT_CREAM = "#F6F3EE";
const LIGHT_PAPER = "#FFFcf8";

/** Grocery dark: warm charcoal shelves, not OLED black. */
export const DARK_CANVAS = "#171412";
export const DARK_SECTION = "#1C1916";
export const DARK_ELEVATED = "#24201C";

/**
 * Light-mode page chrome.
 * Surfaces stay cream / white with a whisper of `main_color` (60/30/10).
 * Brand colour is reserved for buttons, logo, and status — not page wash.
 */
export function buildApiTintedLightSurfaces(main: string, second: string): CSSVariableMap {
  const canvas = mixHex(LIGHT_CREAM, main, 0.035);
  const card = mixHex(LIGHT_PAPER, main, 0.012);
  const muted = mixHex(LIGHT_CREAM, second, 0.04);
  return {
    "--color-bg": canvas,
    "--color-blue-off": mixHex(LIGHT_CREAM, main, 0.06),
    "--color-blue-very-light": mixHex(LIGHT_PAPER, main, 0.04),
    "--color-blue-border": mixHex("#E8E4DC", main, 0.1),
    "--color-bg-primary": canvas,
    "--color-bg-secondary": mixHex(LIGHT_CREAM, main, 0.05),
    "--color-bg-tertiary": muted,
    "--color-bg-hover": mixHex(LIGHT_CREAM, main, 0.08),
    "--color-bg-active": withAlpha(main, 0.1),
    "--color-bg-light": mixHex(LIGHT_PAPER, main, 0.03),
    "--color-bg-card": card,
    "--color-bg-muted": muted,
    "--color-bg-surface": card,
    "--color-bg-input": "#ffffff",
    "--color-bg-accent-soft": withAlpha(second, 0.08),
    "--color-text-inverse": "#ffffff",
    "--color-border-primary": mixHex("#E4DFD6", main, 0.12),
    "--color-border-secondary": mixHex("#DDD8D0", second, 0.1),
    "--color-border-light": mixHex("#EDE9E2", main, 0.08),
    "--color-overlay-brand": withAlpha(darken(main, 12), 0.5),
    "--color-overlay-brand-light": withAlpha(darken(main, 12), 0.25),
  };
}

/**
 * Dark-mode page chrome from API `main_color` / `second_color`
 * (deep `shade` / alpha mixes — same idea as account dark scope).
 */
export function buildApiTintedDarkSurfaces(main: string, second: string): CSSVariableMap {
  const bgRoot = mixHex(DARK_CANVAS, shade(main, 0.88), 0.16);
  const bgPrimary = mixHex(DARK_SECTION, shade(main, 0.85), 0.14);
  const bgSecondary = mixHex(DARK_SECTION, shade(second, 0.82), 0.12);
  const bgTertiary = mixHex(DARK_CANVAS, shade(main, 0.92), 0.1);
  const bgCard = mixHex(DARK_ELEVATED, shade(main, 0.78), 0.12);
  const bgLight = mixHex(DARK_ELEVATED, shade(main, 0.72), 0.16);
  const bgHover = mixHex(DARK_ELEVATED, shade(main, 0.65), 0.22);
  const bgActive = mixHex(DARK_ELEVATED, shade(main, 0.55), 0.28);
  const bgMuted = mixHex(DARK_SECTION, shade(second, 0.86), 0.12);
  const bgAccentSoft = withAlpha(second, 0.16);

  return {
    "--color-bg": bgRoot,
    "--color-blue-off": bgSecondary,
    "--color-blue-very-light": bgPrimary,
    "--color-blue-border": withAlpha(main, 0.22),
    "--color-bg-primary": bgPrimary,
    "--color-bg-secondary": bgSecondary,
    "--color-bg-tertiary": bgTertiary,
    "--color-bg-hover": bgHover,
    "--color-bg-active": bgActive,
    "--color-bg-light": bgLight,
    "--color-bg-card": bgCard,
    "--color-bg-card-elevated": bgCard,
    "--color-bg-muted": bgMuted,
    "--color-bg-surface": bgPrimary,
    "--color-bg-input": mixHex(DARK_ELEVATED, shade(main, 0.9), 0.2),
    "--color-bg-accent-soft": bgAccentSoft,
    "--color-text-inverse": shade(main, 0.95),
    "--color-border-primary": withAlpha(main, 0.18),
    "--color-border-secondary": withAlpha(second, 0.22),
    "--color-border-light": withAlpha(main, 0.12),
    "--color-overlay-brand": withAlpha(shade(main, 0.7), 0.7),
    "--color-overlay-brand-light": withAlpha(shade(main, 0.7), 0.4),
  };
}

/**
 * Derive a full light-mode palette from API colours.
 *
 *   main (main_color) → brand / accent / primary
 *   text (text_color) → body text tokens
 *   Surfaces / borders → tinted from `main_color` + `second_color` (see `buildApiTintedLightSurfaces`).
 */
export function buildLightPalette(colors: AppSettingsColorPalette): CSSVariableMap {
  const main = colors.main_color!;
  const text = colors.text_color!;
  const second = colors.second_color ?? lighten(main, 16);

  return {
    // ── Direct API values (no API background base) ──
    "--color-main": main,
    "--color-text": text,
    /** Accent surface / secondary actions — from API `second_color` */
    "--color-api-second": second,
    "--color-api-second-hover": darken(second, 8),

    // ── Brand / Accent — slightly deeper orange for CTAs (not neon wash) ──
    "--color-primary": darken(main, 6),
    "--color-primary-light": lighten(main, 4),
    "--color-primary-dark": darken(main, 14),
    "--color-secondary": darken(main, 5),
    "--color-trust": "#0F766E",

    // ── Derived brand shades ──
    "--color-blue-light": lighten(main, 12),

    ...buildApiTintedLightSurfaces(main, second),

    // ── Text (ALL based on text_color directly) ──
    "--color-text-primary": text,
    "--color-text-secondary": lighten(text, 12),
    "--color-text-tertiary": lighten(text, 24),
    "--color-text-heading": darken(text, 4),
    "--color-text-muted": lighten(text, 18),

    // ── Borders ──
    "--color-border-accent": lighten(main, 8),
    "--color-border-accent-light": withAlpha(main, 0.35),
    "--color-border-accent-strong": main,

    // ── Accents (from main_color) ──
    "--color-accent-primary": main,
    "--color-accent-primary-hover": darken(main, 8),
    "--color-accent-light": lighten(main, 10),
    "--color-accent-light-bg": withAlpha(main, 0.12),

    // ── Status (semantic — fixed across themes) ──
    "--color-success": "#16a34a",
    "--color-success-light": "#22c55e",
    "--color-warning": "#f59e0b",
    "--color-warning-dark": "#ca8a04",
    "--color-error": "#ef4444",
    "--color-error-light": "#f87171",
    "--color-status-error-bg": withAlpha("#ef4444", 0.08),
    "--color-discount": "#22c55e",
    "--color-delete": "#ff4d4f",
    "--color-gold": "#ffd700",

    // ── Gradient (from main_color) ──
    "--color-gradient-from": lighten(main, 8),
    "--color-gradient-to": darken(main, 12),

    // ── Shadow (from main_color) ──
    "--color-shadow": withAlpha(main, 0.1),
    "--color-shadow-strong": withAlpha(main, 0.18),
    "--color-shadow-accent": withAlpha(darken(main, 12), 0.24),

    // ── Calendar (from main_color) ──
    "--color-calendar-selected": main,
  };
}

/**
 * Derive a full dark-mode palette from API `dark_color`.
 *
 * Surfaces / borders use `buildApiTintedDarkSurfaces` from API `main_color` / `second_color`.
 */
export function buildDarkPalette(colors: AppSettingsColorPalette): CSSVariableMap {
  const main = colors.main_color!;
  const text = colors.text_color!;
  const second = colors.second_color ?? lighten(main, 10);

  return {
    // ── Direct API values ──
    "--color-main": main,
    "--color-text": text,
    "--color-api-second": second,
    "--color-api-second-hover": darken(second, 10),

    // ── Brand / Accent (from main_color) ──
    "--color-primary": main,
    "--color-primary-light": lighten(main, 8),
    "--color-primary-dark": darken(main, 12),
    "--color-secondary": text,
    "--color-trust": "#2DD4BF",

    // ── Derived brand shades ──
    "--color-blue-light": lighten(main, 12),

    ...buildApiTintedDarkSurfaces(main, second),

    // ── Text (ALL based on text_color directly) ──
    "--color-text-primary": text,
    "--color-text-secondary": withAlpha(text, 0.88),
    "--color-text-tertiary": withAlpha(text, 0.72),
    "--color-text-heading": text,
    "--color-text-muted": withAlpha("#E8E4DC", 0.82),

    // ── Borders ──
    "--color-border-accent": darken(main, 8),
    "--color-border-accent-light": withAlpha(main, 0.3),
    "--color-border-accent-strong": main,

    // ── Accents (from main_color) ──
    "--color-accent-primary": main,
    "--color-accent-primary-hover": darken(main, 8),
    "--color-accent-light": lighten(main, 8),
    "--color-accent-light-bg": withAlpha(main, 0.12),

    // ── Status (semantic — fixed across themes) ──
    "--color-success": "#22c55e",
    "--color-success-light": "#4ade80",
    "--color-warning": "#fbbf24",
    "--color-warning-dark": "#d97706",
    "--color-error": "#f87171",
    "--color-error-light": "#fca5a5",
    "--color-status-error-bg": withAlpha("#f87171", 0.1),
    "--color-discount": "#4ade80",
    "--color-delete": "#f87171",
    "--color-gold": "#fbbf24",

    // ── Gradient (from main_color) ──
    "--color-gradient-from": main,
    "--color-gradient-to": darken(main, 15),

    // ── Shadow (from main_color) ──
    "--color-shadow": withAlpha(main, 0.12),
    "--color-shadow-strong": withAlpha(main, 0.18),
    "--color-shadow-accent": withAlpha(main, 0.15),

    // ── Calendar (from main_color) ──
    "--color-calendar-selected": main,
  };
}

/**
 * Apply a map of CSS custom properties to the document root.
 * Safe to call repeatedly — simply overwrites the previous values.
 */
export function applyCSSVariables(vars: CSSVariableMap): void {
  const root = document.documentElement;
  for (const [key, value] of Object.entries(vars)) {
    root.style.setProperty(key, value);
  }
}

/**
 * Remove all dynamically-set CSS variables (restores CSS-file defaults).
 */
export function clearCSSVariables(vars: CSSVariableMap): void {
  const root = document.documentElement;
  for (const key of Object.keys(vars)) {
    root.style.removeProperty(key);
  }
}

/**
 * Check whether an API palette has enough data to generate a theme.
 */
export function isPaletteComplete(p?: AppSettingsColorPalette): p is AppSettingsColorPalette & {
  main_color: string;
  text_color: string;
} {
  return Boolean(p?.main_color && p?.text_color);
}

/**
 * Which API palette should drive CSS variables for the active UI theme.
 * In **dark** mode, uses `dark_color` when complete; otherwise falls back to
 * `color` so `buildDarkPalette` still receives API main/text (fixes empty theme
 * when the backend omits or partially fills `dark_color`).
 */
export function resolveApiPaletteForTheme(
  theme: "light" | "dark",
  lightPalette?: AppSettingsColorPalette,
  darkPalette?: AppSettingsColorPalette,
): AppSettingsColorPalette | undefined {
  if (theme === "light") {
    return isPaletteComplete(lightPalette) ? lightPalette : undefined;
  }
  if (isPaletteComplete(darkPalette)) return darkPalette;
  if (isPaletteComplete(lightPalette)) return lightPalette;
  return undefined;
}
