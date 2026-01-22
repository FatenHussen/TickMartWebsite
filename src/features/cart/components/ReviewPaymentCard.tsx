import type { PaymentMethodOption } from "../types";

type ReviewPaymentCardProps = {
  paymentMethod: PaymentMethodOption;
  onEdit: () => void;
};

export default function ReviewPaymentCard({
  paymentMethod,
  onEdit,
}: ReviewPaymentCardProps) {
  return (
    <div
      className="rounded-2xl p-4"
      style={{
        background: "linear-gradient(180deg, #E4F0FB 0%, #E5F3FF 100%)",
        border: "1px solid #E0E0E0",
      }}
    >
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold" style={{ color: "#D97706" }}>
          Payment Method
        </h3>
        <button
          onClick={onEdit}
          className="text-sm font-medium"
          style={{ color: "#2C8090" }}
        >
          Edit
        </button>
      </div>
      <div className="flex items-center gap-3">
        <div
          className="w-10 h-6 rounded flex items-center justify-center"
          style={{
            background: "linear-gradient(135deg, #1E40AF 0%, #3B82F6 100%)",
          }}
        >
          <span className="text-white text-xs font-bold">VISA</span>
        </div>
        <div className="text-sm text-custom-secondary">
          <p>Visa ending in 4567</p>
          <p className="text-xs text-gray-400">**** **** **** 4567</p>
        </div>
      </div>
    </div>
  );
}
