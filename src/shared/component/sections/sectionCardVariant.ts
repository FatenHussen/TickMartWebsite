import type { Section, SectionCardVariant } from "@/features/home/types";
import { DISPLAY_TYPE } from "@/features/home/types";

/**
 * Dark-mode row behind home API sliders — deep charcoal carrying a faint wash of the
 * dashboard "dark second color" (`--color-api-second`) so cards sit in a cohesive branded band.
 */
export function getDarkSectionBackground(): string {
    return "radial-gradient(ellipse 90% 60% at 50% -10%, color-mix(in srgb, var(--color-api-second) 5%, transparent) 0%, transparent 55%), #0B0B0C";
}

/**
 * Dark card surface inside section rows — subtle diagonal gradient from deep near-black to a
 * gentle tint of the dashboard "dark second color" (`--color-api-second`). Prefer this over
 * {@link getDarkCardSurface} wherever a card supports a gradient (`backgroundImage`).
 */
export function getDarkCardSurfaceGradient(): string {
    return "linear-gradient(160deg, color-mix(in srgb, var(--color-api-second) 9%, #101114) 0%, color-mix(in srgb, var(--color-api-second) 20%, #0b0b0c) 100%)";
}

/**
 * Dark card surface — solid fallback (for cards that only accept a `backgroundColor`).
 * Tinted with the dashboard "dark second color" (`--color-api-second`).
 */
export function getDarkCardSurface(): string {
    return "color-mix(in srgb, var(--color-api-second) 14%, #0e0f12)";
}

export type SectionSliderPreset = {
    slidesPerView: number;
    breakpoints: {
        480: { slidesPerView: number; spaceBetween?: number };
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

/**
 * NOT WIRED UP — `ApiSectionsRenderer` renders every section as a scrolling row
 * (`SECTION_ROW_PROPS`). Reconnecting this is what made rows stack their whole
 * item list down the page with no sideways scroll and no arrows; the product
 * call is that sections always scroll, whatever `variant` the dashboard sends.
 *
 * Kept for reference on what the dashboard means by `variant`: `horizontal`
 * ("سلايدر أفقي") scrolls, `vertical` ("شبكة رأسية") and `square` ("مربعات")
 * were grids. `variant` still drives card shape and slide density through
 * {@link getSectionCardVariant} and {@link getSliderPresetForSection}.
 */
export function getSectionLayoutMode(
    section: Pick<Section, "variant">
): "slider" | "grid" {
    return section.variant === "vertical" || section.variant === "square"
        ? "grid"
        : "slider";
}

/**
 * Grid columns for a section rendered as a grid — the same card counts per
 * breakpoint the matching slider preset shows, so switching `variant` changes
 * whether the row scrolls without resizing its cards.
 */
export function getSectionGridClassName(variant: SectionCardVariant): string {
    switch (variant) {
        case "horizontal":
            return "grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 lg:gap-6";
        case "vertical":
            return "grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 md:gap-4 lg:grid-cols-5";
        case "square":
        default:
            return "grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 md:gap-4";
    }
}

/** Circle cards pack far denser than any product grid — matches their slider. */
export const CATEGORY_GRID_CLASS_NAME =
    "grid-cols-3 gap-3 min-[480px]:grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8";

/** Prefer API `background_card_color`, fall back to legacy typo field on `Section` */
export function getSectionCardSurfaceColor(section: Section): string | null {
    const s = section as Section & { background_card_color?: string | null };
    return s.background_card_color ?? section.background_crad_color ?? null;
}

/** Desktop (1024px): horizontal = 3 cols, square = 4, vertical = 5 */
function sliderPresetForCardVariant(v: SectionCardVariant): SectionSliderPreset {
    switch (v) {
        case "horizontal":
            // Wide/landscape cards: one full card on the smallest phones, a peek of the
            // second from 480px up so the row reads as scrollable on mobile.
            return {
                slidesPerView: 1,
                breakpoints: {
                    480: { slidesPerView: 1.15 },
                    640: { slidesPerView: 2 },
                    768: { slidesPerView: 3 },
                    1024: { slidesPerView: 3 },
                },
            };
        case "vertical":
            return {
                slidesPerView: 1.6,
                breakpoints: {
                    480: { slidesPerView: 2.15 },
                    640: { slidesPerView: 3 },
                    768: { slidesPerView: 4 },
                    1024: { slidesPerView: 5 },
                },
            };
        case "square":
        default:
            return {
                slidesPerView: 1.6,
                breakpoints: {
                    480: { slidesPerView: 2.15 },
                    640: { slidesPerView: 3 },
                    768: { slidesPerView: 4 },
                    1024: { slidesPerView: 4 },
                },
            };
    }
}

/** Swiper density for a home section row */
export function getSliderPresetForSection(
    displayTypeId: number | null,
    variant: SectionCardVariant
): SectionSliderPreset {
    switch (displayTypeId) {
        case DISPLAY_TYPE.PRODUCT:
        case DISPLAY_TYPE.RECIPE:
        case DISPLAY_TYPE.SHOP:
        case DISPLAY_TYPE.BASKET:
        case DISPLAY_TYPE.SCHEDULED_BASKET:
        case DISPLAY_TYPE.BRAND:
            return sliderPresetForCardVariant(variant);
        default:
            return sliderPresetForCardVariant("square");
    }
}
