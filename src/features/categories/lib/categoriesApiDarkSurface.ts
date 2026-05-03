import type { CSSProperties } from "react";
import type { AppSettingsColorPalette } from "@/features/account/api/settingsApi";
import type { Section } from "@/features/home/types";
import { getSectionCardSurfaceColor } from "@/shared/component/sections/sectionCardVariant";

export type CategoriesApiDarkSurface = {
    pageBackground: string;
    pageColor: string;
    mutedColor: string;
    cardBackground: string;
    cardBorder: string;
    main: string;
    second: string;
};

function isGradient(value: string): boolean {
    return /gradient/i.test(value);
}

/**
 * When the app theme is dark and the home "categories" section supplies colors,
 * build surfaces for the categories page (background, cards, text) from API fields:
 * `main_color`, `second_color`, `text_color`, `background_color`, card background fields.
 */
export function resolveCategoriesApiDarkSurface(
    section: Section | undefined,
    isDarkTheme: boolean,
): CategoriesApiDarkSurface | null {
    if (!isDarkTheme || !section) return null;

    const main = section.main_color?.trim() || null;
    const second = section.second_color?.trim() || null;
    const text = section.text_color?.trim() || null;
    const pageBg = section.background_color?.trim() || null;
    const card =
        getSectionCardSurfaceColor(section)?.trim() ||
        section.background_crad_color?.trim() ||
        null;

    if (!main && !second && !text && !pageBg && !card) return null;

    const accent = main || second || "#6366f1";
    const accent2 = (second || main || accent) as string;

    const pageBackground = pageBg
        ? pageBg
        : `linear-gradient(165deg, color-mix(in srgb, ${accent} 52%, #020617) 0%, #020617 48%, color-mix(in srgb, ${accent2} 38%, #020617) 100%)`;

    const pageColor =
        text || `color-mix(in srgb, #f1f5f9 94%, ${accent})`;

    const mutedColor = text
        ? `color-mix(in srgb, ${text} 52%, #64748b)`
        : `color-mix(in srgb, ${pageColor} 50%, #94a3b8)`;

    const cardBackground =
        card ||
        `color-mix(in srgb, ${accent} 14%, #0f172a)`;

    const cardBorder = `color-mix(in srgb, ${accent} 32%, transparent)`;

    return {
        pageBackground,
        pageColor,
        mutedColor,
        cardBackground,
        cardBorder,
        main: accent,
        second: accent2,
    };
}

export function categoriesPageRootStyle(surface: CategoriesApiDarkSurface): CSSProperties {
    const bg = surface.pageBackground;
    if (isGradient(bg)) {
        return {
            background: bg,
            color: surface.pageColor,
        };
    }
    return {
        backgroundColor: bg,
        color: surface.pageColor,
    };
}

/**
 * Dark categories chrome from app settings (`color` / `dark_color` via
 * `resolveApiPaletteForTheme`) when the home section does not supply section colors.
 * Surfaces are brand-tinted dark mixes only — no white stops.
 */
export function resolveCategoriesDarkSurfaceFromSettingsPalette(
    palette: AppSettingsColorPalette,
): CategoriesApiDarkSurface | null {
    const main = palette.main_color?.trim();
    const text = palette.text_color?.trim();
    if (!main || !text) return null;

    const second = palette.second_color?.trim() || main;
    const pageBackground = `linear-gradient(160deg, color-mix(in srgb, ${main} 44%, #020617) 0%, #030712 46%, color-mix(in srgb, ${second} 36%, #020617) 100%)`;
    const mutedColor = `color-mix(in srgb, ${text} 52%, #64748b)`;
    const cardBackground = `color-mix(in srgb, ${main} 12%, #0b1220)`;
    const cardBorder = `color-mix(in srgb, ${main} 28%, transparent)`;

    return {
        pageBackground,
        pageColor: text,
        mutedColor,
        cardBackground,
        cardBorder,
        main,
        second,
    };
}
