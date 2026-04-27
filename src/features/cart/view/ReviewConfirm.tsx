import { useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useLanguage } from "@/context/LanguageContext";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import SideContentLayout from "@/layout/SideContentLayout";
import { CheckoutProgressIndicator, SuccessPopup } from "@/shared/component";
import { useAddresses } from "@/features/account/hooks/useAddress";
import { useOrderPreview } from "../hooks/useOrderPreview";
import { useCartStore } from "@/store/cart";
import { useCheckoutStore } from "@/store/checkout";
import { _OrderApi } from "../api/orderApi";
import {
    ReviewDeliveryDetailsSidebar,
    ReviewAddressCard,
    ReviewPaymentCard,
    OrderItemsTable,
} from "../components";
import { usePaymentMethods } from "../hooks/usePaymentMethods";
import NonDiscountPromotionBanner from "../components/NonDiscountPromotionBanner";
import AvailablePromotionsSelector from "../components/AvailablePromotionsSelector";
import { paths } from "@/app/routes/path/paths";
import type { DeliveryAddress, ReviewOrderSummary, NonDiscountPromotion, OrderPreviewOrderItem } from "../types";
import { toNum } from "../utils";
import { enrichCartItemsWithPreview, getFreeOnlyDisplayItems, buildOrderItemsByVariant } from "../utils/enrichCartItems";
import { useCurrency } from "@/context/CurrencyContext";
import type { Address } from "@/features/account/types";
import OrderFlowHeader from "@/shared/component/OrderFlowHeader";

function mapAddressToDeliveryAddress(addr: Address): DeliveryAddress {
    const parts = [
        addr.street_name,
        addr.building_number,
        addr.floor_apartment,
        addr.nearest_landmark,
    ].filter(Boolean);

    let areaName: string | undefined;
    if (addr.area?.name) {
        if (typeof addr.area.name === "string") {
            areaName = addr.area.name;
        } else {
            areaName = addr.area.name.en || addr.area.name.ar;
        }
    }

    return {
        id: addr.id,
        fullName: addr.label,
        phoneNumber: addr.contact_phone,
        address: [...parts, areaName].filter(Boolean).join(","),
        tags: [addr.label, addr.is_default ? "Default" : null].filter(
            (x): x is string => x != null,
        ),
        isDefault: addr.is_default,
    };
}

