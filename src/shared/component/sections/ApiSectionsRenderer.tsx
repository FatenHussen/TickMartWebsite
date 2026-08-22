import { useState, useRef, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuthStore } from "@/store/auth";
import { useFavorites, useToggleFavorite } from "@/features/account/hooks/useFavorites";
import SliderSection from "../slider/core/SliderSection";
import ProductCard from "../card/ProductCard";
import FlashSaleCard from "../card/FlashSaleCard";
import BrandCardWithRating from "../card/BrandCardWithRating";
import BasketCard from "../card/BasketCard";
import ShopCard from "../card/ShopCard";
import PromotionalBannerCard from "../banner/PromotionalBannerCard";
import PromotionalHeroSlider from "../banner/PromotionalHeroSlider";
import CategoryCircle from "../category/CategoryCircle";
import { readCategoryColor } from "@/shared/lib/categoryColors";
import { normalizeSectionsLocalization } from "@/shared/lib/sectionLocalization";
import { openSectionLink } from "@/shared/lib/sectionLink";
import { buildCategoryTrailSearch } from "@/features/categories/lib/categoryTrail";
import { paths } from "@/app/routes/path/paths";
import LazyImage from "@/shared/component/LazyImage";
import FavoriteButton from "@/shared/component/FavoriteButton";
import Button from "@/shared/ui/Button";
import type {
    Section,
    SectionItem,
    SectionItemBase,
    SectionItemBadge,
    BrandItem,
    RecipeItem,
    ProductItem,
    BasketItem,
    ShopItem,
} from "@/features/home/types";
import {
    mapPageSlugToRoute,
    mapActionPageSlugToRoute,
} from "@/utils/routeMapper";
import type { ProductCardBadge } from "@/shared/component/card/ProductCard";
import {
    mapApiBottomBadgesToProductCard,
    mapApiTopBadgesToProductCard,
    type ApiProductBadgeLike,
} from "@/shared/lib/mapProductBadges";
import {
    getSectionCardVariant,
    getSectionLayout,
    getSectionRowProps,
    getSliderPresetForSection,
    CATEGORY_GRID_CLASS_NAME,
    getSectionCardSurfaceColor,
    getDarkSectionBackground,
    getDarkCardSurface,
    getDarkCardSurfaceGradient,
} from "./sectionCardVariant";
import {
    getItemData,
    getSectionKind,
    isManualItem,
    withResolvedDisplayType,
} from "./sectionKind";
import { DISPLAY_TYPE } from "@/features/home/types";
import { useTheme } from "@/context/ThemeContext";

function getFlashSaleEndDate(endDate?: string | null): string | null {
    if (!endDate) return null;
    const normalized = endDate.trim();
    if (!normalized) return null;
    const parsed = Date.parse(normalized);
    return Number.isFinite(parsed) ? normalized : null;
}

/**
 * Flash-sale accents (timer badge, headline pill, card discount chip) always use
 * the public brand color — NOT the per-section `main_color`, which is often a
 * washed-out tint that makes the flame/discount badges illegible. Same in both
 * themes so the "limited deal" look stays vivid and on-brand.
 */
function getFlashSaleColors(): {
    mainColor: string | null;
    secondColor: string | null;
} {
    return {
        mainColor: "var(--color-main)",
        secondColor: "var(--color-api-second)",
    };
}

/**
 * Full-width band background behind a section's slider. Flash-sale rows tint the
 * band with the API section's `main_color` (per design — falls back to
 * `background_color`); non-flash rows keep `background_color`. Dark theme always
 * uses the neutral dark band so API tints never wash the surface out.
 */
function getSectionBandBackground(
    section: Section,
    isDarkTheme: boolean,
    flashSaleEndDate: string | null
): string | null {
    if (isDarkTheme) return getDarkSectionBackground();
    if (flashSaleEndDate) {
        return section.main_color ?? section.background_color ?? null;
    }
    return section.background_color ?? null;
}

/**
 * Flash-sale items carry the discount on the section (`discount` / `discount_type`)
 * while the per-item `discount` string is empty. Treat an item as discounted when its
 * `price_after_discount` is below `price`, regardless of which level set the discount.
 */
function hasProductDiscount(item: ProductItem): boolean {
    if (item.discount && parseFloat(item.discount) > 0) return true;
    const after = item.price_after_discount;
    const before = item.price;
    return (
        after != null &&
        before != null &&
        Number(after) < Number(before)
    );
}

/** Badge label for a discounted product: per-item discount wins, else section-level. */
function getDiscountBadgeLabel(
    item: ProductItem,
    section: Section
): string | null {
    if (item.discount && parseFloat(item.discount) > 0) {
        return `-${parseFloat(item.discount)}%`;
    }
    const sectionDiscount = section.discount;
    if (sectionDiscount != null && Number(sectionDiscount) > 0) {
        const value = Number(sectionDiscount);
        const isPercent =
            section.discount_type === "percent" ||
            section.discount_type === "percentage";
        return isPercent ? `-${value}%` : `-${value}`;
    }
    return null;
}

/**
 * Highest discount percentage advertised by a flash-sale section — the section-level
 * percent discount or the largest per-item discount, whichever is bigger. Drives the
 * "Up to X% off" headline. Returns null when nothing is on a percentage discount.
 */
function getFlashSaleMaxDiscountPercent(section: Section): number | null {
    let max = 0;
    const sd = section.discount;
    const sectionIsPercent =
        section.discount_type == null ||
        section.discount_type === "percent" ||
        section.discount_type === "percentage";
    if (sd != null && sectionIsPercent && Number(sd) > 0) {
        max = Math.max(max, Number(sd));
    }
    for (const item of section.items) {
        const data = isManualItem(item) ? item.item : item;
        const disc = (data as { discount?: string | null }).discount;
        if (disc && parseFloat(disc) > 0) max = Math.max(max, parseFloat(disc));
    }
    return max > 0 ? Math.round(max) : null;
}

/** Localized flash-sale headline labels for a section, or empty when not a flash sale. */
function getFlashSaleHeadline(
    section: Section,
    flashSaleEndDate: string | null,
    t: (key: string) => string
): { discountLabel?: string; fastDiscountsLabel?: string } {
    if (!flashSaleEndDate) return {};
    const percent = getFlashSaleMaxDiscountPercent(section);
    if (percent == null) return {};
    return {
        discountLabel: t("flashSale.upToDiscount").replace(
            "{{value}}",
            String(percent)
        ),
        fastDiscountsLabel: t("flashSale.fastDiscounts"),
    };
}

/** Shop list may send badges on the item or on `vendor` */
function shopTopBadgesFromItem(item: ShopItem) {
    if (item.top_badges?.length) return item.top_badges;
    if (item.vendor?.top_badges?.length) return item.vendor.top_badges;
    return item.budges;
}

function shopBottomBadgesFromItem(item: ShopItem) {
    return item.bottom_badges ?? item.vendor?.bottom_badges;
}

type ShopCardMappedData = {
    sourceItem: SectionItem;
    id: number;
    name: string;
    description?: string | null;
    image?: string | null;
    isOpenNow: boolean;
    badge?: ProductCardBadge[];
    rating: number;
    address?: string | null;
    isServiceProvider?: boolean;
    isRestaurant?: boolean;
    pricingTier?: string | null;
    paymentMethods?: string[];
    deliveryPrice?: string | number | null;
    discountLabel?: string | null;
    bottomBadges?: ProductCardBadge[];
    isFavorite?: boolean;
};

