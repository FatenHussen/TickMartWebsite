import { Link } from "react-router-dom";
import { HiOutlineClock } from "react-icons/hi";
import { FaStar } from "react-icons/fa";
import Button from "@/shared/ui/Button";
import ReviewPointsSummary from "./ReviewPointsSummary";
import type { ReviewOrderSummary } from "../types";

type ReviewDeliveryDetailsSidebarProps = {
  summary: ReviewOrderSummary;
  onConfirmOrder: () => void;
};

export default function ReviewDeliveryDetailsSidebar({
  summary,
  onConfirmOrder,
}: ReviewDeliveryDetailsSidebarProps) {
  return (
    <div
      className="rounded-3xl shadow-md sticky top-4 overflow-hidden"
      style={{
        background: "linear-gradient(180deg, #FBFBE4 0%, #FFFAB6 100%)",
      }}
    >
      {/* Header - Yellow pill */}
      <div className="flex justify-center pt-6 pb-2 relative">
        <div
          className="px-4 py-2 rounded-full bg-cover bg-center bg-no-repeat absolute left-1/2 top-0 -translate-x-1/2"
          style={{ backgroundImage: "url('/images/backOrder.png')" }}
        >
          <h2 className="text-custom-primary text-sm font-bold whitespace-nowrap">
            Delivery Details
          </h2>
        </div>
      </div>

      {/* Content */}
      <div className="px-5 pb-4 pt-6">
        {/* Summary rows */}
        <div className="space-y-3 text-sm">
          <SummaryRow label="Num of Items" value={summary.numOfItems} />
          <SummaryRow label="Subtotal" value={summary.subtotal} />
          <SummaryRow label="Shipping" value={summary.shipping} isGreen />
          <SummaryRow label="Discounts" value={summary.discounts} isGreen />
          <SummaryRow label="Tax" value={summary.tax} isGreen />
          <SummaryRow label="Coupon discount" value={summary.couponDiscount} />
          <SummaryRow
            label={`Points redeemed (${summary.pointsRedeemed} pts)`}
            value={`- ${summary.pointsValue}`}
            isGreen
          />
        </div>

        {/* Total */}
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-dashed border-gray-400">
          <span className="text-base font-bold text-custom-primary">
            Total to pay
          </span>
          <span className="text-2xl font-bold" style={{ color: "#22C55E" }}>
            {summary.total}
          </span>
        </div>

        {/* Estimated Delivery */}
        <div className="flex items-center gap-2 mt-4 text-custom-secondary text-sm">
          <HiOutlineClock className="w-4 h-4" style={{ color: "#2C8090" }} />
          <span>Estimated delivery: {summary.estimatedDelivery}</span>
        </div>

        {/* Points earned */}
        <div className="flex items-center gap-2 mt-2">
          <FaStar className="w-4 h-4" style={{ color: "#FBBF24" }} />
          <span className="text-sm text-custom-secondary">
            You'll earn{" "}
            <span className="font-semibold" style={{ color: "#22C55E" }}>
              {summary.pointsEarned} points
            </span>
          </span>
        </div>
      </div>

      {/* Actions */}
      <div className="px-5">
        <Button
          type="button"
          variant="primary"
          size="lg"
          fullWidth
          onClick={onConfirmOrder}
          className="text-white rounded-xl mb-3"
          style={{
            background: "linear-gradient(135deg, #4CDAF6 0%, #2C8090 100%)",
          }}
        >
          Confirm Order
        </Button>

        <Link
          to="/cart/checkout"
          className="block text-center text-sm text-custom-secondary hover:text-custom-primary hover:underline py-2"
        >
          Back to checkout
        </Link>
      </div>

      {/* Points Summary */}
      <div className="pt-4">
        <ReviewPointsSummary
          pointsBefore={summary.pointsBefore}
          pointsUsed={summary.pointsRedeemed}
          pointsEarned={summary.pointsEarned}
          pointsNewBalance={summary.pointsNewBalance}
          pointsSavings={summary.pointsSavings}
        />
      </div>
    </div>
  );
}

type SummaryRowProps = {
  label: string;
  value: string | number;
  isGreen?: boolean;
};

function SummaryRow({ label, value, isGreen = false }: SummaryRowProps) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-custom-secondary">{label}</span>
      <span
        className="font-medium"
        style={isGreen ? { color: "#22C55E" } : undefined}
      >
        {value}
      </span>
    </div>
  );
}
