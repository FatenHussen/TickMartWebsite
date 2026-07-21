import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/context/LanguageContext";
import { toast } from "sonner";
import ProductItemsTable, { type ProductItemData } from "@/shared/component/table/ProductItemsTable";
import BasePopup from "@/shared/component/BasePopup";
import { Button, Select } from "@/shared/ui";
import { HiClock, HiPlus } from "react-icons/hi2";
import { HiOutlineCheckCircle } from "react-icons/hi2";
import AnimatedPrice from "@/shared/component/AnimatedPrice";
import { useCartStore } from "@/store/cart";
import { useAuthStore } from "@/store/auth";
import { paths } from "@/app/routes/path/paths";
import { cn } from "@/shared/lib/utils";
import { useBasketRatings } from "../hooks/useBaskets";
import ProductReviews from "@/shared/component/ProductReviews";
import { RatingFormModal } from "@/features/account/components";
import type { BasketDetailsData, BasketDetailItem } from "../types/basket";
import {
    BASKET_ACCENT_SECTION,
    BASKET_BADGE_NEUTRAL,
    BASKET_CARD_ELEVATED,
    BASKET_GHOST_ICON_BTN,
    BASKET_PRIMARY_CTA,
    BASKET_SPINNER,
} from "../constants/basketDetailsStyles";

interface SubscriptionBasketDetailsProps {
    basket: BasketDetailsData;
}

