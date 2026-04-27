import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useLanguage } from "@/context/LanguageContext";
import { toast } from "sonner";
import ProductItemsTable, { type ProductItemData } from "@/shared/component/table/ProductItemsTable";
import Button from "@/shared/ui/Button";
import { HiClock, HiHome, HiChevronRight } from "react-icons/hi2";
import { useCartStore } from "@/store/cart";
import { useAuthStore } from "@/store/auth";
import { paths } from "@/app/routes/path/paths";
import { cn } from "@/shared/lib/utils";
import { useBasketRatings } from "../hooks/useBaskets";
import ProductReviews from "@/shared/component/ProductReviews";
import { RatingFormModal } from "@/features/account/components";
import type { BasketDetailsData } from "../types/basket";
import {
    BASKET_ACCENT_SECTION,
    BASKET_BADGE_OFFER,
    BASKET_CARD_ELEVATED,
    BASKET_CHIP_MAIN,
    BASKET_CHIP_SECOND,
    BASKET_HERO_PANEL,
    BASKET_PRIMARY_CTA,
    BASKET_SPINNER,
} from "../constants/basketDetailsStyles";

interface CustomBasketDetailsProps {
    basket: BasketDetailsData;
}

export default function CustomBasketDetails({
    basket,
}: CustomBasketDetailsProps) {
    const { t } = useTranslation();
    const { isRTL } = useLanguage();
    const navigate = useNavigate();
    const addBasket = useCartStore((s) => s.addBasket);

    const [itemQuantities, setItemQuantities] = useState<Record<number, number>>(
        {}
    );
    const [selectedAlternatives, setSelectedAlternatives] = useState<
        Record<number, number>
    >({});
    const [ratingModalOpen, setRatingModalOpen] = useState(false);

    const token = useAuthStore((s) => s.token);
    const {
        reviews: basketReviews,
        averageRating: reviewsAverage,
        totalReviews: reviewsTotal,
        ratingDistribution: reviewsDistribution,
        isLoading: isRatingsLoading,
    } = useBasketRatings(basket.id, "basket");

    // Convert basket items to ProductItemData format
    const productItems = useMemo<ProductItemData[]>(() => {
        return basket.items.map((item) => {
            const selectedAltId = selectedAlternatives[item.id];
            const selectedAlt = selectedAltId
                ? item.alternatives.find((a) => a.shop_product_variant_id === selectedAltId)
                : null;

            const effectivePrice = selectedAlt?.price ?? item.unit_price;
            const quantity = itemQuantities[item.id] ?? item.quantity;
            const subtotal = effectivePrice * quantity;

            return {
                id: item.id,
                name: item.product.name,
                image: item.product.image,
                quantity: quantity,
                unit_price: effectivePrice,
                subtotal: subtotal,
                min_quantity: item.min_quantity,
                max_quantity: item.max_quantity,
                /** Allow qty steppers on basket details; min/max still enforced by API values */
                can_adjust: true,
                is_required: item.is_required,
                companies: item.alternatives.map((alt) => ({
                    id: alt.shop_product_variant_id,
                    name: alt.name,
                    is_default: false,
                    has_custom_price: true,
                    effective_price: alt.price,
                })),
                selectedCompanyId: selectedAltId,
                variant: item.variant,
            };
        });
    }, [basket.items, itemQuantities, selectedAlternatives]);

    const liveTotal = useMemo(
        () => productItems.reduce((sum, item) => sum + item.subtotal, 0),
        [productItems]
    );

    const hasQuantityOrAltOverrides = useMemo(() => {
        return basket.items.some((item) => {
            const q = itemQuantities[item.id] ?? item.quantity;
            const alt = selectedAlternatives[item.id];
            return q !== item.quantity || (alt != null && alt !== item.shop_product_variant_id);
        });
    }, [basket.items, itemQuantities, selectedAlternatives]);

    // Calculate totals
    const totalQuantity = useMemo(() => {
        return productItems.reduce((sum, item) => sum + item.quantity, 0);
    }, [productItems]);

    // Handle quantity change
    const handleQuantityChange = (itemId: number, newQuantity: number) => {
        setItemQuantities((prev) => ({
            ...prev,
            [itemId]: newQuantity,
        }));
    };

    // Handle alternative change
    const handleCompanyChange = (itemId: number, altId: number) => {
        setSelectedAlternatives((prev) => ({
            ...prev,
            [itemId]: altId,
        }));
    };

    // Handle add to cart
    const handleAddToCart = () => {
        if (!basket.items?.length) {
            toast.error(t("baskets.emptyBasket", "This basket has no items to add."));
            return;
        }

        const items = basket.items.map((item) => {
            const selectedAltId = selectedAlternatives[item.id];
            const shop_product_variant_id =
                selectedAltId ?? item.shop_product_variant_id;
            const quantity = itemQuantities[item.id] ?? item.quantity;
            const selectedAlt = selectedAltId
                ? item.alternatives.find((a) => a.shop_product_variant_id === selectedAltId)
                : null;
            const priceNumeric = selectedAlt?.price ?? item.unit_price;
            return {
                shop_product_variant_id,
                quantity,
                name: item.product.name,
                image: item.product.image,
                priceNumeric,
                storeId: 0,
            };
        });

        if (items.some((i) => !i.shop_product_variant_id || Number.isNaN(i.shop_product_variant_id))) {
            toast.error(t("baskets.invalidBasketItems", "Some items in this basket are invalid."));
            return;
        }

        addBasket({ admin_basket_id: basket.id, items });
        toast.success(t("cart.addedToCart", "Added to cart"));
        navigate(paths.client.cart);
    };

    // Format date
    const formatDate = (dateString: string) => {
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString("en-US", { month: "2-digit", day: "2-digit", year: "numeric" });
        } catch {
            return dateString;
        }
    };

    const savingsPercentage = basket.original_price > 0
        ? Math.round(((basket.original_price - basket.final_price) / basket.original_price) * 100)
        : 0;

    const crumbLink =
        "rounded-md px-1.5 py-0.5 text-custom-secondary transition-colors hover:bg-[color-mix(in_srgb,var(--color-main)_8%,var(--color-bg-card))] hover:text-[var(--color-main)] cursor-pointer";

    return (
        <div className="min-h-screen bg-custom-light" dir={isRTL ? "rtl" : "ltr"}>
            <div className="page-container py-8">
                {/* Breadcrumb */}
                <nav className="flex flex-wrap items-center gap-1.5 text-sm text-custom-secondary mb-6" aria-label="Breadcrumb">
                    <HiHome className="w-4 h-4 shrink-0 text-[var(--color-main)] opacity-80" aria-hidden />
                    <button type="button" className={crumbLink} onClick={() => navigate(paths.client.home)}>
                        {t("footer.home")}
                    </button>
                    <HiChevronRight className="w-4 h-4 shrink-0 opacity-60" aria-hidden />
                    <button type="button" className={crumbLink} onClick={() => navigate(paths.client.baskets)}>
                        {t("baskets.customBaskets")}
                    </button>
                    <HiChevronRight className="w-4 h-4 shrink-0 opacity-60" aria-hidden />
                    <span className="font-medium text-custom-primary truncate max-w-[min(100%,14rem)] sm:max-w-md">{basket.name}</span>
                </nav>

                {/* Page Title */}
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-custom-primary mb-6">
                    {t("baskets.basketDetailsTitle")}
                </h1>

                {/* Basket Header */}
                <div className={`${BASKET_HERO_PANEL} p-5 sm:p-6 mb-6`}>
                    <div className="flex flex-col md:flex-row gap-6 md:gap-8">
                        {/* Image */}
                        <div className="w-full md:w-52 h-52 rounded-2xl overflow-hidden shrink-0 bg-custom-card ring-1 ring-[color-mix(in_srgb,var(--color-main)_12%,transparent)] shadow-sm">
                            <img
                                src={basket.image}
                                alt={basket.name}
                                className="w-full h-full object-cover"
                            />
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between mb-4">
                                <h2 className="text-xl sm:text-2xl font-bold text-custom-primary leading-snug">
                                    {basket.name}
                                </h2>
                                {basket.is_on_offer && (
                                    <span className={BASKET_BADGE_OFFER}>{t("baskets.specialOfferToday")}</span>
                                )}
                            </div>

                            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-custom-secondary mb-5">
                                <p className="flex flex-wrap items-baseline gap-x-1.5 gap-y-0">
                                    <span className="font-semibold text-[var(--color-main)]">{productItems.length}</span>
                                    <span>{t("checkout.items")}</span>
                                    <span className="text-custom-tertiary" aria-hidden>
                                        •
                                    </span>
                                    <span className="font-semibold text-[var(--color-main)]">{basket.num_varieties}</span>
                                    <span>{t("baskets.varieties")}</span>
                                </p>
                                {basket.is_on_offer && (
                                    <div className="flex items-center gap-2 text-custom-secondary">
                                        <HiClock className="w-4 h-4 shrink-0 text-[var(--color-main)] opacity-75" />
                                        <span>
                                            {t("baskets.offerEnding")}: {formatDate(basket.offer_ends_at ?? "")}
                                        </span>
                                    </div>
                                )}
                            </div>

                            <div className="flex flex-col items-baseline gap-3">
                                <span className="text-3xl sm:text-4xl font-bold text-custom-primary tabular-nums">
                                    ${liveTotal.toFixed(2)}
                                </span>
                                <div className="flex flex-row items-baseline gap-3">
                                {!hasQuantityOrAltOverrides && basket.original_price > basket.final_price && (
                                    <>
                                        <span className="text-lg sm:text-xl text-custom-tertiary line-through tabular-nums">
                                            ${basket.original_price.toFixed(2)}
                                        </span>
                                        <span className="text-sm font-medium text-[var(--color-success)]">
                                            {t("product.youSaved")} ${(basket.saving || 0).toFixed(2)} ({savingsPercentage}%)
                                        </span>
                                    </>
                                )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Current Total and Add Button */}
                <div className={`flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between ${BASKET_CARD_ELEVATED} p-4 sm:p-5 mb-6`}>
                    <div>
                        <p className="text-xs font-medium uppercase tracking-wide text-custom-secondary">
                            {t("baskets.currentTotal")}
                        </p>
                        <span className="text-xl sm:text-2xl font-bold text-custom-primary tabular-nums">
                            ${liveTotal.toFixed(2)}
                        </span>
                    </div>
                    <Button
                        onClick={handleAddToCart}
                        disabled={!basket.items?.length}
                        className={cn(BASKET_PRIMARY_CTA, "px-6 sm:px-8 w-full sm:w-auto")}
                        size="lg"
                        variant="ghost"
                    >
                        {t("baskets.addBasketToCart")}
                    </Button>
                </div>

                {/* What's inside this basket */}
                <div className="mb-6">
                    <h2 className="text-xl font-bold text-custom-primary mb-4">
                        {t("baskets.whatsInsideThisBasket")}
                    </h2>
                    <ProductItemsTable
                        items={productItems}
                        onQuantityChange={handleQuantityChange}
                        onCompanyChange={handleCompanyChange}
                        showCompanyColumn={false}
                        showVariantColumn={true}
                        showActionColumn={false}
                        currencySymbol="$"
                        readonly={false}
                    />
                </div>

                {/* Footer Summary */}
                <div className={`${BASKET_ACCENT_SECTION} p-4 sm:p-5`}>
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                        <div className="flex flex-wrap gap-3">
                            <span className={BASKET_CHIP_MAIN}>
                                {t("recipes.quantity")}: {totalQuantity}
                            </span>
                            <span className={BASKET_CHIP_SECOND}>
                                {t("baskets.totalItems")}: {productItems.length}
                            </span>
                        </div>
                        <div className={isRTL ? "text-right sm:text-left lg:text-left" : "text-left lg:text-right"}>
                            <div className="text-sm text-custom-secondary mb-0.5">{t("baskets.currentTotal")}</div>
                            <div className="text-2xl font-bold text-custom-primary tabular-nums">
                                ${liveTotal.toFixed(2)}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Rate this basket + Reviews */}
                {token && (
                    <div className="mt-8">
                        <button
                            type="button"
                            onClick={() => setRatingModalOpen(true)}
                            className={cn(BASKET_PRIMARY_CTA, "px-5 py-2.5 text-sm font-medium")}
                        >
                            {t("baskets.rateBasket", "قيم هذه السلة")}
                        </button>
                    </div>
                )}
                <div className="mt-6">
                    {isRatingsLoading ? (
                        <div className="flex justify-center py-6">
                            <div className={`h-8 w-8 ${BASKET_SPINNER}`} />
                        </div>
                    ) : (
                        <ProductReviews
                            averageRating={
                                reviewsTotal > 0
                                    ? reviewsAverage
                                    : Number(basket.rating) || 0
                            }
                            totalReviews={reviewsTotal}
                            ratingDistribution={reviewsDistribution}
                            reviews={basketReviews}
                            sectionTitle={t("baskets.basketReviews", "تقييمات السلة")}
                        />
                    )}
                </div>
            </div>

            <RatingFormModal
                isOpen={ratingModalOpen}
                onClose={() => setRatingModalOpen(false)}
                onSuccess={() => setRatingModalOpen(false)}
                mode="create"
                rateableType="basket"
                rateableId={basket.id}
            />
        </div>
    );
}
