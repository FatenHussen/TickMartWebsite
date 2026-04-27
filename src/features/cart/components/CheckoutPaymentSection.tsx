import { useTranslation } from "react-i18next";
import { useLanguage } from "@/context/LanguageContext";
import { cn } from "@/shared/lib/utils";
import type { PaymentMethodOption } from "../types";

type CheckoutPaymentSectionProps = {
    paymentMethods: PaymentMethodOption[];
    selectedPaymentMethodId: string;
    onPaymentMethodSelect: (methodId: string) => void;
};

export default function CheckoutPaymentSection({
    paymentMethods,
    selectedPaymentMethodId,
    onPaymentMethodSelect,
}: CheckoutPaymentSectionProps) {
    const { t } = useTranslation();
    const { isRTL } = useLanguage();

    const defaultMethodId =
        selectedPaymentMethodId || paymentMethods[0]?.id || "";

    return (
        <div className="mb-6" dir={isRTL ? "rtl" : "ltr"}>
            {/* Header */}
            <h2 className="text-xl sm:text-2xl font-bold mb-4 text-[color:var(--color-text)]">
                {t("checkout.paymentMethod", "Payment Method")}
            </h2>

            {/* Payment Method Cards */}
            <div className="flex flex-wrap gap-4">
                {paymentMethods.map((method) => {
                    const isSelected =
                        method.id ===
                        (selectedPaymentMethodId || defaultMethodId);

                    return (
                        <button
                            key={method.id}
                            type="button"
                            onClick={() => onPaymentMethodSelect(method.id)}
                            className={cn(
                                "group flex flex-col items-center gap-3 p-4 rounded-2xl border-2",
                                "transition-all duration-200 text-center",
                                "flex-1 min-w-[140px] max-w-[220px]",
                                "focus:outline-none focus-visible:ring-2 focus-visible:ring-[color:color-mix(in_srgb,var(--color-main)_25%,transparent)]",
                                isSelected
                                    ? "shadow-[0_10px_24px_-12px_color-mix(in_srgb,var(--color-main)_35%,transparent)]"
                                    : "border-custom-primary bg-custom-card hover:-translate-y-0.5 hover:shadow-sm hover:border-[color:color-mix(in_srgb,var(--color-main)_35%,transparent)]",
                            )}
                            style={
                                isSelected
                                    ? {
                                          borderColor:
                                              "color-mix(in srgb, var(--color-main) 55%, transparent)",
                                          backgroundColor:
                                              "color-mix(in srgb, var(--color-main) 8%, var(--color-bg-card))",
                                      }
                                    : undefined
                            }
                        >
                            {/* Radio circle at top */}
                            <span
                                className={cn(
                                    "w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all",
                                    isSelected
                                        ? "border-transparent"
                                        : "border-custom-secondary bg-custom-card",
                                )}
                                style={
                                    isSelected
                                        ? {
                                              backgroundColor:
                                                  "var(--color-api-second)",
                                          }
                                        : undefined
                                }
                            >
                                {isSelected && (
                                    <span className="w-2 h-2 rounded-full bg-white" />
                                )}
                            </span>

                            {/* Icon */}
                            <div className="w-16 h-12 flex items-center justify-center flex-shrink-0">
                                {method.icon ? (
                                    <img
                                        src={method.icon}
                                        alt=""
                                        className="max-w-full max-h-full object-contain"
                                    />
                                ) : (
                                    <div
                                        className="w-10 h-10 rounded-full"
                                        style={{
                                            backgroundColor:
                                                "color-mix(in srgb, var(--color-main) 12%, var(--color-bg-tertiary))",
                                        }}
                                    />
                                )}
                            </div>

                            {/* Name + Description */}
                            <div className="min-w-0 w-full">
                                <p className="font-semibold text-sm text-[color:var(--color-text)] leading-tight">
                                    {method.name}
                                </p>
                                {method.description && (
                                    <p className="text-xs text-custom-secondary mt-1 line-clamp-2">
                                        {method.description}
                                    </p>
                                )}
                            </div>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
