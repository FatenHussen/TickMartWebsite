import { useState, useMemo, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useLanguage } from "@/context/LanguageContext";
import { useNavigate } from "react-router-dom";
import { CheckoutProgressIndicator } from "@/shared/component";
import CheckoutAddressSection from "../components/CheckoutAddressSection";
import CheckoutPaymentSection from "../components/CheckoutPaymentSection";
import OrderItemsTable from "../components/OrderItemsTable";
import Button from "@/shared/ui/Button";
import NonDiscountPromotionBanner from "../components/NonDiscountPromotionBanner";
import AvailablePromotionsSelector from "../components/AvailablePromotionsSelector";
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
    DeliveryAddress,
    NonDiscountPromotion,
    OrderPreviewOrderItem,
} from "../types";
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
    const { t } = useTranslation();
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
        setAddressId,
        setPaymentMethodId,
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

    const { data: preview } = useOrderPreview(
        selectedAddressId ? Number(selectedAddressId) : null,
        storedCoupon || undefined,
        previewBenefits,
        selectedPaymentMethodId || undefined,
    );

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

    const canContinue =
        Boolean(selectedAddressId) && Boolean(selectedPaymentMethod);

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

                <div className="mx-auto flex w-full max-w-3xl flex-col gap-6">
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

                    {displayItems.length > 0 && (
                        <OrderItemsTable
                            items={displayItems}
                            compact
                            showTitle={false}
                        />
                    )}

                    <Button
                        type="button"
                        variant="primary"
                        size="lg"
                        fullWidth
                        disabled={!canContinue}
                        onClick={handleContinueToReview}
                        className="flex min-h-[52px] items-center justify-center rounded-2xl text-base font-bold text-white !border-transparent !bg-[color:var(--color-api-second)] hover:!bg-[color:var(--color-api-second-hover)] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {t("checkout.continueToReview", "Continue to review")}
                    </Button>
                </div>
            </div>
        </div>
    );
}
