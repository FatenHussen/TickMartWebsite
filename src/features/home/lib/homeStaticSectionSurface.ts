import type { CSSProperties } from "react";
import { DARK_SECTION } from "@/shared/lib/themeColors";
import type { Section } from "../types";

export function pickHomeSectionBySeeMorePageSlug(
    sections: Section[] | undefined,
    pageSlug: string
): Section | undefined {
    if (!sections?.length) return undefined;
    const sorted = [...sections].sort((a, b) => a.order - b.order);
    return sorted.find((s) => s.see_more?.page_slug === pageSlug);
}

const BREAKOUT_ROW =
    "relative w-screen max-w-[100vw] [margin-inline-start:calc(50%-50vw)]";

type HomeStaticRowOptions = {
    /** Vertical padding on the tinted row (API sliders use `py-4 sm:py-5`). */
    paddingClass?: string;
    /** Full-viewport row breakout like `AllProductsSection` with `disablePageContainer`. */
    breakout?: boolean;
};

/**
 * Flat home row surface — dark: warm section charcoal, light: optional API `background_color` else `bg-custom-card`.
 */
export function homeStaticSectionRowSurface(
    isDarkTheme: boolean,
    apiBackgroundColor: string | null | undefined,
    options?: HomeStaticRowOptions
): { className: string; style: CSSProperties | undefined } {
    const paddingClass = options?.paddingClass ?? "py-4 sm:py-5";
    const breakout = options?.breakout !== false;

    const trimmed = apiBackgroundColor?.trim();
    const lightUsesCard = !isDarkTheme && !trimmed;

    const className = [
        breakout ? BREAKOUT_ROW : "",
        paddingClass,
        lightUsesCard && "bg-custom-card",
    ]
        .filter(Boolean)
        .join(" ");

    const style: CSSProperties | undefined = isDarkTheme
        ? {
              backgroundColor: DARK_SECTION,
              boxShadow:
                  "inset 0 1px 0 0 rgba(255,255,255,0.04), inset 0 -1px 0 0 rgba(0,0,0,0.12)",
          }
        : trimmed
          ? { backgroundColor: trimmed }
          : undefined;

    return { className, style };
}
