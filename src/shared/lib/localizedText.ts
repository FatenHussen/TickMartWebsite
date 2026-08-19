/** API values that arrive either as a plain string or as `{ ar, en }`. */
export type LocalizedTextValue =
    | string
    | number
    | { ar?: string | null; en?: string | null }
    | null
    | undefined;

/**
 * True only for the `{ ar, en }` shape. Arrays and unrelated objects (a nested
 * `category`, a badge record…) are deliberately excluded so normalizers leave
 * them alone.
 */
export function isLocalizedTextObject(
    value: unknown
): value is { ar?: string | null; en?: string | null } {
    return (
        typeof value === "object" &&
        value !== null &&
        !Array.isArray(value) &&
        ("ar" in value || "en" in value)
    );
}

/**
 * Renderable string for a value the API may send localized. Rendering a raw
 * `{ ar, en }` object throws "Objects are not valid as a React child", so any
 * such value has to pass through here before it reaches JSX.
 *
 * Falls back to the other language rather than to an empty string: a section
 * whose dashboard name was only filled in Arabic still shows that name in the
 * English UI instead of an untitled row.
 */
export function resolveLocalizedText(value: unknown, language: string): string {
    if (value == null) return "";
    if (typeof value === "string") return value;
    if (typeof value === "number") return String(value);
    if (isLocalizedTextObject(value)) {
        const isArabic = language.toLowerCase().startsWith("ar");
        return (isArabic ? value.ar : value.en) ?? value.en ?? value.ar ?? "";
    }
    return "";
}
