import { useMemo, useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useLanguage } from "@/context/LanguageContext";
import { useNavigate, Link } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { paths } from "@/app/routes/path/paths";
import SideContentLayout from "@/layout/SideContentLayout";
import { CartSummary } from "../components";
import CartItemCard from "../components/CartItemCard";
import ScheduleDelivery, {
  type ScheduleDeliveryData,
} from "../components/ScheduleDelivery";
import CheckoutProgressIndicator from "@/shared/component/CheckoutProgressIndicator";
import Button from "@/shared/ui/Button";
import { HiArrowLeft } from "react-icons/hi";
import { useCartStore } from "@/store/cart";
import { useCheckoutStore } from "@/store/checkout";
import { useAddresses } from "@/features/account/hooks/useAddress";
import { useOrderPreview } from "../hooks/useOrderPreview";
import { _ScheduledBasketApi } from "@/features/account/api/scheduledBasketApi";
import { queryKeys } from "@/utils/queryKeys";
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
  const queryClient = useQueryClient();

  const createScheduledBasketMutation = useMutation({
    mutationFn: _ScheduledBasketApi.createScheduledBasket,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.scheduledBaskets.all() });
      queryClient.invalidateQueries({ queryKey: queryKeys.myBaskets.all() });
      toast.success(t("cart.scheduleSaved", "Schedule saved successfully"));
      navigate(paths.client.checkout);
    },
    onError: () => {
      toast.error(t("cart.scheduleSaveFailed", "Failed to save schedule"));
    },
  });

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

  const handleSaveSchedule = (data: ScheduleDeliveryData) => {
    const firstItem = items[0];
    const categoryId = firstItem?.category_id;
    if (categoryId == null) {
      toast.error(t("cart.categoryRequired", "Products must have a category"));
      return;
    }
    const validItems = items.filter(
      (i) =>
        i.productId != null &&
        i.shop_product_variant_id != null &&
        i.quantity > 0
    );
    if (validItems.length === 0) {
      toast.error(t("cart.noValidItems", "No valid items to schedule"));
      return;
    }
    createScheduledBasketMutation.mutate({
      name: data.name,
      category_id: categoryId,
      schedule_id: data.schedule_id,
      is_active: true,
      start_date: data.start_date,
      items: validItems.map((i) => ({
        product_id: i.productId!,
        shop_product_variant_id: i.shop_product_variant_id!,
        quantity: i.quantity,
      })),
    });
  };

  const isCartEmpty = items.length === 0;

  return (
    <div className="bg-custom-primary">
      <div className="page-container py-6" dir={isRTL ? "rtl" : "ltr"}>
        {/* Progress Indicator - only when cart has items */}
        {!isCartEmpty && (
          <div className="mb-8">
            <CheckoutProgressIndicator currentStep="cart" />
          </div>
        )}

        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-custom-primary mb-2">
            {t("cart.myShoppingCart")}
          </h1>
        </div>

        {isCartEmpty ? (
          /* Creative empty cart box - no sidebar */
          <div className="flex justify-center items-center min-h-[60vh]">
            <div className="relative w-full max-w-md mx-auto">
              <div className="relative overflow-hidden rounded-3xl bg-linear-to-br from-gray-50 to-gray-100 dark:from-gray-800/50 dark:to-gray-900/50 border border-custom-secondary/20 p-12 text-center shadow-lg">
                {/* Decorative circles */}
                <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full bg-custom-accent/10 blur-2xl" />
                <div className="absolute -bottom-10 -left-10 w-24 h-24 rounded-full bg-primary-light/10 blur-xl" />
                {/* Cart icon */}
                <div className="relative mx-auto mb-6 w-20 h-20 rounded-2xl bg-white/80 dark:bg-gray-800/80 flex items-center justify-center shadow-inner border border-custom-secondary/10">
                  <svg
                    className="w-10 h-10 text-custom-secondary/70"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                </div>
                <h2 className="relative text-xl font-semibold text-custom-primary mb-2">
                  {t("cart.yourCartIsEmpty")}
                </h2>
                <p className="relative text-custom-secondary text-sm mb-8 max-w-xs mx-auto">
                  {t("cart.emptyCartHint")}
                </p>
                <Link
                  to="/home"
                  className="relative inline-flex items-center gap-2 rounded-xl bg-custom-accent hover:bg-custom-accent/90 text-white font-medium px-6 py-3 transition-colors shadow-md hover:shadow-lg"
                >
                  <HiArrowLeft className="w-5 h-5" />
                  {t("cart.continueShopping")}
                </Link>
              </div>
            </div>
          </div>
        ) : (
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
                  onSaveSchedule={handleSaveSchedule}
                  onCancelSchedule={() => console.log("Cancel schedule")}
                  isSaving={createScheduledBasketMutation.isPending}
                />
              )}
            </div>
          </SideContentLayout>
        )}
      </div>
    </div>
  );
}
