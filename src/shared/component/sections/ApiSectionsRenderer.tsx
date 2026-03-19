import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuthStore } from "@/store/auth";
import { useFavorites, useToggleFavorite } from "@/features/account/hooks/useFavorites";
import SliderSection from "../slider/core/SliderSection";
import ProductCard from "../card/ProductCard";
import BrandCard from "../card/BrandCard";
import BasketCard from "../card/BasketCard";
import ShopCard from "../card/ShopCard";
import PromotionalBannerCard from "../banner/PromotionalBannerCard";
import PromotionalHeroSlider from "../banner/PromotionalHeroSlider";
import type {
    Section,
    SectionItem,
    SectionItemManual,
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

type ApiSectionsRendererProps = {
    sections: Section[];
};

// Helper to check if item is manual type
function isManualItem(item: SectionItem): item is SectionItemManual {
    return "item" in item && "link" in item;
}

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

// Helper to get item data regardless of type
function getItemData(item: SectionItem) {
    if (isManualItem(item)) {
        return item.item;
    }
    return item;
}

// Display type constants
const DISPLAY_TYPES = {
    BANNER: 1,
    PRODUCT: 2,
    SHOP: 3,
    BASKET: 4,
    BRAND: 6,
    RECIPE: 7,
} as const;

export default function ApiSectionsRenderer({
    sections,
}: ApiSectionsRendererProps) {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const authenticated = useAuthStore((s) => s.authenticated);
    const { data: favoriteProducts = [] } = useFavorites("product", false);
    const { data: favoriteRecipes = [] } = useFavorites("recipe", false);
    const { data: favoriteBaskets = [] } = useFavorites("basket", false);
    const { data: favoriteShops = [] } = useFavorites("shop", false);
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
            navigate(item.link);
        } else if (section.action?.page_slug) {
            const itemData = getItemData(item);
            const route = mapActionPageSlugToRoute(
                section.action.page_slug,
                itemData.id
            );
            navigate(route);
        }
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
            {sections.map((section) => (
                <SectionByDisplayType
                    key={section.id}
                    section={section}
                    onViewAll={() => handleViewAll(section)}
                    onItemClick={(item) => handleItemClick(section, item)}
                    t={t}
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
            ))}
        </>
    );
}

type SectionByDisplayTypeProps = {
    section: Section;
    onViewAll: () => void;
    onItemClick: (item: SectionItem) => void;
    t: (key: string) => string;
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
    section,
    onViewAll,
    onItemClick,
    t,
    productIsFavoriteFor,
    recipeIsFavoriteFor,
    basketIsFavoriteFor,
    shopIsFavoriteFor,
    onToggleProductFavorite,
    onToggleRecipeFavorite,
    onToggleBasketFavorite,
    onToggleShopFavorite,
}: SectionByDisplayTypeProps) {
    const showViewAll = section.type === "api" && section.see_more;

    switch (section.display_type_id) {
        case DISPLAY_TYPES.BANNER:
            return (
                <BannerSection
                    section={section}
                    showViewAll={showViewAll}
                    onViewAll={onViewAll}
                    onItemClick={onItemClick}
                    t={t}
                />
            );

        case DISPLAY_TYPES.PRODUCT:
            return (
                <ProductSection
                    section={section}
                    showViewAll={showViewAll}
                    onViewAll={onViewAll}
                    onItemClick={onItemClick}
                    t={t}
                    isFavoriteFor={productIsFavoriteFor}
                    onToggleFavorite={onToggleProductFavorite}
                />
            );

        case DISPLAY_TYPES.SHOP:
            return (
                <ShopSection
                    section={section}
                    showViewAll={showViewAll}
                    onViewAll={onViewAll}
                    onItemClick={onItemClick}
                    t={t}
                    isFavoriteFor={shopIsFavoriteFor}
                    onToggleFavorite={onToggleShopFavorite}
                />
            );

        case DISPLAY_TYPES.BASKET:
            return (
                <BasketSection
                    section={section}
                    showViewAll={showViewAll}
                    onViewAll={onViewAll}
                    onItemClick={onItemClick}
                    t={t}
                    isFavoriteFor={basketIsFavoriteFor}
                    onToggleFavorite={onToggleBasketFavorite}
                />
            );

        case DISPLAY_TYPES.BRAND:
            return (
                <BrandSection
                    section={section}
                    showViewAll={showViewAll}
                    onViewAll={onViewAll}
                    onItemClick={onItemClick}
                    t={t}
                />
            );

        case DISPLAY_TYPES.RECIPE:
            return (
                <RecipeSection
                    section={section}
                    showViewAll={showViewAll}
                    onViewAll={onViewAll}
                    onItemClick={onItemClick}
                    t={t}
                    isFavoriteFor={recipeIsFavoriteFor}
                    onToggleFavorite={onToggleRecipeFavorite}
                />
            );

        default:
            console.warn(
                `[ApiSectionsRenderer] Unknown display_type_id: ${section.display_type_id}`
            );
            return null;
    }
}

