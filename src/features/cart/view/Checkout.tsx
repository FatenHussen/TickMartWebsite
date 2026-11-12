import { useState, useMemo, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useLanguage } from "@/context/LanguageContext";
import { useNavigate } from "react-router-dom";
import { CheckoutProgressIndicator } from "@/shared/component";
import CheckoutAddressSection from "../components/CheckoutAddressSection";
import CheckoutPaymentSection from "../components/CheckoutPaymentSection";
import OrderItemsTable from "../components/OrderItemsTable";
import CheckoutOrderSummary from "../components/CheckoutOrderSummary";
import NonDiscountPromotionBanner from "../components/NonDiscountPromotionBanner";
import AvailablePromotionsSelector from "../components/AvailablePromotionsSelector";
import ActiveBenefitsSelector from "../components/ActiveBenefitsSelector";
import CheckoutCouponSection from "../components/CheckoutCouponSection";
import { useActiveBenefits } from "../hooks/useActiveBenefits";
import {
    customerSelectedPromotions,
    isCustomerSelectedPromotion,
} from "../utils/automaticPromotions";
import { useAddresses } from "@/features/account/hooks/useAddress";
import { useOrderPreview } from "../hooks/useOrderPreview";
import { useCartStore } from "@/store/cart";
import { useCheckoutStore } from "@/store/checkout";
import AddressForm from "@/features/account/view/AddressForm";
import { usePaymentMethods } from "../hooks/usePaymentMethods";
import { paths } from "@/app/routes/path/paths";
import type {
    CheckoutOrderSummary as CheckoutOrderSummaryType,
    DeliveryAddress,
    NonDiscountPromotion,
    OrderPreviewOrderItem,
} from "../types";
import { mapPreviewToCheckoutSummary } from "../utils/orderSummary";
import {
    enrichCartItemsWithPreview,
    getFreeOnlyDisplayItems,
    buildOrderItemsByVariant,
} from "../utils/enrichCartItems";
import { useCurrency } from "@/context/CurrencyContext";
import type { Address } from "@/features/account/types";
import {
    isPaymentMethodEnabled,
    resolveSelectablePaymentMethodId,
} from "../utils/paymentMethods";
import DeliveryChoiceSection from "../components/DeliveryChoiceSection";
import { useCartCheckout } from "../hooks/useCartCheckout";
import {
    checkoutBlockMessage,
    isBeforeEarliest,
    isMinimumOrderBlock,
} from "../lib/cartCheckout";

import circle from "/images/shared/circle.png";
import circleBottom from "/images/shared/circleBottom.png";

const PAYMENT_STORAGE_KEY = "tikmool_payment_method_id";

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
        address: [...parts, areaName].filter(Boolean).join(", "),
        isDefault: addr.is_default,
    };
}

