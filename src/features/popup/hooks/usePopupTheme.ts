import { useMemo } from "react";
import { resolveTheme } from "../utils/color";
import type { PopupCampaign, PopupTheme } from "../types";

/**
 * Derives the three-color theme from a campaign's color/theme fields.
 * Memoized — only recomputes when the campaign ID changes.
 */
export function usePopupTheme(popup: PopupCampaign | null): PopupTheme {
    return useMemo(
        () =>
            popup
                ? resolveTheme(popup.colors, popup.theme)
                : { main: "#0ea5e9", secondary: "#f59e0b", text: "#ffffff" },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [popup?.id]
    );
}
