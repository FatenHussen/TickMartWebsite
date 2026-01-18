import { HiLocationMarker } from "react-icons/hi";

type OrderSidebarProps = {
  priceSummary: {
    numOfItems: number;
    subtotal: string;
    shipping: string;
    shippingIsFree: boolean;
    storeDiscounts: string;
    tax: string;
    couponDiscount: string;
    total: string;
  };
  delivery: {
    fullName: string;
    phoneNumber: string;
    address: string;
    eta: string;
    message?: string;
  };
  payment: {
    method: "cash_on_delivery" | "credit_card" | "paypal";
    description: string;
  };
  onTrackOnMap?: () => void;
};

export default function OrderSidebar({
  priceSummary,
  delivery,
  payment,
  onTrackOnMap,
}: OrderSidebarProps) {
  return (
    <div className="bg-blue-off rounded-2xl border border-custom-secondary shadow-sm p-6 space-y-6">
      {/* 1. Price Summary */}
      <div>
        <h3 className="text-base font-semibold text-custom-primary mb-4">
          Price Summary
        </h3>
        <div className="space-y-2 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-custom-secondary">Num of Items:</span>
            <span className="font-medium text-custom-primary">
              {priceSummary.numOfItems}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-custom-secondary">Subtotal:</span>
            <span className="font-medium text-custom-primary">
              {priceSummary.subtotal}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-custom-secondary">Shipping:</span>
            <span
              className={`font-medium ${
                priceSummary.shippingIsFree ? "" : "text-custom-primary"
              }`}
              style={
                priceSummary.shippingIsFree
                  ? { color: "var(--color-green)" }
                  : undefined
              }
            >
              {priceSummary.shipping}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-custom-secondary">Store discounts:</span>
            <span
              className="font-medium"
              style={{ color: "var(--color-green)" }}
            >
              {priceSummary.storeDiscounts}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-custom-secondary">Tax:</span>
            <span
              className="font-medium"
              style={{ color: "var(--color-green)" }}
            >
              {priceSummary.tax}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-custom-secondary">Coupon discount:</span>
            <span className="font-medium text-custom-primary">
              {priceSummary.couponDiscount}
            </span>
          </div>
        </div>

        {/* Total */}
        <div
          className="flex items-center justify-between pt-4 mt-4 border-t"
          style={{ borderColor: "var(--color-accent-light)" }}
        >
          <span className="text-lg font-bold text-custom-primary">Total:</span>
          <span className="text-2xl font-bold text-custom-accent">
            {priceSummary.total}
          </span>
        </div>
      </div>

      {/* Divider */}
      <div className="h-px bg-custom-secondary" />

      {/* 2. Delivery Details */}
      <div>
        <h3 className="text-base font-semibold text-custom-primary mb-4">
          Delivery Details
        </h3>
        <div className="space-y-4">
          <div>
            <div className="text-xs text-custom-secondary mb-1">Full Name</div>
            <div className="text-sm font-medium text-custom-primary">
              {delivery.fullName}
            </div>
          </div>
          <div>
            <div className="text-xs text-custom-secondary mb-1">
              Phone Number
            </div>
            <div className="text-sm font-medium text-custom-primary">
              {delivery.phoneNumber}
            </div>
          </div>
          <div>
            <div className="text-xs text-custom-secondary mb-1">Address</div>
            <div className="text-sm font-medium text-custom-primary">
              {delivery.address}
            </div>
          </div>
          <div>
            <div className="text-xs text-custom-secondary mb-1">ETA</div>
            <div className="text-sm font-medium text-custom-primary">
              {delivery.eta}
            </div>
          </div>
          {delivery.message && (
            <div className="pt-3">
              <p className="text-xs text-custom-accent">{delivery.message}</p>
            </div>
          )}
        </div>
      </div>

      {/* Divider */}
      <div className="h-px bg-custom-secondary" />

      {/* 3. Payment Method */}
      <div>
        <h3 className="text-base font-semibold text-custom-primary mb-4">
          Payment Method
        </h3>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-custom-tertiary flex items-center justify-center">
            <svg
              className="w-6 h-6 text-custom-secondary"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
              />
            </svg>
          </div>
          <div>
            <div className="text-sm font-semibold text-custom-primary">
              {payment.method === "cash_on_delivery"
                ? "Cash on Delivery"
                : payment.method}
            </div>
            <div className="text-xs text-custom-secondary">
              {payment.description}
            </div>
          </div>
        </div>
        {onTrackOnMap && (
          <button
            type="button"
            onClick={onTrackOnMap}
            className="w-full bg-custom-accent hover:opacity-90 text-custom-inverse font-medium py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-opacity"
          >
            <HiLocationMarker className="w-5 h-5" />
            Track Order on Map
          </button>
        )}
      </div>
    </div>
  );
}
