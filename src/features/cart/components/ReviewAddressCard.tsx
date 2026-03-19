import type { DeliveryAddress } from"../types";

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
 className="rounded-2xl"
 style={{
 background:"linear-gradient(90deg, #4CDAF6 0%, #2C8090 100%)",
 padding:"1px",
 borderRadius:"16px",
 boxShadow:"0 4px 20px rgba(0, 0, 0, 0.25)",
 }}
 >
 <div className="rounded-2xl p-4 bg-custom-secondary dark:bg-custom-tertiary">
 <div className="flex items-center justify-between mb-2">
 <h3 className="text-sm font-semibold text-status-success">
 Delivery Address
 </h3>
 <button
 onClick={onEdit}
 className="text-sm font-medium text-custom-accent"
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
 </div>
 );
}
