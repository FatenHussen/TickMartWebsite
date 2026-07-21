import { localize } from "./localize";
import type {
    Language,
    LocalizedString,
    PopupCampaign,
    PopupEntityResource,
    PopupEntityType,
    PopupPromotionResource,
    PromotionListItem,
} from "../types";

/** Array keys on a campaign/promotion that hold attached entities. */
type EntityArrayKey =
    | "products"
    | "restaurants"
    | "serviceProviders"
    | "shops"
    | "recipes"
    | "baskets"
    | "shop_vendor_services";

/** Maps an array key to the entity type it implies (shops are refined later). */
const ARRAY_TO_TYPE: Record<EntityArrayKey, PopupEntityType> = {
    products: "product",
    restaurants: "restaurant",
    serviceProviders: "service_provider",
    shops: "shop",
    recipes: "recipe",
    baskets: "basket",
    shop_vendor_services: "shop_vendor_service",
};

const ENTITY_ARRAY_KEYS = Object.keys(ARRAY_TO_TYPE) as EntityArrayKey[];

/** Inherited promotion attributes injected into each child entity. */
type InheritedContext = {
    promotionTitle?: string;
    mainColor?: string | null;
    secondColor?: string | null;
    endTime?: string | null;
};

function asLocalized(value: unknown): LocalizedString | string | null {
    if (value == null) return null;
    if (typeof value === "string") return value;
    if (typeof value === "object") return value as LocalizedString;
    return null;
}

/** Picks the first usable image URL from the common field names. */
function pickImage(entity: PopupEntityResource): string | undefined {
    const candidates: unknown[] = [
        entity.image,
        entity.image_url,
        entity.logo_url,
        typeof entity.media === "object" && entity.media
            ? entity.media.path
            : entity.media,
    ];
    for (const c of candidates) {
        if (typeof c === "string" && c.trim()) return c;
    }
    return undefined;
}

/** Refines a `shops`-array entity into restaurant/service_provider when flagged. */
function resolveEntityType(
    arrayKey: EntityArrayKey,
    entity: PopupEntityResource
): PopupEntityType {
    if (arrayKey === "shops") {
        if (entity.is_restaurant) return "restaurant";
        if (entity.is_service_provider) return "service_provider";
    }
    return ARRAY_TO_TYPE[arrayKey];
}

function toListItem(
    entity: PopupEntityResource,
    arrayKey: EntityArrayKey,
    ctx: InheritedContext,
    lang: Language
): PromotionListItem | null {
    if (!entity || entity.id == null) return null;
    const entityType = resolveEntityType(arrayKey, entity);
    const name = localize(asLocalized(entity.name ?? entity.title), lang);
    const subtitle =
        localize(asLocalized(entity.subtitle ?? entity.description), lang) ||
        undefined;
    return {
        key: `${entityType}:${entity.id}`,
        entityType,
        entityId: entity.id,
        name,
        subtitle,
        image: pickImage(entity),
        rating: typeof entity.rating === "number" ? entity.rating : undefined,
        promotionTitle: ctx.promotionTitle,
        mainColor: ctx.mainColor,
        secondColor: ctx.secondColor,
        endTime: ctx.endTime,
    };
}

/** Collects entities from a source object's typed arrays into the accumulator. */
function collectFrom(
    source: PopupCampaign | PopupPromotionResource,
    ctx: InheritedContext,
    lang: Language,
    out: PromotionListItem[],
    seen: Set<string>
): void {
    for (const arrayKey of ENTITY_ARRAY_KEYS) {
        const arr = (source as Record<string, unknown>)[arrayKey];
        if (!Array.isArray(arr)) continue;
        for (const entity of arr) {
            const item = toListItem(
                entity as PopupEntityResource,
                arrayKey,
                ctx,
                lang
            );
            if (!item || seen.has(item.key)) continue;
            seen.add(item.key);
            out.push(item);
        }
    }
}

function promotionEndTime(promo: PopupPromotionResource): string | null {
    return promo.end_date ?? promo.ends_at ?? promo.end_time ?? null;
}

function hasAnyEntity(source: PopupCampaign | PopupPromotionResource): boolean {
    return ENTITY_ARRAY_KEYS.some((key) => {
        const arr = (source as Record<string, unknown>)[key];
        return Array.isArray(arr) && arr.length > 0;
    });
}

/**
 * True when the campaign should render as an entity/promotion popup rather than
 * the static media + CTA modal: it is scoped to entities and has at least one
 * attached entity (directly or inside a promotion).
 */
export function isEntityPopup(popup: PopupCampaign | null | undefined): boolean {
    if (!popup || popup.scoped_to_entities !== true) return false;
    if (hasAnyEntity(popup)) return true;
    return (popup.promotions ?? []).some((p) => p && hasAnyEntity(p));
}

/**
 * Flattens the nested promotion/entity payload into a single, deduped list.
 * Each entity inherits its parent promotion's title/theme/end-time; entities
 * attached directly to the campaign inherit the campaign title and theme.
 * Tolerant of null/missing arrays.
 */
export function flattenPromotionEntities(
    popup: PopupCampaign | null | undefined,
    lang: Language
): PromotionListItem[] {
    if (!popup) return [];
    const out: PromotionListItem[] = [];
    const seen = new Set<string>();

    for (const promo of popup.promotions ?? []) {
        if (!promo) continue;
        const ctx: InheritedContext = {
            promotionTitle: localize(asLocalized(promo.name ?? promo.title), lang),
            mainColor: promo.main_color ?? promo.main ?? null,
            secondColor: promo.second_color ?? promo.secondary ?? null,
            endTime: promotionEndTime(promo),
        };
        collectFrom(promo, ctx, lang, out, seen);
    }

    // Entities attached directly to the campaign (not under a promotion).
    const campaignCtx: InheritedContext = {
        promotionTitle: localize(popup.title, lang),
        mainColor: popup.colors?.main ?? popup.theme?.main ?? null,
        secondColor: popup.colors?.secondary ?? popup.theme?.secondary ?? null,
        endTime: null,
    };
    collectFrom(popup, campaignCtx, lang, out, seen);

    return out;
}