function mapSectionItemToShopCardData(item: SectionItem): ShopCardMappedData | null {
    if (isShopItem(item)) {
        return {
            sourceItem: item,
            id: item.id,
            name: item.name,
            description: item.description,
            image: item.image ?? item.cover_image ?? item.logo_url,
            isOpenNow: item.is_open_now,
            badge: mapApiTopBadgesToProductCard(shopTopBadgesFromItem(item)),
            rating: item.average_rating ?? 0,
            address: item.address,
            isServiceProvider: item.is_service_provider,
            isRestaurant: item.is_restaurant,
            pricingTier: item.pricing_tier,
            paymentMethods: item.payment_methods,
            deliveryPrice: item.delivery_price,
            discountLabel: item.discount_label,
            bottomBadges: mapApiBottomBadgesToProductCard(shopBottomBadgesFromItem(item)),
            isFavorite: item.is_favorite,
        };
    }

    const data = getItemData(item) as unknown as Record<string, unknown>;
    const vendor = data.vendor as
        | { top_badges?: unknown[]; bottom_badges?: unknown[] }
        | undefined;

    const topBadges = ((data.top_badges as ShopItem["top_badges"])?.length
        ? (data.top_badges as ShopItem["top_badges"])
        : vendor?.top_badges?.length
          ? (vendor.top_badges as ShopItem["top_badges"])
          : (data.budges as ShopItem["budges"])) as ApiProductBadgeLike[] | undefined;

    const bottomBadges = ((data.bottom_badges as ShopItem["bottom_badges"]) ??
        vendor?.bottom_badges) as ApiProductBadgeLike[] | undefined;

    const rawId = data.id;
    const normalizedId =
        typeof rawId === "number"
            ? rawId
            : typeof rawId === "string" && rawId.trim().length > 0
              ? Number(rawId)
              : NaN;
    if (!Number.isFinite(normalizedId)) return null;

    return {
        sourceItem: item,
        id: normalizedId,
        name: ((data.name as string) ?? (data.title as string) ?? "").trim(),
        description: (data.description as string) ?? null,
        image:
            (data.image as string) ??
            (data.cover_image as string) ??
            (data.logo_url as string) ??
            null,
        isOpenNow: (data.is_open_now as boolean) ?? false,
        badge: mapApiTopBadgesToProductCard(topBadges),
        rating: (data.average_rating as number) ?? 0,
        address: (data.address as string) ?? null,
        isServiceProvider: (data.is_service_provider as boolean) ?? false,
        isRestaurant: (data.is_restaurant as boolean) ?? false,
        pricingTier: (data.pricing_tier as string) ?? null,
        paymentMethods: (data.payment_methods as string[]) ?? [],
        deliveryPrice: (data.delivery_price as string | number) ?? null,
        discountLabel: (data.discount_label as string) ?? null,
        bottomBadges: mapApiBottomBadgesToProductCard(bottomBadges),
        isFavorite: data.is_favorite as boolean | undefined,
    };
}

type ApiSectionsRendererProps = {
    sections: Section[];
    /** When true (e.g. home rows), brand section background spans viewport width */
    edgeToEdgeSectionBackgrounds?: boolean;
    /**
     * When the renderer is already inside `.page-container` (e.g. unified Home column),
     * banner blocks use `w-full` instead of nesting another `.page-container`.
     */
    skipInnerPageContainer?: boolean;
    /**
     * When API omits `background_color` / card tint, brand rows fall back to
     * `--color-api-second`. Pass this on pages (e.g. all-brands) that should use white instead.
     */
    brandDefaultsWhenApiMissing?: {
        sectionBackground: string;
        cardSurface: string;
    };
    /** Optional class applied to each slider section wrapper. */
    sectionClassName?: string;
    removeSectionVerticalSpacing?: boolean;
    /**
     * Where a click on a category card navigates. Defaults to the category's
     * own page (`/categories?trail={id}`); the categories view passes its
     * drill handler so clicks extend the current trail instead.
     */
    onCategoryItemClick?: (categoryId: number) => void;
};

// Type guards for different item types
function isBrandItem(item: SectionItem): item is BrandItem {
    return (
        !isManualItem(item) &&
        "name" in item &&
        "image" in item &&
        !("category" in item) &&
        !("title" in item)
    );
}

function isRecipeItem(item: SectionItem): item is RecipeItem {
    return (
        !isManualItem(item) &&
        "name" in item &&
        "description" in item &&
        "orders_count" in item
    );
}

function isProductItem(item: SectionItem): item is ProductItem {
    return (
        !isManualItem(item) &&
        "category" in item &&
        "name" in item &&
        "sold_number" in item
    );
}

function isBasketItem(item: SectionItem): item is BasketItem {
    return (
        !isManualItem(item) &&
        "title" in item &&
        "items_count" in item &&
        "delivery_price" in item &&
        "discount_type" in item
    );
}

function isShopItem(item: SectionItem): item is ShopItem {
    return (
        !isManualItem(item) &&
        "name" in item &&
        "vendor" in item &&
        "is_open_now" in item &&
        "average_rating" in item &&
        !("category" in item && "sold_number" in item) &&
        !("title" in item && "items_count" in item && "delivery_price" in item)
    );
}

// How a section is laid out is the API's `layout` — `slider` (the default and
// by far the common case), `list` or `grid` — and nothing else decides it.
//
// `variant` used to double as that switch, so an admin could not pick a card
// shape without also deciding whether the row scrolled. They are separate
// fields with separate readers now: `getSectionRowProps` turns `layout` into
// the row props every section below spreads, while `getSectionCardVariant` and
// `getSliderPresetForSection` keep `variant` on card shape and slide density.
//
// Slider arrows come from `Slider`: desktop-only, RTL-aware, and self-hiding
// when the row has nothing left to scroll. List and grid rows lay every item
// out at once, so they get none.

