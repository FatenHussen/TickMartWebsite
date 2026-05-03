import { useMemo } from "react";
import type { CSSProperties } from "react";
import {
  buildDarkPalette,
  buildLightPalette,
  isPaletteComplete,
  resolveApiPaletteForTheme,
} from "@/shared/lib/themeColors";
import { useTheme } from "@/context/ThemeContext";
import { useAppSettings } from "@/features/account/hooks/useAppSettings";

/**
 * Scopes the same API palette as the document theme onto InfoCards
 * (`resolveApiPaletteForTheme` — dark falls back to `color` when `dark_color`
 * is incomplete).
 */
export function useInfoCardsThemeScopeStyle(): CSSProperties {
  const { theme } = useTheme();
  const { data: settings } = useAppSettings();

  return useMemo(() => {
    const palette = resolveApiPaletteForTheme(
      theme,
      settings?.color,
      settings?.dark_color,
    );
    if (!isPaletteComplete(palette)) {
      return {} as CSSProperties;
    }
    return (
      theme === "dark"
        ? buildDarkPalette(palette)
        : buildLightPalette(palette)
    ) as CSSProperties;
  }, [theme, settings?.color, settings?.dark_color]);
}
