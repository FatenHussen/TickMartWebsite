import { useTranslation } from "react-i18next";
import { HiCurrencyDollar } from "react-icons/hi";
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
          { id: "cod1", label: t("product.cashOnDelivery") },
          { id: "cod2", label: t("product.cashOnDelivery") },
          { id: "cod3", label: t("product.cashOnDelivery") },
          { id: "cod4", label: t("product.cashOnDelivery") },
        ];

  return (
    <div className={cn("flex flex-col gap-4", className)}>
      {/* Delivery Options */}
      {defaultDeliveryOptions.length > 0 && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {defaultDeliveryOptions.map((option) => (
            <button
              key={option.id}
              type="button"
              className="flex items-center justify-center gap-2 rounded-xl border border-custom-secondary bg-custom-secondary px-3 py-2 text-xs font-semibold text-primary transition-all hover:border-primary hover:bg-custom-hover"
            >
              {option.icon || <HiCurrencyDollar className="h-4 w-4" />}
              <span className="whitespace-nowrap">{option.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
