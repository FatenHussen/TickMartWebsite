import type { AppSettingsColorPalette } from "@/features/account/api/settingsApi";

/** Deema Fashion brand — overrides API `main_color` / `second_color` until dashboard is updated. */
export const DEEMA_BRAND_LIGHT: AppSettingsColorPalette = {
  main_color: "#c720a4",
  second_color: "#ff1493",
  text_color: "#2a2a2a",
};

export const DEEMA_BRAND_DARK: AppSettingsColorPalette = {
  main_color: "#ff1493",
  second_color: "#c720a4",
  text_color: "#f5f5f5",
};

/** Keep API text_color when present; always force brand main + second. */
export function mergeWithBrandPalette(
  palette: AppSettingsColorPalette | undefined,
  brand: AppSettingsColorPalette,
): AppSettingsColorPalette {
  return {
    ...palette,
    main_color: brand.main_color,
    second_color: brand.second_color,
    text_color: palette?.text_color?.trim() || brand.text_color,
  };
}
