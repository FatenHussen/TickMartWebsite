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
    displayTypeId: number,
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
