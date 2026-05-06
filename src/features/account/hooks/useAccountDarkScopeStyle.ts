import { useMemo } from "react";
import type { CSSProperties } from "react";
import {
  buildApiTintedDarkSurfaces,
  buildApiTintedLightSurfaces,
  buildDarkPalette,
  buildLightPalette,
  isPaletteComplete,
} from "@/shared/lib/themeColors";
import { darken, lighten, withAlpha, tint } from "@/shared/lib/colorUtils";
import { useTheme } from "@/context/ThemeContext";
import type { AppSettingsColorPalette } from "../api/settingsApi";
import { useAppSettings } from "./useAppSettings";

const ACCOUNT_THEME_FALLBACK_DARK: AppSettingsColorPalette = {
  main_color: "#00aed1",
  second_color: "#7c3aed",
  text_color: "#e2e8f0",
};

const ACCOUNT_THEME_FALLBACK_LIGHT: AppSettingsColorPalette = {
  main_color: "#00aed1",
  second_color: "#7c3aed",
  text_color: "#0f172a",
};

function resolveAccountDarkPalette(
  color?: AppSettingsColorPalette,
  darkColor?: AppSettingsColorPalette,
): AppSettingsColorPalette {
  if (isPaletteComplete(darkColor)) return darkColor;
  if (isPaletteComplete(color)) return color;
  return ACCOUNT_THEME_FALLBACK_DARK;
}

function resolveAccountLightPalette(
  color?: AppSettingsColorPalette,
): AppSettingsColorPalette {
  if (isPaletteComplete(color)) return color;
  return ACCOUNT_THEME_FALLBACK_LIGHT;
}

/**
 * Account dark subtree: layers brand tweaks on top of `buildDarkPalette`.
 *
 * Lighter primaries, main→second gradient, stronger shadows, and accent borders.
 */
function buildAccountDarkVars(
  palette: AppSettingsColorPalette,
): Record<string, string> {
  const main = palette.main_color!;
  const text = palette.text_color!;
  const second = palette.second_color ?? lighten(main, 14);

  return {
    // API accent colors — kept original for buttons, active states, icons
    "--color-main": main,
    "--color-text": text,
    "--color-api-second": second,
    "--color-api-second-hover": lighten(second, 6),

    "--color-primary": lighten(main, 6),
    "--color-primary-light": lighten(main, 14),
    "--color-primary-dark": darken(main, 8),
    "--color-secondary": second,
    "--color-blue-light": lighten(main, 10),

    // Let base API-tinted surfaces run first, then override with fixed dark foundation
    ...buildApiTintedDarkSurfaces(main, second),

    // ── Fixed dark foundations (override API-tinted surfaces) ──────────────
    "--color-bg-primary":   "#050505",
    "--color-bg-secondary": "#0B0B0C",
    "--color-bg-card":      "#101114",
    "--color-bg-tertiary":  "#141418",
    "--color-bg-hover":     "rgba(255,255,255,0.035)",
    "--color-bg-active":    `color-mix(in srgb, ${main} 12%, transparent)`,
    "--color-bg-input":     "#17181c",
    "--color-bg-surface":   "#101114",
    "--color-bg-muted":     "#0d0d10",

    // Borders — neutral/subtle, NOT API-colored
    "--color-border-primary":       "rgba(255,255,255,0.06)",
    "--color-border-secondary":     "rgba(255,255,255,0.04)",
    "--color-border-light":         "rgba(255,255,255,0.03)",
    // Accent borders only for focused/active elements
    "--color-border-accent":        withAlpha(main, 0.28),
    "--color-border-accent-light":  withAlpha(main, 0.15),
    "--color-border-accent-strong": main,

    // Text — fixed readable values, independent of API
    "--color-text-primary":   "#FFFFFF",
    "--color-text-secondary": "#A1A1AA",
    "--color-text-tertiary":  "#71717A",
    "--color-text-heading":   "#FFFFFF",
    "--color-text-muted":     "#71717A",
    "--color-text-inverse":   "#0a0a0a",
    // ───────────────────────────────────────────────────────────────────────

    "--color-accent-primary":       main,
    "--color-accent-primary-hover": lighten(main, 6),
    "--color-accent-light":         lighten(main, 10),
    "--color-accent-light-bg":      withAlpha(main, 0.12),

    "--color-success":          "#22c55e",
    "--color-success-light":    "#4ade80",
    "--color-warning":          "#fbbf24",
    "--color-warning-dark":     "#d97706",
    "--color-error":            "#f87171",
    "--color-error-light":      "#fca5a5",
    "--color-status-error-bg":  withAlpha("#f87171", 0.1),
    "--color-discount":         "#4ade80",
    "--color-delete":           "#f87171",
    "--color-gold":             "#fbbf24",

    "--color-gradient-from": main,
    "--color-gradient-to":   second,

    // Shadows — dimmed, not API-color-saturated
    "--color-shadow":        withAlpha(main, 0.1),
    "--color-shadow-strong": withAlpha(main, 0.18),
    "--color-shadow-accent": withAlpha(second, 0.12),

    "--color-calendar-selected": main,
  };
}

