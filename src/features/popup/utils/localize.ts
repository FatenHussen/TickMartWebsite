import type { Language, LocalizedString } from "../types";

/**
 * Extracts the localized string for the current language,
 * falling back gracefully between languages and plain strings.
 */
export function localize(
    value: LocalizedString | string | null | undefined,
    lang: Language
): string {
    if (!value) return "";
    if (typeof value === "string") return value;
    return value[lang] || value.en || value.ar || "";
}
