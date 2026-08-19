import type { Section, SectionItem } from "@/features/home/types";
import { isLocalizedTextObject, resolveLocalizedText } from "./localizedText";

/**
 * Keys a sections endpoint may send as `{ ar, en }` instead of a string.
 *
 * A section's `name` is the common one: the dashboard's page-section editor
 * saves the name override as `{ ar, en }` (`PUT /admin/page-sections/{id}`), and
 * the public payload hands that object straight back.
 */
const LOCALIZABLE_KEYS = ["name", "title", "desc", "description"] as const;

/**
 * `data` with every localizable field resolved to a string for `language`.
 * Only `{ ar, en }` values are converted — strings, `null` and anything else
 * pass through — and the very same object is returned when there was nothing
 * to convert, so the common all-strings payload allocates nothing.
 */
export function resolveLocalizableFields<T extends object>(
    data: T,
    language: string
): T {
    const record = data as Record<string, unknown>;
    let next: Record<string, unknown> | null = null;
    for (const key of LOCALIZABLE_KEYS) {
        const value = record[key];
        if (!isLocalizedTextObject(value)) continue;
        next = next ?? { ...record };
        next[key] = resolveLocalizedText(value, language);
    }
    return (next ?? record) as T;
}

export function normalizeSectionItemLocalization(
    item: SectionItem,
    language: string
): SectionItem {
    // Manual items wrap the payload in `item`; API items are the payload itself.
    if ("item" in item && "link" in item) {
        const resolved = resolveLocalizableFields(item.item, language);
        return resolved === item.item ? item : { ...item, item: resolved };
    }
    return resolveLocalizableFields(item, language);
}

/** A section and its items with localized fields resolved to strings. */
export function normalizeSectionLocalization(
    section: Section,
    language: string
): Section {
    const resolved = resolveLocalizableFields(section, language);
    const items = section.items ?? [];
    const nextItems = items.map((item) =>
        normalizeSectionItemLocalization(item, language)
    );
    const itemsChanged = nextItems.some((item, index) => item !== items[index]);
    if (resolved === section && !itemsChanged) return section;
    return { ...resolved, items: nextItems };
}

export function normalizeSectionsLocalization(
    sections: Section[] | undefined,
    language: string
): Section[] {
    return (sections ?? []).map((section) =>
        normalizeSectionLocalization(section, language)
    );
}
