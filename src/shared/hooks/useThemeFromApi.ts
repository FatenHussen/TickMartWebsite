import { useEffect } from "react";
import { useTheme } from "@/context/ThemeContext";
import { useAppSettings } from "@/features/account/hooks/useAppSettings";
import {
  TICKMART_BRAND_DARK,
  TICKMART_BRAND_LIGHT,
  mergeWithBrandPalette,
} from "@/shared/lib/brandColors";

/**
 * Applies theme colours at runtime. API palettes are merged with TickMart
 * so dashboard Deema colours do not paint the storefront.
 */
export function useThemeFromApi() {
  const { setApiColors } = useTheme();
  const { data: settings } = useAppSettings();

  useEffect(() => {
    setApiColors(
      mergeWithBrandPalette(settings?.color, TICKMART_BRAND_LIGHT),
      mergeWithBrandPalette(settings?.dark_color, TICKMART_BRAND_DARK),
    );
  }, [settings, setApiColors]);
}
