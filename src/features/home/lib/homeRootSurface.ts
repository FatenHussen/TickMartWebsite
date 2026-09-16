import type { CSSProperties } from "react";
import { DARK_CANVAS } from "@/shared/lib/themeColors";

/** Dark home shell — warm charcoal, brand only as a faint aisle light. */
export const HOME_ROOT_DARK_BACKGROUND =
    `radial-gradient(ellipse 100% 55% at 12% -5%, color-mix(in srgb, var(--color-main) 7%, transparent) 0%, transparent 65%), radial-gradient(ellipse 80% 40% at 90% 105%, color-mix(in srgb, var(--color-api-second) 5%, transparent) 0%, transparent 65%), ${DARK_CANVAS}`;

export const HOME_ROOT_LIGHT_BACKGROUND_COLOR = "#F6F3EE";

/** Same surface as the home page root so nested sections stay visually aligned with API colours. */
export function getHomeRootSurfaceStyle(isDarkTheme: boolean): CSSProperties {
    if (isDarkTheme) {
        return { background: HOME_ROOT_DARK_BACKGROUND };
    }
    return { backgroundColor: HOME_ROOT_LIGHT_BACKGROUND_COLOR };
}
