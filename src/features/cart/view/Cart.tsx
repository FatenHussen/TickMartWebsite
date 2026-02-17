import { useMemo, useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useLanguage } from "@/context/LanguageContext";
import { useNavigate, Link } from "react-router-dom";
import { paths } from "@/app/routes/path/paths";
import SideContentLayout from "@/layout/SideContentLayout";
import { CartSummary } from "../components";
import CartItemCard from "../components/CartItemCard";
import ScheduleDelivery from "../components/ScheduleDelivery";
import CheckoutProgressIndicator from "@/shared/component/CheckoutProgressIndicator";
import Button from "@/shared/ui/Button";
import { HiArrowLeft } from "react-icons/hi";
import { useCartStore } from "@/store/cart";
import { useCheckoutStore } from "@/store/checkout";
import { useAddresses } from "@/features/account/hooks/useAddress";
import { useOrderPreview } from "../hooks/useOrderPreview";
import type { OrderSummary } from "../types";

function parseSubtotal(s: string): number {
  return parseFloat(String(s).replace(/[^0-9.]/g, "")) || 0;
}

export default function Cart() {
  const { t } = useTranslation();
  const { isRTL } = useLanguage();
  const navigate = useNavigate();
  const checkoutCoupon = useCheckoutStore((s) => s.coupon);
  const [coupon, setCoupon] = useState(checkoutCoupon);
  const setCheckoutCoupon = useCheckoutStore((s) => s.setCoupon);
  useEffect(() => {
    setCoupon(checkoutCoupon);
  }, [checkoutCoupon]);
  const items = useCartStore((s) => s.items);
  const cart_type = useCartStore((s) => s.cart_type);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const removeItem = useCartStore((s) => s.removeItem);

  const { data: addresses = [], isLoading: isAddressesLoading } = useAddresses();
  const defaultAddress = addresses.find((a) => a.is_default) ?? addresses[0];
  const addressId = defaultAddress?.id ?? null;
  const { data: preview, isLoading: isPreviewLoading } = useOrderPreview(
    addressId != null ? addressId : null,
    coupon || undefined
  );

  const showSummaryLoading =
    items.length > 0 &&
    (isAddressesLoading || (addressId != null && isPreviewLoading));

  const summary = useMemo<OrderSummary>(() => {
    if (preview) {
      const couponDiscount = preview.coupon?.applied
        ? preview.coupon.discount
        : 0;
      const productDiscount =
        preview.subtotal_before_discount - preview.subtotal_after_product_discount;
      const hasProductDiscount = productDiscount > 0;
      const hasBasketDiscount = (preview.basket_discount_amount ?? 0) > 0;

      return {
        numOfItems: preview.total_quantity,
        subtotal: `£${preview.subtotal.toFixed(2)}`,
        ...(hasProductDiscount && {
          subtotalBeforeDiscount: `£${preview.subtotal_before_discount.toFixed(2)}`,
          productDiscount: `-£${productDiscount.toFixed(2)}`,
        }),
        shipping:
          preview.delivery_price === 0
            ? "Free"
            : `£${preview.delivery_price.toFixed(2)}`,
        shippingIsFree: preview.delivery_price === 0,
        storeDiscounts: hasBasketDiscount
          ? `-£${(preview.basket_discount_amount ?? 0).toFixed(2)}`
          : "£0.00",
        basketDiscount: hasBasketDiscount
          ? `-£${(preview.basket_discount_amount ?? 0).toFixed(2)}`
          : undefined,
        tax: "0%",
        couponDiscount: `-£${couponDiscount.toFixed(2)}`,
        total: `£${preview.total.toFixed(2)}`,
        ...(preview.coupon && {
          couponFeedback: {
            valid: preview.coupon.valid,
            applied: preview.coupon.applied,
            fail_reasons: preview.coupon.fail_reasons ?? [],
          },
        }),
      };
    }
    if (items.length > 0) {
      return {
        numOfItems: 0,
        subtotal: "£0.00",
        shipping: "-",
        shippingIsFree: false,
        storeDiscounts: "£0.00",
        tax: "0%",
        couponDiscount: "£0.00",
        total: "£0.00",
      };
    }
    const numOfItems = items.reduce((sum, i) => sum + i.quantity, 0);
    const subtotalNum = items.reduce(
      (sum, i) => sum + parseSubtotal(i.subtotal),
      0
    );
    const subtotal = `£${subtotalNum.toFixed(2)}`;
    return {
      numOfItems,
      subtotal,
      shipping: "Free",
      shippingIsFree: true,
      storeDiscounts: "£0.00",
      tax: "0%",
      couponDiscount: "£0.00",
      total: subtotal,
    };
  }, [items, preview]);

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

  const handleMoveToWishlist = (itemId: number | string) => {
    // TODO: Implement move to wishlist
    console.log("Move to wishlist:", itemId);
  };

  const handleUpdateCart = () => {
    // TODO: Update cart logic
    console.log("Update cart");
  };

  const handleCheckout = () => {
    setCheckoutCoupon(coupon);
    navigate("/cart/checkout");
  };

  return (
    <div className="bg-custom-primary">
      <div className="page-container py-6" dir={isRTL ? "rtl" : "ltr"}>
        {/* Progress Indicator */}
        <div className="mb-8">
          <CheckoutProgressIndicator currentStep="cart" />
        </div>

        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-custom-primary mb-2">
            {t("cart.myShoppingCart")}
          </h1>
        </div>

        <SideContentLayout
          sidebar={
            <CartSummary
              summary={summary}
              onCheckout={handleCheckout}
              coupon={coupon}
              onCouponChange={setCoupon}
              isLoading={showSummaryLoading}
              status={summaryStatus}
              onAddAddress={() => navigate(paths.account.addAddress)}
            />
          }
          sidebarPosition="right"
          gapClassName="gap-6"
        >
          <div className="space-y-6">
            {items.length === 0 ? (
              <div className="text-center py-12 bg-custom-primary rounded-2xl border border-custom-secondary">
                <p className="text-custom-secondary text-lg mb-4">
                  {t("cart.yourCartIsEmpty")}
                </p>
                <Link
                  to="/home"
                  className="text-custom-accent hover:underline font-medium"
                >
                  {t("cart.continueShopping")}
                </Link>
              </div>
            ) : (
              <>
                {/* Cart Items */}
                <div className="space-y-4 bg-cart-items rounded-2xl p-4">
                  {items.map((item) => (
                    <CartItemCard
                      key={item.id}
                      item={item}
                      onQuantityChange={handleQuantityChange}
                      onRemove={handleRemoveItem}
                      onMoveToWishlist={handleMoveToWishlist}
                    />
                  ))}
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-between">
                  <Link to="/home">
                    <Button
                      variant="primary"
                      className="bg-primary-light hover:opacity-90 text-white flex items-center gap-2"
                    >
                      <HiArrowLeft className="w-5 h-5" />
                      {t("cart.returnToShop")}
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    onClick={handleUpdateCart}
                    className="bg-gray-bold hover:bg-custom-hover"
                  >
                    {t("cart.updateCart")}
                  </Button>
                </div>

                {/* Schedule Delivery Section - only for product cart */}
                {cart_type === "default" && (
                  <ScheduleDelivery
                    onSaveSchedule={() => console.log("Save schedule")}
                    onCancelSchedule={() => console.log("Cancel schedule")}
                  />
                )}
              </>
            )}
          </div>
        </SideContentLayout>
      </div>
    </div>
  );
}
