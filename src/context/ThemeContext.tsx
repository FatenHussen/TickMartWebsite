import {
  createContext,
  useContext,
  useLayoutEffect,
  useEffect,
  useState,
  useCallback,
  useRef,
} from "react";
import type { ReactNode } from "react";
import type { AppSettingsColorPalette } from "@/features/account/api/settingsApi";
import {
  buildLightPalette,
  buildDarkPalette,
  applyCSSVariables,
  clearCSSVariables,
  isPaletteComplete,
} from "@/shared/lib/themeColors";
import type { CSSVariableMap } from "@/shared/lib/themeColors";

type Theme = "light" | "dark";

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
  /** Feed API colour palettes into the theme system. */
  setApiColors: (
    light?: AppSettingsColorPalette,
    dark?: AppSettingsColorPalette,
  ) => void;
  /** `true` once API colours have been applied at least once. */
  isApiThemeApplied: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(() => {
    const stored = localStorage.getItem("theme") as Theme | null;
    if (stored) return stored;
    if (window.matchMedia("(prefers-color-scheme: dark)").matches) return "dark";
    return "light";
  });

  const [lightPalette, setLightPalette] = useState<
    AppSettingsColorPalette | undefined
  >();
  const [darkPalette, setDarkPalette] = useState<
    AppSettingsColorPalette | undefined
  >();
  const [isApiThemeApplied, setIsApiThemeApplied] = useState(false);

  const prevVarsRef = useRef<CSSVariableMap>({});
  const transitionTimerRef = useRef<ReturnType<typeof setTimeout>>();
  const isFirstRenderRef = useRef(true);

  useLayoutEffect(() => {
    const root = document.documentElement;

    if (!isFirstRenderRef.current) {
      root.classList.add("theme-transitioning");
      clearTimeout(transitionTimerRef.current);
      transitionTimerRef.current = setTimeout(() => {
        root.classList.remove("theme-transitioning");
      }, 350);
    }
    isFirstRenderRef.current = false;

    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  useEffect(() => {
    const palette = theme === "dark" ? darkPalette : lightPalette;

    if (!isPaletteComplete(palette)) {
      if (Object.keys(prevVarsRef.current).length) {
        clearCSSVariables(prevVarsRef.current);
        prevVarsRef.current = {};
      }
      setIsApiThemeApplied(false);
      return;
    }

    const vars =
      theme === "dark" ? buildDarkPalette(palette) : buildLightPalette(palette);

    applyCSSVariables(vars);
    prevVarsRef.current = vars;
    setIsApiThemeApplied(true);
  }, [theme, lightPalette, darkPalette]);

  const toggleTheme = useCallback(() => {
    setThemeState((prev) => (prev === "light" ? "dark" : "light"));
  }, []);

  const setTheme = useCallback((newTheme: Theme) => {
    setThemeState(newTheme);
  }, []);

  const setApiColors = useCallback(
    (light?: AppSettingsColorPalette, dark?: AppSettingsColorPalette) => {
      setLightPalette(light);
      setDarkPalette(dark);
    },
    [],
  );

  return (
    <ThemeContext.Provider
      value={{
        theme,
        toggleTheme,
        setTheme,
        setApiColors,
        isApiThemeApplied,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
