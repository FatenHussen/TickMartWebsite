import { HiLocationMarker } from "react-icons/hi";

type PaymentMethodProps = {
  payment: {
    method: "cash_on_delivery" | "credit_card" | "paypal";
    description: string;
  };
  onTrackOnMap?: () => void;
};

export default function PaymentMethod({
  payment,
  onTrackOnMap,
}: PaymentMethodProps) {
  return (
    <div className="bg-custom-primary rounded-2xl border border-custom-secondary shadow-sm p-6">
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
            {payment.method === "cash_on_delivery" ? "Cash on Delivery" : payment.method}
          </div>
          <div className="text-xs text-custom-secondary">{payment.description}</div>
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
  );
}