export default function ApiSectionsRenderer({
    sections: apiSections,
    edgeToEdgeSectionBackgrounds = false,
    skipInnerPageContainer = false,
    brandDefaultsWhenApiMissing,
    sectionClassName,
    removeSectionVerticalSpacing = false,
    onCategoryItemClick,
}: ApiSectionsRendererProps) {
    const navigate = useNavigate();
    const { t, i18n } = useTranslation();
    const { theme } = useTheme();
    const isDarkTheme = theme === "dark";
    const authenticated = useAuthStore((s) => s.authenticated);
    const { data: favoriteProducts = [] } = useFavorites("product", false);
    const { data: favoriteRecipes = [] } = useFavorites("recipe", false);
    const { data: favoriteBaskets = [] } = useFavorites("basket", false);
    const { data: favoriteShops = [] } = useFavorites("shop", false);
    const language = i18n.language || "en";
    // Every sections endpoint may send `name` (and item `title`/`description`)
    // as `{ ar, en }` — the dashboard saves a section's name override as that
    // object and the public payload hands it straight back. Resolving here, at
    // the one component all fourteen callers share, keeps a localized value from
    // ever reaching JSX as a raw object ("Objects are not valid as a React
    // child"). Payloads already normalized upstream pass through unchanged.
    const sections = useMemo(
        () => normalizeSectionsLocalization(apiSections, language),
        [apiSections, language]
    );
    const toggleFavorite = useToggleFavorite();
    const productFavoriteIds = favoriteProducts.map((f) => f.id);
    const recipeFavoriteIds = favoriteRecipes.map((f) => f.id);
    const basketFavoriteIds = favoriteBaskets.map((f) => f.id);
    const shopFavoriteIds = favoriteShops.map((f) => f.id);

    // Optimistic favorite state: key ="type:id", value = optimistic isFavorite
    const [optimisticFavorites, setOptimisticFavorites] = useState<
        Map<string, boolean>
    >(new Map());

    // Returns a computed isFavorite checker for a given type that respects optimistic overrides
    const makeIsFavoriteFor =
        (type: string, baseIds: number[]) =>
            (id: number, itemIsFavorite?: boolean): boolean => {
                const key = `${type}:${id}`;
                if (optimisticFavorites.has(key)) return optimisticFavorites.get(key)!;
                return itemIsFavorite ?? baseIds.includes(id);
            };

    const handleViewAll = (section: Section) => {
        if (section.see_more?.page_slug) {
            const route = mapPageSlugToRoute(
                section.see_more.page_slug,
                section.see_more.params
            );
            navigate(route);
        }
    };

    const handleItemClick = (section: Section, item: SectionItem) => {
        if (isManualItem(item) && item.link) {
            // A manual item's link may point outside the app (banners often do).
            openSectionLink(item.link, navigate);
        } else if (section.action?.page_slug) {
            const itemData = getItemData(item);
            const route = mapActionPageSlugToRoute(
                section.action.page_slug,
                itemData.id
            );
            navigate(route);
        }
    };

    const handleCategoryItemClick = (item: SectionItem) => {
        if (isManualItem(item) && item.link) {
            openSectionLink(item.link, navigate);
            return;
        }
        const id = Number((getItemData(item) as { id?: number | string }).id);
        if (!Number.isFinite(id)) return;
        if (onCategoryItemClick) {
            onCategoryItemClick(id);
            return;
        }
        navigate(`${paths.client.categories}${buildCategoryTrailSearch([id])}`);
    };

    const handleToggleFavorite = (
        type: "product" | "recipe" | "basket" | "shop",
        id: number,
        currentIsFavorite: boolean
    ) => {
        if (!authenticated) {
            navigate("/auth/sign-in");
            return;
        }
        const key = `${type}:${id}`;
        // Flip immediately (optimistic)
        setOptimisticFavorites((prev) => new Map(prev).set(key, !currentIsFavorite));
        toggleFavorite.mutate({ type, id }, {
            onError: () => {
                // Rollback: API failed, restore the previous value
                setOptimisticFavorites((prev) =>
                    new Map(prev).set(key, currentIsFavorite)
                );
            },
            // onSuccess: intentionally omitted — the flipped optimistic value is
            // already correct (it matches what the server saved). Removing it would
            // reveal the stale sections cache (which still holds the old is_favorite),
            // causing the heart icon to revert until the page is reloaded.
        });
    };

    return (
        <>
            {sections.map((section, index) => (
                <LazySection key={section.id} eager={index < 2}>
                    <SectionByDisplayType
                        section={section}
                        isDarkTheme={isDarkTheme}
                        onViewAll={() => handleViewAll(section)}
                        onItemClick={(item) => handleItemClick(section, item)}
                        onCategoryClick={handleCategoryItemClick}
                        t={t}
                        edgeToEdgeSectionBackgrounds={edgeToEdgeSectionBackgrounds}
                        skipInnerPageContainer={skipInnerPageContainer}
                        brandDefaultsWhenApiMissing={brandDefaultsWhenApiMissing}
                        sectionClassName={sectionClassName}
                        removeSectionVerticalSpacing={removeSectionVerticalSpacing}
                        productIsFavoriteFor={makeIsFavoriteFor("product", productFavoriteIds)}
                        recipeIsFavoriteFor={makeIsFavoriteFor("recipe", recipeFavoriteIds)}
                        basketIsFavoriteFor={makeIsFavoriteFor("basket", basketFavoriteIds)}
                        shopIsFavoriteFor={makeIsFavoriteFor("shop", shopFavoriteIds)}
                        onToggleProductFavorite={(id, cur) =>
                            handleToggleFavorite("product", id, cur)
                        }
                        onToggleRecipeFavorite={(id, cur) =>
                            handleToggleFavorite("recipe", id, cur)
                        }
                        onToggleBasketFavorite={(id, cur) =>
                            handleToggleFavorite("basket", id, cur)
                        }
                        onToggleShopFavorite={(id, cur) =>
                            handleToggleFavorite("shop", id, cur)
                        }
                    />
                </LazySection>
            ))}
        </>
    );
}

type SectionByDisplayTypeProps = {
    section: Section;
    isDarkTheme: boolean;
    onViewAll: () => void;
    onItemClick: (item: SectionItem) => void;
    /** Click handler for items inside category-card sections. */
    onCategoryClick: (item: SectionItem) => void;
    t: (key: string) => string;
    edgeToEdgeSectionBackgrounds?: boolean;
    skipInnerPageContainer?: boolean;
    brandDefaultsWhenApiMissing?: ApiSectionsRendererProps["brandDefaultsWhenApiMissing"];
    sectionClassName?: string;
    removeSectionVerticalSpacing?: boolean;
    productIsFavoriteFor: (id: number, itemIsFavorite?: boolean) => boolean;
    recipeIsFavoriteFor: (id: number, itemIsFavorite?: boolean) => boolean;
    basketIsFavoriteFor: (id: number, itemIsFavorite?: boolean) => boolean;
    shopIsFavoriteFor: (id: number, itemIsFavorite?: boolean) => boolean;
    onToggleProductFavorite: (id: number, currentIsFavorite: boolean) => void;
    onToggleRecipeFavorite: (id: number, currentIsFavorite: boolean) => void;
    onToggleBasketFavorite: (id: number, currentIsFavorite: boolean) => void;
    onToggleShopFavorite: (id: number, currentIsFavorite: boolean) => void;
};

function SectionByDisplayType({
    section: apiSection,
    isDarkTheme,
    onViewAll,
    onItemClick,
    onCategoryClick,
    t,
    edgeToEdgeSectionBackgrounds,
    skipInnerPageContainer,
    brandDefaultsWhenApiMissing,
    sectionClassName,
    removeSectionVerticalSpacing,
    productIsFavoriteFor,
    recipeIsFavoriteFor,
    basketIsFavoriteFor,
    shopIsFavoriteFor,
    onToggleProductFavorite,
    onToggleRecipeFavorite,
    onToggleBasketFavorite,
    onToggleShopFavorite,
}: SectionByDisplayTypeProps) {
    // A section with no items renders nothing at all — not a heading, not a
    // placeholder line. Every page mixes rows the backend fills from a query,
    // so an empty one is a query that matched nothing (a leaf category has no
    // subcategories row to draw), not something the visitor needs told.
    if (!apiSection.items?.length) return null;

    // `see_more` alone decides the "view all" button. Gating it on
    // `type === "api"` swallowed the button on manual sections, which the
    // dashboard is free to attach a `see_more` target to as well.
    const showViewAll = Boolean(apiSection.see_more?.page_slug);
    // Not a plain `display_type_id` switch: `content_type` is the field the API
    // sets on every section, while `manual_model` is null on `type: "api"` rows
    // and an unseeded host can still send a `null` display type. Cards
    // downstream still read `display_type_id`, hence the section is handed on
    // with the id its kind implies.
    const kind = getSectionKind(apiSection);
    const section = withResolvedDisplayType(apiSection, kind);

    switch (kind) {
        case "category":
            return (
                <CategorySection
                    section={section}
                    isDarkTheme={isDarkTheme}
                    showViewAll={showViewAll}
                    onViewAll={onViewAll}
                    onItemClick={onCategoryClick}
                    t={t}
                    edgeToEdgeSectionBackgrounds={edgeToEdgeSectionBackgrounds}
                    sectionClassName={sectionClassName}
                    removeSectionVerticalSpacing={removeSectionVerticalSpacing}
                />
            );

        case "banner":
            return (
                <BannerSection
                    section={section}
                    showViewAll={showViewAll}
                    onViewAll={onViewAll}
                    onItemClick={onItemClick}
                    t={t}
                    skipInnerPageContainer={skipInnerPageContainer}
                />
            );

        case "product":
            return (
                <ProductSection
                    section={section}
                    isDarkTheme={isDarkTheme}
                    showViewAll={showViewAll}
                    onViewAll={onViewAll}
                    onItemClick={onItemClick}
                    t={t}
                    edgeToEdgeSectionBackgrounds={edgeToEdgeSectionBackgrounds}
                    sectionClassName={sectionClassName}
                    removeSectionVerticalSpacing={removeSectionVerticalSpacing}
                    isFavoriteFor={productIsFavoriteFor}
                    onToggleFavorite={onToggleProductFavorite}
                />
            );

        case "shop":
            return (
                <ShopSection
                    section={section}
                    isDarkTheme={isDarkTheme}
                    showViewAll={showViewAll}
                    onViewAll={onViewAll}
                    onItemClick={onItemClick}
                    t={t}
                    edgeToEdgeSectionBackgrounds={edgeToEdgeSectionBackgrounds}
                    sectionClassName={sectionClassName}
                    removeSectionVerticalSpacing={removeSectionVerticalSpacing}
                    isFavoriteFor={shopIsFavoriteFor}
                    onToggleFavorite={onToggleShopFavorite}
                />
            );

        case "basket":
        case "scheduled_basket":
            return (
                <BasketSection
                    section={section}
                    isDarkTheme={isDarkTheme}
                    showViewAll={showViewAll}
                    onViewAll={onViewAll}
                    onItemClick={onItemClick}
                    t={t}
                    edgeToEdgeSectionBackgrounds={edgeToEdgeSectionBackgrounds}
                    sectionClassName={sectionClassName}
                    removeSectionVerticalSpacing={removeSectionVerticalSpacing}
                    isFavoriteFor={basketIsFavoriteFor}
                    onToggleFavorite={onToggleBasketFavorite}
                />
            );

        case "brand":
            return (
                <BrandSection
                    section={section}
                    isDarkTheme={isDarkTheme}
                    showViewAll={showViewAll}
                    onViewAll={onViewAll}
                    onItemClick={onItemClick}
                    t={t}
                    edgeToEdgeSectionBackgrounds={edgeToEdgeSectionBackgrounds}
                    brandDefaultsWhenApiMissing={brandDefaultsWhenApiMissing}
                    sectionClassName={sectionClassName}
                    removeSectionVerticalSpacing={removeSectionVerticalSpacing}
                />
            );

        case "recipe":
            return (
                <RecipeSection
                    section={section}
                    isDarkTheme={isDarkTheme}
                    showViewAll={showViewAll}
                    onViewAll={onViewAll}
                    onItemClick={onItemClick}
                    t={t}
                    edgeToEdgeSectionBackgrounds={edgeToEdgeSectionBackgrounds}
                    sectionClassName={sectionClassName}
                    removeSectionVerticalSpacing={removeSectionVerticalSpacing}
                    isFavoriteFor={recipeIsFavoriteFor}
                    onToggleFavorite={onToggleRecipeFavorite}
                />
            );

        default:
            // Items are present (empty sections returned above) but nothing
            // identifies them — drawing a placeholder card here would put a
            // broken row on a live page, so the section is skipped and logged.
            console.warn(
                `[ApiSectionsRenderer] Section ${apiSection.id} ("${apiSection.name}") has no recognizable card type (content_type: ${apiSection.content_type ?? "—"}, manual_model: ${apiSection.manual_model ?? "—"}, display_type_id: ${apiSection.display_type_id}, items: ${apiSection.items.length})`
            );
            return null;
    }
}

