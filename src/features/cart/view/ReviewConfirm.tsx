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
import { mockCheckoutPaymentMethods } from "../data/mockData";
import { paths } from "@/app/routes/path/paths";
import type { DeliveryAddress, ReviewOrderSummary } from "../types";
import type { Address } from "@/features/account/types";

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
      (x): x is string => x != null,
    ),
    isDefault: addr.is_default,
  };
}

export default function ReviewConfirm() {
  const { t } = useTranslation();
  const { isRTL } = useLanguage();
  const navigate = useNavigate();
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [createdOrderId, setCreatedOrderId] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigatingToTrackOrder = useRef(false);

  const { addressId, coupon, paymentMethodId, additionalNotes } =
    useCheckoutStore();
  const {
    items: cartItems,
    cart_type,
    recipe_id,
    admin_basket_id,
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
  const selectedPaymentMethod =
    mockCheckoutPaymentMethods.find((p) => p.id === paymentMethodId) ??
    mockCheckoutPaymentMethods[0];

  const addressIdNum = addressId ? Number(addressId) : null;
  const { data: preview } = useOrderPreview(addressIdNum, coupon || undefined);

  const reviewSummary = useMemo<ReviewOrderSummary | null>(() => {
    if (!preview) return null;
    const couponDiscount = preview.coupon?.applied
      ? preview.coupon.discount
      : 0;
    return {
      items: cartItems,
      numOfItems: preview.total_quantity,
      subtotal: `£${preview.subtotal.toFixed(2)}`,
      shipping:
        preview.delivery_price === 0
          ? "Free"
          : `£${preview.delivery_price.toFixed(2)}`,
      discounts: `-£${(preview.basket_discount_amount ?? 0).toFixed(2)}`,
      tax: "0%",
      couponDiscount: `-£${couponDiscount.toFixed(2)}`,
      pointsRedeemed: 0,
      pointsValue: "£0.00",
      total: `£${preview.total.toFixed(2)}`,
      estimatedDelivery: "2:00 PM - 4:00 PM",
      pointsEarned: 0,
      pointsBefore: 0,
      pointsNewBalance: 0,
      pointsSavings: "£0.00",
    };
  }, [preview, cartItems]);

  const handleConfirmOrder = async () => {
    if (!addressId || !preview) return;

    setIsSubmitting(true);
    try {
      const isInstantDelivery = cartItems.some(
        (i) => i.is_instant_delivery ?? !!i.hasFreeDelivery,
      );
      const payload = {
        address_id: Number(addressId),
        cart_type,
        is_instant_delivery: isInstantDelivery,
        items: getPreviewItems(),
        ...(coupon && { coupon }),
        ...(recipe_id != null && { recipe_id }),
        ...(admin_basket_id != null && { admin_basket_id }),
        ...(paymentMethodId && { payment_method_id: paymentMethodId }),
        ...(additionalNotes && { notes: additionalNotes }),
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

  const handleTrackOrder = () => {
    if (createdOrderId != null) {
      navigatingToTrackOrder.current = true;
      setShowSuccessPopup(false);
      setCreatedOrderId(null);
      navigate(
        paths.client.trackOrder.replace(":orderId", String(createdOrderId)),
      );
    }
  };

  const handleBackToHome = () => {
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
    !navigatingToTrackOrder.current
  ) {
    navigate(paths.client.cart);
    return null;
  }

  if (
    !isSuccessState &&
    checkoutAddresses.length === 0 &&
    !navigatingToTrackOrder.current
  ) {
    navigate(paths.client.checkout);
    return null;
  }

  if (
    !isSuccessState &&
    !addressId &&
    checkoutAddresses.length > 0 &&
    !navigatingToTrackOrder.current
  ) {
    navigate(paths.client.checkout);
    return null;
  }

  if (
    !isSuccessState &&
    addressId &&
    !selectedAddress &&
    checkoutAddresses.length > 0 &&
    !navigatingToTrackOrder.current
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
    <div className="page-container py-6" dir={isRTL ? "rtl" : "ltr"}>
      <div className="mb-8">
        <CheckoutProgressIndicator currentStep="review" />
      </div>

      <div className="text-center mb-8">
        <p className="text-custom-secondary text-base">
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
          <div className="grid grid-cols-2 gap-4">
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

          <OrderItemsTable
            items={cartItems}
            onMoveToWishlist={handleMoveToWishlist}
          />
        </div>
      </SideContentLayout>

      <SuccessPopup
        isOpen={showSuccessPopup}
        onClose={handleClosePopup}
        pointsEarned={reviewSummary?.pointsEarned ?? 0}
        primaryButtonText={t("successPopup.trackOrder", "Track Order")}
        onPrimaryClick={handleTrackOrder}
        secondaryButtonText={t("successPopup.backToHome", "Back to home page")}
        onSecondaryClick={handleBackToHome}
      />
    </div>
  );
}
