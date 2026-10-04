import { useEffect } from "react";
import { useTheme } from "@/context/ThemeContext";
import { useAppSettings } from "@/features/account/hooks/useAppSettings";
import {
  DEEMA_BRAND_DARK,
  DEEMA_BRAND_LIGHT,
  mergeWithBrandPalette,
} from "@/shared/lib/brandColors";

/**
 * Applies theme colours at runtime. API palettes are merged with the static
 * Deema Fashion brand so old dashboard colours (e.g. orange) do not override CSS.
 */
export function useThemeFromApi() {
  const { setApiColors } = useTheme();
  const { data: settings } = useAppSettings();

  useEffect(() => {
    setApiColors(
      mergeWithBrandPalette(settings?.color, DEEMA_BRAND_LIGHT),
      mergeWithBrandPalette(settings?.dark_color, DEEMA_BRAND_DARK),
    );
  }, [settings, setApiColors]);
}