type SectionProps = {
    section: Section;
    isDarkTheme?: boolean;
    showViewAll: boolean | any;
    onViewAll: () => void;
    onItemClick: (item: SectionItem) => void;
    t: (key: string) => string;
    /** Full-bleed section tint (same prop as brand rows; brand UI unchanged). */
    edgeToEdgeSectionBackgrounds?: boolean;
    brandDefaultsWhenApiMissing?: ApiSectionsRendererProps["brandDefaultsWhenApiMissing"];
    skipInnerPageContainer?: boolean;
    sectionClassName?: string;
    removeSectionVerticalSpacing?: boolean;
};

type SectionPropsWithFavorites = SectionProps & {
    /** Computed isFavorite checker — already aware of optimistic overrides */
    isFavoriteFor: (id: number, itemIsFavorite?: boolean) => boolean;
    /** Must receive current isFavorite so the handler can flip optimistically */
    onToggleFavorite: (id: number, currentIsFavorite: boolean) => void;
};

type ScheduledBasketCardProps = {
    item: BasketItem;
    isFavorite: boolean;
    t: (key: string) => string;
    onClick: () => void;
    onToggleFavorite: (id: number, currentIsFavorite: boolean) => void;
    isDarkTheme?: boolean;
};

function ScheduledBasketCard({
    item,
    isFavorite,
    t,
    onClick,
    onToggleFavorite,
    isDarkTheme = false,
}: ScheduledBasketCardProps) {
    const nextDelivery = item.next_delivery_date
        ? new Date(item.next_delivery_date).toLocaleDateString()
        : null;
    const priceValue = item.final_price ?? item.price_after_discount ?? 0;
    const originalPrice = item.original_price > 0 ? `${item.original_price}` : null;
    const cta = t("home.openBasket") === "home.openBasket" ? "View Schedule" : t("home.openBasket");
    const itemsLabel = t("baskets.items") === "baskets.items" ? "items" : t("baskets.items");
    const deliveryLabel =
        t("baskets.deliveryPrice") === "baskets.deliveryPrice"
            ? "Delivery"
            : t("baskets.deliveryPrice");
    const nextDeliveryLabel =
        t("baskets.nextDeliveryDate") === "baskets.nextDeliveryDate"
            ? "Next delivery"
            : t("baskets.nextDeliveryDate");

    return (
        <div
            className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-emerald-200/70 bg-white shadow-[0_10px_30px_-18px_rgba(16,185,129,0.45)] transition-all duration-300 hover:-translate-y-1 dark:border-white/[0.12] dark:bg-[var(--color-bg-card-elevated)] dark:shadow-[0_0_0_1px_rgba(255,255,255,0.06),0_4px_28px_-10px_rgba(0,0,0,0.5)]"
            onClick={onClick}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") onClick();
            }}
        >
            <div className="relative h-44 overflow-hidden rounded-t-3xl">
                <LazyImage
                    src={item.image}
                    alt={item.title || item.name || ""}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                    wrapperClassName="h-full w-full"
                />
                <div className="absolute inset-x-0 top-0 flex items-start justify-between p-3">
                    <span className="rounded-full bg-emerald-600 px-3 py-1 text-xs font-semibold text-white">
                        {nextDeliveryLabel}
                    </span>
                    <FavoriteButton
                        isFavorite={isFavorite}
                        onToggle={(e) => {
                            e.stopPropagation();
                            onToggleFavorite(item.id, isFavorite);
                        }}
                        size="md"
                        ariaLabel="Toggle favorite"
                    />
                </div>
            </div>

            <div
                className={`flex flex-1 flex-col gap-3 p-4${
                    isDarkTheme
                        ? ""
                        : " bg-gradient-to-b from-emerald-50/80 to-white"
                }`}
                style={
                    isDarkTheme
                        ? { backgroundImage: getDarkCardSurfaceGradient() }
                        : undefined
                }
            >
                <h3 className="line-clamp-2 text-lg font-bold text-custom-primary dark:text-white">
                    {item.title || item.name || ""}
                </h3>
                <div className="grid grid-cols-2 gap-2 rounded-2xl bg-emerald-100/70 p-2 text-xs dark:bg-emerald-900/25">
                    <div className="rounded-xl bg-white/70 p-2 text-custom-secondary dark:bg-black/20 dark:text-zinc-300">
                        <div className="mb-1 text-[11px] opacity-80">{itemsLabel}</div>
                        <div className="font-semibold">{item.items_count}</div>
                    </div>
                    <div className="rounded-xl bg-white/70 p-2 text-custom-secondary dark:bg-black/20 dark:text-zinc-300">
                        <div className="mb-1 text-[11px] opacity-80">{deliveryLabel}</div>
                        <div className="font-semibold">{item.delivery_price}</div>
                    </div>
                </div>

                {nextDelivery && (
                    <p className="text-sm font-medium text-emerald-700 dark:text-emerald-300">
                        {nextDeliveryLabel}: {nextDelivery}
                    </p>
                )}

                <div className="mt-auto flex items-end justify-between gap-2">
                    <div>
                        <div className="text-xl font-bold text-custom-primary dark:text-white">
                            {priceValue}
                        </div>
                        {originalPrice && (
                            <div className="text-sm text-custom-tertiary line-through dark:text-zinc-500">
                                {originalPrice}
                            </div>
                        )}
                    </div>
                    <Button
                        variant="primary"
                        size="sm"
                        className="rounded-xl px-4"
                        onClick={(e) => {
                            e.stopPropagation();
                            onClick();
                        }}
                    >
                        {cta}
                    </Button>
                </div>
            </div>
        </div>
    );
}

