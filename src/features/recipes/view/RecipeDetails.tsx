import { useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useLanguage } from "@/context/LanguageContext";
import { toast } from "sonner";
import { useRecipeDetails, useRecipeRatings } from "../hooks/useRecipes";
import { useSectionsByPosition } from "@/features/home/hooks/useSections";
import ApiSectionsRenderer from "@/shared/component/sections/ApiSectionsRenderer";
import FullBleedSection from "@/shared/component/FullBleedSection";
import Rating from "@/shared/component/Rating";
import Badge from "@/shared/component/Badge";
import ProductReviews from "@/shared/component/ProductReviews";
import Button from "@/shared/ui/Button";
import ProductItemsTable, { type ProductItemData } from "@/shared/component/table/ProductItemsTable";
import {
    HiPlay,
    HiClock,
    HiUserGroup,
    HiShoppingCart,
    HiChevronDown,
    HiFire,
} from "react-icons/hi2";
import { cn } from "@/shared/lib/utils";
import FavoriteButton from "@/shared/component/FavoriteButton";
import { useToggleFavorite } from "@/features/account/hooks/useFavorites";
import { useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/utils/queryKeys";
import { useCartStore } from "@/store/cart";
import { useAuthStore } from "@/store/auth";
import { RatingFormModal } from "@/features/account/components";
import type { RecipeItem } from "../types";

const recipeCardGradient =
    "bg-gradient-to-b from-[#E4F0FB] to-[#E5F3FF] dark:from-[#1a2332] dark:to-[#1e293b]";
const recipeCardShadow =
    "shadow-[0_4px_6px_-4px_rgba(0,174,209,0.1),0_10px_15px_-3px_rgba(0,174,209,0.1)]";

function badgeTagClassName(color: string | null | undefined): string {
    switch (color) {
        case "success":
            return "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300";
        case "warning":
            return "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-200";
        case "danger":
            return "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300";
        default:
            return "bg-cyan-100 text-cyan-800 dark:bg-cyan-900/40 dark:text-cyan-200";
    }
}

const stepNumberBadgeClass =
    "flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-b from-[#4CDAF6] to-[#2C8090] text-sm font-bold text-white shadow-sm";

export default function RecipeDetails() {
    const { t } = useTranslation();
    const { isRTL } = useLanguage();
    const { id } = useParams<{ id: string }>();
    const recipeId = parseInt(id || "0", 10);

    const { data: recipe, isLoading, error } = useRecipeDetails(recipeId);
    const {
        reviews: recipeReviews,
        averageRating: reviewsAverage,
        totalReviews: reviewsTotal,
        ratingDistribution: reviewsDistribution,
        isLoading: isRatingsLoading,
        observerTarget,
        isFetchingNextPage,
    } = useRecipeRatings(recipeId);

    const { beforeSections, afterSections } =
        useSectionsByPosition("recipe_details");

    // State for ingredient quantities and selected variants
    const [quantities, setQuantities] = useState<Record<number, number>>({});
    const [selectedVariants, setSelectedVariants] = useState<
        Record<number, number>
    >({});
    const [ratingModalOpen, setRatingModalOpen] = useState(false);

    const token = useAuthStore((s) => s.token);
    const queryClient = useQueryClient();
    const toggleFavorite = useToggleFavorite();
    const addRecipe = useCartStore((s) => s.addRecipe);

    const handleToggleFavorite = () => {
        toggleFavorite.mutate(
            { type: "recipe", id: recipeId },
            {
                onSuccess: () => {
                    queryClient.invalidateQueries({ queryKey: queryKeys.recipes.details(recipeId) });
                },
            }
        );
    };

    // Separate banner sections (display_type_id: 1) from other sections
    const bannerSections = beforeSections.filter((s) => s.display_type_id === 1);
    const otherBeforeSections = beforeSections.filter(
        (s) => s.display_type_id !== 1
    );

    const getQuantity = (index: number, defaultQty: number) => {
        return quantities[index] ?? defaultQty;
    };

    // Helper: get selected variant (main_item or alternative) for a recipe item
    const getSelectedVariant = (
        item: RecipeItem,
        selectedId: number | undefined
    ) => {
        if (selectedId === item.main_item.shop_product_variant_id)
            return item.main_item;
        const alt = item.alternatives.find(
            (a) => a.shop_product_variant_id === selectedId
        );
        return alt ?? item.main_item;
    };

    // Convert recipe items to ProductItemData format
    const recipeItems = useMemo<ProductItemData[]>(() => {
        if (!recipe?.items) return [];

        return recipe.items.map((item, index) => {
            const qty = getQuantity(index, item.terms.default_quantity);
            const selectedId =
                selectedVariants[index] ?? item.main_item.shop_product_variant_id;
            const selectedVariant = getSelectedVariant(item, selectedId);
            const itemTotal = selectedVariant.price * qty;

            const mainAsVariant = {
                id: item.main_item.shop_product_variant_id,
                name: item.main_item.name,
            };
            const altVariants = item.alternatives.map((alt) => ({
                id: alt.shop_product_variant_id,
                name: alt.name,
            }));
            const variants = [mainAsVariant, ...altVariants];

            const variantLabel = (selectedVariant as { variant?: string[] }).variant
                ?.join(", ");
            const variantArray = (selectedVariant as { variant?: string[] }).variant;

            return {
                id: index,
                name: item.main_item.name,
                image: selectedVariant.image_url ?? undefined,
                quantity: qty,
                unit_price: selectedVariant.price,
                subtotal: itemTotal,
                min_quantity: item.terms.min_quantity,
                max_quantity: item.terms.max_quantity,
                can_adjust: true,
                variants: variants.length > 1 ? variants : undefined,
                selectedVariantId: selectedId,
                variantLabel,
                variant: variantArray,
            };
        });
    }, [recipe?.items, quantities, selectedVariants]);

    const itemsSubtotalNumeric = useMemo(
        () => recipeItems.reduce((sum, row) => sum + row.subtotal, 0),
        [recipeItems]
    );

    const selectionMatchesApiDefaults = useMemo(() => {
        if (!recipe?.items?.length) return true;
        return recipe.items.every((item, i) => {
            const q = getQuantity(i, item.terms.default_quantity);
            const sid =
                selectedVariants[i] ?? item.main_item.shop_product_variant_id;
            return (
                q === item.terms.default_quantity &&
                sid === item.main_item.shop_product_variant_id
            );
        });
    }, [recipe?.items, quantities, selectedVariants]);

    // Handle quantity change from ProductItemsTable
    const handleItemQuantityChange = (itemId: number, newQuantity: number) => {
        if (!recipe?.items) return;
        const item = recipe.items[itemId];
        if (!item) return;

        setQuantities((prev) => ({
            ...prev,
            [itemId]: newQuantity,
        }));
    };

    // Handle variant change from ProductItemsTable
    const handleItemVariantChange = (itemId: number, variantId: number | string) => {
        setSelectedVariants((prev) => ({
            ...prev,
            [itemId]: Number(variantId),
        }));
    };

    // Handle remove item from ProductItemsTable
    const handleRemoveItem = (itemId: number) => {
        // TODO: Implement remove item logic if needed
        console.log("Remove item:", itemId);
    };

    const handleAddAllToCart = () => {
        if (!recipe?.items?.length || !recipeItems.length) return;

        const items = recipe.items.map((item, index) => {
            const qty = getQuantity(index, item.terms.default_quantity);
            const selectedId =
                selectedVariants[index] ?? item.main_item.shop_product_variant_id;
            const selectedVariant = getSelectedVariant(item, selectedId);
            return {
                shop_product_variant_id: selectedVariant.shop_product_variant_id,
                quantity: qty,
                name: selectedVariant.name,
                image: selectedVariant.image_url ?? "",
                priceNumeric: selectedVariant.price,
                storeId: 0,
            };
        });

        if (items.some((i) => !i.shop_product_variant_id || Number.isNaN(i.shop_product_variant_id))) {
            toast.error(t("recipes.invalidRecipeItems", "Some ingredients are invalid."));
            return;
        }

        addRecipe({ recipe_id: recipe.id, items });
        toast.success(t("cart.addedToCart", "Added to cart"));
    };

    // Loading state
    if (isLoading) {
        return (
            <div
                className="min-h-screen bg-custom-primary flex items-center justify-center"
                dir={isRTL ? "rtl" : "ltr"}
            >
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-light"></div>
            </div>
        );
    }

    // Error state
    if (error || !recipe) {
        return (
            <div
                className="min-h-screen bg-custom-primary flex items-center justify-center"
                dir={isRTL ? "rtl" : "ltr"}
            >
                <div className="text-center">
                    <p className="text-custom-primary text-lg">
                        {t("recipes.recipeNotFound")}
                    </p>
                </div>
            </div>
        );
    }

    const hasDiscount =
        (recipe.discount && parseFloat(recipe.discount) > 0) ||
        (recipe.totals != null && recipe.totals.discount_value > 0);

    const imageUrl = recipe.image.startsWith("http")
        ? recipe.image
        : `https://tickdash.tickmartsy.com/storage/${recipe.image}`;

    const currencySymbol = recipe.totals?.currency_symbol ?? "$";

    const topBadges = recipe.top_badges ?? [];
    const legacyBadges = [...(recipe.badges ?? []), ...(recipe.budges ?? [])];
    const tagBadges =
        recipe.bottom_badges && recipe.bottom_badges.length > 0
            ? recipe.bottom_badges
            : legacyBadges;

    return (
        <div className="min-h-screen bg-custom-primary" dir={isRTL ? "rtl" : "ltr"}>
            {/* Banner Sections - Full Width (display_type_id: 1) - BEFORE main content */}
            {bannerSections.length > 0 && (
                <div className="w-full">
                    <ApiSectionsRenderer sections={bannerSections} />
                </div>
            )}

            <div className="page-container py-6">
                {/* Recipe Hero Section — two-column layout (main card + shopping list) */}
                <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_min(100%,389px)] gap-6 mb-6 items-start">
                    {/* Left: Recipe card */}
                    <div
                        className={`overflow-hidden rounded-2xl ${recipeCardGradient} ${recipeCardShadow}`}
                    >
                        <div className="relative h-[min(22rem,55vw)] min-h-[200px] w-full">
                            {recipe.video_url ? (
                                <a
                                    href={recipe.video_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="group relative block h-full w-full cursor-pointer"
                                >
                                    <img
                                        src={imageUrl}
                                        alt={recipe.name}
                                        className="h-full w-full object-cover transition group-hover:opacity-95"
                                    />
                                    <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 transition group-hover:opacity-100">
                                        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-600 shadow-lg">
                                            <HiPlay className="ms-1 h-8 w-8 text-white" />
                                        </div>
                                    </div>
                                </a>
                            ) : (
                                <img
                                    src={imageUrl}
                                    alt={recipe.name}
                                    className="h-full w-full object-cover"
                                />
                            )}

                            {topBadges.length > 0 && (
                                <div
                                    className={`absolute top-4 z-10 flex max-w-[85%] flex-wrap gap-2 ${isRTL ? "right-4" : "left-4"}`}
                                >
                                    {topBadges.map((badge) => (
                                        <Badge
                                            key={badge.id}
                                            label={badge.name || " "}
                                            type={badge.image ? "image" : badge.type}
                                            imageSrc={badge.image ?? undefined}
                                            imageAlt={badge.name || "badge"}
                                            imageClassName="max-h-8 rounded-lg"
                                            className={
                                                badge.image
                                                    ? undefined
                                                    : `rounded-full px-3 py-1 text-xs font-semibold ${badgeTagClassName(badge.color)}`
                                            }
                                        />
                                    ))}
                                </div>
                            )}

                            {recipe.rating > 0 && (
                                <div
                                    className={`absolute bottom-4 z-10 rounded-full bg-white/95 px-2.5 py-1 shadow-sm backdrop-blur-sm ${isRTL ? "right-4" : "left-4"}`}
                                >
                                    <Rating
                                        rating={recipe.rating}
                                        size="sm"
                                        className="[&>span]:text-custom-primary"
                                    />
                                </div>
                            )}

                            <div className={`absolute top-4 z-10 ${isRTL ? "left-4" : "right-4"}`}>
                                <FavoriteButton
                                    isFavorite={recipe.is_favorite ?? false}
                                    onToggle={handleToggleFavorite}
                                    size="md"
                                    className="border-white/80 shadow-sm"
                                    ariaLabel={t("recipes.toggleFavorite", "Toggle favorite")}
                                />
                            </div>
                        </div>

                        <div className="flex flex-col gap-3 p-5 md:p-6">
                            <h1 className="text-2xl font-bold leading-tight text-custom-primary md:text-[1.75rem]">
                                {recipe.name}
                            </h1>
                            {recipe.description && (
                                <p className="text-sm leading-relaxed text-custom-secondary md:text-[0.9375rem]">
                                    {recipe.description}
                                </p>
                            )}

                            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-custom-secondary">
                                {recipe.prepare_time && (
                                    <span className="inline-flex items-center gap-1.5 text-[#00AED1]">
                                        <HiClock className="h-4 w-4 shrink-0" aria-hidden />
                                        <span className="text-custom-secondary">
                                            {t("recipes.readyIn")} {recipe.prepare_time} min
                                        </span>
                                    </span>
                                )}
                                {recipe.serves && (
                                    <span className="inline-flex items-center gap-1.5 text-[#00AED1]">
                                        <HiUserGroup className="h-4 w-4 shrink-0" aria-hidden />
                                        <span className="text-custom-secondary">
                                            {t("recipes.serves")} {recipe.serves}
                                        </span>
                                    </span>
                                )}
                            </div>

                            {tagBadges.length > 0 && (
                                <div className="flex flex-wrap gap-2 pt-1">
                                    {tagBadges.map((badge) => (
                                        <Badge
                                            key={badge.id}
                                            label={badge.name}
                                            type={badge.image ? "image" : badge.type}
                                            imageSrc={badge.image ?? undefined}
                                            imageAlt={badge.name}
                                            className={
                                                badge.image
                                                    ? undefined
                                                    : `rounded-full px-3 py-1 text-xs font-medium ${badgeTagClassName(badge.color)}`
                                            }
                                        />
                                    ))}
                                </div>
                            )}

                            {token && recipeId > 0 && (
                                <div className="pt-1">
                                    <button
                                        type="button"
                                        onClick={() => setRatingModalOpen(true)}
                                        className="rounded-lg bg-gradient-to-b from-[#4CDAF6] to-[#2C8090] px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:opacity-95"
                                    >
                                        {t("recipes.rateRecipe", "قيم هذه الوصفة")}
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right: Shopping list card */}
                    <div
                        className={`flex flex-col gap-2 rounded-2xl p-4 ${recipeCardGradient} ${recipeCardShadow}`}
                    >
                        <h2 className="text-base font-bold leading-snug text-custom-primary md:text-lg">
                            {t("recipes.shoppingListFor")} {recipe.name}
                        </h2>
                        <p className="text-xs leading-relaxed text-custom-tertiary md:text-sm">
                            {t("recipes.getIngredientsDesc")}
                        </p>

                        {recipe.items && recipe.items.length > 0 && (
                            <div className="mb-1 space-y-0">
                                {recipe.items.slice(0, 4).map((item, index) => (
                                    <div
                                        key={index}
                                        className="flex items-baseline justify-between gap-3 border-b border-[#00AED1]/10 py-2.5 last:border-b-0"
                                    >
                                        <span className="min-w-0 flex-1 text-sm font-medium text-custom-primary">
                                            {item.main_item.name}
                                        </span>
                                        <span className="shrink-0 text-sm tabular-nums text-custom-tertiary">
                                            {getQuantity(index, item.terms.default_quantity)}x
                                        </span>
                                    </div>
                                ))}
                                {recipe.items.length > 4 && (
                                    <button
                                        type="button"
                                        className="mt-1 inline-flex items-center gap-1 text-sm font-medium text-[#00AED1] hover:underline"
                                    >
                                        {t("recipes.viewFullList")}
                                        <HiChevronDown className="h-4 w-4" aria-hidden />
                                    </button>
                                )}
                            </div>
                        )}

                        <div className="mt-1 space-y-2 border-t border-[#00AED1]/20 pt-3">
                            <div className="flex justify-between gap-3 text-sm">
                                <span className="text-custom-secondary">{t("recipes.itemsSubtotal")}</span>
                                <span className="font-medium tabular-nums text-custom-primary">
                                    {selectionMatchesApiDefaults && recipe.totals?.total_before_discount_formatted
                                        ? recipe.totals.total_before_discount_formatted
                                        : `${currencySymbol}${itemsSubtotalNumeric.toFixed(2)}`}
                                </span>
                            </div>
                            {hasDiscount && recipe.totals && (
                                <div className="flex justify-between gap-3 text-sm">
                                    <span className="font-medium text-[#16A34A] dark:text-green-400">
                                        {t("recipes.recipeDiscount")}
                                    </span>
                                    <span className="font-semibold tabular-nums text-[#16A34A] dark:text-green-400">
                                        {recipe.totals.discount_value_formatted ??
                                            `-${currencySymbol}${recipe.totals.discount_value.toFixed(2)}`}
                                    </span>
                                </div>
                            )}
                            <div className="flex justify-between gap-3 border-t border-[#00AED1]/20 pt-3 text-base font-bold text-custom-primary">
                                <span>{t("recipes.total")}</span>
                                <span className="tabular-nums">
                                    {selectionMatchesApiDefaults && recipe.totals?.total_after_discount_formatted
                                        ? recipe.totals.total_after_discount_formatted
                                        : `${currencySymbol}${(
                                              hasDiscount && recipe.totals
                                                  ? Math.max(
                                                        0,
                                                        itemsSubtotalNumeric -
                                                            recipe.totals.discount_value
                                                    )
                                                  : itemsSubtotalNumeric
                                          ).toFixed(2)}`}
                                </span>
                            </div>
                            <p className="text-[0.6875rem] leading-tight text-custom-tertiary">
                                {t("recipes.pricesMayChange")}
                            </p>
                        </div>

                        <div className="mt-4">
                            <Button
                                variant="primary"
                                leftIcon={<HiShoppingCart className="h-5 w-5" />}
                                className="w-full rounded-xl bg-gradient-to-b from-[#4CDAF6] to-[#00AED1] py-3 text-base font-bold text-white shadow-sm hover:opacity-95 focus:ring-[#00AED1]"
                                onClick={handleAddAllToCart}
                            >
                                {t("recipes.addAllToCart")}
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Other Sections before main content */}
                {otherBeforeSections.length > 0 && (
                    <FullBleedSection>
                        <ApiSectionsRenderer sections={otherBeforeSections} />
                    </FullBleedSection>
                )}

                {/* Ingredients Table */}
                {recipe.items && recipe.items.length > 0 && (
                    <ProductItemsTable
                        items={recipeItems}
                        onQuantityChange={handleItemQuantityChange}
                        onVariantChange={handleItemVariantChange}
                        onRemoveItem={handleRemoveItem}
                        showCompanyColumn={false}
                        showVariantColumn={true}
                        showActionColumn={true}
                        currencySymbol={currencySymbol}
                        className="mb-6"
                    />
                )}

                {/* Cooking Video and Steps Section */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                    {/* Cooking Video */}
                    <div className="lg:col-span-1">
                        <div
                            className={cn(
                                "flex h-full flex-col gap-4 rounded-2xl px-3 py-6",
                                recipeCardGradient,
                                recipeCardShadow
                            )}
                        >
                            <h2 className="text-center text-lg font-bold text-custom-primary md:text-xl">
                                {t("recipes.cookingVideo")}
                            </h2>

                            {recipe.video_url ? (
                                <div
                                    className={cn(
                                        "flex flex-col gap-4 lg:flex-row lg:items-stretch lg:gap-4",
                                        isRTL && "lg:flex-row-reverse"
                                    )}
                                >
                                    <a
                                        href={recipe.video_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="group relative block h-40 shrink-0 overflow-hidden rounded-xl lg:h-auto lg:min-h-[168px] lg:w-[42%]"
                                    >
                                        <img
                                            src={imageUrl}
                                            alt="Video thumbnail"
                                            className="h-full w-full object-cover transition group-hover:scale-[1.02]"
                                        />
                                        <div className="absolute inset-0 flex items-center justify-center bg-black/35 transition group-hover:bg-black/25">
                                            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-red-600 shadow-lg transition group-hover:scale-105">
                                                <HiPlay className="ms-1 h-7 w-7 text-white" />
                                            </div>
                                        </div>
                                    </a>
                                    <div className="flex min-w-0 flex-1 flex-col justify-center gap-3">
                                        <h3 className="text-base font-bold leading-snug text-custom-primary">
                                            {recipe.video_title?.trim()
                                                ? recipe.video_title
                                                : `${t("recipes.howToMake")} ${recipe.name}`}
                                        </h3>
                                        <p className="text-sm leading-relaxed text-custom-secondary">
                                            {recipe.video_desc?.trim()
                                                ? recipe.video_desc
                                                : t("recipes.watchOurChef")}
                                        </p>
                                        <a
                                            href={recipe.video_url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="mt-1 block"
                                        >
                                            <Button
                                                variant="primary"
                                                leftIcon={<HiPlay className="h-5 w-5" />}
                                                className="w-full rounded-xl bg-gradient-to-r from-[#4CDAF6] to-[#00AED1] py-3 text-base font-semibold text-white shadow-sm hover:opacity-95 focus:ring-[#00AED1]"
                                            >
                                                {t("recipes.playOnYouTube")}
                                            </Button>
                                        </a>
                                    </div>
                                </div>
                            ) : (
                                <div
                                    className={cn(
                                        "flex flex-col gap-4 lg:flex-row lg:items-stretch lg:gap-4",
                                        isRTL && "lg:flex-row-reverse"
                                    )}
                                >
                                    <div className="h-40 shrink-0 overflow-hidden rounded-xl lg:h-auto lg:min-h-[168px] lg:w-[42%]">
                                        <img
                                            src={imageUrl}
                                            alt="Recipe"
                                            className="h-full w-full object-cover"
                                        />
                                    </div>
                                    <div className="flex min-w-0 flex-1 flex-col justify-center gap-2">
                                        {recipe.video_title?.trim() && (
                                            <h3 className="text-base font-bold leading-snug text-custom-primary">
                                                {recipe.video_title}
                                            </h3>
                                        )}
                                        {recipe.video_desc?.trim() ? (
                                            <p className="text-sm leading-relaxed text-custom-secondary">
                                                {recipe.video_desc}
                                            </p>
                                        ) : (
                                            !recipe.video_title?.trim() && (
                                                <p className="text-sm leading-relaxed text-custom-secondary">
                                                    {t("recipes.noVideoAvailable", "No video available for this recipe.")}
                                                </p>
                                            )
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Cooking Steps */}
                    <div className="lg:col-span-2">
                        <div className="h-full rounded-2xl border border-slate-200/90 bg-custom-primary p-6 shadow-[0_4px_6px_-4px_rgba(0,0,0,0.08),0_10px_15px_-3px_rgba(0,0,0,0.06)] dark:border-slate-700">
                            <h2 className="mb-6 text-xl font-bold text-custom-primary">
                                {t("recipes.cookingSteps")}
                            </h2>

                            {recipe.steps && recipe.steps.length > 0 ? (
                                <div className="space-y-8">
                                    {recipe.steps.map((step) => (
                                        <div key={step.step_number} className="flex gap-4">
                                            <div className={stepNumberBadgeClass}>{step.step_number}</div>

                                            <div className="min-w-0 flex-1">
                                                <p className="mb-2 text-[0.9375rem] leading-relaxed text-custom-primary">
                                                    {step.instruction}
                                                </p>
                                                {(step.time_minutes || step.heat_level) && (
                                                    <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5 text-sm text-custom-tertiary">
                                                        {step.time_minutes && (
                                                            <span className="inline-flex items-center gap-1.5">
                                                                <HiClock
                                                                    className="h-4 w-4 shrink-0 text-[#00AED1]"
                                                                    aria-hidden
                                                                />
                                                                {step.time_minutes}
                                                            </span>
                                                        )}
                                                        {step.heat_level && (
                                                            <span className="inline-flex items-center gap-1.5">
                                                                <HiFire
                                                                    className="h-4 w-4 shrink-0 text-orange-500"
                                                                    aria-hidden
                                                                />
                                                                {step.heat_level}
                                                            </span>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-custom-secondary">{t("recipes.noCookingSteps")}</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Recipe ratings / reviews */}
                <div className="mt-10">
                    {isRatingsLoading ? (
                        <div className="flex justify-center py-8">
                            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-cyan-500" />
                        </div>
                    ) : (
                        <ProductReviews
                            averageRating={reviewsTotal > 0 ? reviewsAverage : (recipe?.rating ?? 0)}
                            totalReviews={reviewsTotal}
                            ratingDistribution={reviewsDistribution}
                            reviews={recipeReviews}
                            sectionTitle={t("recipes.reviews", "تقييمات الوصفة")}
                            observerTarget={observerTarget}
                            isFetchingNextPage={isFetchingNextPage}
                        />
                    )}
                </div>

                {/* Sections after main content */}
                {afterSections.length > 0 && (
                    <FullBleedSection>
                        <ApiSectionsRenderer sections={afterSections} />
                    </FullBleedSection>
                )}
            </div>

            <RatingFormModal
                isOpen={ratingModalOpen}
                onClose={() => setRatingModalOpen(false)}
                onSuccess={() => setRatingModalOpen(false)}
                mode="create"
                rateableType="recipe"
                rateableId={recipeId}
            />
        </div>
    );
}
