import type {
    UserPromotionLocalizedStrings,
    UserPromotionTextField,
} from "../types";

/**
 * Resolves display text from the promotions API: plain string, or a locale map
 * (`en` / `ar` / active locale) with fallbacks.
 */
export function pickLocalizedPromotionText(
    value: UserPromotionTextField | null | undefined,
    locale: string,
    fallback = ""
): string {
    if (value == null) return fallback;
    if (typeof value === "string") {
        const trimmed = value.trim();
        return trimmed || fallback;
    }
    if (typeof value !== "object" || Array.isArray(value)) return fallback;

    const map = value as UserPromotionLocalizedStrings;

    const primary = map[locale];
    if (typeof primary === "string" && primary.trim()) return primary.trim();

    const en = map.en;
    if (typeof en === "string" && en.trim()) return en.trim();

    const ar = map.ar;
    if (typeof ar === "string" && ar.trim()) return ar.trim();

    const first = Object.values(map).find(
        (v) => typeof v === "string" && v.trim().length > 0
    );
    return typeof first === "string" ? first.trim() : fallback;
}
