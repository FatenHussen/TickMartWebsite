import { useState } from "react";
import { Link } from "react-router-dom";
import Button from "@/shared/ui/Button";
import Input from "@/shared/ui/Input";
import type { OrderSummaryLegacy } from "../types";

type OrderSummaryProps = {
  summary: OrderSummaryLegacy;
  onCheckout: () => void;
};

export default function OrderSummary({
  summary,
  onCheckout,
}: OrderSummaryProps) {
  const [promoCode, setPromoCode] = useState("");

  const handleApplyPromo = () => {
    // TODO: Implement promo code logic
    console.log("Apply promo code:", promoCode);
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 sticky top-4">
      <h2 className="text-xl font-bold text-text-primary mb-6">
        Order summary
      </h2>

      {/* Cost Breakdown */}
      <div className="space-y-3 mb-6">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Items total:</span>
          <span className="font-medium text-text-primary">{summary.itemsTotal}</span>
        </div>
        {summary.discounts && (
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Discounts:</span>
            <span className="font-medium text-green-600">{summary.discounts}</span>
          </div>
        )}
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Delivery fees:</span>
          <span className="font-medium text-text-primary">{summary.deliveryFees}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Service fee:</span>
          <span className="font-medium text-text-primary">{summary.serviceFee}</span>
        </div>
      </div>

      {/* Total */}
      <div className="flex items-center justify-between py-4 border-t border-gray-200 mb-6">
        <span className="text-base font-semibold text-text-primary">Total to pay:</span>
        <span className="text-xl font-bold text-text-primary">{summary.total}</span>
      </div>

      {/* Promo Code */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-text-primary mb-2">
          Promo code
        </label>
        <div className="flex gap-2">
          <Input
            type="text"
            placeholder="Enter promo code"
            value={promoCode}
            onChange={(e) => setPromoCode(e.target.value)}
            className="flex-1"
          />
          <Button
            type="button"
            variant="primary"
            onClick={handleApplyPromo}
            className="px-4 whitespace-nowrap"
          >
            Apply
          </Button>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-3">
        <Button
          type="button"
          variant="primary"
          size="lg"
          fullWidth
          onClick={onCheckout}
          className="bg-primary hover:opacity-90"
        >
          Continue to checkout
        </Button>
        <Link
          to="/home"
          className="block text-center text-primary hover:underline text-sm font-medium"
        >
          Continue shopping
        </Link>
      </div>
    </div>
  );
}

