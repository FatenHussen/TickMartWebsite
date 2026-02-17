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
import { paths } from "@/app/routes/path/paths";
import { mockCheckoutPaymentMethods } from "../data/mockData";
import type { DeliveryAddress, CheckoutOrderSummary as CheckoutOrderSummaryType } from "../types";
import type { Address } from "@/features/account/types";

import circle from "/images/shared/circle.png";
import circleBottom from "/images/shared/circleBottom.png";

function mapAddressToDeliveryAddress(addr: Address): DeliveryAddress {
  const parts = [
    addr.street_name,
    addr.building_number,
    addr.floor_apartment,
    addr.nearest_landmark,
  ].filter(Boolean);
  return {
    id: addr.id,
    fullName: addr.label,
    phoneNumber: addr.contact_phone,
    address: [...parts, addr.area?.name].filter(Boolean).join(", "),
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
    setAddressId,
    setCoupon,
    setPaymentMethodId,
    setAdditionalNotes,
  } = useCheckoutStore();

  const selectedAddressId =
    storedAddressId ??
    defaultAddress?.id ??
    (checkoutAddresses[0]?.id ?? "");
  const [selectedPaymentMethodId, setSelectedPaymentMethodId] = useState(
    storedPaymentId || mockCheckoutPaymentMethods[0]?.id || ""
  );
  const [additionalNotes, setLocalAdditionalNotes] = useState(storedNotes);

  const { data: preview } = useOrderPreview(
    selectedAddressId ? Number(selectedAddressId) : null,
    storedCoupon || undefined
  );

  const checkoutSummary = useMemo<CheckoutOrderSummaryType | null>(() => {
    if (!preview) return null;
    return {
      items: cartItems,
      itemsTotal: `£${preview.subtotal.toFixed(2)}`,
      subtotal: `£${preview.subtotal.toFixed(2)}`,
      deliveryFees:
        preview.delivery_price === 0
          ? "Free"
          : `£${preview.delivery_price.toFixed(2)}`,
      storeDiscounts: `-£${(preview.basket_discount_amount ?? 0).toFixed(2)}`,
      couponDiscount: `-£${(preview.coupon?.applied ? preview.coupon.discount : 0).toFixed(2)}`,
      total: `£${preview.total.toFixed(2)}`,
    };
  }, [preview, cartItems]);

  useEffect(() => {
    if (defaultAddress && !storedAddressId && checkoutAddresses.length > 0) {
      setAddressId(defaultAddress.id);
    }
  }, [defaultAddress, storedAddressId, checkoutAddresses.length, setAddressId]);

  const handleAddressSelect = (addressId: number | string) => {
    setAddressId(addressId);
  };

  const handlePaymentMethodSelect = (methodId: string) => {
    setSelectedPaymentMethodId(methodId);
    setPaymentMethodId(methodId);
  };

  const handleChangeAddress = () => {
    navigate(paths.account.addresses);
  };

  const handleAddNewAddress = () => {
    navigate(paths.account.addAddress);
  };

  const handlePlaceOrder = () => {
    setAddressId(selectedAddressId);
    setPaymentMethodId(selectedPaymentMethodId);
    setAdditionalNotes(additionalNotes);
    setCoupon(storedCoupon);
    navigate("/cart/review");
  };

  return (
    <div className="bg-custom-primary min-h-screen relative">
      <div className="page-container py-6 " dir={isRTL ? "rtl" : "ltr"}>
        <img src={circle} alt="" className="absolute left-0 top-0" />
        <img
          src={circleBottom}
          alt=""
          className="absolute right-0 -bottom-2/4"
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
                  itemsTotal: "£0.00",
                  subtotal: "£0.00",
                  deliveryFees: "-",
                  storeDiscounts: "£0.00",
                  couponDiscount: "£0.00",
                  total: "£0.00",
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
            <CheckoutAddressSection
              addresses={checkoutAddresses}
              selectedAddressId={selectedAddressId}
              onAddressSelect={handleAddressSelect}
              onChangeAddress={handleChangeAddress}
              onAddNewAddress={handleAddNewAddress}
            />

            {/* Additional Info Section */}
            <div className="mb-6">
              <h2 className="text-lg font-bold text-custom-primary mb-4">
                {t("checkout.additionalInfo")}
              </h2>
              <textarea
                value={additionalNotes}
                onChange={(e) => setLocalAdditionalNotes(e.target.value)}
                placeholder={t("checkout.additionalInfoPlaceholder")}
                rows={4}
                className="w-full px-4 py-3 rounded-lg border border-custom-secondary bg-custom-primary text-custom-primary placeholder:text-custom-secondary focus:outline-none focus:ring-2 focus:ring-custom-accent focus:border-custom-accent resize-none"
              />
            </div>

            {/* Payment Method Section */}
            <CheckoutPaymentSection
              paymentMethods={mockCheckoutPaymentMethods}
              selectedPaymentMethodId={selectedPaymentMethodId}
              onPaymentMethodSelect={handlePaymentMethodSelect}
            />
          </div>
        </SideContentLayout>
      </div>
    </div>
  );
}
