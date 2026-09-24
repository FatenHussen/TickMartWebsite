import type {
 SectionItem,
 SectionItemManual,
} from"@/features/home/types";

/**
 * Banner copy from the API is a string or null (sometimes "").
 * Anything else — including a missing value — is empty and must not render.
 */
export function bannerText(value: unknown): string {
    return typeof value === "string" ? value.trim() : "";
}

function isManualItem(item: SectionItem): item is SectionItemManual {
 return"item"in item &&"link"in item;
}

export function getItemData(item: SectionItem) {
 if (isManualItem(item)) {
 return item.item;
 }
 return item;
}
