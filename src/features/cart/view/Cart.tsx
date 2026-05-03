import { useMemo, useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useLanguage } from "@/context/LanguageContext";
import { useNavigate, Link } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { paths } from "@/app/routes/path/paths";
import SideContentLayout from "@/layout/SideContentLayout";
import { CartSummary } from "../components";
import CartItemCard from "../components/CartItemCard";
import ScheduleDelivery, {
    type ScheduleDeliveryData,
} from "../components/ScheduleDelivery";
import CheckoutProgressIndicator from "@/shared/component/CheckoutProgressIndicator";
import BasePopup from "@/shared/component/BasePopup";
import Button from "@/shared/ui/Button";
import { HiArrowLeft, HiTrash } from "react-icons/hi";
import { useCartStore } from "@/store/cart";
import { useCheckoutStore } from "@/store/checkout";
import { useAddresses } from "@/features/account/hooks/useAddress";
import { useOrderPreview } from "../hooks/useOrderPreview";
import { useActiveBenefits } from "../hooks/useActiveBenefits";
import ActiveBenefitsSelector from "../components/ActiveBenefitsSelector";
import AvailablePromotionsSelector from "../components/AvailablePromotionsSelector";
import NonDiscountPromotionBanner from "../components/NonDiscountPromotionBanner";
import { useCurrency } from "@/context/CurrencyContext";
import type { NonDiscountPromotion } from "../types";
import { _ScheduledBasketApi } from "@/features/account/api/scheduledBasketApi";
import { queryKeys } from "@/utils/queryKeys";
import type { OrderSummary, OrderPreviewItemPrice, OrderPreviewOrderItem } from "../types";
import { toNum } from "../utils";
import { matchPreviewOrderItem } from "../utils/enrichCartItems";
import { mapPreviewToCartSummary } from "../utils/orderSummary";

function parseSubtotal(s: string): number {
    return parseFloat(String(s).replace(/[^0-9.]/g, "")) || 0;
}