function BannerSection({
    section,
    showViewAll,
    onViewAll,
    onItemClick,
    t,
    skipInnerPageContainer,
}: SectionProps) {
    const innerMax = skipInnerPageContainer ? "w-full" : "page-container";
    // A banner row is artwork, so `variant` has nothing to say about it — but
    // `layout` still does: `slider` is the hero carousel these rows have always
    // been, `list` and `grid` show every banner at once instead of one at a time.
    const layout = getSectionLayout(section);
    const viewAllButtonClass =
        "inline-flex items-center gap-1.5 rounded-full border border-primary-light/35 bg-primary-light/10 px-4 py-2 text-sm font-semibold text-primary-light transition-all duration-200 hover:-translate-y-0.5 hover:bg-primary-light hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-light/40";
    // If only one item, show promotional banner with container
    if (section.items.length === 1) {
        const item = section.items[0];
        const itemData = getItemData(item);
        const link = isManualItem(item) ? item.link : undefined;

        return (
            <div className="w-full">
                {showViewAll && section.name && (
                    <div
                        className={`${innerMax} mb-4 flex items-center justify-between`}
                    >
                        <h2 className="text-2xl font-bold text-custom-primary dark:text-[color:var(--color-text,var(--color-text-primary))]">
                            {section.name}
                        </h2>
                        <button
                            onClick={onViewAll}
                            className={viewAllButtonClass}
                        >
                            {t("common.viewAll")}
                            <span aria-hidden="true">{"->"}</span>
                        </button>
                    </div>
                )}
                <div className={innerMax}>
                    <PromotionalBannerCard
                        item={itemData as SectionItemBase}
                        link={link}
                        onClick={() => onItemClick(item)}
                        className="w-full"
                    />
                </div>
            </div>
        );
    }

    // Multiple items - use hero-style slider (like HeroSlider)
    return (
        <div className={innerMax}>
            {showViewAll && section.name && (
                <div className="mb-4 flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-custom-primary dark:text-[color:var(--color-text,var(--color-text-primary))]">
                        {section.name}
                    </h2>
                    <button
                        onClick={onViewAll}
                        className={viewAllButtonClass}
                    >
                        {t("common.viewAll")}
                        <span aria-hidden="true">{"->"}</span>
                    </button>
                </div>
            )}
            {layout === "slider" ? (
                <PromotionalHeroSlider
                    items={section.items}
                    getLink={(item) => (isManualItem(item) ? item.link : undefined)}
                    onItemClick={onItemClick}
                />
            ) : (
                <div
                    className={
                        layout === "list"
                            ? "flex flex-col gap-4 md:gap-5"
                            : "grid grid-cols-1 gap-4 md:grid-cols-2 lg:gap-6"
                    }
                >
                    {section.items.map((item, index) => {
                        const itemData = getItemData(item) as SectionItemBase;
                        return (
                            <PromotionalBannerCard
                                key={String(itemData.id ?? index)}
                                item={itemData}
                                link={isManualItem(item) ? item.link : undefined}
                                onClick={() => onItemClick(item)}
                                className="w-full"
                            />
                        );
                    })}
                </div>
            )}
        </div>
    );
}

/** Compact circle cards — denser rows than any product/card preset. */
const CATEGORY_SLIDER_PRESET = {
    slidesPerView: 3.2,
    spaceBetween: 12,
    breakpoints: {
        480: { slidesPerView: 4.2 },
        640: { slidesPerView: 5 },
        768: { slidesPerView: 6 },
        1024: { slidesPerView: 8 },
    },
};

/**
 * Category-card section (`manual_model === "category"`): a slider of the same
 * circular category avatars used on the categories page. Clicking a card opens
 * that category's own page (`/user/categories/{id}/page` on the backend).
 */
function CategorySection({
    section,
    isDarkTheme = false,
    showViewAll,
    onViewAll,
    onItemClick,
    t,
    edgeToEdgeSectionBackgrounds,
    sectionClassName,
    removeSectionVerticalSpacing,
}: SectionProps) {
    return (
        <SliderSection
            title={section.name}
            viewAllLabel={showViewAll ? t("common.viewAll") : undefined}
            onViewAllClick={showViewAll ? onViewAll : undefined}
            items={section.items}
            slidesPerView={CATEGORY_SLIDER_PRESET.slidesPerView}
            breakpoints={CATEGORY_SLIDER_PRESET.breakpoints}
            spaceBetween={CATEGORY_SLIDER_PRESET.spaceBetween}
            sectionBackgroundColor={getSectionBandBackground(section, isDarkTheme, null)}
            edgeToEdgeSectionBackground={edgeToEdgeSectionBackgrounds}
            className={sectionClassName}
            removeVerticalSpacing={removeSectionVerticalSpacing}
            {...getSectionRowProps(section, "square", CATEGORY_GRID_CLASS_NAME)}
            renderItem={(item) => {
                const data = getItemData(item) as unknown as {
                    id?: number | string;
                    name?: string | null;
                    title?: string | null;
                    icon?: string | null;
                    image?: string | null;
                    children?: unknown[];
                };
                if (data.id == null) return null;
                return (
                    <CategoryCircle
                        key={String(data.id)}
                        name={data.name ?? data.title ?? ""}
                        icon={data.icon ?? data.image ?? null}
                        mainColor={readCategoryColor(data, "main")}
                        secondColor={readCategoryColor(data, "second")}
                        size="md"
                        hasChildren={
                            Array.isArray(data.children) && data.children.length > 0
                        }
                        onClick={() => onItemClick(item)}
                    />
                );
            }}
        />
    );
}