/**
 * Account light subtree: layers brand tweaks on top of `buildLightPalette`.
 *
 * Soft tinted surfaces, main→second gradient, brand-tinted shadows, accent
 * borders. Mirrors the dark variant so layouts behave identically.
 */
function buildAccountLightVars(
  palette: AppSettingsColorPalette,
): Record<string, string> {
  const main = palette.main_color!;
  const text = palette.text_color!;
  const second = palette.second_color ?? lighten(main, 16);

  return {
    "--color-main": main,
    "--color-text": text,
    "--color-api-second": second,
    "--color-api-second-hover": darken(second, 8),

    "--color-primary": main,
    "--color-primary-light": lighten(main, 8),
    "--color-primary-dark": darken(main, 12),
    "--color-secondary": darken(main, 5),

    "--color-blue-light": lighten(main, 12),

    ...buildApiTintedLightSurfaces(main, second),

    "--color-border-primary": withAlpha(main, 0.22),
    "--color-border-secondary": withAlpha(second, 0.2),
    "--color-border-light": tint(main, 0.78),
    "--color-border-accent": withAlpha(main, 0.45),
    "--color-border-accent-light": withAlpha(main, 0.3),
    "--color-border-accent-strong": main,

    "--color-text-primary": text,
    "--color-text-secondary": lighten(text, 14),
    "--color-text-tertiary": lighten(text, 26),
    "--color-text-heading": darken(text, 4),
    "--color-text-muted": lighten(text, 20),

    "--color-accent-primary": main,
    "--color-accent-primary-hover": darken(main, 8),
    "--color-accent-light": lighten(main, 10),
    "--color-accent-light-bg": withAlpha(main, 0.12),

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

    "--color-gradient-from": lighten(main, 8),
    "--color-gradient-to": second,

    "--color-shadow": withAlpha(main, 0.12),
    "--color-shadow-strong": withAlpha(main, 0.2),
    "--color-shadow-accent": withAlpha(second, 0.22),

    "--color-calendar-selected": main,
  };
}

/**
 * Theme-aware account subtree palette.
 *
 * Returns a creative light or dark CSS-variable set that follows the global
 * theme (so toggling theme also flips the account/auth/affiliate scopes).
 */
export function useAccountDarkScopeStyle(): CSSProperties {
  const { data: settings } = useAppSettings();
  const { theme } = useTheme();

  return useMemo(() => {
    if (theme === "dark") {
      const palette = resolveAccountDarkPalette(
        settings?.color,
        settings?.dark_color,
      );
      const base = buildDarkPalette(palette);
      const creative = buildAccountDarkVars(palette);
      return { colorScheme: "dark", ...base, ...creative } as CSSProperties;
    }

    const palette = resolveAccountLightPalette(settings?.color);
    const base = buildLightPalette(palette);
    const creative = buildAccountLightVars(palette);
    return { colorScheme: "light", ...base, ...creative } as CSSProperties;
  }, [theme, settings?.color, settings?.dark_color]);
}