export default function Checkout() {
    const { t, i18n } = useTranslation();
    const { isRTL } = useLanguage();
    const navigate = useNavigate();
    const { formatPrice } = useCurrency();
    const { data: addressesData = [] } = useAddresses();
    const cartItems = useCartStore((s) => s.items);

    const checkoutAddresses = useMemo<DeliveryAddress[]>(
        () => addressesData.map(mapAddressToDeliveryAddress),
        [addressesData],
    );

    const defaultAddress =
        checkoutAddresses.find((a) => a.isDefault) ?? checkoutAddresses[0];
    const {
        addressId: storedAddressId,
        coupon: storedCoupon,
        paymentMethodId: storedPaymentId,
        pointCouponExchangeId,
        pointFreeDeliveryExchangeId,
        useSubscriptionDiscount,
        useSubscriptionFreeDelivery,
        promotionId,
        deliveryChoice,
        scheduledDeliveryAt,
        setAddressId,
        setPaymentMethodId,
        setPromotionId,
        setDeliveryChoice,
        setScheduledDeliveryAt,
        setEarliestDeliveryAt,
        setCoupon: setCheckoutCoupon,
        setPointCouponExchangeId,
        setPointFreeDeliveryExchangeId,
        setUseSubscriptionDiscount,
        setUseSubscriptionFreeDelivery,
    } = useCheckoutStore();

    const { data: activeBenefitsData } = useActiveBenefits();
    const [selectedCouponKey, setSelectedCouponKey] = useState<string | null>(null);
    const [selectedDeliveryKey, setSelectedDeliveryKey] = useState<string | null>(null);

    /** Only one discount source may apply: a code, a points/subscription benefit, or a promotion. */
    const handleApplyCoupon = (code: string) => {
        setSelectedCouponKey(null);
        setPointCouponExchangeId(null);
        setUseSubscriptionDiscount(false);
        setPromotionId(null);
        setCheckoutCoupon(code);
    };

    const handleRemoveCoupon = () => setCheckoutCoupon("");

    const handleSelectCouponBenefit = (
        key: string | null,
        value: number | boolean | null,
    ) => {
        setSelectedCouponKey(key);
        setPointCouponExchangeId(null);
        setUseSubscriptionDiscount(false);
        if (key === "point_coupon_exchange_id" && typeof value === "number") {
            setPointCouponExchangeId(value);
            setCheckoutCoupon("");
        } else if (key === "use_subscription_discount") {
            setUseSubscriptionDiscount(true);
            setCheckoutCoupon("");
        }
        // A promotion conflicts with any discount benefit.
        setPromotionId(null);
    };

    const handleSelectDeliveryBenefit = (
        key: string | null,
        value: number | boolean | null,
    ) => {
        setSelectedDeliveryKey(key);
        setPointFreeDeliveryExchangeId(null);
        setUseSubscriptionFreeDelivery(false);
        if (key === "point_free_delivery_exchange_id" && typeof value === "number") {
            setPointFreeDeliveryExchangeId(value);
        } else if (key === "use_subscription_free_delivery") {
            setUseSubscriptionFreeDelivery(true);
        }
    };

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

    const { methods: paymentMethods } = usePaymentMethods();

    const selectedAddressId =
        storedAddressId ?? defaultAddress?.id ?? checkoutAddresses[0]?.id ?? "";
    const [selectedPaymentMethodId, setSelectedPaymentMethodId] = useState(
        () =>
            resolveSelectablePaymentMethodId(
                paymentMethods,
                storedPaymentId || localStorage.getItem(PAYMENT_STORAGE_KEY),
            ),
    );
    const [showAddAddressForm, setShowAddAddressForm] = useState(false);

    const { data: serverCheckout } = useCartCheckout();
    const { data: preview, isLoading: isPreviewLoading } = useOrderPreview(
        selectedAddressId ? Number(selectedAddressId) : null,
        storedCoupon || undefined,
        previewBenefits,
        selectedPaymentMethodId || undefined,
    );

    /** A points / subscription discount is active, so a code cannot stack on it. */
    const couponBlockedByBenefit = Boolean(selectedCouponKey);

    const orderItemsByVariant = useMemo(
        () =>
            buildOrderItemsByVariant(
                preview?.orderItems as OrderPreviewOrderItem[] | undefined,
            ),
        [preview?.orderItems],
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
    const checkoutSummary = useMemo<CheckoutOrderSummaryType>(() => {
        if (preview) {
            return mapPreviewToCheckoutSummary(preview, displayItems, formatPrice, {
                language: i18n.language,
                discountLabel: t("cart.promotionDiscount"),
                freeShippingLabel: t("cart.automaticFreeShipping"),
                freeShippingValue: t("cart.freeDelivery"),
            });
        }
        return {
            items: displayItems,
            itemsTotal: formatPrice(0),
            subtotal: formatPrice(0),
            deliveryFees: "-",
            storeDiscounts: formatPrice(0),
            couponDiscount: formatPrice(0),
            total: formatPrice(0),
        };
    }, [displayItems, formatPrice, i18n.language, preview, t]);

    const selectedPaymentMethod =
        paymentMethods.find(
            (method) =>
                method.id === selectedPaymentMethodId &&
                isPaymentMethodEnabled(method),
        ) ?? paymentMethods.find(isPaymentMethodEnabled);

    useEffect(() => {
        if (cartItems.length === 0) {
            navigate(paths.client.cart, { replace: true });
        }
    }, [cartItems.length, navigate]);

    useEffect(() => {
        if (promotionId == null || !preview?.available_promotions) return;
        const match = preview.available_promotions.find((promo) => promo.id === promotionId);
        if (match && !isCustomerSelectedPromotion(match)) {
            setPromotionId(null);
        }
    }, [preview?.available_promotions, promotionId, setPromotionId]);

    useEffect(() => {
        if (defaultAddress && !storedAddressId && checkoutAddresses.length > 0) {
            setAddressId(defaultAddress.id);
        }
    }, [defaultAddress, storedAddressId, checkoutAddresses.length, setAddressId]);

    useEffect(() => {
        if (paymentMethods.length === 0) return;

        const nextId = resolveSelectablePaymentMethodId(
            paymentMethods,
            selectedPaymentMethodId ||
                storedPaymentId ||
                localStorage.getItem(PAYMENT_STORAGE_KEY),
        );

        if (!nextId || nextId === selectedPaymentMethodId) return;

        setSelectedPaymentMethodId(nextId);
        setPaymentMethodId(nextId);
        localStorage.setItem(PAYMENT_STORAGE_KEY, nextId);
    }, [
        paymentMethods,
        selectedPaymentMethodId,
        setPaymentMethodId,
        storedPaymentId,
    ]);

    const handleAddressSelect = (addressId: number | string) => {
        setAddressId(addressId);
    };

    const handlePaymentMethodSelect = (methodId: string) => {
        const method = paymentMethods.find((item) => item.id === methodId);
        if (!method || !isPaymentMethodEnabled(method)) return;

        setSelectedPaymentMethodId(methodId);
        setPaymentMethodId(methodId);
        localStorage.setItem(PAYMENT_STORAGE_KEY, methodId);
    };

    const checkout = preview?.checkout ?? serverCheckout ?? null;
    const instantOnly = checkout?.instant_only === true;
    const blockedByMinimum = isMinimumOrderBlock(checkout);
    const scheduledTooEarly =
        !instantOnly &&
        deliveryChoice === "scheduled" &&
        (!scheduledDeliveryAt ||
            isBeforeEarliest(scheduledDeliveryAt, checkout?.earliest_delivery_at));
    const checkoutMessage = checkoutBlockMessage(checkout);
    const canContinue =
        Boolean(selectedAddressId) &&
        Boolean(selectedPaymentMethod) &&
        !blockedByMinimum &&
        checkout?.can_checkout !== false &&
        !scheduledTooEarly;

    useEffect(() => {
        setEarliestDeliveryAt(checkout?.earliest_delivery_at || null);
    }, [checkout?.earliest_delivery_at, setEarliestDeliveryAt]);

    const handleAddNewAddress = () => {
        setShowAddAddressForm(true);
    };

    const handleAddressFormSuccess = (addressId?: number) => {
        setShowAddAddressForm(false);
        if (addressId != null) {
            setAddressId(addressId);
        }
    };

    const handleContinueToReview = () => {
        if (!canContinue || !selectedAddressId || !selectedPaymentMethod) return;
        if (
            !instantOnly &&
            deliveryChoice === "scheduled" &&
            (!scheduledDeliveryAt ||
                isBeforeEarliest(scheduledDeliveryAt, checkout?.earliest_delivery_at))
        ) {
            return;
        }
        setAddressId(selectedAddressId);
        setPaymentMethodId(selectedPaymentMethod.id);
        navigate(paths.client.review);
    };

    if (cartItems.length === 0) {
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
                    <CheckoutProgressIndicator currentStep="checkout" />
                </div>

                <div className="mx-auto grid w-full max-w-6xl items-start gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(300px,380px)]">
                    <div className="flex min-w-0 flex-col gap-6">
                    <h1 className="text-xl font-bold text-[color:var(--color-text)]">
                        {t("checkout.paymentStep", "Payment")}
                    </h1>
                    {!showAddAddressForm ? (
                        <CheckoutAddressSection
                            addresses={checkoutAddresses}
                            selectedAddressId={selectedAddressId}
                            onAddressSelect={handleAddressSelect}
                            onAddNewAddress={handleAddNewAddress}
                        />
                    ) : (
                        <AddressForm
                            inline
                            onSuccess={handleAddressFormSuccess}
                            onCancel={() => setShowAddAddressForm(false)}
                        />
                    )}

                    <CheckoutPaymentSection
                        paymentMethods={paymentMethods}
                        selectedPaymentMethodId={selectedPaymentMethodId}
                        onPaymentMethodSelect={handlePaymentMethodSelect}
                    />

                    {!blockedByMinimum && (
                        <DeliveryChoiceSection
                            choice={deliveryChoice}
                            scheduledDeliveryAt={scheduledDeliveryAt}
                            earliestDeliveryAt={checkout?.earliest_delivery_at ?? ""}
                            instantOnly={instantOnly}
                            onChoiceChange={setDeliveryChoice}
                            onScheduledChange={setScheduledDeliveryAt}
                        />
                    )}

                    {/* `رصيدك الحالي` — points and subscription benefits with apply buttons. */}
                    {activeBenefitsData?.has_benefits && (
                        <ActiveBenefitsSelector
                            coupons={activeBenefitsData.coupons}
                            freeDeliveries={activeBenefitsData.free_deliveries}
                            selectedCouponKey={selectedCouponKey}
                            selectedDeliveryKey={selectedDeliveryKey}
                            onSelectCoupon={handleSelectCouponBenefit}
                            onSelectDelivery={handleSelectDeliveryBenefit}
                        />
                    )}

                    {/* `وفر على طلبك` — discount code with an apply button. */}
                    <CheckoutCouponSection
                        coupon={storedCoupon}
                        onApply={handleApplyCoupon}
                        onRemove={handleRemoveCoupon}
                        isLoading={isPreviewLoading}
                        disabled={couponBlockedByBenefit}
                        disabledHint={t(
                            "cart.couponDisabledByBenefit",
                            "Remove the selected discount to use a coupon code",
                        )}
                        applied={preview?.coupon?.applied ?? false}
                        failReasons={preview?.coupon?.fail_reasons ?? []}
                    />

                    {customerSelectedPromotions(preview?.available_promotions).length > 0 && (
                            <AvailablePromotionsSelector
                                promotions={customerSelectedPromotions(preview?.available_promotions)}
                                selectedPromotionId={promotionId}
                                onSelect={setPromotionId}
                            />
                        )}

                    {preview?.non_discount_promotions &&
                        !Array.isArray(preview.non_discount_promotions) &&
                        (preview.non_discount_promotions as NonDiscountPromotion)
                            .free_items?.length > 0 && (
                            <NonDiscountPromotionBanner
                                promotion={
                                    preview.non_discount_promotions as NonDiscountPromotion
                                }
                                orderItemsByVariant={orderItemsByVariant}
                                cartItems={cartItems}
                            />
                        )}

                    </div>

                    <div className="flex min-w-0 flex-col gap-4 lg:sticky lg:top-6">
                        {displayItems.length > 0 && (
                            <OrderItemsTable
                                items={displayItems}
                                title={t("checkout.orderSummary")}
                                compact
                            />
                        )}
                        {checkoutMessage && (
                            <p className="rounded-2xl border border-[color:var(--color-ui-amber-200)] bg-[color:var(--color-ui-amber-50)] px-4 py-3 text-sm leading-relaxed text-[color:var(--color-ui-amber-900)]">
                                {checkoutMessage}
                            </p>
                        )}
                        {scheduledTooEarly && !checkoutMessage && (
                            <p className="rounded-2xl border border-[color:var(--color-ui-amber-200)] bg-[color:var(--color-ui-amber-50)] px-4 py-3 text-sm leading-relaxed text-[color:var(--color-ui-amber-900)]">
                                {t("checkout.deliveryTooEarly", {
                                    time: checkout?.earliest_delivery_at ?? "",
                                    defaultValue: "Choose a time at or after {{time}}",
                                })}
                            </p>
                        )}
                        <CheckoutOrderSummary
                            summary={checkoutSummary}
                            onPlaceOrder={handleContinueToReview}
                            buttonText={t("checkout.continueToReview", "Continue to review")}
                            canContinue={canContinue}
                            backHref={paths.client.cart}
                            backLabel={t("checkout.backToCart", "Back to cart")}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
