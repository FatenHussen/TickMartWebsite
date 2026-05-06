import type { CSSProperties } from "react";
import type { AppSettingsColorPalette } from "@/features/account/api/settingsApi";
import type { Section } from "@/features/home/types";
import { isPaletteComplete } from "@/shared/lib/themeColors";

/**
 * Premium categories dark mode: fixed foundation (no raw API colors on large surfaces).
 * API `main` / `second` are used only for accents, buttons, active states, glows.
 */
export type CategoriesApiDarkSurface = {
    /** Nested panels, filter chips (unselected) */
    secondaryBackground: string;
    pageColor: string;
    mutedColor: string;
    faintColor: string;
    /** Glass card / sidebar shell */
    cardBackground: string;
    cardBorder: string;
    main: string;
    second: string;
};

const LUXURY = {
    secondary: "#0B0B0C",
    card: "rgba(16,17,20,0.72)",
    border: "rgba(255,255,255,0.06)",
    text: "#FFFFFF",
    muted: "#A1A1AA",
    faint: "#71717A",
} as const;

/**
 * Resolve API accent colors for dark categories chrome (section → settings → CSS vars).
 */
export function resolveCategoriesDarkAccents(
    section: Section | undefined,
    settingsPalette: AppSettingsColorPalette | undefined,
    isDarkTheme: boolean,
): { main: string; second: string } {
    const fallbackMain = "var(--color-main)";
    const fallbackSecond = "var(--color-api-second)";

    if (!isDarkTheme) {
        return { main: fallbackMain, second: fallbackSecond };
    }

    const mainFromSection = section?.main_color?.trim();
    const secondFromSection = section?.second_color?.trim();

    if (mainFromSection || secondFromSection) {
        return {
            main: mainFromSection || secondFromSection || fallbackMain,
            second: secondFromSection || mainFromSection || fallbackSecond,
        };
    }

    if (settingsPalette && isPaletteComplete(settingsPalette)) {
        const m = settingsPalette.main_color!.trim();
        const s = settingsPalette.second_color?.trim() || m;
        return { main: m, second: s };
    }

    return { main: fallbackMain, second: fallbackSecond };
}

export function buildCategoriesLuxuryDarkSurface(main: string, second: string): CategoriesApiDarkSurface {
    return {
        secondaryBackground: LUXURY.secondary,
        pageColor: LUXURY.text,
        mutedColor: LUXURY.muted,
        faintColor: LUXURY.faint,
        cardBackground: LUXURY.card,
        cardBorder: LUXURY.border,
        main,
        second,
    };
}

/** Page chrome only — global shell (`app-layout-canvas`) provides the dark backdrop. */
export function categoriesPageRootStyle(surface: CategoriesApiDarkSurface): CSSProperties {
    return {
        backgroundColor: "transparent",
        color: surface.pageColor,
    };
}
