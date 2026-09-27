import { useState, useMemo, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useLanguage } from "@/context/LanguageContext";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { CheckoutProgressIndicator, SuccessPopup } from "@/shared/component";
import CheckoutOrderSummary from "../components/CheckoutOrderSummary";
import OrderItemsTable from "../components/OrderItemsTable";
import { useOrderPreview } from "../hooks/useOrderPreview";
import { useCartStore } from "@/store/cart";
import { useCheckoutStore } from "@/store/checkout";
import { usePaymentMethods } from "../hooks/usePaymentMethods";
import { _OrderApi } from "../api/orderApi";
import { paths } from "@/app/routes/path/paths";
import type { CheckoutOrderSummary as CheckoutOrderSummaryType } from "../types";
import {
    enrichCartItemsWithPreview,
    getFreeOnlyDisplayItems,
} from "../utils/enrichCartItems";
import { useCurrency } from "@/context/CurrencyContext";
import { mapPreviewToCheckoutSummary } from "../utils/orderSummary";
import {
    isCustomerSelectedPromotion,
    resolveCustomerPromotionId,
} from "../utils/automaticPromotions";
import { isPaymentMethodEnabled } from "../utils/paymentMethods";

import circle from "/images/shared/circle.png";
import circleBottom from "/images/shared/circleBottom.png";

