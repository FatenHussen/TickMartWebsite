import { useState, useMemo, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useLanguage } from "@/context/LanguageContext";
import { useNavigate } from "react-router-dom";
import SideContentLayout from "@/layout/SideContentLayout";
import CheckoutAddressSection from "../components/CheckoutAddressSection";
import CheckoutPaymentSection from "../components/CheckoutPaymentSection";
import CheckoutOrderSummary from "../components/CheckoutOrderSummary";
import CheckoutProgressIndicator from "@/shared/component/CheckoutProgressIndicator";
import { useAddresses } from "@/features/account/hooks/useAddress";
import { useOrderPreview } from "../hooks/useOrderPreview";
import { useCartStore } from "@/store/cart";
import { useCheckoutStore } from "@/store/checkout";
import AddressForm from "@/features/account/view/AddressForm";
import { usePaymentMethods } from "../hooks/usePaymentMethods";
import type { DeliveryAddress, CheckoutOrderSummary as CheckoutOrderSummaryType } from "../types";
import { enrichCartItemsWithPreview, getFreeOnlyDisplayItems } from "../utils/enrichCartItems";
import { useCurrency } from "@/context/CurrencyContext";
import type { Address } from "@/features/account/types";
import { mapPreviewToCheckoutSummary } from "../utils/orderSummary";

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
        address: [...parts, areaName].filter(Boolean).join(","),
        tags: [addr.label, addr.is_default ? "Default" : null].filter(
            (x): x is string => x != null
        ),
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
        [addressesData]
    );

    const defaultAddress =
        checkoutAddresses.find((a) => a.isDefault) ?? checkoutAddresses[0];
    const {
        addressId: storedAddressId,
        coupon: storedCoupon,
        paymentMethodId: storedPaymentId,
        additionalNotes: storedNotes,
        pointCouponExchangeId,
        pointFreeDeliveryExchangeId,
        useSubscriptionDiscount,
        useSubscriptionFreeDelivery,
        promotionId,
        setAddressId,
        setCoupon,
        setPaymentMethodId,
        setAdditionalNotes,
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
        ]
    );

    const { methods: paymentMethods } = usePaymentMethods();

    const selectedAddressId =
        storedAddressId ??
        defaultAddress?.id ??
        (checkoutAddresses[0]?.id ?? "");
    const [selectedPaymentMethodId, setSelectedPaymentMethodId] = useState(
        storedPaymentId ||
        localStorage.getItem(PAYMENT_STORAGE_KEY) ||
        paymentMethods[0]?.id ||
        ""
    );
    const [additionalNotes] = useState(storedNotes);
    const [showAddAddressForm, setShowAddAddressForm] = useState(false);

    const { data: preview } = useOrderPreview(
        selectedAddressId ? Number(selectedAddressId) : null,
        storedCoupon || undefined,
        previewBenefits,
        selectedPaymentMethodId || undefined
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

    const checkoutSummary = useMemo<CheckoutOrderSummaryType | null>(() => {
        if (!preview) return null;
        return mapPreviewToCheckoutSummary(preview, displayItems, formatPrice);
    }, [displayItems, formatPrice, preview]);

    useEffect(() => {
        if (defaultAddress && !storedAddressId && checkoutAddresses.length > 0) {
            setAddressId(defaultAddress.id);
        }
    }, [defaultAddress, storedAddressId, checkoutAddresses.length, setAddressId]);

    useEffect(() => {
        if (paymentMethods.length > 0 && !selectedPaymentMethodId) {
            const saved = localStorage.getItem("tikmool_payment_method_id");
            const initial =
                saved && paymentMethods.find((m) => m.id === saved)
                    ? saved
                    : paymentMethods[0].id;
            setSelectedPaymentMethodId(initial);
            setPaymentMethodId(initial);
        }
    }, [paymentMethods, selectedPaymentMethodId, setPaymentMethodId]);

    const handleAddressSelect = (addressId: number | string) => {
        setAddressId(addressId);
    };

    const handlePaymentMethodSelect = (methodId: string) => {
        setSelectedPaymentMethodId(methodId);
        setPaymentMethodId(methodId);
        localStorage.setItem("tikmool_payment_method_id", methodId);
    };

    const handleAddNewAddress = () => {
        setShowAddAddressForm(true);
    };

    const handleAddressFormSuccess = (addressId?: number) => {
        setShowAddAddressForm(false);
        if (addressId != null) {
            setAddressId(addressId);
        }
    };

    const handlePlaceOrder = () => {
        setAddressId(selectedAddressId);
        setPaymentMethodId(selectedPaymentMethodId);
        setAdditionalNotes(additionalNotes);
        setCoupon(storedCoupon);
        navigate("/cart/review");
    };

    return (
        <div className="bg-custom-tertiary min-h-screen relative">
               {/* <OrderFlowHeader /> */}
            <div className="page-container py-6 relative" dir={isRTL ? "rtl" : "ltr"}>
                <img src={circle} alt="" className="absolute left-0 top-0 opacity-60 pointer-events-none" />
                <img
                    src={circleBottom}
                    alt=""
                    className="absolute right-0 -bottom-2/4 opacity-60 pointer-events-none"
                />

                {/* Progress Indicator */}
                <div className="mb-8">
                    <CheckoutProgressIndicator currentStep="checkout" />
                </div>

                <SideContentLayout
                    sidebar={
                        <CheckoutOrderSummary
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
                            onPlaceOrder={handlePlaceOrder}
                        />
                    }
                    sidebarPosition="right"
                    gapClassName="gap-6"
                    columnTemplate="1fr 500px"
                >
                    <div>
                        {/* Delivery Address Section */}
                        {!showAddAddressForm ? (
                            <CheckoutAddressSection
                                addresses={checkoutAddresses}
                                selectedAddressId={selectedAddressId}
                                onAddressSelect={handleAddressSelect}
                                onAddNewAddress={handleAddNewAddress}
                            />
                        ) : (
                            <div
                                className="mb-6 p-6 bg-custom-card rounded-2xl border shadow-sm"
                                style={{
                                    borderColor:
                                        "color-mix(in srgb, var(--color-main) 25%, transparent)",
                                }}
                            >
                                <AddressForm
                                    inline
                                    onSuccess={handleAddressFormSuccess}
                                    onCancel={() => setShowAddAddressForm(false)}
                                />
                            </div>
                        )}

                        {/* Additional Info Section */}
                        {/* <div className="mb-6">
                            <h2 className="text-lg font-bold text-custom-primary mb-4">
                                {t("checkout.additionalInfoOptional", "Additional Info (Optional)")}
                            </h2>
                            <textarea
                                value={additionalNotes}
                                onChange={(e) => setLocalAdditionalNotes(e.target.value)}
                                placeholder={t(
                                    "checkout.additionalInfoPlaceholder",
                                    "Notes about your order, e.g., delivery instructions"
                                )}
                                rows={4}
                                className="w-full px-4 py-3 rounded-xl border border-custom-primary bg-custom-card text-custom-primary placeholder:text-custom-secondary focus:outline-none focus:ring-2 focus:ring-primary-light focus:border-primary-light resize-none"
                            />
                        </div> */}

                        {/* Payment Method Section */}
                        <CheckoutPaymentSection
                            paymentMethods={paymentMethods}
                            selectedPaymentMethodId={selectedPaymentMethodId}
                            onPaymentMethodSelect={handlePaymentMethodSelect}
                        />
                    </div>
                </SideContentLayout>
            </div>
        </div>
    );
}