function ProductSection({
    section,
    isDarkTheme = false,
    showViewAll,
    onViewAll,
    onItemClick,
    t,
    edgeToEdgeSectionBackgrounds,
    sectionClassName,
    removeSectionVerticalSpacing,
    isFavoriteFor,
    onToggleFavorite,
}: SectionPropsWithFavorites) {
    const cardVariant = getSectionCardVariant(section);
    const sliderPreset = getSliderPresetForSection(cardVariant);
    const surfaceColor = isDarkTheme ? getDarkCardSurface() : getSectionCardSurfaceColor(section);
    const surfaceGradient = isDarkTheme ? getDarkCardSurfaceGradient() : undefined;
    const flashSaleEndDate = getFlashSaleEndDate(section.end_date);
    const { mainColor, secondColor } = getFlashSaleColors();
    const flashHeadline = getFlashSaleHeadline(section, flashSaleEndDate, t);

    return (
        <SliderSection
            title={section.name}
            flashSaleEndDate={flashSaleEndDate}
            flashSaleMainColor={mainColor}
            flashSaleSecondColor={secondColor}
            flashSaleDiscountLabel={flashHeadline.discountLabel}
            flashSaleFastDiscountsLabel={flashHeadline.fastDiscountsLabel}
            viewAllLabel={showViewAll ? t("common.viewAll") : undefined}
            onViewAllClick={showViewAll ? onViewAll : undefined}
            items={section.items}
            slidesPerView={sliderPreset.slidesPerView}
            breakpoints={sliderPreset.breakpoints}
            spaceBetween={sliderPreset.spaceBetween}
            sectionBackgroundColor={getSectionBandBackground(section, isDarkTheme, flashSaleEndDate)}
            edgeToEdgeSectionBackground={edgeToEdgeSectionBackgrounds}
            className={sectionClassName}
            removeVerticalSpacing={removeSectionVerticalSpacing}
            {...getSectionRowProps(section, cardVariant)}
            renderItem={(item) => {
                if (isProductItem(item)) {
                    const hasDiscount = hasProductDiscount(item);
                    const discountLabel = getDiscountBadgeLabel(item, section);
                    const isFav = isFavoriteFor(item.id, item.is_favorite);

                    // Flash-sale rows use a dedicated campaign card, not the shared one.
                    if (flashSaleEndDate) {
                        return (
                            <FlashSaleCard
                                key={item.id}
                                id={item.id}
                                name={item.name}
                                description={item.description ?? undefined}
                                image={item.image}
                                price={
                                    item.price_after_discount_formatted ??
                                    `${item.price_after_discount}`
                                }
                                originalPrice={
                                    hasDiscount && item.price
                                        ? item.price_formatted ?? `${item.price}`
                                        : undefined
                                }
                                savings={
                                    item.amount_saved > 0
                                        ? item.amount_saved_formatted ??
                                          `${item.amount_saved}`
                                        : undefined
                                }
                                discountLabel={discountLabel ?? undefined}
                                rating={item.rating || 0}
                                sold={item.sold_number}
                                isFavorite={isFav}
                                mainColor={mainColor}
                                secondColor={secondColor}
                                t={t}
                                onClick={() => onItemClick(item)}
                                onToggleFavorite={(id) =>
                                    onToggleFavorite(id, isFav)
                                }
                            />
                        );
                    }

                    const discountBadges: ProductCardBadge[] = discountLabel
                        ? [
                              {
                                  label: discountLabel,
                                  className: "bg-red-500 text-white",
                                  rawLabel: true,
                                  align: "left",
                              },
                          ]
                        : [];

                    const fromApi =
                        mapApiTopBadgesToProductCard(
                            item.top_badges?.length ? item.top_badges : item.budges
                        ) ?? [];

                    const topMerged = [...discountBadges, ...fromApi];
                    const badge = topMerged.length ? topMerged : undefined;

                    return (
                        <ProductCard
                            key={item.id}
                            id={item.id}
                            name={item.name}
                            description={item.description ?? undefined}
                            store=""
                            price={
                                item.price_after_discount_formatted ??
                                `${item.price_after_discount}`
                            }
                            originalPrice={
                                hasDiscount && item.price
                                    ? item.price_formatted ?? `${item.price}`
                                    : undefined
                            }
                            rating={item.rating || 0}
                            image={item.image}
                            badge={badge}
                            bottomBadges={mapApiBottomBadgesToProductCard(
                                item.bottom_badges
                            )}
                            category={item.category}
                            sold={item.sold_number}
                            savings={item.amount_saved_formatted ?? undefined}
                            layout={cardVariant}
                            surfaceColor={surfaceColor}
                            surfaceGradient={surfaceGradient}
                            t={t}
                            isFavorite={isFav}
                            onClick={() => onItemClick(item)}
                            onToggleFavorite={(id) => onToggleFavorite(id, isFav)}
                        />
                    );
                }
                // Fallback for backward compatibility
                const data = getItemData(item) as any;
                const hasDiscount = data.discount && parseFloat(data.discount) > 0;
                const isFav = isFavoriteFor(data.id, data.is_favorite);

                const discountBadgesFb: ProductCardBadge[] = hasDiscount
                    ? [
                          {
                              label: `-${data.discount}%`,
                              className: "bg-red-500 text-white",
                              rawLabel: true,
                              align: "left",
                          },
                      ]
                    : [];

                const fromApiFb =
                    mapApiTopBadgesToProductCard(
                        data.top_badges?.length ? data.top_badges : data.budges
                    ) ?? [];

                const topMergedFb = [...discountBadgesFb, ...fromApiFb];
                const badgeFb = topMergedFb.length ? topMergedFb : undefined;

                return (
                    <ProductCard
                        key={data.id}
                        id={data.id}
                        name={data.name || data.desc || data.title || ""}
                        description={data.description ?? data.desc ?? undefined}
                        store={(data.vendor as string) ?? ""}
                        price={
                            data.price_after_discount_formatted ??
                            (data.price_after_discount
                                ? `${data.price_after_discount}`
                                : `${data.price || 0}`)
                        }
                        originalPrice={
                            hasDiscount && data.price
                                ? data.price_formatted ?? `${data.price}`
                                : undefined
                        }
                        rating={data.rating || 0}
                        image={data.image || ""}
                        badge={badgeFb}
                        bottomBadges={mapApiBottomBadgesToProductCard(
                            data.bottom_badges
                        )}
                        category={data.category}
                        sold={
                            typeof data.sold_number === "number"
                                ? data.sold_number
                                : typeof data.sold === "number"
                                  ? data.sold
                                  : undefined
                        }
                        savings={
                            (data.amount_saved_formatted as string) ??
                            (typeof data.amount_saved === "number"
                                ? `${data.amount_saved}`
                                : undefined)
                        }
                        layout={cardVariant}
                        surfaceColor={surfaceColor}
                        surfaceGradient={surfaceGradient}
                        t={t}
                        isFavorite={isFav}
                        onClick={() => onItemClick(item)}
                        onToggleFavorite={(id) => onToggleFavorite(id, isFav)}
                    />
                );
            }}
        />
    );
}

