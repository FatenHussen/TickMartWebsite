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
import ProductReviews from "@/shared/component/ProductReviews";
import Button from "@/shared/ui/Button";
import ProductItemsTable, { type ProductItemData } from "@/shared/component/table/ProductItemsTable";
import { HiCheck, HiPlay } from "react-icons/hi2";
import FavoriteButton from "@/shared/component/FavoriteButton";
import { useToggleFavorite } from "@/features/account/hooks/useFavorites";
import { useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/utils/queryKeys";
import { useCartStore } from "@/store/cart";
import { useAuthStore } from "@/store/auth";
import { RatingFormModal } from "@/features/account/components";
import type { RecipeItem } from "../types";

// Step colors for cooking steps
const stepColors = [
    "bg-cyan-500",
    "bg-blue-500",
    "bg-orange-500",
    "bg-red-500",
    "bg-purple-500",
    "bg-green-500",
];

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

    const hasDiscount = recipe.discount && parseFloat(recipe.discount) > 0;
    const imageUrl = recipe.image.startsWith("http")
        ? recipe.image
        : `https://tikmool.octopus-software.online/storage/${recipe.image}`;

    // Calculate totals based on current quantities
    const calculateItemTotal = (item: RecipeItem, index: number) => {
        const qty = getQuantity(index, item.terms.default_quantity);
        return item.main_item.price * qty;
    };

    const itemsSubtotal =
        recipe.items?.reduce((sum, item, index) => {
            return sum + calculateItemTotal(item, index);
        }, 0) || 0;

    return (
        <div className="min-h-screen bg-custom-primary" dir={isRTL ? "rtl" : "ltr"}>
            {/* Banner Sections - Full Width (display_type_id: 1) - BEFORE main content */}
            {bannerSections.length > 0 && (
                <div className="w-full">
                    <ApiSectionsRenderer sections={bannerSections} />
                </div>
            )}

            <div className="page-container py-6">
                {/* Recipe Hero Section */}
                <div className="bg-custom-secondary rounded-2xl p-6 shadow-sm border border-custom-primary mb-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Left: Recipe Image and Info */}
                        <div>
                            <div className="relative mb-4">
                                {recipe.video_url ? (
                                    <a
                                        href={recipe.video_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="block relative group cursor-pointer"
                                    >
                                        <img
                                            src={imageUrl}
                                            alt={recipe.name}
                                            className="w-full h-80 object-cover rounded-xl transition group-hover:opacity-95"
                                        />
                                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition bg-black/20 rounded-xl">
                                            <div className="w-16 h-16 rounded-full bg-red-600 flex items-center justify-center shadow-lg">
                                                <HiPlay className="h-8 w-8 text-white ms-1" />
                                            </div>
                                        </div>
                                    </a>
                                ) : (
                                    <img
                                        src={imageUrl}
                                        alt={recipe.name}
                                        className="w-full h-80 object-cover rounded-xl"
                                    />
                                )}
                                {/* Rating Badge */}
                                {recipe.rating > 0 && (
                                    <div className="absolute bottom-4 left-4 bg-custom-primary/90 backdrop-blur-sm rounded-lg px-2 py-1">
                                        <Rating rating={recipe.rating} size="sm" />
                                    </div>
                                )}
                                {/* Favorite Button */}
                                <div className="absolute top-4 right-4">
                                    <FavoriteButton
                                        isFavorite={recipe.is_favorite ?? false}
                                        onToggle={handleToggleFavorite}
                                        size="md"
                                        className="bg-custom-primary/90 backdrop-blur-sm border-custom-primary hover:bg-custom-primary"
                                        ariaLabel={t("recipes.toggleFavorite", "Toggle favorite")}
                                    />
                                </div>
                            </div>

                            {/* Recipe Title and Description */}
                            <h1 className="text-2xl font-bold text-custom-primary mb-2">
                                {recipe.name}
                            </h1>
                            {recipe.description && (
                                <p className="text-custom-secondary text-sm mb-4">
                                    {recipe.description}
                                </p>
                            )}

                            {/* Meta info: Time, Servings */}
                            <div className="flex items-center gap-4 text-sm text-custom-secondary mb-4">
                                {recipe.prepare_time && (
                                    <span className="flex items-center gap-1">
                                        <span className="text-green-500">⏱</span>{""}
                                        {t("recipes.readyIn")} {recipe.prepare_time} min
                                    </span>
                                )}
                                {recipe.serves && (
                                    <span className="flex items-center gap-1">
                                        <span className="text-custom-tertiary">👥</span>{""}
                                        {t("recipes.serves")} {recipe.serves}
                                    </span>
                                )}
                                {!recipe.prepare_time && !recipe.serves && (
                                    <>
                                        <span className="flex items-center gap-1">
                                            <span className="text-green-500">⏱</span>{""}
                                            {t("recipes.readyIn")} 25 min
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <span className="text-custom-tertiary">👥</span>{""}
                                            {t("recipes.serves")} 2-4
                                        </span>
                                    </>
                                )}
                            </div>

                            {/* Tags/Badges */}
                            {(recipe.badges ?? recipe.budges) && (recipe.badges ?? recipe.budges)!.length > 0 && (
                                <div className="flex flex-wrap gap-2">
                                    {(recipe.badges ?? recipe.budges)!.map((badge) => (
                                        <span
                                            key={badge.id}
                                            className="px-3 py-1 rounded-full text-xs font-medium bg-cyan-100 text-cyan-700 dark:bg-cyan-900 dark:text-cyan-300"
                                        >
                                            {badge.name}
                                        </span>
                                    ))}
                                </div>
                            )}

                            {/* Rate this recipe (logged-in users) */}
                            {token && recipeId > 0 && (
                                <div className="mt-4">
                                    <button
                                        type="button"
                                        onClick={() => setRatingModalOpen(true)}
                                        className="px-4 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-600 text-white font-medium text-sm"
                                    >
                                        {t("recipes.rateRecipe", "قيم هذه الوصفة")}
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Right: Shopping List Summary */}
                        <div className="bg-custom-primary rounded-xl p-6 border border-custom-primary">
                            <h2 className="text-lg font-bold text-custom-primary mb-1">
                                {t("recipes.shoppingListFor")} {recipe.name}
                            </h2>
                            <p className="text-sm text-custom-secondary mb-4">
                                {t("recipes.getIngredientsDesc")}
                            </p>

                            {/* Ingredients Checklist */}
                            {recipe.items && recipe.items.length > 0 && (
                                <div className="space-y-2 mb-4">
                                    {recipe.items.slice(0, 4).map((item, index) => (
                                        <div key={index} className="flex items-center gap-2">
                                            <div className="h-5 w-5 rounded bg-cyan-500 flex items-center justify-center">
                                                <HiCheck className="h-3 w-3 text-white" />
                                            </div>
                                            <span className="text-sm text-custom-primary flex-1">
                                                {item.main_item.name}
                                            </span>
                                            <span className="text-sm text-custom-secondary">
                                                {getQuantity(index, item.terms.default_quantity)}x
                                            </span>
                                        </div>
                                    ))}
                                    {recipe.items.length > 4 && (
                                        <button className="text-sm text-cyan-600 dark:text-cyan-400 hover:underline mt-2">
                                            {t("recipes.viewFullList")} ↓
                                        </button>
                                    )}
                                </div>
                            )}

                            {/* Pricing Summary */}
                            <div className="border-t border-custom-primary pt-4 space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-custom-secondary">
                                        {t("recipes.itemsSubtotal")}
                                    </span>
                                    <span className="font-medium text-custom-primary">
                                        ${itemsSubtotal.toFixed(2)}
                                    </span>
                                </div>
                                {hasDiscount && recipe.totals && (
                                    <div className="flex justify-between text-sm">
                                        <span className="text-custom-secondary">
                                            {t("recipes.recipeDiscount")}
                                        </span>
                                        <span className="font-medium text-red-500">
                                            -${recipe.totals.discount_value.toFixed(2)}
                                        </span>
                                    </div>
                                )}
                                <div className="flex justify-between text-base font-bold pt-2 border-t border-custom-primary">
                                    <span className="text-custom-primary">
                                        {t("recipes.total")}
                                    </span>
                                    <span className="text-custom-primary">
                                        $
                                        {recipe.totals?.total_after_discount.toFixed(2) ||
                                            itemsSubtotal.toFixed(2)}
                                    </span>
                                </div>
                                <p className="text-xs text-custom-tertiary">
                                    {t("recipes.pricesMayChange")}
                                </p>
                            </div>

                            {/* Action Buttons */}
                            <div className="mt-6 space-y-3">
                                <Button
                                    variant="primary"
                                    className="w-full bg-cyan-500 hover:bg-cyan-600 text-white py-3"
                                    onClick={handleAddAllToCart}
                                >
                                    {t("recipes.addAllToCart")}
                                </Button>
                            </div>
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
                        currencySymbol="$"
                        className="mb-6"
                    />
                )}

                {/* Cooking Video and Steps Section */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                    {/* Cooking Video */}
                    <div className="lg:col-span-1">
                        <div className="bg-custom-secondary rounded-2xl p-6 shadow-sm border border-custom-primary h-full">
                            <h2 className="text-xl font-bold text-custom-primary mb-4">
                                {t("recipes.cookingVideo")}
                            </h2>

                            {recipe.video_url ? (
                                <>
                                    <a
                                        href={recipe.video_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="block relative rounded-xl overflow-hidden mb-4 group cursor-pointer"
                                    >
                                        <img
                                            src={imageUrl}
                                            alt="Video thumbnail"
                                            className="w-full h-40 object-cover transition group-hover:scale-105"
                                        />
                                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center group-hover:bg-black/30 transition">
                                            <div className="w-14 h-14 rounded-full bg-red-600 flex items-center justify-center group-hover:scale-110 transition shadow-lg">
                                                <HiPlay className="h-6 w-6 text-white ms-1" />
                                            </div>
                                        </div>
                                    </a>
                                    <h3 className="font-semibold text-custom-primary mb-2">
                                        {t("recipes.howToMake")} {recipe.name}
                                    </h3>
                                    <p className="text-sm text-custom-secondary mb-4">
                                        {t("recipes.watchOurChef")}
                                    </p>
                                    <a
                                        href={recipe.video_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="block"
                                    >
                                        <Button
                                            variant="primary"
                                            className="w-full bg-red-600 hover:bg-red-700 text-white"
                                        >
                                            <HiPlay className="h-4 w-4 me-2" />
                                            {t("recipes.playOnYouTube")}
                                        </Button>
                                    </a>
                                </>
                            ) : (
                                <div className="rounded-xl overflow-hidden mb-4">
                                    <img
                                        src={imageUrl}
                                        alt="Recipe"
                                        className="w-full h-40 object-cover"
                                    />
                                    <p className="text-sm text-custom-secondary mt-2">
                                        {t("recipes.noVideoAvailable", "No video available for this recipe.")}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Cooking Steps */}
                    <div className="lg:col-span-2">
                        <div className="bg-custom-secondary rounded-2xl p-6 shadow-sm border border-custom-primary h-full">
                            <h2 className="text-xl font-bold text-custom-primary mb-6">
                                {t("recipes.cookingSteps")}
                            </h2>

                            {recipe.steps && recipe.steps.length > 0 ? (
                                <div className="space-y-6">
                                    {recipe.steps.map((step, index) => (
                                        <div key={step.step_number} className="flex gap-4">
                                            {/* Step Number Circle */}
                                            <div
                                                className={`shrink-0 w-8 h-8 rounded-full ${stepColors[index % stepColors.length]
                                                    } flex items-center justify-center text-white font-bold text-sm`}
                                            >
                                                {step.step_number}
                                            </div>

                                            {/* Step Content */}
                                            <div className="flex-1">
                                                <p className="text-custom-primary mb-2">
                                                    {step.instruction}
                                                </p>
                                                <div className="flex flex-wrap gap-2">
                                                    {step.time_minutes && (
                                                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-cyan-100 dark:bg-cyan-900 text-cyan-700 dark:text-cyan-300 text-xs">
                                                            ⏱ {step.time_minutes}
                                                        </span>
                                                    )}
                                                    {step.heat_level && (
                                                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-orange-100 dark:bg-orange-900 text-orange-700 dark:text-orange-300 text-xs">
                                                            🔥 {step.heat_level}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-custom-secondary">
                                    {t("recipes.noCookingSteps")}
                                </p>
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
