import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useLanguage } from "@/context/LanguageContext";
import SideContentLayout from "@/layout/SideContentLayout";
import CheckoutAddressSection from "../components/CheckoutAddressSection";
import CheckoutPaymentSection from "../components/CheckoutPaymentSection";
import CheckoutOrderSummary from "../components/CheckoutOrderSummary";
import {
  mockCheckoutAddresses,
  mockCheckoutPaymentMethods,
  mockCheckoutOrderSummary,
} from "../data/mockData";

export default function Checkout() {
  const { t } = useTranslation();
  const { isRTL } = useLanguage();
  const [selectedAddressId, setSelectedAddressId] = useState<number | string>(
    mockCheckoutAddresses[0]?.id || ""
  );
  const [selectedPaymentMethodId, setSelectedPaymentMethodId] =
    useState<string>(mockCheckoutPaymentMethods[0]?.id || "");
  const [additionalNotes, setAdditionalNotes] = useState("");

  const handleAddressSelect = (addressId: number | string) => {
    setSelectedAddressId(addressId);
  };

  const handlePaymentMethodSelect = (methodId: string) => {
    setSelectedPaymentMethodId(methodId);
  };

  const handleChangeAddress = () => {
    // TODO: Open address selection modal
    console.log("Change address");
  };

  const handleAddNewAddress = () => {
    // TODO: Open add address form
    console.log("Add new address");
  };

  const handlePlaceOrder = () => {
    // TODO: Process order
    console.log("Place order", {
      addressId: selectedAddressId,
      paymentMethodId: selectedPaymentMethodId,
      additionalNotes,
    });
  };

  return (
    <div className="page-container py-6" dir={isRTL ? "rtl" : "ltr"}>
      {/* Breadcrumb */}
      <div className="mb-6">
        <nav className="text-sm text-custom-secondary">
          <span className="hover:text-custom-primary cursor-pointer">
            {t("checkout.cart")}
          </span>
          <span className="mx-2">/</span>
          <span className="text-custom-primary font-medium">
            {t("checkout.checkoutTitle")}
          </span>
        </nav>
      </div>

      <SideContentLayout
        sidebar={
          <CheckoutOrderSummary
            summary={mockCheckoutOrderSummary}
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
            addresses={mockCheckoutAddresses}
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
              onChange={(e) => setAdditionalNotes(e.target.value)}
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
  );
}
