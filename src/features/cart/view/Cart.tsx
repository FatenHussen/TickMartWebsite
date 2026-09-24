import { useMemo, useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useLanguage } from "@/context/LanguageContext";
import { useNavigate, Link } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { paths } from "@/app/routes/path/paths";
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
import { assignPreviewOrderItemsToCart } from "../utils/enrichCartItems";
import { mapPreviewToCartSummary } from "../utils/orderSummary";
import { ScreenPromotions } from "@/features/promotions";

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

    const orderItemsByVariant = useMemo(() => {
        const arr = preview?.orderItems as OrderPreviewOrderItem[] | undefined;
        if (!arr?.length) return new Map<number, OrderPreviewOrderItem>();
        const m = new Map<number, OrderPreviewOrderItem>();
        arr.forEach((it) => m.set(it.shop_product_variant_id, it));
        return m;
    }, [preview?.orderItems]);

    const previewOrderItemByCartId = useMemo(
        () =>
            assignPreviewOrderItemsToCart(
                items,
                preview?.orderItems as OrderPreviewOrderItem[] | undefined
            ),
        [items, preview?.orderItems]
    );

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

    const handleClearCartClick = () => {
        setShowClearCartPopup(true);
    };

    const handleConfirmClearCart = () => {
        clearCart();
        setShowClearCartPopup(false);
        toast.success(t("cart.cartCleared", "Cart cleared"));
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
    const storeCount = useMemo(() => {
        const keys = items.map((item) => item.shopId ?? item.storeId ?? item.store);
        return new Set(keys.filter(Boolean)).size;
    }, [items]);
    const pointsEarned =
        preview?.automatic_promotions?.points_expected ??
        preview?.automatic_promotions?.points_awarded;
    const benefitsContent = activeBenefitsData?.has_benefits ? (
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
    ) : null;

    return (
        <div className="min-h-screen bg-custom-tertiary">
            <div className="page-container py-6" dir={isRTL ? "rtl" : "ltr"}>
                {!isCartEmpty && (
                    <div className="mb-6">
                        <CheckoutProgressIndicator currentStep="cart" />
                    </div>
                )}

                <ScreenPromotions pageSlug="cart" placement="top" className="mb-6" />

                {isCartEmpty ? (
                    <div className="flex justify-center items-center min-h-[52vh]">
                        <div className="w-full max-w-md rounded-2xl border border-custom-primary bg-custom-card px-8 py-12 text-center">
                            <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-custom-muted text-custom-secondary">
                                <svg
                                    className="h-7 w-7"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    aria-hidden
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={1.5}
                                        d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                                    />
                                </svg>
                            </div>
                            <h1 className="text-xl font-semibold text-custom-primary mb-2">
                                {t("cart.yourCartIsEmpty")}
                            </h1>
                            <p className="text-sm text-custom-secondary mb-7 max-w-xs mx-auto leading-relaxed">
                                {t("cart.emptyCartHint")}
                            </p>
                            <Link
                                to={paths.client.home}
                                className="inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold text-white !bg-[color:var(--color-api-second)] hover:!bg-[color:var(--color-api-second-hover)]"
                            >
                                <HiArrowLeft className={`w-4 h-4 ${isRTL ? "rotate-180" : ""}`} />
                                {t("cart.continueShopping")}
                            </Link>
                        </div>
                    </div>
                ) : (
                    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6">
                        <div className="space-y-6">
                            <div className="flex flex-wrap items-end justify-between gap-3">
                                <div>
                                    <h1 className="text-2xl font-semibold tracking-tight text-custom-primary">
                                        {t("cart.myShoppingCart")}
                                    </h1>
                                    <p className="mt-1 text-sm text-custom-secondary">
                                        {t("cart.itemsInCart", "{{count}} items", {
                                            count: summary.numOfItems || items.reduce((sum, i) => sum + i.quantity, 0),
                                        })}
                                    </p>
                                </div>
                                <div className="flex items-center gap-4 text-sm">
                                    <Link
                                        to={paths.client.home}
                                        className="inline-flex items-center gap-1.5 font-medium text-custom-secondary hover:text-custom-primary"
                                    >
                                        <HiArrowLeft className={`w-4 h-4 ${isRTL ? "rotate-180" : ""}`} />
                                        {t("cart.continueShopping")}
                                    </Link>
                                    <button
                                        type="button"
                                        onClick={handleClearCartClick}
                                        className="inline-flex items-center gap-1.5 font-medium text-custom-secondary hover:text-[color:var(--color-error)]"
                                    >
                                        <HiTrash className="h-4 w-4" />
                                        {t("cart.clearCart")}
                                    </button>
                                </div>
                            </div>

                            {storeCount > 1 && (
                                <p className="-mt-3 text-sm text-custom-secondary">
                                    {t("cart.buyingFromStores", { count: storeCount })}
                                </p>
                            )}

                            <div className="overflow-hidden rounded-2xl border border-custom-primary bg-custom-card divide-y divide-[color:color-mix(in_srgb,var(--color-border-primary)_85%,transparent)]">
                                {items.map((item) => {
                                    const orderItem = previewOrderItemByCartId.get(item.id);
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
                                    const previewSubtotalFormatted =
                                        orderItem?.subtotal != null
                                            ? formatPrice(toNum(orderItem.subtotal))
                                            : undefined;
                                    const extrasTotal =
                                        orderItem?.extras_total != null &&
                                        toNum(orderItem.extras_total) > 0
                                            ? formatPrice(toNum(orderItem.extras_total))
                                            : undefined;
                                    const productHref = item.productId
                                        ? `${paths.client.productDetails(item.productId)}${
                                              item.shopId != null ? `?shop_id=${item.shopId}` : ""
                                          }`
                                        : undefined;
                                    return (
                                        <CartItemCard
                                            key={item.id}
                                            item={item}
                                            previewPrices={previewPricesMap}
                                            previewPrice={previewPriceForItem}
                                            previewSubtotal={previewSubtotalFormatted}
                                            extrasTotal={extrasTotal}
                                            note={orderItem?.note ?? item.note}
                                            image={orderItem?.product_image || orderItem?.image}
                                            displayName={orderItem?.product_name}
                                            displayVariant={orderItem?.variant}
                                            displayStore={orderItem?.shop_name}
                                            productHref={productHref}
                                            freeQuantity={item.shop_product_variant_id != null ? freeItemsByVariant.get(item.shop_product_variant_id) : undefined}
                                            isExcludedFromCoupon={item.shop_product_variant_id != null ? excludedFromCouponSet.has(item.shop_product_variant_id) : false}
                                            canEditQuantity={cart_type === "default"}
                                            onQuantityChange={handleQuantityChange}
                                            onRemove={handleRemoveItem}
                                        />
                                    );
                                })}
                            </div>

                            {preview?.non_discount_promotions &&
                                !Array.isArray(preview.non_discount_promotions) &&
                                (preview.non_discount_promotions as NonDiscountPromotion).free_items?.length > 0 && (
                                    <NonDiscountPromotionBanner
                                        promotion={preview.non_discount_promotions as NonDiscountPromotion}
                                        orderItemsByVariant={orderItemsByVariant}
                                        cartItems={items}
                                    />
                                )}

                            <ScreenPromotions pageSlug="cart" placement="bottom" />

                            {cart_type === "default" && (
                                <ScheduleDelivery
                                    onSaveSchedule={handleSaveSchedule}
                                    isSaving={createScheduledBasketMutation.isPending}
                                />
                            )}
                        </div>

                        <CartSummary
                            summary={summary}
                            onCheckout={handleCheckout}
                            coupon={coupon}
                            onCouponChange={setCoupon}
                            isLoading={showSummaryLoading}
                            status={summaryStatus}
                            onAddAddress={() => navigate(paths.account.addAddress)}
                            couponDisabled={!!selectedCouponKey}
                            pointsEarned={typeof pointsEarned === "number" ? pointsEarned : undefined}
                            benefitsContent={benefitsContent}
                        />
                    </div>
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