export default function Cart() {
    const { t } = useTranslation();
    const { isRTL } = useLanguage();
    const { formatPrice } = useCurrency();
    const navigate = useNavigate();
    const checkoutCoupon = useCheckoutStore((s) => s.coupon);
    const [coupon, setCoupon] = useState(checkoutCoupon);
    const setCheckoutCoupon = useCheckoutStore((s) => s.setCoupon);
    const {
        pointCouponExchangeId,
        pointFreeDeliveryExchangeId,
        useSubscriptionDiscount,
        useSubscriptionFreeDelivery,
        promotionId,
        setPointCouponExchangeId,
        setPointFreeDeliveryExchangeId,
        setUseSubscriptionDiscount,
        setUseSubscriptionFreeDelivery,
        setPromotionId,
    } = useCheckoutStore();
    const [selectedCouponKey, setSelectedCouponKey] = useState<string | null>(null);
    const [selectedDeliveryKey, setSelectedDeliveryKey] = useState<string | null>(null);
    const [showClearCartPopup, setShowClearCartPopup] = useState(false);

    useEffect(() => {
        setCoupon(checkoutCoupon);
    }, [checkoutCoupon]);
    const items = useCartStore((s) => s.items);
    const cart_type = useCartStore((s) => s.cart_type);
    const updateQuantity = useCartStore((s) => s.updateQuantity);
    const removeItem = useCartStore((s) => s.removeItem);
    const clearCart = useCartStore((s) => s.clearCart);
    const queryClient = useQueryClient();

    const createScheduledBasketMutation = useMutation({
        mutationFn: _ScheduledBasketApi.createScheduledBasket,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.scheduledBaskets.all() });
            queryClient.invalidateQueries({ queryKey: queryKeys.myBaskets.all() });
            toast.success(t("cart.scheduleSaved", "Schedule saved successfully"));
            navigate(paths.client.checkout);
        },
        onError: () => {
            toast.error(t("cart.scheduleSaveFailed", "Failed to save schedule"));
        },
    });

    const { data: activeBenefitsData } = useActiveBenefits();
    const { data: addresses = [], isLoading: isAddressesLoading } = useAddresses();
    const defaultAddress = addresses.find((a) => a.is_default) ?? addresses[0];
    const addressId = defaultAddress?.id ?? null;

    const benefits = {
        pointCouponExchangeId,
        pointFreeDeliveryExchangeId,
        useSubscriptionDiscount,
        useSubscriptionFreeDelivery,
        promotionId,
    };

    const { data: preview, isLoading: isPreviewLoading } = useOrderPreview(
        addressId != null ? addressId : null,
        coupon || undefined,
        benefits
    );

    const showSummaryLoading =
        items.length > 0 &&
        (isAddressesLoading || (addressId != null && isPreviewLoading));

    const summary = useMemo<OrderSummary>(() => {
        if (preview) {
            return mapPreviewToCartSummary(preview, formatPrice);
        }
        if (items.length > 0) {
            return {
                numOfItems: 0,
                subtotal: formatPrice(0),
                shipping: "-",
                shippingIsFree: false,
                storeDiscounts: formatPrice(0),
                tax: "0%",
                couponDiscount: formatPrice(0),
                total: formatPrice(0),
            };
        }
        const numOfItems = items.reduce((sum, i) => sum + i.quantity, 0);
        const subtotalNum = items.reduce(
            (sum, i) => sum + parseSubtotal(i.subtotal),
            0
        );
        const subtotal = formatPrice(subtotalNum);
        return {
            numOfItems,
            subtotal,
            shipping: "Free",
            shippingIsFree: true,
            storeDiscounts: formatPrice(0),
            tax: "0%",
            couponDiscount: formatPrice(0),
            total: subtotal,
        };
    }, [formatPrice, items, preview]);

    const previewPricesMap = useMemo(() => {
        const map = new Map<number, { price: number; priceBeforeDiscount?: number }>();
        const orderItems = preview?.orderItems as OrderPreviewOrderItem[] | undefined;
        if (orderItems?.length) {
            orderItems.forEach((it) => {
                if (it?.shop_product_variant_id != null) {
                    const price = toNum(it.price_after_discount ?? it.price);
                    const priceBefore = toNum(it.price);
                    map.set(it.shop_product_variant_id, {
                        price: price || toNum(it.price),
                        priceBeforeDiscount: priceBefore > 0 ? priceBefore : undefined,
                    });
                }
            });
            return map;
        }
        const raw = preview?.items as OrderPreviewItemPrice[] | Record<string, { items: OrderPreviewItemPrice[] }> | undefined;
        if (!raw) return map;
        const arr = Array.isArray(raw) ? raw : Object.values(raw).flatMap((shop) => shop?.items ?? []);
        arr.forEach((it) => {
            if (it?.shop_product_variant_id != null && (it.price != null || it.price_before_discount != null)) {
                const price = it.price ?? it.price_before_discount ?? 0;
                map.set(it.shop_product_variant_id, {
                    price: typeof price === 'number' ? price : toNum(price),
                    priceBeforeDiscount: it.price_before_discount,
                });
            }
        });
        return map;
    }, [preview?.items, preview?.orderItems]);

    const excludedFromCouponSet = useMemo(() => {
        const ids = preview?.coupon?.excluded_items ?? preview?.excluded_items ?? [];
        return new Set(Array.isArray(ids) ? ids : []);
    }, [preview?.coupon?.excluded_items, preview?.excluded_items]);

    const freeItemsByVariant = useMemo(() => {
        const promo = preview?.non_discount_promotions as { free_items?: { shop_product_variant_id: number; free_quantity: number }[] } | null | undefined;
        if (!promo?.free_items?.length) return new Map<number, number>();
        const m = new Map<number, number>();
        promo.free_items.forEach((fi) => {
            const q = (m.get(fi.shop_product_variant_id) ?? 0) + fi.free_quantity;
            m.set(fi.shop_product_variant_id, q);
        });
        return m;
    }, [preview?.non_discount_promotions]);

    const promotionBadges = useMemo(() => {
        const badges: string[] = [];

        if (preview?.available_promotions?.length) {
            preview.available_promotions.forEach((promotion) => {
                if (!promotion?.name) return;
                const name =
                    typeof promotion.name === "string"
                        ? promotion.name
                        : (promotion.name.en ?? promotion.name.ar ?? "");
                if (name) badges.push(name);
            });
        }

        const nonDiscountPromotion = preview?.non_discount_promotions as
            | { promotion_title?: string }
            | null
            | undefined;

        if (nonDiscountPromotion?.promotion_title) {
            badges.push(nonDiscountPromotion.promotion_title);
        }

        return Array.from(new Set(badges)).filter(Boolean);
    }, [preview?.available_promotions, preview?.non_discount_promotions]);

    const orderItemsByVariant = useMemo(() => {
        const arr = preview?.orderItems as OrderPreviewOrderItem[] | undefined;
        if (!arr?.length) return new Map<number, OrderPreviewOrderItem>();
        const m = new Map<number, OrderPreviewOrderItem>();
        arr.forEach((it) => m.set(it.shop_product_variant_id, it));
        return m;
    }, [preview?.orderItems]);

    const summaryStatus: "loading" | "no-address" | "ready" =
        items.length === 0
            ? "ready"
            : isAddressesLoading
                ? "loading"
                : addresses.length === 0
                    ? "no-address"
                    : isPreviewLoading
                        ? "loading"
                        : "ready";

    const handleQuantityChange = (itemId: number | string, quantity: number) => {
        updateQuantity(itemId, quantity);
    };

    const handleRemoveItem = (itemId: number | string) => {
        removeItem(itemId);
    };

    const handleMoveToWishlist = (itemId: number | string) => {
        // TODO: Implement move to wishlist
        console.log("Move to wishlist:", itemId);
    };

    const handleClearCartClick = () => {
        setShowClearCartPopup(true);
    };

    const handleConfirmClearCart = () => {
        clearCart();
        setShowClearCartPopup(false);
        toast.success(t("cart.cartCleared", "Cart cleared"));
    };

    const handleUpdateCart = () => {
        // TODO: Update cart logic
        console.log("Update cart");
    };

    const handleSelectCouponBenefit = (key: string | null, value: number | boolean | null) => {
        setSelectedCouponKey(key);
        setPointCouponExchangeId(null);
        setUseSubscriptionDiscount(false);
        if (key === "point_coupon_exchange_id" && typeof value === "number") {
            setPointCouponExchangeId(value);
            setCoupon("");
            setCheckoutCoupon("");
        } else if (key === "use_subscription_discount") {
            setUseSubscriptionDiscount(true);
            setCoupon("");
            setCheckoutCoupon("");
        }
        // Promotion conflicts with any discount benefit
        setPromotionId(null);
    };

    const handleSelectPromotion = (id: number | null) => {
        if (id != null) {
            // Clear coupon discount benefits — only one discount source allowed
            setSelectedCouponKey(null);
            setCoupon("");
            setCheckoutCoupon("");
        }
        setPromotionId(id);
    };

    const handleSelectDeliveryBenefit = (key: string | null, value: number | boolean | null) => {
        setSelectedDeliveryKey(key);
        // Reset all delivery benefits first
        setPointFreeDeliveryExchangeId(null);
        setUseSubscriptionFreeDelivery(false);
        if (key === "point_free_delivery_exchange_id" && typeof value === "number") {
            setPointFreeDeliveryExchangeId(value);
        } else if (key === "use_subscription_free_delivery") {
            setUseSubscriptionFreeDelivery(true);
        }
    };

    const handleCheckout = () => {
        setCheckoutCoupon(coupon);
        navigate("/cart/checkout");
    };

    const handleSaveSchedule = (data: ScheduleDeliveryData) => {
        const firstItem = items[0];
        const categoryId = firstItem?.category_id;
        if (categoryId == null) {
            toast.error(t("cart.categoryRequired", "Products must have a category"));
            return;
        }
        const validItems = items.filter(
            (i) =>
                i.productId != null &&
                i.shop_product_variant_id != null &&
                i.quantity > 0
        );
        if (validItems.length === 0) {
            toast.error(t("cart.noValidItems", "No valid items to schedule"));
            return;
        }
        createScheduledBasketMutation.mutate({
            name: data.name,
            category_id: categoryId,
            schedule_id: data.schedule_id,
            is_active: true,
            start_date: data.start_date,
            items: validItems.map((i) => ({
                product_id: i.productId!,
                shop_product_variant_id: i.shop_product_variant_id!,
                quantity: i.quantity,
            })),
        });
    };

    const isCartEmpty = items.length === 0;

    return (
        <div className="min-h-screen bg-custom-tertiary">
             {/* <OrderFlowHeader /> */}
            <div className="page-container py-6" dir={isRTL ? "rtl" : "ltr"}>
                {/* Progress Indicator - only when cart has items */}
                {!isCartEmpty && (
                    <div className="mb-8">
                        <CheckoutProgressIndicator currentStep="cart" />
                    </div>
                )}

                {isCartEmpty ? (
                    /* Creative empty cart — uses theme tokens */
                    <div className="flex justify-center items-center min-h-[60vh]">
                        <div className="relative w-full max-w-md mx-auto">
                            <div
                                className="relative overflow-hidden rounded-3xl border bg-custom-card p-12 text-center shadow-sm"
                                style={{
                                    borderColor:
                                        "color-mix(in srgb, var(--color-main) 18%, transparent)",
                                    boxShadow:
                                        "0 12px 32px -16px color-mix(in srgb, var(--color-main) 22%, transparent)",
                                }}
                            >
                                <div
                                    className="pointer-events-none absolute -top-12 -right-12 h-36 w-36 rounded-full blur-3xl"
                                    style={{
                                        background:
                                            "radial-gradient(circle, color-mix(in srgb, var(--color-main) 28%, transparent) 0%, transparent 70%)",
                                    }}
                                    aria-hidden
                                />
                                <div
                                    className="pointer-events-none absolute -bottom-12 -left-12 h-32 w-32 rounded-full blur-2xl"
                                    style={{
                                        background:
                                            "radial-gradient(circle, color-mix(in srgb, var(--color-api-second) 26%, transparent) 0%, transparent 72%)",
                                    }}
                                    aria-hidden
                                />

                                <div className="relative">
                                    <div
                                        className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-2xl text-white"
                                        style={{
                                            background:
                                                "linear-gradient(135deg, var(--color-main) 0%, var(--color-api-second) 100%)",
                                            boxShadow:
                                                "0 12px 28px -10px color-mix(in srgb, var(--color-main) 50%, transparent)",
                                        }}
                                    >
                                        <svg
                                            className="h-10 w-10"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={1.5}
                                                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                                            />
                                        </svg>
                                    </div>
                                    <h2 className="text-xl font-bold text-[color:var(--color-text)] mb-2">
                                        {t("cart.yourCartIsEmpty")}
                                    </h2>
                                    <p className="text-sm text-custom-secondary mb-8 max-w-xs mx-auto leading-relaxed">
                                        {t("cart.emptyCartHint")}
                                    </p>
                                    <Link
                                        to="/home"
                                        className="inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold text-white transition-all duration-200 hover:-translate-y-0.5"
                                        style={{
                                            backgroundColor:
                                                "var(--color-api-second)",
                                            boxShadow:
                                                "0 8px 22px -8px color-mix(in srgb, var(--color-main) 45%, transparent)",
                                        }}
                                    >
                                        <HiArrowLeft
                                            className={`w-5 h-5 ${isRTL ? "rotate-180" : ""}`}
                                        />
                                        {t("cart.continueShopping")}
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <SideContentLayout
                        sidebar={
                            <CartSummary
                                summary={summary}
                                onCheckout={handleCheckout}
                                coupon={coupon}
                                onCouponChange={setCoupon}
                                isLoading={showSummaryLoading}
                                status={summaryStatus}
                                onAddAddress={() => navigate(paths.account.addAddress)}
                                couponDisabled={!!selectedCouponKey}
                                benefitsContent={
                                    activeBenefitsData?.has_benefits ? (
                                        <div className="space-y-3">
                                            <ActiveBenefitsSelector
                                                coupons={activeBenefitsData.coupons}
                                                freeDeliveries={activeBenefitsData.free_deliveries}
                                                selectedCouponKey={selectedCouponKey}
                                                selectedDeliveryKey={selectedDeliveryKey}
                                                onSelectCoupon={handleSelectCouponBenefit}
                                                onSelectDelivery={handleSelectDeliveryBenefit}
                                            />
                                            {preview?.available_promotions && preview.available_promotions.length > 0 && (
                                                <AvailablePromotionsSelector
                                                    promotions={preview.available_promotions}
                                                    selectedPromotionId={promotionId}
                                                    onSelect={handleSelectPromotion}
                                                />
                                            )}
                                        </div>
                                    ) : preview?.available_promotions && preview.available_promotions.length > 0 ? (
                                        <AvailablePromotionsSelector
                                            promotions={preview.available_promotions}
                                            selectedPromotionId={promotionId}
                                            onSelect={handleSelectPromotion}
                                        />
                                    ) : null
                                }
                            />
                        }
                        sidebarPosition="right"
                        gapClassName="gap-6"
                    >
                        <div className="space-y-6">
                            {/* Cart Items */}
                            <div className="bg-cart-items space-y-5 rounded-[24px] p-6">
                                {items.map((item) => {
                                    const orderItem = matchPreviewOrderItem(
                                        item,
                                        preview?.orderItems as OrderPreviewOrderItem[] | undefined
                                    );
                                    const previewPriceForItem = orderItem
                                        ? (() => {
                                              const priceBefore = toNum(orderItem.price);
                                              const priceAfter = toNum(
                                                  orderItem.price_after_discount ?? orderItem.price
                                              );
                                              return {
                                                  price: priceAfter || priceBefore,
                                                  priceBeforeDiscount:
                                                      priceBefore > 0 ? priceBefore : undefined,
                                              };
                                          })()
                                        : undefined;
                                    return (
                                        <CartItemCard
                                            key={item.id}
                                            item={item}
                                            previewPrices={previewPricesMap}
                                            previewPrice={previewPriceForItem}
                                            displayName={orderItem?.product_name}
                                            displayVariant={orderItem?.variant}
                                            freeQuantity={item.shop_product_variant_id != null ? freeItemsByVariant.get(item.shop_product_variant_id) : undefined}
                                            isExcludedFromCoupon={item.shop_product_variant_id != null ? excludedFromCouponSet.has(item.shop_product_variant_id) : false}
                                            canEditQuantity={cart_type === "default"}
                                            promotionBadges={promotionBadges}
                                            onQuantityChange={handleQuantityChange}
                                            onRemove={handleRemoveItem}
                                            onMoveToWishlist={handleMoveToWishlist}
                                        />
                                    );
                                })}
                            </div>

                            {/* Free gift promotions (buy_x_get_y) - items to offer */}
                            {preview?.non_discount_promotions &&
                                !Array.isArray(preview.non_discount_promotions) &&
                                (preview.non_discount_promotions as NonDiscountPromotion).free_items?.length > 0 && (
                                    <NonDiscountPromotionBanner
                                        promotion={preview.non_discount_promotions as NonDiscountPromotion}
                                        orderItemsByVariant={orderItemsByVariant}
                                        cartItems={items}
                                    />
                                )}

                            {/* Action Buttons */}
                            <div
                                className="flex flex-col gap-3 rounded-2xl p-4 sm:px-6 sm:py-4 border md:flex-row md:flex-wrap md:items-center md:justify-between"
                                style={{
                                    backgroundColor:
                                        "color-mix(in srgb, var(--color-main) 6%, var(--color-bg-card))",
                                    borderColor:
                                        "color-mix(in srgb, var(--color-main) 18%, transparent)",
                                }}
                            >
                                <Link to="/home" className="block w-full md:w-auto md:shrink-0">
                                    <Button
                                        variant="primary"
                                        className="h-12 w-full md:min-w-[252px] rounded-xl px-6 text-sm font-semibold text-white !bg-[color:var(--color-api-second)] hover:!bg-[color:var(--color-api-second-hover)] transition-colors"
                                    >
                                        <HiArrowLeft className={`w-5 h-5 ${isRTL ? "rotate-180" : ""}`} />
                                        {t("cart.returnToShop")}
                                    </Button>
                                </Link>
                                <div className="grid grid-cols-2 gap-3 md:flex md:items-center">
                                    <Button
                                        variant="outline"
                                        onClick={handleClearCartClick}
                                        className="h-12 w-full md:min-w-[150px] rounded-xl px-4 sm:px-6 text-sm font-medium transition-colors !bg-custom-card !border !border-[color:color-mix(in_srgb,var(--color-error)_35%,transparent)] !text-[color:var(--color-error)] hover:!bg-[color:color-mix(in_srgb,var(--color-error)_8%,var(--color-bg-card))]"
                                    >
                                        <HiTrash className="h-5 w-5" />
                                        {t("cart.clearCart", "Delete all")}
                                    </Button>
                                    <Button
                                        variant="outline"
                                        onClick={handleUpdateCart}
                                        className="h-12 w-full md:min-w-[150px] rounded-xl px-4 sm:px-6 text-sm font-medium !bg-custom-card !border !border-custom-primary !text-[color:var(--color-text)] hover:!border-[color:color-mix(in_srgb,var(--color-main)_35%,transparent)] hover:!bg-custom-hover transition-colors"
                                    >
                                        {t("cart.updateCart")}
                                    </Button>
                                </div>
                            </div>

                            {/* Schedule Delivery Section - only for product cart */}
                            {cart_type === "default" && (
                                <ScheduleDelivery
                                    onSaveSchedule={handleSaveSchedule}
                                    onCancelSchedule={() => console.log("Cancel schedule")}
                                    isSaving={createScheduledBasketMutation.isPending}
                                />
                            )}
                        </div>
                    </SideContentLayout>
                )}
            </div>

            {/* Clear cart confirmation popup */}
            <BasePopup
                isOpen={showClearCartPopup}
                onClose={() => setShowClearCartPopup(false)}
                icon={
                    <div
                        className="w-20 h-20 rounded-full flex items-center justify-center shadow-lg"
                        style={{
                            backgroundColor: "var(--color-error)",
                            boxShadow:
                                "0 12px 28px -10px color-mix(in srgb, var(--color-error) 40%, transparent)",
                        }}
                    >
                        <HiTrash className="w-10 h-10 text-white" />
                    </div>
                }
                title={t("cart.clearCartTitle", "Clear cart?")}
                description={t("cart.clearCartConfirm", "Are you sure you want to remove all items from your cart?")}
                contentClassName="pt-12 p-8"
                actions={
                    <div className="flex flex-col gap-3">
                        <Button
                            type="button"
                            variant="danger"
                            size="lg"
                            fullWidth
                            onClick={handleConfirmClearCart}
                            className="text-white rounded-xl"
                        >
                            {t("cart.clearCart", "Delete all")}
                        </Button>
                        <button
                            type="button"
                            onClick={() => setShowClearCartPopup(false)}
                            className="text-sm text-custom-secondary hover:text-custom-primary hover:underline transition-colors"
                        >
                            {t("common.cancel")}
                        </button>
                    </div>
                }
            />
        </div>
    );
}