export default function ReviewConfirm() {
    const { t, i18n } = useTranslation();
    const { isRTL } = useLanguage();
    const navigate = useNavigate();
    const { formatPrice } = useCurrency();
    const cartItems = useCartStore((s) => s.items);
    const cart_type = useCartStore((s) => s.cart_type);
    const recipe_id = useCartStore((s) => s.recipe_id);
    const admin_basket_id = useCartStore((s) => s.admin_basket_id);
    const admin_schedule_basket_id = useCartStore((s) => s.admin_schedule_basket_id);
    const basket_schedule_id = useCartStore((s) => s.basket_schedule_id);
    const getPreviewItems = useCartStore((s) => s.getPreviewItems);
    const clearCart = useCartStore((s) => s.clearCart);

    const [showSuccessPopup, setShowSuccessPopup] = useState(false);
    const [createdOrderId, setCreatedOrderId] = useState<number | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigatingToTrackOrder = useRef(false);
    const navigatingToHome = useRef(false);

    const {
        addressId: storedAddressId,
        coupon: storedCoupon,
        paymentMethodId: storedPaymentId,
        additionalNotes,
        pointCouponExchangeId,
        pointFreeDeliveryExchangeId,
        useSubscriptionDiscount,
        useSubscriptionFreeDelivery,
        promotionId,
        setPromotionId,
    } = useCheckoutStore();

    const previewBenefits = useMemo(
        () => ({
            pointCouponExchangeId,
            pointFreeDeliveryExchangeId,
            useSubscriptionDiscount,
            useSubscriptionFreeDelivery,
            promotionId,
        }),
        [
            pointCouponExchangeId,
            pointFreeDeliveryExchangeId,
            useSubscriptionDiscount,
            useSubscriptionFreeDelivery,
            promotionId,
        ],
    );

    const { methods: paymentMethods, isLoading: paymentMethodsLoading } =
        usePaymentMethods();

    const selectedPaymentMethod = paymentMethods.find(
        (method) => method.id === storedPaymentId && isPaymentMethodEnabled(method),
    );

    const { data: preview } = useOrderPreview(
        storedAddressId ? Number(storedAddressId) : null,
        storedCoupon || undefined,
        previewBenefits,
        storedPaymentId || undefined,
    );

    const enrichedItems = useMemo(
        () => enrichCartItemsWithPreview(cartItems, preview, formatPrice),
        [cartItems, preview, formatPrice],
    );
    const freeOnlyItems = useMemo(
        () => getFreeOnlyDisplayItems(preview, cartItems, t("cart.free", "FREE")),
        [preview, cartItems, t],
    );
    const displayItems = useMemo(
        () => [...enrichedItems, ...freeOnlyItems],
        [enrichedItems, freeOnlyItems],
    );

    const checkoutSummary = useMemo<CheckoutOrderSummaryType | null>(() => {
        if (!preview) return null;
        return mapPreviewToCheckoutSummary(preview, displayItems, formatPrice, {
            language: i18n.language,
            discountLabel: t("cart.promotionDiscount"),
            freeShippingLabel: t("cart.automaticFreeShipping"),
            freeShippingValue: t("cart.freeDelivery"),
        });
    }, [displayItems, formatPrice, i18n.language, preview, t]);

    useEffect(() => {
        if (promotionId == null || !preview?.available_promotions) return;
        const match = preview.available_promotions.find((promo) => promo.id === promotionId);
        if (match && !isCustomerSelectedPromotion(match)) {
            setPromotionId(null);
        }
    }, [preview?.available_promotions, promotionId, setPromotionId]);

    const isSuccessState = showSuccessPopup || createdOrderId != null;

    useEffect(() => {
        if (isSuccessState) return;
        if (
            cartItems.length === 0 &&
            !navigatingToTrackOrder.current &&
            !navigatingToHome.current
        ) {
            navigate(paths.client.cart, { replace: true });
        }
    }, [cartItems.length, isSuccessState, navigate]);

    useEffect(() => {
        if (isSuccessState || paymentMethodsLoading) return;
        if (!storedAddressId || !selectedPaymentMethod) {
            navigate(paths.client.checkout, { replace: true });
        }
    }, [
        isSuccessState,
        navigate,
        paymentMethodsLoading,
        selectedPaymentMethod,
        storedAddressId,
    ]);

    const canConfirm =
        Boolean(storedAddressId) &&
        Boolean(preview) &&
        Boolean(selectedPaymentMethod) &&
        !isSubmitting;

    const handleConfirmOrder = async () => {
        if (!canConfirm || !storedAddressId || !preview || !selectedPaymentMethod) {
            return;
        }

        setIsSubmitting(true);
        try {
            const isInstantDelivery = cartItems.some((item) => !!item.is_instant_delivery);
            const promotionToSend = resolveCustomerPromotionId(
                promotionId,
                preview.available_promotions,
            );
            const payload = {
                address_id: Number(storedAddressId),
                cart_type,
                is_instant_delivery: isInstantDelivery,
                items: getPreviewItems(),
                ...(storedCoupon && { coupon: storedCoupon }),
                ...(recipe_id != null && { recipe_id }),
                ...(admin_basket_id != null && { admin_basket_id }),
                ...(admin_schedule_basket_id != null && {
                    admin_schedule_basket_id,
                }),
                ...(basket_schedule_id != null && { basket_schedule_id }),
                payment_method_id: selectedPaymentMethod.id,
                ...(additionalNotes && { notes: additionalNotes }),
                ...(pointCouponExchangeId != null && {
                    point_coupon_exchange_id: pointCouponExchangeId,
                }),
                ...(pointFreeDeliveryExchangeId != null && {
                    point_free_delivery_exchange_id: pointFreeDeliveryExchangeId,
                }),
                ...(useSubscriptionDiscount && { use_subscription_discount: true }),
                ...(useSubscriptionFreeDelivery && {
                    use_subscription_free_delivery: true,
                }),
                ...(promotionToSend != null && { promotion_id: promotionToSend }),
            };

            const { id } = await _OrderApi.postOrder(payload);
            setShowSuccessPopup(true);
            setCreatedOrderId(id);
            useCheckoutStore.getState().reset();
            clearCart();
        } catch (err) {
            console.error("Order failed:", err);
            toast.error(
                t("checkout.orderFailed", "Could not place this order. Please try again."),
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleClosePopup = () => {
        setShowSuccessPopup(false);
        setCreatedOrderId(null);
    };

    const handleOrderDetails = () => {
        if (createdOrderId == null) return;
        navigatingToTrackOrder.current = true;
        setShowSuccessPopup(false);
        setCreatedOrderId(null);
        navigate(paths.client.orderDetails(createdOrderId));
    };

    const handleBackToHome = () => {
        navigatingToHome.current = true;
        setShowSuccessPopup(false);
        setCreatedOrderId(null);
        navigate(paths.client.home);
    };

    if (!isSuccessState && (cartItems.length === 0 || !storedAddressId)) {
        return null;
    }

    if (!isSuccessState && !paymentMethodsLoading && !selectedPaymentMethod) {
        return null;
    }

    return (
        <div className="bg-custom-tertiary min-h-screen relative">
            <div className="page-container py-6 relative" dir={isRTL ? "rtl" : "ltr"}>
                <img
                    src={circle}
                    alt=""
                    className="absolute left-0 top-0 opacity-60 pointer-events-none"
                />
                <img
                    src={circleBottom}
                    alt=""
                    className="absolute right-0 -bottom-2/4 opacity-60 pointer-events-none"
                />

                <div className="mb-8">
                    <CheckoutProgressIndicator currentStep="review" />
                </div>

                <div className="mx-auto flex w-full max-w-3xl flex-col gap-6">
                    {selectedPaymentMethod && (
                        <section className="rounded-2xl border border-custom-primary bg-custom-card px-4 py-4 sm:px-5">
                            <h2 className="text-base font-bold text-[color:var(--color-text)]">
                                {t("checkout.paymentMethod", "Payment method")}
                            </h2>
                            <p className="mt-2 text-sm font-semibold text-[color:var(--color-text)]">
                                {selectedPaymentMethod.name}
                            </p>
                        </section>
                    )}

                    {displayItems.length > 0 && (
                        <OrderItemsTable
                            items={displayItems}
                            compact
                            showTitle={false}
                        />
                    )}

                    <CheckoutOrderSummary
                        totalOnly
                        summary={
                            checkoutSummary ?? {
                                items: [],
                                itemsTotal: formatPrice(0),
                                subtotal: formatPrice(0),
                                deliveryFees: "-",
                                storeDiscounts: formatPrice(0),
                                couponDiscount: formatPrice(0),
                                total: formatPrice(0),
                            }
                        }
                        onPlaceOrder={handleConfirmOrder}
                        canContinue={canConfirm}
                        isLoading={isSubmitting}
                        backHref={paths.client.checkout}
                        backLabel={t("checkout.backToCheckout", "Back to checkout")}
                    />
                </div>

                <SuccessPopup
                    isOpen={showSuccessPopup}
                    onClose={handleClosePopup}
                    pointsEarned={checkoutSummary?.pointsEarned ?? 0}
                    primaryButtonText={t("orders.viewDetails")}
                    onPrimaryClick={handleOrderDetails}
                    secondaryButtonText={t(
                        "successPopup.backToHome",
                        "Back to home page",
                    )}
                    onSecondaryClick={handleBackToHome}
                />
            </div>
        </div>
    );
}