function RecipeSection({
    section,
    isDarkTheme = false,
    showViewAll,
    onViewAll,
    onItemClick,
    t,
    edgeToEdgeSectionBackgrounds,
    sectionClassName,
    removeSectionVerticalSpacing,
    isFavoriteFor,
    onToggleFavorite,
}: SectionPropsWithFavorites) {
    const cardVariant = getSectionCardVariant(section);
    const sliderPreset = getSliderPresetForSection(cardVariant);
    const surfaceColor = isDarkTheme ? getDarkCardSurface() : getSectionCardSurfaceColor(section);
    const surfaceGradient = isDarkTheme ? getDarkCardSurfaceGradient() : undefined;
    const flashSaleEndDate = getFlashSaleEndDate(section.end_date);
    const { mainColor, secondColor } = getFlashSaleColors();
    const flashHeadline = getFlashSaleHeadline(section, flashSaleEndDate, t);

    return (
        <SliderSection
            title={section.name}
            flashSaleEndDate={flashSaleEndDate}
            flashSaleMainColor={mainColor}
            flashSaleSecondColor={secondColor}
            flashSaleDiscountLabel={flashHeadline.discountLabel}
            flashSaleFastDiscountsLabel={flashHeadline.fastDiscountsLabel}
            viewAllLabel={showViewAll ? t("common.viewAll") : undefined}
            onViewAllClick={showViewAll ? onViewAll : undefined}
            items={section.items}
            slidesPerView={sliderPreset.slidesPerView}
            breakpoints={sliderPreset.breakpoints}
            spaceBetween={sliderPreset.spaceBetween}
            sectionBackgroundColor={getSectionBandBackground(section, isDarkTheme, flashSaleEndDate)}
            edgeToEdgeSectionBackground={edgeToEdgeSectionBackgrounds}
            className={sectionClassName}
            removeVerticalSpacing={removeSectionVerticalSpacing}
            {...getSectionRowProps(section, cardVariant)}
            renderItem={(item) => {
                if (isRecipeItem(item)) {
                    const hasDiscount = item.discount && parseFloat(item.discount) > 0;
                    const isFav = isFavoriteFor(item.id, item.is_favorite);

                    const discountBadges: ProductCardBadge[] = hasDiscount
                        ? [
                              {
                                  label: `-${item.discount}%`,
                                  className: "bg-red-500 text-white",
                                  rawLabel: true,
                                  align: "left",
                              },
                          ]
                        : [];

                    const fromApi =
                        mapApiTopBadgesToProductCard(
                            item.top_badges?.length ? item.top_badges : item.budges
                        ) ?? [];

                    const topMerged = [...discountBadges, ...fromApi];
                    const badge = topMerged.length ? topMerged.slice(0, 1) : undefined;

                    return (
                        <ProductCard
                            key={item.id}
                            id={item.id}
                            name={item.name}
                            store=""
                            price={
                                item.price_after_discount_formatted ??
                                `${item.price_after_discount}`
                            }
                            originalPrice={
                                hasDiscount && item.price
                                    ? item.price_formatted ?? `${item.price}`
                                    : undefined
                            }
                            rating={item.rating || 0}
                            image={item.image}
                            badge={badge}
                            bottomBadges={mapApiBottomBadgesToProductCard(
                                item.bottom_badges
                            )}
                            sold={
                                item.sold !== undefined && item.sold > 0
                                    ? item.sold
                                    : undefined
                            }
                            layout={cardVariant}
                            surfaceColor={surfaceColor}
                            surfaceGradient={surfaceGradient}
                            t={t}
                            isFavorite={isFav}
                            onClick={() => onItemClick(item)}
                            onToggleFavorite={(id) => onToggleFavorite(id, isFav)}
                        />
                    );
                }
                // Fallback
                const data = getItemData(item) as any;
                const hasDiscount = data.discount && parseFloat(data.discount) > 0;
                const isFav = isFavoriteFor(data.id, data.is_favorite);

                const discountBadgesFb: ProductCardBadge[] = hasDiscount
                    ? [
                          {
                              label: `-${data.discount}%`,
                              className: "bg-red-500 text-white",
                              rawLabel: true,
                              align: "left",
                          },
                      ]
                    : [];

                const fromApiFb =
                    mapApiTopBadgesToProductCard(
                        data.top_badges?.length ? data.top_badges : data.budges
                    ) ?? [];

                const topMergedFb = [...discountBadgesFb, ...fromApiFb];
                const badgeFb = topMergedFb.length ? topMergedFb.slice(0, 1) : undefined;

                return (
                    <ProductCard
                        key={data.id}
                        id={data.id}
                        name={data.name || data.desc || data.title || ""}
                        store=""
                        price={
                            data.price_after_discount_formatted ??
                            (data.price_after_discount
                                ? `${data.price_after_discount}`
                                : `${data.price || 0}`)
                        }
                        originalPrice={
                            hasDiscount && data.price
                                ? data.price_formatted ?? `${data.price}`
                                : undefined
                        }
                        rating={data.rating || 0}
                        image={data.image || ""}
                        badge={badgeFb}
                        bottomBadges={mapApiBottomBadgesToProductCard(
                            data.bottom_badges
                        )}
                        sold={
                            typeof data.sold === "number" && data.sold > 0
                                ? data.sold
                                : undefined
                        }
                        layout={cardVariant}
                        surfaceColor={surfaceColor}
                        surfaceGradient={surfaceGradient}
                        t={t}
                        isFavorite={isFav}
                        onClick={() => onItemClick(item)}
                        onToggleFavorite={(id) => onToggleFavorite(id, isFav)}
                    />
                );
            }}
        />
    );
}

function BasketSection({
    section,
    isDarkTheme = false,
    showViewAll,
    onViewAll,
    onItemClick,
    t,
    edgeToEdgeSectionBackgrounds,
    sectionClassName,
    removeSectionVerticalSpacing,
    isFavoriteFor,
    onToggleFavorite,
}: SectionPropsWithFavorites) {
    const cardVariant = getSectionCardVariant(section);
    const displayTypeId = Number(section.display_type_id);
    const sliderPreset = getSliderPresetForSection(cardVariant);
    const surfaceColor = isDarkTheme ? getDarkCardSurface() : getSectionCardSurfaceColor(section);
    const surfaceGradient = isDarkTheme ? getDarkCardSurfaceGradient() : undefined;
    const flashSaleEndDate = getFlashSaleEndDate(section.end_date);
    const { mainColor, secondColor } = getFlashSaleColors();
    const flashHeadline = getFlashSaleHeadline(section, flashSaleEndDate, t);

    return (
        <SliderSection
            title={section.name}
            flashSaleEndDate={flashSaleEndDate}
            flashSaleMainColor={mainColor}
            flashSaleSecondColor={secondColor}
            flashSaleDiscountLabel={flashHeadline.discountLabel}
            flashSaleFastDiscountsLabel={flashHeadline.fastDiscountsLabel}
            viewAllLabel={showViewAll ? t("common.viewAll") : undefined}
            onViewAllClick={showViewAll ? onViewAll : undefined}
            items={section.items}
            slidesPerView={sliderPreset.slidesPerView}
            breakpoints={sliderPreset.breakpoints}
            spaceBetween={sliderPreset.spaceBetween}
            sectionBackgroundColor={getSectionBandBackground(section, isDarkTheme, flashSaleEndDate)}
            edgeToEdgeSectionBackground={edgeToEdgeSectionBackgrounds}
            className={sectionClassName}
            removeVerticalSpacing={removeSectionVerticalSpacing}
            {...getSectionRowProps(section, cardVariant)}
            renderItem={(item) => {
                if (isBasketItem(item)) {
                    const isScheduledBasket =
                        displayTypeId === DISPLAY_TYPE.SCHEDULED_BASKET;
                    const saveAmount =
                        item.saving > 0 ? `${t("baskets.save")} ${item.saving}` : undefined;
                    const savings =
                        item.original_price > 0 && item.saving > 0
                            ? `${t("baskets.youSave")} ${item.saving}`
                            : undefined;
                    const offerEndingDate =
                        item.is_on_offer && item.offer_ends_at
                            ? `${t("baskets.offerEnding")}: ${new Date(
                                item.offer_ends_at
                            ).toLocaleDateString()}`
                            : undefined;
                    const isFav = isFavoriteFor(item.id, item.is_favorite);

                    if (isScheduledBasket) {
                        return (
                            <ScheduledBasketCard
                                key={item.id}
                                item={item}
                                isFavorite={isFav}
                                t={t}
                                onClick={() => onItemClick(item)}
                                onToggleFavorite={onToggleFavorite}
                                isDarkTheme={isDarkTheme}
                            />
                        );
                    }

                    return (
                        <BasketCard
                            key={item.id}
                            id={item.id}
                            name={item.title || item.name || ""}
                            description={item.desc || ""}
                            price={`${item.final_price ?? item.price_after_discount ?? 0}`}
                            originalPrice={
                                item.original_price > 0 ? `${item.original_price}` : undefined
                            }
                            rating={item.rating}
                            image={item.image}
                            saveAmount={saveAmount}
                            badge={mapApiTopBadgesToProductCard(
                                item.top_badges?.length ? item.top_badges : item.budges
                            )}
                            savings={savings}
                            offerEndingDate={offerEndingDate}
                            bottomBadges={mapApiBottomBadgesToProductCard(
                                item.bottom_badges
                            )}
                            itemCount={item.items_count}
                            soldCount={item.num_sold}
                            layout={cardVariant}
                            surfaceColor={surfaceColor}
                            surfaceGradient={surfaceGradient}
                            mainColor={isDarkTheme ? null : (item.main_color ?? null)}
                            secondColor={isDarkTheme ? null : (item.second_color ?? null)}
                            textColor={isDarkTheme ? null : (item.text_color ?? null)}
                            isFavorite={isFav}
                            t={t}
                            onClick={() => onItemClick(item)}
                            onAddToCart={() => onItemClick(item)}
                            onToggleFavorite={(id) => onToggleFavorite(id, isFav)}
                        />
                    );
                }
                // Fallback for backward compatibility
                const data = getItemData(item) as any;
                const isFav = isFavoriteFor(data.id, data.is_favorite);
                return (
                    <BasketCard
                        key={data.id}
                        id={data.id}
                        name={data.title || data.name || ""}
                        description={data.desc || data.description || ""}
                        price={
                            data.price_after_discount
                                ? `${data.price_after_discount}`
                                : `${data.price || 0}`
                        }
                        originalPrice={
                            data.price &&
                                data.price_after_discount &&
                                data.price > data.price_after_discount
                                ? `${data.price}`
                                : undefined
                        }
                        image={data.image || ""}
                        badge={mapApiTopBadgesToProductCard(
                            data.top_badges?.length ? data.top_badges : data.budges
                        )}
                        bottomBadges={mapApiBottomBadgesToProductCard(
                            data.bottom_badges
                        )}
                        layout={cardVariant}
                        surfaceColor={surfaceColor}
                        surfaceGradient={surfaceGradient}
                        mainColor={isDarkTheme ? null : ((data.main_color as string) ?? null)}
                        secondColor={isDarkTheme ? null : ((data.second_color as string) ?? null)}
                        textColor={isDarkTheme ? null : ((data.text_color as string) ?? null)}
                        isFavorite={isFav}
                        t={t}
                        onClick={() => onItemClick(item)}
                        onAddToCart={() => onItemClick(item)}
                        onToggleFavorite={(id) => onToggleFavorite(id, isFav)}
                    />
                );
            }}
        />
    );
}

