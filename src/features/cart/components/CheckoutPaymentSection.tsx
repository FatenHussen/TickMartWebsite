import { HiCurrencyDollar, HiCreditCard } from "react-icons/hi";
import { useTranslation } from "react-i18next";
import { useLanguage } from "@/context/LanguageContext";
import { cn } from "@/shared/lib/utils";
import type { PaymentMethodOption } from "../types";

type CheckoutPaymentSectionProps = {
  paymentMethods: PaymentMethodOption[];
  selectedPaymentMethodId: string;
  onPaymentMethodSelect: (methodId: string) => void;
};

// Helper: Get payment icon component and color style
const getPaymentIcon = (type: PaymentMethodOption["type"]) => {
  const isCashOnDelivery = type === "cash_on_delivery";
  return {
    Icon: isCashOnDelivery ? HiCurrencyDollar : HiCreditCard,
    colorStyle: {
      color: isCashOnDelivery
        ? "var(--color-green)"
        : "var(--color-accent-primary)",
    },
  };
};

// Helper: Get payment option container classes and styles
const getPaymentOptionStyles = (isSelected: boolean) => {
  const baseClasses =
    "flex items-start gap-3 p-4 rounded-lg border-2 cursor-pointer transition-colors";
  const unselectedClasses =
    "border-custom-secondary bg-custom-primary hover:border-custom-primary";

  if (isSelected) {
    return {
      className: cn(baseClasses),
      style: {
        borderColor: "var(--color-accent-primary)",
        backgroundColor: "var(--color-bg-secondary)",
      },
    };
  }

  return {
    className: cn(baseClasses, unselectedClasses),
    style: undefined,
  };
};

export default function CheckoutPaymentSection({
  paymentMethods,
  selectedPaymentMethodId,
  onPaymentMethodSelect,
}: CheckoutPaymentSectionProps) {
  const { t } = useTranslation();
  const { isRTL } = useLanguage();

  return (
    <div className="mb-6" dir={isRTL ? "rtl" : "ltr"}>
      {/* Header */}
      <h2 className="text-lg font-bold mb-4 text-custom-primary">
        {t("checkout.paymentMethod")}
      </h2>

      {/* Payment Options */}
      <div className="space-y-3">
        {paymentMethods.map((method) => {
          const isSelected = method.id === selectedPaymentMethodId;
          const { Icon, colorStyle } = getPaymentIcon(method.type);

          const { className, style } = getPaymentOptionStyles(isSelected);

          return (
            <label key={method.id} className={className} style={style}>
              <input
                type="radio"
                name="paymentMethod"
                value={method.id}
                checked={isSelected}
                onChange={() => onPaymentMethodSelect(method.id)}
                className="mt-1 w-5 h-5 shrink-0 border-custom-secondary focus:ring-2 focus:ring-custom-accent"
                style={{
                  accentColor: "var(--color-accent-primary)",
                }}
              />
              <Icon
                className="w-5 h-5 shrink-0 mt-0.5"
                style={colorStyle}
                aria-hidden="true"
              />
              <div className="flex-1">
                <div className="font-medium mb-0.5 text-custom-primary">
                  {method.name}
                </div>
                <div className="text-sm text-custom-secondary">
                  {method.description}
                </div>
              </div>
            </label>
          );
        })}
      </div>
    </div>
  );
}
