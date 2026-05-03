import type { AppSettingsColorPalette } from "@/features/account/api/settingsApi";
import { lighten, darken, withAlpha, shade, tint, mixHex } from "./colorUtils";

/** CSS variable name → value */
export type CSSVariableMap = Record<string, string>;

/**
 * Light-mode page chrome from API `main_color` / `second_color`
 * (tints toward white so contrast stays readable).
 */
export function buildApiTintedLightSurfaces(main: string, second: string): CSSVariableMap {
  return {
    "--color-bg": tint(main, 0.97),
    "--color-blue-off": tint(main, 0.88),
    "--color-blue-very-light": tint(main, 0.9),
    "--color-blue-border": tint(main, 0.93),
    "--color-bg-primary": tint(main, 0.985),
    "--color-bg-secondary": tint(main, 0.88),
    "--color-bg-tertiary": tint(second, 0.92),
    "--color-bg-hover": tint(main, 0.86),
    "--color-bg-active": withAlpha(main, 0.14),
    "--color-bg-light": tint(main, 0.92),
    "--color-bg-card": tint(main, 0.993),
    "--color-bg-muted": tint(second, 0.95),
    "--color-bg-surface": tint(main, 0.99),
    "--color-bg-input": tint(main, 0.995),
    "--color-bg-accent-soft": withAlpha(second, 0.1),
    "--color-text-inverse": "#ffffff",
    "--color-border-primary": withAlpha(main, 0.22),
    "--color-border-secondary": withAlpha(second, 0.18),
    "--color-border-light": tint(main, 0.78),
    "--color-overlay-brand": withAlpha(darken(main, 12), 0.5),
    "--color-overlay-brand-light": withAlpha(darken(main, 12), 0.25),
  };
}

/**
 * Dark-mode page chrome from API `main_color` / `second_color`
 * (deep `shade` / alpha mixes — same idea as account dark scope).
 */
export function buildApiTintedDarkSurfaces(main: string, second: string): CSSVariableMap {
  const bgRoot = shade(main, 0.88);
  const bgPrimary = shade(main, 0.85);
  const bgSecondary = shade(second, 0.82);
  const bgTertiary = shade(main, 0.92);
  /** Cards: blend API `main` + `second` (dark only — see `buildApiTintedLightSurfaces` for light). */
  const cardMain = shade(main, 0.82);
  const cardSecond = shade(second, 0.8);
  const bgCard = mixHex(cardMain, cardSecond, 0.36);
  const bgLight = shade(main, 0.8);
  const bgHover = shade(main, 0.7);
  const bgActive = shade(main, 0.6);
  const bgMuted = shade(second, 0.86);
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
    "--color-bg-muted": bgMuted,
    "--color-bg-surface": bgPrimary,
    "--color-bg-input": shade(main, 0.9),
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

    // ── Brand / Accent (from main_color) ──
    "--color-primary": main,
    "--color-primary-light": lighten(main, 8),
    "--color-primary-dark": darken(main, 12),
    "--color-secondary": darken(main, 5),

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

    // ── Derived brand shades ──
    "--color-blue-light": lighten(main, 12),

    ...buildApiTintedDarkSurfaces(main, second),

    // ── Text (ALL based on text_color directly) ──
    "--color-text-primary": text,
    "--color-text-secondary": withAlpha(text, 0.88),
    "--color-text-tertiary": withAlpha(text, 0.72),
    "--color-text-heading": text,
    "--color-text-muted": withAlpha(text, 0.78),

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
