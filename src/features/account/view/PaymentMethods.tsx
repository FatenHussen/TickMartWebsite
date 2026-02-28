import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useLanguage } from "@/context/LanguageContext";
import { cn } from "@/shared/lib/utils";
import type { PaymentMethodOption } from "@/features/cart/types";

import cashIcon from "/images/checkout/cash.png";
import syriatelIcon from "/images/checkout/syriatel.png";
import mtnIcon from "/images/checkout/mtn.png";
import backimage from "/images/accounts/PaymentMethods.png";

const getPaymentIcon = (type: PaymentMethodOption["type"]) => {
  switch (type) {
    case "cash_on_delivery":
      return cashIcon;
    case "syriatel_cash":
      return syriatelIcon;
    case "mtn_cash":
      return mtnIcon;
    default:
      return cashIcon;
  }
};

export default function PaymentMethods() {
  const { t } = useTranslation();
  const { isRTL } = useLanguage();

  const [paymentMethods] = useState<PaymentMethodOption[]>([
    {
      id: "cash_on_delivery",
      name: "Cash on Delivery",
      description: "Pay the driver when your order arrives.",
      type: "cash_on_delivery",
    },
    {
      id: "syriatel_cash",
      name: "Syriatel Cash",
      description: "Pay securely with your card.",
      type: "syriatel_cash",
    },
    {
      id: "mtn_cash",
      name: "MTN Cash",
      description: "Pay securely with your card.",
      type: "mtn_cash",
    },
  ]);

  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>(
    "cash_on_delivery"
  );

  const handlePaymentMethodSelect = (methodId: string) => {
    setSelectedPaymentMethod(methodId);
    // TODO: Save selected payment method to user preferences
    console.log("Selected payment method:", methodId);
  };

  return (
    <div className="space-y-6">
      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-text-primary mb-2">
            {t("account.paymentMethods.title")}
          </h1>
          <p className="text-text-secondary text-sm">
            {t("account.paymentMethods.subtitle")}
          </p>
        </div>

        {/* Payment Method Options */}
        <div className="space-y-4 mb-8">
          {paymentMethods.map((method) => {
            const isSelected = method.id === selectedPaymentMethod;
            const isDefault = method.id === "cash_on_delivery";
            const icon = getPaymentIcon(method.type);

            return (
              <div
                key={method.id}
                className={cn(
                  "bg-white dark:bg-gray-800 rounded-2xl p-6 cursor-pointer transition-all",
                  "border-2",
                  isSelected
                    ? "border-primary bg-cart-items shadow-md"
                    : "border-gray-200 dark:border-gray-600 hover:border-primary/50 dark:hover:border-gray-500",
                  isRTL && "text-right"
                )}
                onClick={() => handlePaymentMethodSelect(method.id)}
              >
                <div className="flex items-center gap-4">
          

                  {/* Payment Icon */}
                  <div className="w-16 h-16 flex items-center justify-center shrink-0">
                    <img
                      src={icon}
                      alt={method.name}
                      className="w-full h-full object-contain"
                    />
                  </div>

                  {/* Payment Method Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="text-lg font-semibold text-text-primary">
                        {method.name}
                      </h3>
                   
                    </div>
                    <p className="text-sm text-text-secondary">
                      {method.description}
                    </p>
                  </div>

                  {/* Radio Button */}
                  {isDefault && (
                        <span
                          className="px-3 py-1 rounded-full text-xs font-medium text-white bg-primary"
                        >
                          {t("account.addresses.default")}
                        </span>
                      )}
                  <div className="flex items-center">
                    <div
                      className={cn(
                        "w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all",
                        isSelected
                          ? "border-primary"
                          : "border-gray-300 dark:border-gray-600"
                      )}
                    >
                      {isSelected && (
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ background: "#4CDAF6" }}
                        />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Informational Note */}
        <div className="bg-blue-50 dark:bg-blue-900/10 rounded-xl p-4 mb-8">
          <p className="text-sm text-gray-light dark:text-blue-300">
            {t("account.paymentMethods.note")}
          </p>
        </div>

        {/* How Payments Work Section */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 relative overflow-hidden">
          {/* Background Image */}
          <div
            className="absolute inset-0 opacity-10 pointer-events-none"
            style={{
              backgroundImage: `url(${backimage})`,
              backgroundSize: "cover",
              backgroundPosition: "bottom right",
              backgroundRepeat: "no-repeat",
            }}
          />
          
          {/* Content */}
          <div className="relative z-10">
            <h2 className="text-lg font-semibold text-text-primary mb-4">
              {t("account.paymentMethods.howPaymentsWork")}
            </h2>
            <ul className="space-y-3">
              {[
                "account.paymentMethods.howPaymentsWork1",
                "account.paymentMethods.howPaymentsWork2",
                "account.paymentMethods.howPaymentsWork3",
              ].map((key, index) => (
                <li key={index} className="flex items-start gap-3">
                  {/* Numbered Circle */}
                  <div
                    className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5 font-semibold text-sm text-white"
                    style={{ background: "#4CDAF6" }}
                  >
                    {index + 1}
                  </div>
                  <p className="text-sm text-text-secondary">
                    {t(key)}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
