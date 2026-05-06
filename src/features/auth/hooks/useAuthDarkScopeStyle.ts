import { useMemo } from "react";
import type { CSSProperties } from "react";
import { isPaletteComplete } from "@/shared/lib/themeColors";
import { lighten } from "@/shared/lib/colorUtils";
import { useTheme } from "@/context/ThemeContext";
import type { AppSettingsColorPalette } from "@/features/account/api/settingsApi";
import { useAppSettings } from "@/features/account/hooks/useAppSettings";
import { useAccountDarkScopeStyle } from "@/features/account/hooks/useAccountDarkScopeStyle";

const AUTH_FALLBACK_PALETTE: AppSettingsColorPalette = {
    main_color: "#00aed1",
    second_color: "#7c3aed",
    text_color: "#e2e8f0",
};

function resolveAuthDarkPalette(
    color?: AppSettingsColorPalette,
    darkColor?: AppSettingsColorPalette,
): AppSettingsColorPalette {
    if (isPaletteComplete(darkColor)) return darkColor;
    if (isPaletteComplete(color)) return color;
    return AUTH_FALLBACK_PALETTE;
}

/**
 * Auth pages only: same account/API resolution as account, plus subtle overrides
 * for a minimal dark auth UI (softened primary CTA, glass input token).
 */
export function useAuthDarkScopeStyle(): CSSProperties {
    const accountScope = useAccountDarkScopeStyle();
    const { data: settings } = useAppSettings();
    const { theme } = useTheme();

    return useMemo(() => {
        /** Account palette uses very faint `--color-border-secondary`; restore visible field edges on auth forms */
        const authFieldBorderLight = "#d1d5db";
        const authFieldBorderDark = "rgba(255, 255, 255, 0.16)";

        if (theme !== "dark") {
            return {
                ...accountScope,
                "--color-border-secondary": authFieldBorderLight,
            } as CSSProperties;
        }

        const palette = resolveAuthDarkPalette(settings?.color, settings?.dark_color);
        const main = palette.main_color!;
        const primarySoft = lighten(main, 5);
        const primaryHover = lighten(main, 10);

        return {
            ...accountScope,
            "--color-primary": primarySoft,
            "--color-accent-primary": primarySoft,
            "--color-accent-primary-hover": primaryHover,
            "--color-bg-input": "rgba(255,255,255,0.055)",
            "--auth-focus-ring": `color-mix(in srgb, ${main} 30%, transparent)`,
            "--color-border-secondary": authFieldBorderDark,
        } as CSSProperties;
    }, [accountScope, theme, settings?.color, settings?.dark_color]);
}
