type DeliveryDetailsProps = {
  delivery: {
    fullName: string;
    phoneNumber: string;
    address: string;
    eta: string;
    message?: string;
  };
};

export default function DeliveryDetails({ delivery }: DeliveryDetailsProps) {
  return (
    <div className="bg-custom-primary rounded-2xl border border-custom-secondary shadow-sm p-6 mb-6">
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
          <div className="text-xs text-custom-secondary mb-1">Phone Number</div>
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
  );
}
