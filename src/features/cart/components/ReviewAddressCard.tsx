import type { DeliveryAddress } from "../types";

type ReviewAddressCardProps = {
  address: DeliveryAddress;
  onEdit: () => void;
};

export default function ReviewAddressCard({
  address,
  onEdit,
}: ReviewAddressCardProps) {
  return (
    <div
      className="rounded-2xl p-4"
      style={{
        background: "linear-gradient(180deg, #E4F0FB 0%, #E5F3FF 100%)",
        border: "1px solid #E0E0E0",
      }}
    >
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold" style={{ color: "#22C55E" }}>
          Delivery Address
        </h3>
        <button
          onClick={onEdit}
          className="text-sm font-medium"
          style={{ color: "#2C8090" }}
        >
          Edit
        </button>
      </div>
      <div className="text-sm text-custom-secondary space-y-1">
        <p className="font-semibold text-custom-primary">{address.fullName}</p>
        <p>{address.phoneNumber}</p>
        <p className="whitespace-pre-line">{address.address}</p>
      </div>
    </div>
  );
}
