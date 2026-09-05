import type {
    Section,
    SectionItem,
    SectionItemManual,
} from "@/features/home/types";
import { DISPLAY_TYPE } from "@/features/home/types";

/**
 * What a section's cards actually are, independent of how the API labelled it.
 *
 * `content_type` is the discriminator that ships on every section, `api` and
 * `manual` alike; `manual_model` says the same thing but only for manual
 * sections (it is `null` whenever `type` is `"api"`), and both are backed by a
 * `display_type_id` seeded to a fixed id per kind in every environment (1
 * banner … 8 category, plus 9/10 for welcome/intro banners, 11 schedule
 * categories). All three were absent or environment-specific until recently,
 * so the order stays `content_type` → `api_method` → `manual_model` → a known
 * `display_type_id` → the item shape: that is what keeps an API host whose
 * seeder has not run yet rendering.
 *
 * `schedule` (11) is a customize-your-own interval card. `scheduled_basket` (5)
 * is an admin-filled basket — never open `/schedules/{id}` for those.
 */
export type SectionKind =
    | "banner"
    | "product"
    | "shop"
    | "basket"
    | "scheduled_basket"
    | "schedule"
    | "brand"
    | "recipe"
    | "category";

/** Manual items wrap the payload in `item`; API items are the payload itself. */
export function isManualItem(item: SectionItem): item is SectionItemManual {
    return "item" in item && "link" in item;
}

/** The card payload of an item, whether it is a manual entry or an API row. */
export function getItemData(item: SectionItem) {
    if (isManualItem(item)) {
        return item.item;
    }
    return item;
}

const KIND_BY_DISPLAY_TYPE: Record<number, SectionKind> = {
    [DISPLAY_TYPE.BANNER]: "banner",
    [DISPLAY_TYPE.PRODUCT]: "product",
    [DISPLAY_TYPE.SHOP]: "shop",
    [DISPLAY_TYPE.BASKET]: "basket",
    [DISPLAY_TYPE.SCHEDULED_BASKET]: "scheduled_basket",
    [DISPLAY_TYPE.BRAND]: "brand",
    [DISPLAY_TYPE.RECIPE]: "recipe",
    [DISPLAY_TYPE.CATEGORY]: "category",
    [DISPLAY_TYPE.WELCOME_BANNER]: "banner",
    [DISPLAY_TYPE.INTRO_BANNER]: "banner",
    [DISPLAY_TYPE.SCHEDULE]: "schedule",
};

/** Shared vocabulary of `content_type` and `manual_model` — same value space. */
const KIND_BY_CONTENT_NAME: Record<string, SectionKind> = {
    category: "category",
    product: "product",
    shop: "shop",
    vendor: "shop",
    basket: "basket",
    schedule: "schedule",
    "schedule-basket": "scheduled_basket",
    scheduled_basket: "scheduled_basket",
    brand: "brand",
    recipe: "recipe",
    banner: "banner",
};

/** `api_method` uses the list endpoint name (`schedules`), not `content_type`. */
const KIND_BY_API_METHOD: Record<string, SectionKind> = {
    schedules: "schedule",
    "schedule-basket": "scheduled_basket",
};

const DISPLAY_TYPE_BY_KIND: Partial<Record<SectionKind, number>> = {
    banner: DISPLAY_TYPE.BANNER,
    product: DISPLAY_TYPE.PRODUCT,
    shop: DISPLAY_TYPE.SHOP,
    basket: DISPLAY_TYPE.BASKET,
    scheduled_basket: DISPLAY_TYPE.SCHEDULED_BASKET,
    schedule: DISPLAY_TYPE.SCHEDULE,
    brand: DISPLAY_TYPE.BRAND,
    recipe: DISPLAY_TYPE.RECIPE,
    category: DISPLAY_TYPE.CATEGORY,
};

/** `null` for the `null` / `""` an unseeded host can still send instead of an id. */
function readDisplayTypeId(section: Section): number | null {
    const raw = section.display_type_id as number | string | null | undefined;
    if (raw == null || raw === "") return null;
    const id = Number(raw);
    return Number.isFinite(id) ? id : null;
}

/**
 * Card kind read off one item's payload. Keys are tested with `in` rather than
 * for a value: a root category's `parent_id` is `null`, and a shop's optional
 * fields often are too.
 */
function inferKindFromItem(item: SectionItem): SectionKind | null {
    const data = getItemData(item) as unknown as Record<string, unknown>;
    if (
        "parent_id" in data ||
        "has_children" in data ||
        "children_count" in data
    ) {
        return "category";
    }
    if ("items_count" in data && "delivery_price" in data) return "basket";
    if ("sold_number" in data) return "product";
    if ("is_open_now" in data || "vendor" in data) return "shop";
    if ("orders_count" in data && "price" in data) return "recipe";
    if ("interval_days" in data) return "schedule";
    if (isManualItem(item)) return "banner";
    if ("image" in data && "name" in data && !("price" in data)) return "brand";
    return null;
}

function inferKindFromItems(items: SectionItem[] | undefined): SectionKind | null {
    for (const item of items ?? []) {
        const kind = inferKindFromItem(item);
        if (kind) return kind;
    }
    return null;
}

/**
 * The kind of cards a section holds — `content_type` when the backend sends it,
 * then `api_method`, then `manual_model`, then a known `display_type_id`, then
 * the shape of the items. `null` only when the section is empty or carries an
 * unrecognizable payload.
 */
export function getSectionKind(section: Section): SectionKind | null {
    const fromContentType = section.content_type
        ? KIND_BY_CONTENT_NAME[section.content_type]
        : undefined;
    if (fromContentType) return fromContentType;

    const fromApiMethod = section.api_method
        ? KIND_BY_API_METHOD[section.api_method] ??
          KIND_BY_CONTENT_NAME[section.api_method]
        : undefined;
    if (fromApiMethod) return fromApiMethod;

    const fromModel = section.manual_model
        ? KIND_BY_CONTENT_NAME[section.manual_model]
        : undefined;
    if (fromModel) return fromModel;

    const displayTypeId = readDisplayTypeId(section);
    if (displayTypeId != null) {
        const fromDisplayType = KIND_BY_DISPLAY_TYPE[displayTypeId];
        if (fromDisplayType) return fromDisplayType;
    }

    return inferKindFromItems(section.items);
}

/**
 * The section with a `display_type_id` that matches what it renders. Slider
 * density presets and the scheduled-basket card read that id, so a section the
 * API sent without one must carry the id its kind implies before it reaches a
 * card component. Returns the same object whenever the API already sent one.
 */
export function withResolvedDisplayType(
    section: Section,
    kind: SectionKind | null
): Section {
    if (readDisplayTypeId(section) != null) return section;
    const displayTypeId = kind ? DISPLAY_TYPE_BY_KIND[kind] : undefined;
    if (displayTypeId == null) return section;
    return { ...section, display_type_id: displayTypeId };
}
