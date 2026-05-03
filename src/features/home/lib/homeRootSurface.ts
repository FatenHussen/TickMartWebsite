import type { CSSProperties } from "react";

/** Dark home shell — uses API theme vars (`--color-main`, `--color-api-second`). */
export const HOME_ROOT_DARK_BACKGROUND =
    "radial-gradient(at 0% 0%, color-mix(in srgb, var(--color-main) 45%, black) 0%, transparent 55%), radial-gradient(at 100% 100%, color-mix(in srgb, var(--color-api-second) 38%, black) 0%, transparent 55%), linear-gradient(180deg, color-mix(in srgb, var(--color-main) 18%, #07090f) 0%, color-mix(in srgb, var(--color-api-second) 14%, #050709) 100%)";

export const HOME_ROOT_LIGHT_BACKGROUND_COLOR = "#FFF9F5";

/** Same surface as the home page root so nested sections stay visually aligned with API colours. */
export function getHomeRootSurfaceStyle(isDarkTheme: boolean): CSSProperties {
    if (isDarkTheme) {
        return { background: HOME_ROOT_DARK_BACKGROUND };
    }
    return { backgroundColor: HOME_ROOT_LIGHT_BACKGROUND_COLOR };
}
