import { useEffect } from "react";
import { useTheme } from "@/context/ThemeContext";
import { useAppSettings } from "@/features/account/hooks/useAppSettings";

/**
 * Fetches app settings (which include colour palettes) via React Query
 * and pushes them into the ThemeContext so CSS variables update at runtime.
 *
 * Mount this hook **once** in a component that lives inside both
 * `<QueryClientProvider>` and `<ThemeProvider>` — the root `<App>` is ideal.
 */
export function useThemeFromApi() {
  const { setApiColors } = useTheme();
  const { data: settings } = useAppSettings();

  useEffect(() => {
    if (settings) {
      setApiColors(settings.color, settings.dark_color);
    }
  }, [settings, setApiColors]);
}
