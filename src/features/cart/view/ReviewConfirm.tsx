import { useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { useNavigate } from "react-router-dom";
import SideContentLayout from "@/layout/SideContentLayout";
import CheckoutProgressIndicator from "@/shared/component/CheckoutProgressIndicator";
import {
  mockCheckoutAddresses,
  mockCheckoutPaymentMethods,
  mockReviewOrderSummary,
} from "../data/mockData";
import {
  ReviewDeliveryDetailsSidebar,
  ReviewAddressCard,
  ReviewPaymentCard,
  ReviewOrderItemsTable,
} from "../components";

export default function ReviewConfirm() {
  const { isRTL } = useLanguage();
  const navigate = useNavigate();
  const [selectedAddress] = useState(mockCheckoutAddresses[0]);
  const [selectedPaymentMethod] = useState(mockCheckoutPaymentMethods[0]);

  const handleConfirmOrder = () => {
    console.log("Order confirmed", {
      address: selectedAddress,
      paymentMethod: selectedPaymentMethod,
      orderSummary: mockReviewOrderSummary,
    });
  };

  const handleEditAddress = () => {
    navigate("/cart/checkout");
  };

  const handleEditPayment = () => {
    navigate("/cart/checkout");
  };

  return (
    <div className="page-container py-6" dir={isRTL ? "rtl" : "ltr"}>
      {/* Progress Indicator */}
      <div className="mb-8">
        <CheckoutProgressIndicator currentStep="review" />
      </div>

      {/* Confirmation Message */}
      <div className="text-center mb-8">
        <p className="text-custom-secondary text-base">
          Please check all details before Confirming your order.
        </p>
      </div>

      <SideContentLayout
        sidebar={
          <ReviewDeliveryDetailsSidebar
            summary={mockReviewOrderSummary}
            onConfirmOrder={handleConfirmOrder}
          />
        }
        sidebarPosition="right"
        gapClassName="gap-6"
        columnTemplate="1fr 362px"
      >
        <div className="space-y-6">
          {/* Address and Payment Cards */}
          <div className="grid grid-cols-2 gap-4">
            <ReviewAddressCard
              address={selectedAddress}
              onEdit={handleEditAddress}
            />
            <ReviewPaymentCard
              paymentMethod={selectedPaymentMethod}
              onEdit={handleEditPayment}
            />
          </div>

          {/* Order Items Title */}
          <h2 className="text-lg font-bold text-custom-primary">Order Items</h2>

          {/* Order Items Table */}
          <ReviewOrderItemsTable items={mockReviewOrderSummary.items} />
        </div>
      </SideContentLayout>
    </div>
  );
}
