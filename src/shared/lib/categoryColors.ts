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
