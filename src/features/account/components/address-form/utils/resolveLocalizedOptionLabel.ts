export function resolveLocalizedOptionLabel(value: unknown, lang: string): string {
    if (value == null) return "";
    if (typeof value === "string") return value;
    if (typeof value === "object" && value !== null && ("ar" in value || "en" in value)) {
        const o = value as { ar?: string; en?: string };
        return (lang.startsWith("ar") ? o.ar ?? o.en : o.en ?? o.ar) ?? "";
    }
    return String(value);
}
