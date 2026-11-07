import type { AppSettingsColorPalette } from "@/features/account/api/settingsApi";

/** TickMart brand — overrides API palette while dashboard still returns Deema colours. */
export const TICKMART_BRAND_LIGHT: AppSettingsColorPalette = {
  main_color: "#00aed1",
  second_color: "#4cdaf6",
  text_color: "#2a2a2a",
};

export const TICKMART_BRAND_DARK: AppSettingsColorPalette = {
  main_color: "#4cdaf6",
  second_color: "#00aed1",
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