function ShopSection({
    section,
    isDarkTheme = false,
    showViewAll,
    onViewAll,
    onItemClick,
    t,
    edgeToEdgeSectionBackgrounds,
    sectionClassName,
    removeSectionVerticalSpacing,
    isFavoriteFor,
    onToggleFavorite,
}: SectionPropsWithFavorites) {
    const cardVariant = getSectionCardVariant(section);
    const sliderPreset = getSliderPresetForSection(cardVariant);
    const surfaceColor = isDarkTheme ? getDarkCardSurface() : getSectionCardSurfaceColor(section);
    const surfaceGradient = isDarkTheme ? getDarkCardSurfaceGradient() : undefined;
    const flashSaleEndDate = getFlashSaleEndDate(section.end_date);
    const { mainColor, secondColor } = getFlashSaleColors();

    return (
        <SliderSection
            title={section.name}
            flashSaleEndDate={flashSaleEndDate}
            flashSaleMainColor={mainColor}
            flashSaleSecondColor={secondColor}
            viewAllLabel={showViewAll ? t("common.viewAll") : undefined}
            onViewAllClick={showViewAll ? onViewAll : undefined}
            items={section.items}
            slidesPerView={sliderPreset.slidesPerView}
            breakpoints={sliderPreset.breakpoints}
            spaceBetween={sliderPreset.spaceBetween}
            sectionBackgroundColor={getSectionBandBackground(section, isDarkTheme, flashSaleEndDate)}
            edgeToEdgeSectionBackground={edgeToEdgeSectionBackgrounds}
            className={sectionClassName}
            removeVerticalSpacing={removeSectionVerticalSpacing}
            {...getSectionRowProps(section, cardVariant)}
            renderItem={(item) => {
                const shopCardData = mapSectionItemToShopCardData(item);
                if (!shopCardData) return null;

                const isFav = isFavoriteFor(shopCardData.id, shopCardData.isFavorite);

                return (
                    <ShopCard
                        key={shopCardData.id}
                        id={shopCardData.id}
                        name={shopCardData.name}
                        description={shopCardData.description}
                        image={shopCardData.image}
                        isOpenNow={shopCardData.isOpenNow}
                        badge={shopCardData.badge}
                        rating={shopCardData.rating}
                        address={shopCardData.address}
                        isServiceProvider={shopCardData.isServiceProvider}
                        isRestaurant={shopCardData.isRestaurant}
                        pricingTier={shopCardData.pricingTier}
                        paymentMethods={shopCardData.paymentMethods}
                        deliveryPrice={shopCardData.deliveryPrice}
                        discountLabel={shopCardData.discountLabel}
                        bottomBadges={shopCardData.bottomBadges}
                        layout={cardVariant}
                        surfaceColor={surfaceColor}
                        surfaceGradient={surfaceGradient}
                        isFavorite={isFav}
                        onFavorite={(id) => onToggleFavorite(Number(id), isFav)}
                        onClick={() => onItemClick(shopCardData.sourceItem)}
                    />
                );
            }}
        />
    );
}

function BrandSection({
    section,
    isDarkTheme = false,
    showViewAll,
    onViewAll,
    onItemClick,
    t,
    edgeToEdgeSectionBackgrounds,
    brandDefaultsWhenApiMissing,
    sectionClassName,
    removeSectionVerticalSpacing,
}: SectionProps) {
    const cardVariant = getSectionCardVariant(section);
    const sliderPreset = getSliderPresetForSection(cardVariant);
    const surfaceColor = isDarkTheme
        ? getDarkCardSurface()
        : (getSectionCardSurfaceColor(section) ??
            brandDefaultsWhenApiMissing?.cardSurface ??
            null);
    const surfaceGradient = isDarkTheme ? getDarkCardSurfaceGradient() : undefined;
    const flashSaleEndDate = getFlashSaleEndDate(section.end_date);
    const { mainColor, secondColor } = getFlashSaleColors();
    const sectionBgFallback = isDarkTheme
        ? getDarkSectionBackground()
        : (brandDefaultsWhenApiMissing?.sectionBackground ?? "var(--color-api-second)");

    return (
        <SliderSection
            title={section.name}
            flashSaleEndDate={flashSaleEndDate}
            flashSaleMainColor={mainColor}
            flashSaleSecondColor={secondColor}
            viewAllLabel={showViewAll ? t("common.viewAll") : undefined}
            onViewAllClick={showViewAll ? onViewAll : undefined}
            items={section.items}
            slidesPerView={sliderPreset.slidesPerView}
            breakpoints={sliderPreset.breakpoints}
            spaceBetween={sliderPreset.spaceBetween}
            sectionBackgroundColor={
                isDarkTheme ? sectionBgFallback : (section.background_color ?? sectionBgFallback)
            }
            edgeToEdgeSectionBackground={edgeToEdgeSectionBackgrounds}
            className={sectionClassName}
            removeVerticalSpacing={removeSectionVerticalSpacing}
            {...getSectionRowProps(section, cardVariant)}
            renderItem={(item) => {
                if (isBrandItem(item)) {
                    return (
                        <BrandCardWithRating
                            key={item.id}
                            item={item}
                            onClick={() => onItemClick(item)}
                            layout={cardVariant}
                            surfaceColor={surfaceColor}
                            surfaceGradient={surfaceGradient}
                        />
                    );
                }
                const data = getItemData(item);
                const d = data as {
                    id: number;
                    name?: string;
                    title?: string;
                    image?: string;
                    rating?: number;
                    average_rating?: number;
                    orders_count?: number;
                    top_badges?: SectionItemBadge[];
                    bottom_badges?: SectionItemBadge[];
                    budges?: SectionItemBadge[];
                };
                return (
                    <BrandCardWithRating
                        key={data.id}
                        item={{
                            id: d.id,
                            name: d.name || d.title || "",
                            image: d.image || "",
                            rating: d.rating,
                            average_rating: d.average_rating,
                            orders_count: d.orders_count,
                            top_badges: d.top_badges,
                            bottom_badges: d.bottom_badges,
                            budges: d.budges,
                        }}
                        onClick={() => onItemClick(item)}
                        layout={cardVariant}
                        surfaceColor={surfaceColor}
                        surfaceGradient={surfaceGradient}
                    />
                );
            }}
        />
    );
}

/** Defers rendering children until the placeholder enters the viewport.
 *  The first `eager` sections render immediately (above the fold). */
function LazySection({
    children,
    eager = false,
}: {
    children: React.ReactNode;
    eager?: boolean;
}) {
    const ref = useRef<HTMLDivElement | null>(null);
    const [visible, setVisible] = useState(eager);

    useEffect(() => {
        const el = ref.current;
        if (!el || visible) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setVisible(true);
                    observer.disconnect();
                }
            },
            { rootMargin: "300px" }
        );

        observer.observe(el);
        return () => observer.disconnect();
    }, [visible]);

    if (visible) return <>{children}</>;

    return <div ref={ref} className="min-h-[200px]" />;
}
