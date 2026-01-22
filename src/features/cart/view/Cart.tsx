import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useLanguage } from "@/context/LanguageContext";
import { useNavigate, Link } from "react-router-dom";
import SideContentLayout from "@/layout/SideContentLayout";
import { CartSummary } from "../components";
import CartItemCard from "../components/CartItemCard";
import ScheduleDelivery from "../components/ScheduleDelivery";
import CheckoutProgressIndicator from "@/shared/component/CheckoutProgressIndicator";
import Button from "@/shared/ui/Button";
import { HiArrowLeft } from "react-icons/hi";
import { mockCartItems, mockCartSummary } from "../data/mockData";
import type { CartItem, OrderSummary } from "../types";

export default function Cart() {
  const { t } = useTranslation();
  const { isRTL } = useLanguage();
  const navigate = useNavigate();
  const [items, setItems] = useState<CartItem[]>(mockCartItems);
  const [summary] = useState<OrderSummary>(mockCartSummary);

  const handleQuantityChange = (itemId: number | string, quantity: number) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id === itemId) {
          const newQuantity = Math.max(1, quantity);
          const priceValue = parseFloat(item.price.replace("$", ""));
          const newSubtotal = `$${(priceValue * newQuantity).toFixed(2)}`;
          return { ...item, quantity: newQuantity, subtotal: newSubtotal };
        }
        return item;
      })
    );
    // TODO: Recalculate totals
  };

  const handleRemoveItem = (itemId: number | string) => {
    setItems((prev) => prev.filter((item) => item.id !== itemId));
    // TODO: Recalculate totals
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
            <CartSummary summary={summary} onCheckout={handleCheckout} />
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

                {/* Schedule Delivery Section */}
                <ScheduleDelivery
                  onSaveSchedule={() => console.log("Save schedule")}
                  onCancelSchedule={() => console.log("Cancel schedule")}
                />
              </>
            )}
          </div>
        </SideContentLayout>
      </div>
    </div>
  );
}