type SectionProps = {
    section: Section;
    showViewAll: boolean | any;
    onViewAll: () => void;
    onItemClick: (item: SectionItem) => void;
    t: (key: string) => string;
};

type SectionPropsWithFavorites = SectionProps & {
    /** Computed isFavorite checker — already aware of optimistic overrides */
    isFavoriteFor: (id: number, itemIsFavorite?: boolean) => boolean;
    /** Must receive current isFavorite so the handler can flip optimistically */
    onToggleFavorite: (id: number, currentIsFavorite: boolean) => void;
};

function BannerSection({
    section,
    showViewAll,
    onViewAll,
    onItemClick,
    t,
}: SectionProps) {
    // If only one item, show promotional banner with container
    if (section.items.length === 1) {
        const item = section.items[0];
        const itemData = getItemData(item);
        const link = isManualItem(item) ? item.link : undefined;

        return (
            <div className="w-full">
                {showViewAll && section.name && (
                    <div className="page-container mb-4 flex items-center justify-between">
                        <h2 className="text-2xl font-bold text-custom-primary">
                            {section.name}
                        </h2>
                        <button
                            onClick={onViewAll}
                            className="text-primary-light hover:underline text-sm font-medium"
                        >
                            عرض الكل
                        </button>
                    </div>
                )}
                <div className="page-container">
                    <PromotionalBannerCard
                        item={itemData as any}
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
        <div className="page-container">
            {showViewAll && section.name && (
                <div className="mb-4 flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-custom-primary">
                        {section.name}
                    </h2>
                    <button
                        onClick={onViewAll}
                        className="text-primary-light hover:underline text-sm font-medium"
                    >
                        {t("common.viewAll")}
                    </button>
                </div>
            )}
            <PromotionalHeroSlider
                items={section.items}
                getLink={(item) => (isManualItem(item) ? item.link : undefined)}
                onItemClick={onItemClick}
            />
        </div>
    );
}

function ProductSection({
    section,
    showViewAll,
    onViewAll,
    onItemClick,
    t,
    isFavoriteFor,
    onToggleFavorite,
}: SectionPropsWithFavorites) {
    return (
        <SliderSection
            title={section.name}
            viewAllLabel={showViewAll ? t("common.viewAll") : undefined}
            onViewAllClick={showViewAll ? onViewAll : undefined}
            items={section.items}
            breakpoints={{
                640: { slidesPerView: 2 },
                768: { slidesPerView: 3 },
                1024: { slidesPerView: 4 },
            }}
            renderItem={(item) => {
                if (isProductItem(item)) {
                    const hasDiscount = item.discount && parseFloat(item.discount) > 0;
                    const topBadge =
                        item.top_badges?.[0] ??
                        item.budges?.find(
                            (b) => b.postion === "top" || b.position === "top"
                        );
                    const isFav = isFavoriteFor(item.id, item.is_favorite);

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
                            badge={
                                hasDiscount
                                    ? {
                                        label: `-${item.discount}%`,
                                        className: "bg-red-500",
                                    }
                                    : topBadge
                                        ? {
                                            label: topBadge.name,
                                            className: `bg-${topBadge.color}-500`,
                                        }
                                        : undefined
                            }
                            isFavorite={isFav}
                            onClick={() => onItemClick(item)}
                            onToggleFavorite={(id) => onToggleFavorite(id, isFav)}
                        />
                    );
                }
                // Fallback for backward compatibility
                const data = getItemData(item) as any;
                const hasDiscount = data.discount && parseFloat(data.discount) > 0;
                const topBadge = (data.top_badges as any[])?.[0] ?? data.budges?.[0];
                const isFav = isFavoriteFor(data.id, data.is_favorite);

                console.log(data);

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
                        badge={
                            hasDiscount
                                ? { label: `-${data.discount}%`, className: "bg-red-500" }
                                : topBadge
                                    ? {
                                        label: topBadge.name,
                                        className: `bg-${topBadge.color}-500`,
                                    }
                                    : undefined
                        }
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
    showViewAll,
    onViewAll,
    onItemClick,
    t,
    isFavoriteFor,
    onToggleFavorite,
}: SectionPropsWithFavorites) {
    return (
        <SliderSection
            title={section.name}
            viewAllLabel={showViewAll ? t("common.viewAll") : undefined}
            onViewAllClick={showViewAll ? onViewAll : undefined}
            items={section.items}
            breakpoints={{
                640: { slidesPerView: 2 },
                768: { slidesPerView: 3 },
                1024: { slidesPerView: 4 },
            }}
            renderItem={(item) => {
                if (isRecipeItem(item)) {
                    const hasDiscount = item.discount && parseFloat(item.discount) > 0;
                    const topBadge =
                        item.top_badges?.[0] ??
                        item.budges?.find(
                            (b) => b.postion === "top" || b.position === "top"
                        );
                    const isFav = isFavoriteFor(item.id, item.is_favorite);

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
                            badge={
                                hasDiscount
                                    ? {
                                        label: `-${item.discount}%`,
                                        className: "bg-red-500",
                                    }
                                    : topBadge
                                        ? {
                                            label: topBadge.name,
                                            className: `bg-${topBadge.color}-500`,
                                        }
                                        : undefined
                            }
                            isFavorite={isFav}
                            onClick={() => onItemClick(item)}
                            onToggleFavorite={(id) => onToggleFavorite(id, isFav)}
                        />
                    );
                }
                // Fallback
                const data = getItemData(item) as any;
                const hasDiscount = data.discount && parseFloat(data.discount) > 0;
                const topBadge = (data.top_badges as any[])?.[0] ?? data.budges?.[0];
                const isFav = isFavoriteFor(data.id, data.is_favorite);

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
                        badge={
                            hasDiscount
                                ? { label: `-${data.discount}%`, className: "bg-red-500" }
                                : topBadge
                                    ? {
                                        label: topBadge.name,
                                        className: `bg-${topBadge.color}-500`,
                                    }
                                    : undefined
                        }
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
    showViewAll,
    onViewAll,
    onItemClick,
    t,
    isFavoriteFor,
    onToggleFavorite,
}: SectionPropsWithFavorites) {
    return (
        <SliderSection
            title={section.name}
            viewAllLabel={showViewAll ? t("common.viewAll") : undefined}
            onViewAllClick={showViewAll ? onViewAll : undefined}
            items={section.items}
            breakpoints={{
                640: { slidesPerView: 1.2 },
                768: { slidesPerView: 2 },
                1024: { slidesPerView: 3 },
            }}
            renderItem={(item) => {
                if (isBasketItem(item)) {
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
                            savings={savings}
                            offerEndingDate={offerEndingDate}
                            isFavorite={isFav}
                            onClick={() => onItemClick(item)}
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
                        isFavorite={isFav}
                        onClick={() => onItemClick(item)}
                        onToggleFavorite={(id) => onToggleFavorite(id, isFav)}
                    />
                );
            }}
        />
    );
}

function ShopSection({
    section,
    showViewAll,
    onViewAll,
    onItemClick,
    t,
    isFavoriteFor,
    onToggleFavorite,
}: SectionPropsWithFavorites) {
    return (
        <SliderSection
            title={section.name}
            viewAllLabel={showViewAll ? t("common.viewAll") : undefined}
            onViewAllClick={showViewAll ? onViewAll : undefined}
            items={section.items}
            breakpoints={{
                640: { slidesPerView: 1.2 },
                768: { slidesPerView: 2 },
                1024: { slidesPerView: 3 },
            }}
            renderItem={(item) => {
                if (isShopItem(item)) {
                    const isFav = isFavoriteFor(item.id, item.is_favorite);
                    return (
                        <ShopCard
                            key={item.id}
                            id={item.id}
                            name={item.name}
                            description={item.description}
                            image={item.image ?? item.logo_url}
                            isOpenNow={item.is_open_now}
                            rating={item.average_rating}
                            deliveryPrice={item.delivery_price}
                            discountLabel={item.discount_label}
                            isFavorite={isFav}
                            onFavorite={(id) => onToggleFavorite(Number(id), isFav)}
                            onClick={() => onItemClick(item)}
                        />
                    );
                }
                const data = getItemData(item) as unknown as Record<string, unknown>;
                const isFav = isFavoriteFor(
                    data.id as number,
                    data.is_favorite as boolean | undefined
                );
                return (
                    <ShopCard
                        key={data.id as number}
                        id={data.id as number}
                        name={(data.name as string) ?? ""}
                        description={(data.description as string) ?? null}
                        image={(data.image as string) ?? (data.logo_url as string) ?? null}
                        isOpenNow={(data.is_open_now as boolean) ?? false}
                        rating={(data.average_rating as number) ?? 0}
                        deliveryPrice={(data.delivery_price as string | number) ?? null}
                        discountLabel={(data.discount_label as string) ?? null}
                        isFavorite={isFav}
                        onFavorite={(id) => onToggleFavorite(Number(id), isFav)}
                        onClick={() => onItemClick(item)}
                    />
                );
            }}
        />
    );
}

function BrandSection({
    section,
    showViewAll,
    onViewAll,
    onItemClick,
    t,
}: SectionProps) {
    return (
        <SliderSection
            title={section.name}
            viewAllLabel={showViewAll ? t("common.viewAll") : undefined}
            onViewAllClick={showViewAll ? onViewAll : undefined}
            items={section.items}
            breakpoints={{
                640: { slidesPerView: 2.5 },
                768: { slidesPerView: 3.5 },
                1024: { slidesPerView: 6 },
            }}
            renderItem={(item) => {
                if (isBrandItem(item)) {
                    return (
                        <BrandCard
                            key={item.id}
                            name={item.name}
                            image={item.image}
                            rating={0}
                            onClick={() => onItemClick(item)}
                        />
                    );
                }
                // Fallback for backward compatibility
                const data = getItemData(item);
                return (
                    <BrandCard
                        key={data.id}
                        name={(data as any).name || (data as any).title || ""}
                        image={data.image || ""}
                        rating={0}
                        onClick={() => onItemClick(item)}
                    />
                );
            }}
        />
    );
}
