import { useTranslation } from "react-i18next";
import { HiOutlineTruck } from "react-icons/hi";
import { cn } from "@/shared/lib/utils";

export type DeliveryOption = {
  id: string;
  label: string;
  icon?: React.ReactNode;
};

export type ProductActionsProps = {
  deliveryOptions?: DeliveryOption[];
  className?: string;
};

export default function ProductActions({
  deliveryOptions = [],
  className,
}: ProductActionsProps) {
  const { t } = useTranslation();
  const defaultDeliveryOptions: DeliveryOption[] =
    deliveryOptions.length > 0
      ? deliveryOptions
      : [
          { id: "cod1", label: t("product.cashOnDelivery", "Cash on delivery") },
          { id: "cod2", label: t("product.cashOnDelivery", "Cash on delivery") },
          { id: "cod3", label: t("product.cashOnDelivery", "Cash on delivery") },
          { id: "cod4", label: t("product.cashOnDelivery", "Cash on delivery") },
        ];

  return (
    <div className={cn("flex flex-col gap-4", className)}>
      {/* Delivery Options - 4 columns grid */}
      {defaultDeliveryOptions.length > 0 && (
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {defaultDeliveryOptions.map((option) => (
            <button
              key={option.id}
              type="button"
              className="flex flex-col items-center justify-center gap-1 rounded-lg border border-gray-200 bg-white px-3 py-3 text-center transition-all hover:border-primary-light hover:shadow-sm"
            >
              {option.icon || (
                <HiOutlineTruck className="h-5 w-5 text-primary-light" />
              )}
              <span className="text-xs font-medium text-gray-700 whitespace-nowrap">
                {option.label}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
