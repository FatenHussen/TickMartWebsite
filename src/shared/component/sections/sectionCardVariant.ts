import type { Section, SectionCardVariant } from "@/features/home/types";
import { DISPLAY_TYPE } from "@/features/home/types";

/**
 * Dark-mode row behind home API sliders — flat `color-mix` (no gradient).
 * Uses theme `--color-main` from API.
 */
export function getDarkSectionBackground(): string {
    return "color-mix(in srgb, var(--color-main) 22%, #0a0c12)";
}

/**
 * Dark card surface inside those rows — tinted with `--color-api-second`.
 */
export function getDarkCardSurface(): string {
    return "color-mix(in srgb, var(--color-api-second) 20%, #15171f)";
}

export type SectionSliderPreset = {
    slidesPerView: number;
    breakpoints: {
        640: { slidesPerView: number; spaceBetween?: number };
        768: { slidesPerView: number; spaceBetween?: number };
        1024: { slidesPerView: number; spaceBetween?: number };
    };
    spaceBetween?: number;
};

export function getSectionCardVariant(section: Pick<Section, "variant">): SectionCardVariant {
    const v = section.variant;
    if (v === "vertical" || v === "square" || v === "horizontal") return v;
    /** No `variant` in payload — keep previous home slider density */
    return "square";
}

/** Prefer API `background_card_color`, fall back to legacy typo field on `Section` */
export function getSectionCardSurfaceColor(section: Section): string | null {
    const s = section as Section & { background_card_color?: string | null };
    return s.background_card_color ?? section.background_crad_color ?? null;
}

/** Desktop (1024px): horizontal = 3 cols, square = 4, vertical = 5 */
function sliderPresetForCardVariant(v: SectionCardVariant): SectionSliderPreset {
    switch (v) {
        case "horizontal":
            // Whole-number slidesPerView only — fractional (e.g. 1.5) makes one slide
            // ~⅔ of the row and the next a “peek”, so cards look different widths.
            return {
                slidesPerView: 1,
                breakpoints: {
                    640: { slidesPerView: 2 },
                    768: { slidesPerView: 3 },
                    1024: { slidesPerView: 3 },
                },
            };
        case "vertical":
            return {
                slidesPerView: 1,
                breakpoints: {
                    640: { slidesPerView: 3 },
                    768: { slidesPerView: 4 },
                    1024: { slidesPerView: 5 },
                },
            };
        case "square":
        default:
            return {
                slidesPerView: 1,
                breakpoints: {
                    640: { slidesPerView: 3 },
                    768: { slidesPerView: 4 },
                    1024: { slidesPerView: 4 },
                },
            };
    }
}

/** Swiper density for a home section row */
export function getSliderPresetForSection(
    displayTypeId: number,
    variant: SectionCardVariant
): SectionSliderPreset {
    switch (displayTypeId) {
        case DISPLAY_TYPE.PRODUCT:
        case DISPLAY_TYPE.RECIPE:
        case DISPLAY_TYPE.SHOP:
        case DISPLAY_TYPE.BASKET:
        case DISPLAY_TYPE.BRAND:
            return sliderPresetForCardVariant(variant);
        default:
            return sliderPresetForCardVariant("square");
    }
}
