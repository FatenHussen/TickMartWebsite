/**
 * Shared readers for the brand colors the API attaches to categories.
 * The backend is inconsistent about casing (`main_color` vs `mainColor` vs
 * `color_main`), so every consumer used to carry its own copy of this lookup.
 */

const COLOR_KEYS = {
    main: ["main_color", "mainColor", "color_main"],
    second: ["second_color", "secondColor", "color_second", "secondary_color"],
} as const;

/** First non-empty brand color on the object, or `undefined`. */
export function readCategoryColor(
    source: object | null | undefined,
    key: "main" | "second",
): string | undefined {
    if (!source) return undefined;
    const record = source as Record<string, unknown>;

    for (const candidate of COLOR_KEYS[key]) {
        const value = record[candidate];
        if (typeof value === "string" && value.trim()) return value.trim();
    }

    return undefined;
}

/**
 * Palette used when the dashboard attached neither an icon nor brand colors to a
 * category. A row of identical gray discs reads as a broken/loading state, so the
 * name picks a stable hue instead — same name always gets the same tint.
 */
const FALLBACK_TINTS = [
    "#F59E0B",
    "#EC4899",
    "#8B5CF6",
    "#0EA5E9",
    "#10B981",
    "#F97316",
    "#6366F1",
    "#14B8A6",
];

/** Deterministic accent for an icon-less, color-less category. */
export function getCategoryFallbackTint(name: string): string {
    let hash = 0;
    for (let i = 0; i < name.length; i += 1) {
        hash = (hash * 31 + name.charCodeAt(i)) >>> 0;
    }
    return FALLBACK_TINTS[hash % FALLBACK_TINTS.length];
}

/** Text gradient for a category label; `null` when both colors are missing. */
export function buildCategoryLabelGradient(
    main: string | undefined | null,
    second: string | undefined | null,
): string | null {
    const start = main?.trim() || second?.trim();
    const end = second?.trim() || main?.trim();
    if (!start || !end) return null;
    return `linear-gradient(100deg, ${start}, ${end})`;
}