export default function ReviewConfirm() {
    const { t } = useTranslation();
    const { isRTL } = useLanguage();
    const { formatPrice } = useCurrency();
    const navigate = useNavigate();
    const [showSuccessPopup, setShowSuccessPopup] = useState(false);
    const [createdOrderId, setCreatedOrderId] = useState<number | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigatingToTrackOrder = useRef(false);
    const navigatingToHome = useRef(false);

    const {
        addressId,
        coupon,
        paymentMethodId,
        additionalNotes,
        pointCouponExchangeId,
        pointFreeDeliveryExchangeId,
        useSubscriptionDiscount,
        useSubscriptionFreeDelivery,
        promotionId,
        setPromotionId,
    } = useCheckoutStore();
    const {
        items: cartItems,
        cart_type,
        recipe_id,
        admin_basket_id,
        admin_schedule_basket_id,
        basket_schedule_id,
        getPreviewItems,
        clearCart,
    } = useCartStore();

    const { data: addressesData = [] } = useAddresses();
    const checkoutAddresses = useMemo<DeliveryAddress[]>(
        () => addressesData.map(mapAddressToDeliveryAddress),
        [addressesData],
    );

    const selectedAddress =
        addressId != null
            ? checkoutAddresses.find((a) => a.id === addressId)
            : checkoutAddresses[0];
    const { methods: paymentMethods } = usePaymentMethods();
    const selectedPaymentMethod =
        paymentMethods.find((p) => p.id === paymentMethodId) ??
        paymentMethods[0];

    const addressIdNum = addressId ? Number(addressId) : null;
    const benefits = {
        pointCouponExchangeId,
        pointFreeDeliveryExchangeId,
        useSubscriptionDiscount,
        useSubscriptionFreeDelivery,
        promotionId,
    };
    const { data: preview } = useOrderPreview(
        addressIdNum,
        coupon || undefined,
        benefits,
        paymentMethodId || undefined
    );

    const orderItemsByVariant = useMemo(
        () => buildOrderItemsByVariant(preview?.orderItems as OrderPreviewOrderItem[] | undefined),
        [preview?.orderItems]
    );
    const enrichedItems = useMemo(
        () => enrichCartItemsWithPreview(cartItems, preview, formatPrice),
        [cartItems, preview, formatPrice]
    );
    const freeOnlyItems = useMemo(
        () => getFreeOnlyDisplayItems(preview, cartItems, t("cart.free", "FREE")),
        [preview, cartItems, t]
    );
    const displayItems = useMemo(
        () => [...enrichedItems, ...freeOnlyItems],
        [enrichedItems, freeOnlyItems]
    );

    const reviewSummary = useMemo<ReviewOrderSummary | null>(() => {
        if (!preview) return null;
        const couponDiscount = preview.coupon?.applied
            ? preview.coupon.discount
            : 0;
        return {
            items: displayItems,
            numOfItems: toNum(preview.total_quantity),
            subtotal: `£${toNum(preview.subtotal).toFixed(2)}`,
            shipping:
                toNum(preview.delivery_price) === 0
                    ? "Free"
                    : `£${toNum(preview.delivery_price).toFixed(2)}`,
            discounts: `-£${toNum(preview.basket_discount_amount).toFixed(2)}`,
            tax: "0%",
            couponDiscount: `-£${toNum(couponDiscount).toFixed(2)}`,
            ...(toNum(preview.subscription_discount) > 0 && {
                subscriptionDiscount: `-£${toNum(preview.subscription_discount).toFixed(2)}`,
            }),
            ...(toNum(preview.promotion_discount) > 0 && {
                promotionDiscount: `-£${toNum(preview.promotion_discount).toFixed(2)}`,
            }),
            pointsRedeemed: 0,
            pointsValue: "£0.00",
            total: `£${toNum(preview.total).toFixed(2)}`,
            estimatedDelivery: "2:00 PM - 4:00 PM",
            pointsEarned: 0,
            pointsBefore: 0,
            pointsNewBalance: 0,
            pointsSavings: "£0.00",
        };
    }, [preview, displayItems]);

    const handleConfirmOrder = async () => {
        if (!addressId || !preview) return;

        setIsSubmitting(true);
        try {
            const isInstantDelivery = cartItems.some((i) => !!i.is_instant_delivery);
            const payload = {
                address_id: Number(addressId),
                cart_type,
                is_instant_delivery: isInstantDelivery,
                items: getPreviewItems(),
                ...(coupon && { coupon }),
                ...(recipe_id != null && { recipe_id }),
                ...(admin_basket_id != null && { admin_basket_id }),
                ...(admin_schedule_basket_id != null && { admin_schedule_basket_id }),
                ...(basket_schedule_id != null && { basket_schedule_id }),
                ...(paymentMethodId && { payment_method_id: paymentMethodId }),
                ...(additionalNotes && { notes: additionalNotes }),
                ...(pointCouponExchangeId != null && { point_coupon_exchange_id: pointCouponExchangeId }),
                ...(pointFreeDeliveryExchangeId != null && { point_free_delivery_exchange_id: pointFreeDeliveryExchangeId }),
                ...(useSubscriptionDiscount && { use_subscription_discount: true }),
                ...(useSubscriptionFreeDelivery && { use_subscription_free_delivery: true }),
                ...(promotionId != null && { promotion_id: promotionId }),
            };

            const { id } = await _OrderApi.postOrder(payload);
            setShowSuccessPopup(true);
            setCreatedOrderId(id);
            useCheckoutStore.getState().reset();
            clearCart();
        } catch (err) {
            console.error("Order failed:", err);
            toast.error(
                t("cart.orderFailed", "Failed to create order. Please try again."),
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
        if (createdOrderId != null) {
            navigatingToTrackOrder.current = true;
            setShowSuccessPopup(false);
            setCreatedOrderId(null);
            navigate(paths.client.orderDetails(createdOrderId));
        }
    };

    const handleBackToHome = () => {
        navigatingToHome.current = true;
        setShowSuccessPopup(false);
        setCreatedOrderId(null);
        navigate(paths.client.home);
    };

    const handleEditAddress = () => {
        navigate(paths.client.checkout);
    };

    const handleEditPayment = () => {
        navigate(paths.client.checkout);
    };

    const handleMoveToWishlist = (itemId: number | string) => {
        console.log("Move to wishlist:", itemId);
    };

    const isSuccessState = showSuccessPopup || createdOrderId != null;

    if (
        !isSuccessState &&
        cartItems.length === 0 &&
        !navigatingToTrackOrder.current &&
        !navigatingToHome.current
    ) {
        navigate(paths.client.cart);
        return null;
    }

    if (
        !isSuccessState &&
        checkoutAddresses.length === 0 &&
        !navigatingToTrackOrder.current &&
        !navigatingToHome.current
    ) {
        navigate(paths.client.checkout);
        return null;
    }

    if (
        !isSuccessState &&
        !addressId &&
        checkoutAddresses.length > 0 &&
        !navigatingToTrackOrder.current &&
        !navigatingToHome.current
    ) {
        navigate(paths.client.checkout);
        return null;
    }

    if (
        !isSuccessState &&
        addressId &&
        !selectedAddress &&
        checkoutAddresses.length > 0 &&
        !navigatingToTrackOrder.current &&
        !navigatingToHome.current
    ) {
        navigate(paths.client.checkout);
        return null;
    }

    const fallbackSummary: ReviewOrderSummary = {
        items: cartItems,
        numOfItems: cartItems.reduce((s, i) => s + i.quantity, 0),
        subtotal: "£0.00",
        shipping: "-",
        discounts: "£0.00",
        tax: "0%",
        couponDiscount: "£0.00",
        pointsRedeemed: 0,
        pointsValue: "£0.00",
        total: "£0.00",
        estimatedDelivery: "-",
        pointsEarned: 0,
        pointsBefore: 0,
        pointsNewBalance: 0,
        pointsSavings: "£0.00",
    };

    return (
        <div className="bg-custom-tertiary min-h-screen">
              {/* <OrderFlowHeader /> */}
            <div className="page-container py-6" dir={isRTL ? "rtl" : "ltr"}>
                <div className="mb-8">
                    <CheckoutProgressIndicator currentStep="review" />
                </div>

                <div className="text-center mb-8">
                    <h1 className="text-2xl sm:text-3xl font-bold text-[color:var(--color-text)] mb-2">
                        {t("checkout.reviewTitle", "Review your order")}
                    </h1>
                    <p className="text-sm text-custom-secondary max-w-lg mx-auto leading-relaxed">
                        {t(
                            "checkout.reviewMessage",
                            "Please check all details before confirming your order.",
                        )}
                    </p>
                </div>

                <SideContentLayout
                    sidebar={
                        <ReviewDeliveryDetailsSidebar
                            summary={reviewSummary ?? fallbackSummary}
                            onConfirmOrder={handleConfirmOrder}
                            isLoading={isSubmitting}
                        />
                    }
                    sidebarPosition="right"
                    gapClassName="gap-6"
                    columnTemplate="1fr 362px"
                >
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {selectedAddress && (
                                <ReviewAddressCard
                                    address={selectedAddress}
                                    onEdit={handleEditAddress}
                                />
                            )}
                            <ReviewPaymentCard
                                paymentMethod={selectedPaymentMethod}
                                onEdit={handleEditPayment}
                            />
                        </div>

                        {preview?.available_promotions && preview.available_promotions.length > 0 && (
                            <AvailablePromotionsSelector
                                promotions={preview.available_promotions}
                                selectedPromotionId={promotionId}
                                onSelect={setPromotionId}
                            />
                        )}

                        {preview?.non_discount_promotions &&
                            !Array.isArray(preview.non_discount_promotions) &&
                            (preview.non_discount_promotions as NonDiscountPromotion).free_items?.length > 0 && (
                                <NonDiscountPromotionBanner
                                    promotion={preview.non_discount_promotions as NonDiscountPromotion}
                                    orderItemsByVariant={orderItemsByVariant}
                                    cartItems={cartItems}
                                />
                            )}

                        <OrderItemsTable
                            items={displayItems}
                            onMoveToWishlist={handleMoveToWishlist}
                        />
                    </div>
                </SideContentLayout>

                <SuccessPopup
                    isOpen={showSuccessPopup}
                    onClose={handleClosePopup}
                    pointsEarned={reviewSummary?.pointsEarned ?? 0}
                    primaryButtonText={t("successPopup.detailsOrder", "Details Order")}
                    onPrimaryClick={handleOrderDetails}
                    secondaryButtonText={t("successPopup.backToHome", "Back to home page")}
                    onSecondaryClick={handleBackToHome}
                />
            </div>
        </div>
    );
}
