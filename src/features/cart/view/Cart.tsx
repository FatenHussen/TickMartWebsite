import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useLanguage } from "@/context/LanguageContext";
import SideContentLayout from "@/layout/SideContentLayout";
import { CartTable, CartSummary } from "../components";
import { mockCartItems, mockCartSummary } from "../data/mockData";
import type { CartItem, OrderSummary } from "../types";

export default function Cart() {
  const { t } = useTranslation();
  const { isRTL } = useLanguage();
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
    // TODO: Navigate to checkout page
    console.log("Proceed to checkout");
  };

  return (
    <div className="bg-custom-primary">
      <div className="page-container py-6" dir={isRTL ? "rtl" : "ltr"}>
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
          <div>
            {items.length === 0 ? (
              <div className="text-center py-12 bg-custom-primary rounded-2xl border border-custom-secondary">
                <p className="text-custom-secondary text-lg mb-4">
                  {t("cart.yourCartIsEmpty")}
                </p>
                <a
                  href="/home"
                  className="text-custom-accent hover:underline font-medium"
                >
                  {t("cart.continueShopping")}
                </a>
              </div>
            ) : (
              <CartTable
                items={items}
                onQuantityChange={handleQuantityChange}
                onRemove={handleRemoveItem}
                onMoveToWishlist={handleMoveToWishlist}
                onUpdateCart={handleUpdateCart}
              />
            )}
          </div>
        </SideContentLayout>
      </div>
    </div>
  );
}
