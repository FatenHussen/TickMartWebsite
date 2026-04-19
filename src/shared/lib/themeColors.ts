import type { AppSettingsColorPalette } from "@/features/account/api/settingsApi";
import { lighten, darken, withAlpha } from "./colorUtils";

/** CSS variable name → value */
export type CSSVariableMap = Record<string, string>;

/**
 * Surfaces, borders, and tints aligned with `src/index.css` @theme.
 * Intentionally not driven by API `second_color` so page backgrounds stay stable.
 */
const FIXED_LIGHT_SURFACE: CSSVariableMap = {
  "--color-bg": "#ffffff",
  "--color-blue-off": "#e4f0fb",
  "--color-blue-very-light": "#e5f3ff",
  "--color-blue-border": "#eff6ff",
  "--color-bg-primary": "#ffffff",
  "--color-bg-secondary": "#e4f0fb",
  "--color-bg-tertiary": "#f3f4f6",
  "--color-bg-hover": "#e4f0fb",
  "--color-bg-active": "#e0f7fa",
  "--color-bg-light": "#f8fafc",
  "--color-bg-card": "#ffffff",
  "--color-bg-muted": "#f3f4f6",
  "--color-bg-surface": "#ffffff",
  "--color-bg-input": "#ffffff",
  "--color-bg-accent-soft": "#e5f3ff",
  "--color-text-inverse": "#ffffff",
  "--color-border-primary": "#e4f0fb",
  "--color-border-secondary": "#d1d5db",
  "--color-border-light": "#e5e7eb",
};

const FIXED_DARK_SURFACE: CSSVariableMap = {
  "--color-bg": "#1e293b",
  "--color-blue-off": "#1a2332",
  "--color-blue-very-light": "#1e293b",
  "--color-blue-border": "#334155",
  "--color-bg-primary": "#1e293b",
  "--color-bg-secondary": "#1a2332",
  "--color-bg-tertiary": "#0f172a",
  "--color-bg-hover": "#334155",
  "--color-bg-active": "#1e3a5f",
  "--color-bg-light": "#334155",
  "--color-bg-card": "#1e293b",
  "--color-bg-muted": "#334155",
  "--color-bg-surface": "#1e293b",
  "--color-bg-input": "#1e293b",
  "--color-bg-accent-soft": "#1a2332",
  "--color-text-inverse": "#1a1a1a",
  "--color-border-primary": "#334155",
  "--color-border-secondary": "#475569",
  "--color-border-light": "#334155",
  "--color-overlay-brand": withAlpha("#1e293b", 0.7),
  "--color-overlay-brand-light": withAlpha("#1e293b", 0.4),
};

/**
 * Derive a full light-mode palette from API colours.
 *
 *   main (main_color) → brand / accent / primary
 *   text (text_color) → body text tokens
 *   Backgrounds → fixed design tokens (see FIXED_LIGHT_SURFACE), not `second_color`.
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

    ...FIXED_LIGHT_SURFACE,

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

    // ── Overlay ──
    "--color-overlay-brand": withAlpha(darken(main, 12), 0.5),
    "--color-overlay-brand-light": withAlpha(darken(main, 12), 0.25),

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
 * Backgrounds use FIXED_DARK_SURFACE (same idea as light mode).
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

    ...FIXED_DARK_SURFACE,

    // ── Text (ALL based on text_color directly) ──
    "--color-text-primary": text,
    "--color-text-secondary": darken(text, 8),
    "--color-text-tertiary": darken(text, 16),
    "--color-text-heading": text,
    "--color-text-muted": darken(text, 12),

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
