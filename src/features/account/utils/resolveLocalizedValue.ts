/**
 * Resolves API values that may be a plain string or a localized object `{ ar, en }`.
 */
export function resolveLocalizedValue(value: unknown, lang: string): string {
    if (value == null) return "";
    if (typeof value === "string") return value;
    if (typeof value === "object" && "ar" in value && "en" in value) {
        const o = value as { ar?: string; en?: string };
        const s = lang.startsWith("ar") ? (o.ar ?? o.en) : (o.en ?? o.ar);
        return typeof s === "string" ? s : "";
    }
    return String(value);
}
