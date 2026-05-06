import type { CSSProperties } from "react";

/** Dark home shell — API colors used only as ultra-subtle ambient glows, foundation is near-black. */
export const HOME_ROOT_DARK_BACKGROUND =
    "radial-gradient(ellipse 100% 55% at 12% -5%, color-mix(in srgb, var(--color-main) 8%, transparent) 0%, transparent 65%), radial-gradient(ellipse 80% 40% at 90% 105%, color-mix(in srgb, var(--color-api-second) 6%, transparent) 0%, transparent 65%), #050505";

export const HOME_ROOT_LIGHT_BACKGROUND_COLOR = "#FFF9F5";

/** Same surface as the home page root so nested sections stay visually aligned with API colours. */
export function getHomeRootSurfaceStyle(isDarkTheme: boolean): CSSProperties {
    if (isDarkTheme) {
        return { background: HOME_ROOT_DARK_BACKGROUND };
    }
    return { backgroundColor: HOME_ROOT_LIGHT_BACKGROUND_COLOR };
}
