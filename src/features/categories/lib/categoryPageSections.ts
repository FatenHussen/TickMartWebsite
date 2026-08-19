import type { Section, SectionItem } from "@/features/home/types";
import { getSectionKind, isManualItem } from "@/shared/component/sections/sectionKind";
import { toStorageUrl } from "@/shared/lib/storageUrl";

/**
 * The display types that existed before `DisplayTypeSeeder` fixed the table.
 * Deliberately not 8/9/10: on a host that has not been seeded yet, an id
 * outside this set can only be the `firstOrCreate`d subcategories row.
 */
const STABLE_DISPLAY_TYPE_IDS = new Set<number>([1, 2, 3, 4, 5, 6, 7]);

/** `null` for the `null` / `""` an unseeded host can still send instead of an id. */
function readDisplayTypeId(section: Section): number | null {
    const raw = section.display_type_id as number | string | null | undefined;
    if (raw == null || raw === "") return null;
    const id = Number(raw);
    return Number.isFinite(id) ? id : null;
}

/**
 * The seeded subcategories row, tagged so it resolves to category circles.
 *
 * A seeded API host says so itself — `manual_model: "category"` with display
 * type 8 — and this returns the section untouched. The fallback is for a host
 * that has not run the migration: there the row carries neither, its display
 * type is `firstOrCreate`d (id 10 on such a host), and its items serialize as
 * generic `{ id, title, image }` rows that no shape check can tell apart from a
 * banner, so the renderer would find no kind and draw nothing at all.
 */
function withSubcategoriesKind(section: Section): Section {
    if (section.content_type || section.manual_model) return section;
    const displayTypeId = readDisplayTypeId(section);
    if (displayTypeId == null || STABLE_DISPLAY_TYPE_IDS.has(displayTypeId)) {
        return section;
    }
    return { ...section, manual_model: "category" };
}

/**
 * Same row again: it sends `image` relative to the storage root while every
 * other endpoint sends an absolute URL, so its circles would fall back to
 * initials right next to a drill strip showing the real icons.
 */
function withAbsoluteItemImages(section: Section): Section {
    const isCategoryRow =
        section.content_type === "category" || section.manual_model === "category";
    if (!isCategoryRow) return section;
    return {
        ...section,
        items: (section.items ?? []).map((item) => {
            if (isManualItem(item)) return item;
            const image = (item as { image?: string | null }).image;
            const absolute = toStorageUrl(image);
            return absolute && absolute !== image
                ? ({ ...item, image: absolute } as SectionItem)
                : item;
        }),
    };
}

/** True only when the host actually sends the flag; absent on an un-migrated one. */
function hasIsDefaultFlag(section: Section): boolean {
    const raw = section.is_default as boolean | number | string | null | undefined;
    return raw != null && raw !== "";
}

/**
 * True only for a section the backend generated itself. Tolerates the `1` / `"1"`
 * a host may serialize a boolean as; anything else — including the field being
 * absent on an un-migrated host — counts as admin-added and is kept.
 */
function isBackendGeneratedSection(section: Section): boolean {
    const raw = section.is_default as boolean | number | string | null | undefined;
    return raw === true || raw === 1 || raw === "1";
}

/**
 * The generated subcategories row recognised by shape, for a host that does not
 * send `is_default` yet.
 *
 * On a category page an `api` row of categories can only be the children of the
 * category being shown — the backend has no other category source to point one
 * at — and those are exactly what the drill strip above the listing draws, with
 * the trail, icons and colors this row does not carry. A `manual` row an admin
 * built stays: its items are a hand-picked list, not this level.
 *
 * Call it on a section that already went through `withSubcategoriesKind`, or an
 * unseeded host's display type (10) resolves to "banner" instead.
 */
function isGeneratedSubcategoriesRow(section: Section): boolean {
    return section.type === "api" && getSectionKind(section) === "category";
}

/**
 * The generated products row, same host: an `api` row whose "see more" opens the
 * products page of this very category — the query the listing below already
 * runs, only without its filters, sort and pagination.
 */
function isGeneratedProductsRow(
    section: Section,
    categoryId: number | undefined,
): boolean {
    if (section.type !== "api" || categoryId == null) return false;
    const seeMore = section.see_more;
    if (!seeMore || seeMore.page_slug !== "products") return false;
    const params = seeMore.params;
    if (!params || Array.isArray(params)) return false;
    return Number((params as Record<string, unknown>).category_id) === categoryId;
}

/**
 * The sections of a category page this app renders, ordered by `order`.
 *
 * The two generated rows — subcategories and products — are dropped **here and
 * only here**. This is not a global rule: the home and other page-slug feeds
 * render whatever they are sent. It is scoped to the category page because that
 * page already draws both itself, and better: the circle strip comes from
 * `category.children` and carries the drill trail, and the product grid honours
 * the listing's active filters. Rendering the API's versions too put the same
 * subcategories on screen twice, once above the other.
 *
 * A host that sends `is_default` is believed outright. One that does not — what
 * the API serves today — gets the shape checks above instead, which is the only
 * way those rows can be told from an admin's: they arrive with the same fields
 * as any other section, and their names are localized, so nothing but their
 * source (`type: "api"`) and their target gives them away.
 *
 * Everything an admin added renders, in `order`, even when its content repeats a
 * generated row — that rule is unchanged for `type: "manual"` sections and for
 * `api` sections that are neither of the two generated shapes (the shops row in
 * the screenshots keeps rendering).
 *
 * Empty-items sections need no filtering here; `ApiSectionsRenderer` skips them.
 */
export function selectRenderableCategorySections(
    sections: Section[] | undefined,
    categoryId?: number,
): Section[] {
    return [...(sections ?? [])]
        .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
        .map((section) => withAbsoluteItemImages(withSubcategoriesKind(section)))
        .filter((section) =>
            hasIsDefaultFlag(section)
                ? !isBackendGeneratedSection(section)
                : !isGeneratedSubcategoriesRow(section) &&
                  !isGeneratedProductsRow(section, categoryId),
        );
}
