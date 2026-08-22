import type { Section, SectionCardVariant, SectionLayout } from "@/features/home/types";

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

/**
 * The shape of a single card *inside* a section — the API's `variant`, and
 * nothing else. It never decides whether the section scrolls; that is
 * {@link getSectionLayout}.
 *
 * A section that sends no `variant` draws `horizontal` cards, the contract's
 * default.
 */
export function getSectionCardVariant(section: Pick<Section, "variant">): SectionCardVariant {
    const v = section.variant;
    if (v === "vertical" || v === "square" || v === "horizontal") return v;
    return "horizontal";
}

/**
 * How a whole section is laid out — the API's `layout`, and nothing else.
 *
 * These are three independent fields, and each answers exactly one question:
 * `layout` picks slider / list / grid, `variant` picks the shape of one card
 * inside that layout ({@link getSectionCardVariant}), and `display_type_id`
 * only says what kind of thing the items are (`getSectionKind`). Never read
 * one to stand in for another — `horizontal` in particular is a card shape,
 * not a scrolling row.
 *
 * A payload that predates the field — or carries a value this client does not
 * know — falls back to `"slider"`, which is what every section used to be.
 */
export function getSectionLayout(section: Pick<Section, "layout">): SectionLayout {
    const l = section.layout;
    if (l === "slider" || l === "list" || l === "grid") return l;
    return "slider";
}

/** Vertical stack: one item per row, so only the gap needs saying. */
const SECTION_LIST_CLASS_NAME = "gap-4 md:gap-5";

/** What `SliderSection` needs to draw a section in the layout the API asked for. */
export type SectionRowLayoutProps = {
    layout: SectionLayout;
    gridClassName?: string;
    showNavigation: boolean;
};

/**
 * The layout props a section row hands to `SliderSection`.
 *
 * Arrows belong to a slider alone — a list or a grid lays every item out at
 * once and has nothing left to scroll sideways — so navigation is on for
 * `slider` and off for the other two, where the column/gap classes of the card
 * variant take over instead. `gridClassNameOverride` is for rows whose cards
 * pack at their own density (category circles).
 */
export function getSectionRowProps(
    section: Pick<Section, "layout">,
    variant: SectionCardVariant,
    gridClassNameOverride?: string
): SectionRowLayoutProps {
    const layout = getSectionLayout(section);
    if (layout === "slider") return { layout, showNavigation: true };
    return {
        layout,
        gridClassName:
            layout === "list"
                ? SECTION_LIST_CLASS_NAME
                : gridClassNameOverride ?? getSectionGridClassName(variant),
        showNavigation: false,
    };
}

/**
 * Grid columns for a section whose `layout` is `grid` — the same card counts
 * per breakpoint the matching slider preset shows, so a section that switches
 * `layout` stops scrolling without its cards changing size.
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

/**
 * Swiper density for a section row, from the card variant alone.
 *
 * It used to switch on `display_type_id` first and only consult `variant` for
 * the six card kinds it listed. That id says what the items *are*, never how
 * they are laid out, and every caller had already resolved the kind before
 * getting here — so the switch could only ever agree with `variant` or
 * contradict it.
 */
export function getSliderPresetForSection(
    variant: SectionCardVariant
): SectionSliderPreset {
    return sliderPresetForCardVariant(variant);
}
