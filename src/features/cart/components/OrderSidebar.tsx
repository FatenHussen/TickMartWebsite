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
}: OrderSidebarProps) {
  return (
    <div className="space-y-4">
      {/* Order Summary Card */}
      <OrderSummaryCard priceSummary={priceSummary} />

      {/* Delivery Details Card */}
      <DeliveryDetailsCard delivery={delivery} />

      {/* Payment Method Card */}
      <PaymentMethodCard payment={payment} />
    </div>
  );
}

type OrderSummaryCardProps = {
  priceSummary: OrderSidebarProps["priceSummary"];
};

function OrderSummaryCard({ priceSummary }: OrderSummaryCardProps) {
  return (
    <div
      className="rounded-2xl shadow-sm overflow-hidden"
      style={{
        background: "linear-gradient(180deg, #FBFBE4 0%, #FFFAB6 100%)",
      }}
    >
      {/* Header */}
      <div className="flex justify-center pt-4 pb-2 relative">
        <div
          className="px-4 py-2 rounded-full bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('/images/backOrder.png')" }}
        >
          <h3 className="text-custom-primary text-sm font-bold whitespace-nowrap">
            Order Summary
          </h3>
        </div>
      </div>

      {/* Content */}
      <div className="px-5 pb-5 pt-2">
        <div className="space-y-3 text-sm">
          <SummaryRow label="Num of Items" value={priceSummary.numOfItems} />
          <SummaryRow label="Subtotal" value={priceSummary.subtotal} />
          <SummaryRow
            label="Shipping"
            value={priceSummary.shipping}
            isGreen={priceSummary.shippingIsFree}
          />
          <SummaryRow
            label="Store discounts"
            value={priceSummary.storeDiscounts}
            isGreen
          />
          <SummaryRow label="Tax" value={priceSummary.tax} isGreen />
          <SummaryRow
            label="Coupon discount"
            value={priceSummary.couponDiscount}
          />
        </div>

        {/* Total */}
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-dashed border-gray-400">
          <span className="text-base font-bold text-custom-primary">Total</span>
          <span className="text-2xl font-bold" style={{ color: "#22C55E" }}>
            {priceSummary.total}
          </span>
        </div>
      </div>
    </div>
  );
}

type DeliveryDetailsCardProps = {
  delivery: OrderSidebarProps["delivery"];
};

function DeliveryDetailsCard({ delivery }: DeliveryDetailsCardProps) {
  return (
    <div
      className="rounded-2xl shadow-sm overflow-hidden"
      style={{
        background: "linear-gradient(180deg, #FBFBE4 0%, #FFFAB6 100%)",
      }}
    >
      {/* Header */}
      <div className="flex justify-center pt-4 pb-2 relative">
        <div
          className="px-4 py-2 rounded-full bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('/images/backOrder.png')" }}
        >
          <h3 className="text-custom-primary text-sm font-bold whitespace-nowrap">
            Delivery Details
          </h3>
        </div>
      </div>

      {/* Content */}
      <div className="px-5 pb-5 pt-2">
        <div className="space-y-3 text-sm">
          <DetailRow label="Full Name:" value={delivery.fullName} />
          <DetailRow label="Phone Number:" value={delivery.phoneNumber} />
          <div>
            <span className="text-custom-secondary font-medium">Address:</span>
            <p className="text-custom-primary mt-1">{delivery.address}</p>
          </div>
          <DetailRow label="ETA:" value={delivery.eta} />
        </div>

        {delivery.message && (
          <div
            className="mt-4 p-3 rounded-lg text-sm"
            style={{
              backgroundColor: "rgba(251, 191, 36, 0.2)",
              border: "1px solid #FBBF24",
            }}
          >
            <span className="text-custom-primary">{delivery.message}</span>
          </div>
        )}
      </div>
    </div>
  );
}

type PaymentMethodCardProps = {
  payment: OrderSidebarProps["payment"];
};

function PaymentMethodCard({ payment }: PaymentMethodCardProps) {
  const getPaymentMethodName = (method: string) => {
    switch (method) {
      case "cash_on_delivery":
        return "Cash on Delivery";
      case "credit_card":
        return "Credit Card";
      case "paypal":
        return "PayPal";
      default:
        return method;
    }
  };

  return (
    <div
      className="rounded-2xl shadow-sm overflow-hidden"
      style={{
        background: "linear-gradient(180deg, #FBFBE4 0%, #FFFAB6 100%)",
      }}
    >
      {/* Header */}
      <div className="flex justify-center pt-4 pb-2 relative">
        <div
          className="px-4 py-2 rounded-full bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('/images/backOrder.png')" }}
        >
          <h3 className="text-custom-primary text-sm font-bold whitespace-nowrap">
            Payment Method
          </h3>
        </div>
      </div>

      {/* Content */}
      <div className="px-5 pb-5 pt-2">
        <div className="flex items-center gap-3">
          <div
            className="w-12 h-8 rounded flex items-center justify-center"
            style={{
              background: "linear-gradient(135deg, #4CDAF6 0%, #2C8090 100%)",
            }}
          >
            <svg
              className="w-5 h-5 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
          </div>
          <div>
            <p className="text-sm font-semibold text-custom-primary">
              {getPaymentMethodName(payment.method)}
            </p>
            <p className="text-xs text-custom-secondary">{payment.description}</p>
          </div>
        </div>
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

type DetailRowProps = {
  label: string;
  value: string;
};

function DetailRow({ label, value }: DetailRowProps) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-custom-secondary font-medium">{label}</span>
      <span className="text-custom-primary">{value}</span>
    </div>
  );
}