export default function SubscriptionBasketDetails({
    basket,
}: SubscriptionBasketDetailsProps) {
    const { t } = useTranslation();
    const { isRTL } = useLanguage();
    const navigate = useNavigate();
    const addBasket = useCartStore((s) => s.addBasket);

    const [selectedScheduleId, setSelectedScheduleId] = useState<number | null>(
        basket.schedules?.[0]?.id ?? null
    );
    const [repeatOption, setRepeatOption] = useState<"automatic" | "once">(
        "automatic"
    );
    const [itemQuantities, setItemQuantities] = useState<Record<number, number>>(
        {}
    );
    const [selectedAlternatives, setSelectedAlternatives] = useState<
        Record<number, number>
    >({});

    // Extras popup state
    const [showExtrasPopup, setShowExtrasPopup] = useState(false);
    const [ratingModalOpen, setRatingModalOpen] = useState(false);

    // Track which extras have been added to the table
    const [addedExtras, setAddedExtras] = useState<BasketDetailItem[]>([]);

    const token = useAuthStore((s) => s.token);
    const {
        reviews: basketReviews,
        averageRating: reviewsAverage,
        totalReviews: reviewsTotal,
        ratingDistribution: reviewsDistribution,
        isLoading: isRatingsLoading,
    } = useBasketRatings(basket.id, "schedule_basket");

    // Get selected schedule
    const selectedSchedule = useMemo(() => {
        return basket.schedules?.find((s) => s.id === selectedScheduleId) ?? null;
    }, [basket.schedules, selectedScheduleId]);

    // Schedule options for Select (from API)
    const scheduleOptions = useMemo(() => {
        if (!basket.schedules?.length) return [];
        return basket.schedules.map((schedule) => ({
            value: schedule.id,
            label:
                schedule.discount_value > 0
                    ? `${schedule.title} (${schedule.discount_value}${schedule.discount_type === "percentage" ? "%" : ""} ${t("baskets.discountExtra")})`
                    : schedule.title,
        }));
    }, [basket.schedules, t]);

    // Helper: convert a BasketDetailItem to ProductItemData
    const mapItemToProductData = (item: BasketDetailItem): ProductItemData => {
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
            can_adjust: item.can_adjust,
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
    };

    // Combine basket items + added extras into ProductItemData
    const productItems = useMemo<ProductItemData[]>(() => {
        const allItems = [...basket.items, ...addedExtras];
        return allItems.map(mapItemToProductData);
    }, [basket.items, addedExtras, itemQuantities, selectedAlternatives]);

    // Available extras to show in popup (exclude already added ones)
    const availableExtras = useMemo(() => {
        const addedIds = new Set(addedExtras.map((e) => e.id));
        return (basket.extras ?? []).filter((e) => !addedIds.has(e.id));
    }, [basket.extras, addedExtras]);

    // Calculate totals
    const subtotal = useMemo(() => {
        return productItems.reduce((sum, item) => sum + item.subtotal, 0);
    }, [productItems]);

    const totalQuantity = useMemo(() => {
        return productItems.reduce((sum, item) => sum + item.quantity, 0);
    }, [productItems]);

    const scheduleDiscount = useMemo(() => {
        if (!selectedSchedule || repeatOption === "once") return 0;

        if (selectedSchedule.discount_type === "percentage") {
            return (subtotal * selectedSchedule.discount_value) / 100;
        } else {
            return selectedSchedule.discount_value;
        }
    }, [selectedSchedule, subtotal, repeatOption]);

    const discount = basket.discount_amount || 0;
    const totalDiscount = discount + scheduleDiscount;
    const total = subtotal - totalDiscount;
    const savings = totalDiscount;

    // Handle quantity change
    const handleQuantityChange = (itemId: number, newQuantity: number) => {
        setItemQuantities((prev) => ({
            ...prev,
            [itemId]: newQuantity,
        }));
    };

    // Handle alternative change (mapped to company change)
    const handleAlternativeChange = (itemId: number, altId: number) => {
        setSelectedAlternatives((prev) => ({
            ...prev,
            [itemId]: altId,
        }));
    };

    // Handle removing an extra from table
    const handleRemoveItem = (itemId: number) => {
        setAddedExtras((prev) => prev.filter((e) => e.id !== itemId));
        // Clean up quantities and alternatives for removed item
        setItemQuantities((prev) => {
            const next = { ...prev };
            delete next[itemId];
            return next;
        });
        setSelectedAlternatives((prev) => {
            const next = { ...prev };
            delete next[itemId];
            return next;
        });
    };

    // Handle adding an extra from popup
    const handleAddExtra = (extra: BasketDetailItem) => {
        setAddedExtras((prev) => [...prev, extra]);
    };

    // Handle confirm order - add basket to cart
    const handleConfirmOrder = () => {
        const allItems = [...basket.items, ...addedExtras];
        const items = allItems.map((item) => {
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

        addBasket({ admin_basket_id: basket.id, items });
        toast.success(t("cart.addedToCart", "Added to cart"));
        navigate(paths.client.cart);
    };

    const handleAddMoreItems = () => {
        setShowExtrasPopup(true);
    };

    return (
        <div className="min-h-screen" dir={isRTL ? "rtl" : "ltr"}>
            <div className="page-container py-8">
                {/* Selected Basket Hero */}
                <div
                    className={cn(
                        BASKET_CARD_ELEVATED,
                        "animate-basket-rise relative mb-5 overflow-hidden p-5 sm:p-6"
                    )}
                >
                    {/* Accent strip + soft glow anchor the hero */}
                    <span
                        className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[var(--color-main)] to-[var(--color-api-second)]"
                        aria-hidden
                    />
                    <span
                        className="pointer-events-none absolute -right-16 -top-16 h-44 w-44 rounded-full bg-[color-mix(in_srgb,var(--color-main)_14%,transparent)] blur-3xl"
                        aria-hidden
                    />

                    <div className="relative flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                        <div className="min-w-0 flex-1">
                            <div className="mb-2 flex flex-wrap items-center gap-2">
                                <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--color-api-second)] px-3 py-1 text-xs font-semibold text-white shadow-sm">
                                    <span className="h-1.5 w-1.5 rounded-full bg-white/90" aria-hidden />
                                    {t("baskets.scheduled")}
                                </span>
                                {selectedSchedule && (
                                    <span className={BASKET_BADGE_NEUTRAL}>{selectedSchedule.title}</span>
                                )}
                            </div>
                            <p className="text-xs font-medium uppercase tracking-wide text-custom-tertiary">
                                {t("baskets.selectedBasket")}
                            </p>
                            <h2 className="mt-0.5 text-xl font-bold leading-snug tracking-tight text-custom-primary sm:text-2xl">
                                {basket.name}
                            </h2>

                            <div className="mt-3.5 flex flex-wrap items-center gap-2">
                                <span className="inline-flex items-center gap-1.5 rounded-full bg-[color-mix(in_srgb,var(--color-main)_8%,var(--color-bg-card))] px-3 py-1.5 text-sm text-custom-secondary ring-1 ring-custom-primary/10">
                                    <span className="font-bold text-[var(--color-main)] tabular-nums">{productItems.length}</span>
                                    {t("checkout.items")}
                                </span>
                                <span className="inline-flex items-center gap-1.5 rounded-full bg-[color-mix(in_srgb,var(--color-main)_8%,var(--color-bg-card))] px-3 py-1.5 text-sm text-custom-secondary ring-1 ring-custom-primary/10">
                                    <HiClock className="h-4 w-4 shrink-0 text-[var(--color-main)] opacity-80" />
                                    <span className="font-medium">{t("baskets.nextDelivery")}:</span>
                                    <span className="font-semibold text-custom-primary">{basket.next_delivery_date ?? "-"}</span>
                                </span>
                            </div>
                        </div>

                        {/* Delivery schedule selector — cleaner card */}
                        {basket.schedules && basket.schedules.length > 0 && (
                            <div className="w-full shrink-0 rounded-2xl border border-custom-primary/10 bg-[color-mix(in_srgb,var(--color-main)_4%,var(--color-bg-card))] p-3.5 lg:w-72">
                                <Select
                                    label={t("baskets.selectSchedule")}
                                    options={scheduleOptions}
                                    value={selectedScheduleId ?? ""}
                                    onChange={(e) =>
                                        setSelectedScheduleId(
                                            e.target.value ? Number(e.target.value) : null
                                        )
                                    }
                                    className="!mb-0"
                                />
                            </div>
                        )}
                    </div>
                </div>

                {/* Pricing Info */}
                <div className={`${BASKET_CARD_ELEVATED} p-4 sm:p-5 mb-5`}>
                    <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
                        <div className="flex items-baseline gap-2">
                            <span className="text-custom-secondary">{t("baskets.subtotal")}:</span>
                            <AnimatedPrice value={subtotal} prefix="$" className="font-bold text-custom-primary" />
                        </div>
                        {discount > 0 && (
                            <div className="flex items-baseline gap-2">
                                <span className="text-custom-secondary">{t("baskets.discount")}:</span>
                                <AnimatedPrice value={discount} prefix="-$" className="font-bold text-[var(--color-error)]" />
                            </div>
                        )}
                        <div className="flex items-baseline gap-2">
                            <span className="text-custom-secondary">{t("baskets.total")}:</span>
                            <AnimatedPrice value={total} prefix="$" className="text-lg font-bold text-[var(--color-main)]" />
                        </div>
                    </div>
                    {savings > 0 && (
                        <div className="mt-3 flex items-start gap-3 rounded-xl border border-[color-mix(in_srgb,var(--color-success)_30%,transparent)] bg-[color-mix(in_srgb,var(--color-success)_8%,var(--color-bg-card))] p-3 sm:p-4">
                            <span
                                className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[color-mix(in_srgb,var(--color-success)_16%,transparent)] text-[var(--color-success)]"
                                aria-hidden
                            >
                                <HiOutlineCheckCircle className="h-5 w-5" />
                            </span>
                            <p className="text-sm font-medium leading-relaxed text-custom-primary">
                                <span className="font-bold text-[var(--color-success)]">
                                    {t("baskets.youSave")} <AnimatedPrice value={savings} prefix="$" />
                                </span>
                                {scheduleDiscount > 0 && selectedSchedule && (
                                    <>
                                        {" "}
                                        ({selectedSchedule.discount_type === "percentage"
                                            ? `${selectedSchedule.discount_value}%`
                                            : ""})
                                        {repeatOption === "automatic" && (
                                            <> {selectedSchedule.title} {t("baskets.subscriptionDiscountApplied")}</>
                                        )}
                                    </>
                                )}
                            </p>
                        </div>
                    )}
                </div>

                {/* Products Table */}
                <div className="mb-4">
                    <ProductItemsTable
                        items={productItems}
                        onQuantityChange={handleQuantityChange}
                        onCompanyChange={handleAlternativeChange}
                        onRemoveItem={handleRemoveItem}
                        showCompanyColumn={true}
                        showVariantColumn={true}
                        showActionColumn={true}
                        currencySymbol="$"
                    />
                </div>

                {/* Summary Section — sticks to the bottom while scrolling the items */}
                <div className="sticky bottom-3 z-20 mb-6">
                    <div
                        className={cn(
                            BASKET_ACCENT_SECTION,
                            "p-4 shadow-[0_10px_30px_-12px_color-mix(in_srgb,var(--color-main)_45%,transparent)] backdrop-blur-sm sm:p-5",
                            "supports-[backdrop-filter]:bg-[color-mix(in_srgb,var(--color-accent-light-bg)_90%,transparent)]"
                        )}
                    >
                        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-6">
                                <span className="font-bold text-custom-primary">{t("baskets.orderSummary")}</span>
                                <div className="flex flex-wrap items-center gap-2 text-sm">
                                    <span className="text-custom-secondary">
                                        {productItems.length} {t("baskets.totalItems")}
                                    </span>
                                    <span className="text-custom-tertiary" aria-hidden>
                                        |
                                    </span>
                                    <span className="text-custom-secondary">
                                        {t("recipes.quantity")}: {totalQuantity}
                                    </span>
                                </div>
                            </div>
                            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-6">
                                <div className={isRTL ? "text-left sm:text-right" : "text-right"}>
                                    <div className="text-sm text-custom-secondary tabular-nums">
                                        {t("baskets.subtotal")}: <AnimatedPrice value={subtotal} prefix="$" />
                                    </div>
                                    <div className="text-lg font-bold text-[var(--color-main)]">
                                        {t("baskets.total")}: <AnimatedPrice value={total} prefix="$" />
                                    </div>
                                </div>
                                {availableExtras.length > 0 && (
                                    <Button
                                        onClick={handleAddMoreItems}
                                        className={cn(
                                            BASKET_PRIMARY_CTA,
                                            "px-5 py-2.5 transition-transform duration-150 ease-out hover:-translate-y-0.5 active:translate-y-0 motion-reduce:hover:translate-y-0"
                                        )}
                                        variant="ghost"
                                    >
                                        + {t("baskets.addMoreItems")}
                                    </Button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Repeat Option */}
                <div className={`${BASKET_ACCENT_SECTION} mb-8 p-5 sm:p-6`}>
                    <div className="mb-4 flex items-start gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--color-main)] shadow-sm ring-2 ring-[color-mix(in_srgb,var(--color-main)_35%,transparent)]">
                            <span className="text-lg leading-none text-white" aria-hidden>
                                🔄
                            </span>
                        </div>
                        <h3 className="text-lg font-bold text-custom-primary">{t("baskets.repeatBasketOption")}</h3>
                    </div>

                    <div className="ms-0 space-y-4 sm:ms-12">
                        <label className="flex cursor-pointer items-start gap-3">
                            <input
                                type="radio"
                                name="repeatOption"
                                value="automatic"
                                checked={repeatOption === "automatic"}
                                onChange={(e) =>
                                    setRepeatOption(e.target.value as "automatic")
                                }
                                className="mt-1 h-5 w-5 shrink-0 accent-[var(--color-main)]"
                            />
                            <div className="min-w-0 flex-1">
                                <div className="flex flex-wrap items-center gap-2">
                                    <span className="font-semibold text-custom-primary">
                                        {t("baskets.repeatAutomatically")}
                                    </span>
                                    <span className="rounded-md bg-[var(--color-api-second)] px-2 py-0.5 text-xs font-semibold text-white shadow-sm">
                                        {t("home.recommended")}
                                    </span>
                                </div>
                                <p className="mt-1 text-sm leading-relaxed text-custom-secondary">
                                    {t("baskets.repeatAutomaticallyDescription")}
                                </p>
                            </div>
                        </label>

                        <label className="flex cursor-pointer items-start gap-3">
                            <input
                                type="radio"
                                name="repeatOption"
                                value="once"
                                checked={repeatOption === "once"}
                                onChange={(e) =>
                                    setRepeatOption(e.target.value as "once")
                                }
                                className="mt-1 h-5 w-5 shrink-0 accent-[var(--color-main)]"
                            />
                            <div>
                                <p className="font-semibold text-custom-primary">{t("baskets.oneTimeOnly")}</p>
                                <p className="text-sm text-custom-secondary mt-1">
                                    {t("baskets.oneTimeOnlyDescription")}
                                </p>
                            </div>
                        </label>
                    </div>
                </div>

        
                {/* Confirm Button */}
                <div className="flex justify-center">
                    <Button
                        onClick={handleConfirmOrder}
                        className={cn(BASKET_PRIMARY_CTA, "w-full px-10 py-3 text-base sm:w-auto sm:px-12 sm:text-lg")}
                        size="lg"
                        variant="ghost"
                    >
                        ✓ {t("baskets.confirmSubscriptionOrder")}
                    </Button>
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
                            <div className={cn("h-8 w-8", BASKET_SPINNER)} />
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
                rateableType="schedule_basket"
                rateableId={basket.id}
            />

            {/* Extras Popup */}
            <BasePopup
                isOpen={showExtrasPopup}
                onClose={() => setShowExtrasPopup(false)}
                title={t("baskets.addMoreItems")}
                maxWidth="lg"
                contentClassName="!text-start p-6"
                actions={
                    <Button
                        onClick={() => setShowExtrasPopup(false)}
                        className={cn(BASKET_PRIMARY_CTA, "w-full py-3")}
                        size="lg"
                        variant="ghost"
                    >
                        {t("common.close")}
                    </Button>
                }
            >
                <div className="max-h-[50vh] overflow-y-auto">
                    {availableExtras.length === 0 ? (
                        <p className="text-center text-custom-secondary py-8">
                            {t("baskets.noExtrasAvailable")}
                        </p>
                    ) : (
                        <div className="space-y-3">
                            {availableExtras.map((extra) => (
                                <div
                                    key={extra.id}
                                    className="group flex cursor-pointer items-center gap-4 rounded-xl border border-custom-primary/15 p-3 transition hover:border-[color-mix(in_srgb,var(--color-main)_35%,var(--color-border-primary))] hover:bg-custom-accent-light"
                                    onClick={() => handleAddExtra(extra)}
                                >
                                    {/* Product Image */}
                                    <img
                                        src={extra.product.image}
                                        alt={extra.product.name}
                                        className="w-14 h-14 rounded-lg object-cover shrink-0"
                                    />

                                    {/* Product Info */}
                                    <div className="flex-1 min-w-0">
                                        <h4 className="font-semibold text-custom-primary text-sm truncate">
                                            {extra.product.name}
                                        </h4>
                                        <div className="flex items-center gap-2 mt-1">
                                            {extra.variant && extra.variant.length > 0 && (
                                                <span className="text-xs text-custom-secondary">
                                                    {extra.variant
                                                        .filter((v) => !(typeof v === "string" && v.startsWith("#")))
                                                        .join(",")}
                                                </span>
                                            )}
                                            {extra.variant?.some(
                                                (v) => typeof v === "string" && v.startsWith("#")
                                            ) && (
                                                    <span
                                                        className="w-4 h-4 rounded-full border border-custom-secondary inline-block"
                                                        style={{
                                                            backgroundColor: extra.variant.find(
                                                                (v) => typeof v === "string" && v.startsWith("#")
                                                            ) as string,
                                                        }}
                                                    />
                                                )}
                                        </div>
                                        <p className="mt-1 text-sm font-bold tabular-nums text-[var(--color-main)]">
                                            ${extra.unit_price.toFixed(2)}
                                        </p>
                                    </div>

                                    {/* Add Button */}
                                    <button
                                        type="button"
                                        className={cn(
                                            BASKET_GHOST_ICON_BTN,
                                            "flex h-9 w-9 shrink-0 items-center justify-center opacity-0 transition-opacity group-hover:opacity-100"
                                        )}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleAddExtra(extra);
                                        }}
                                    >
                                        <HiPlus className="w-5 h-5" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </BasePopup>
        </div>
    );
}
