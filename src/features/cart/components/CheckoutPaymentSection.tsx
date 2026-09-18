import { useTranslation } from "react-i18next";
import { useLanguage } from "@/context/LanguageContext";
import { cn } from "@/shared/lib/utils";
import type { PaymentMethodOption } from "../types";

type CheckoutPaymentSectionProps = {
    paymentMethods: PaymentMethodOption[];
    selectedPaymentMethodId: string;
    onPaymentMethodSelect: (methodId: string) => void;
    allowEmpty?: boolean;
};

export default function CheckoutPaymentSection({
    paymentMethods,
    selectedPaymentMethodId,
    onPaymentMethodSelect,
    allowEmpty = false,
}: CheckoutPaymentSectionProps) {
    const { t } = useTranslation();
    const { isRTL } = useLanguage();

    const defaultMethodId =
        selectedPaymentMethodId ||
        (allowEmpty ? "" : paymentMethods[0]?.id || "");

    return (
        <section dir={isRTL ? "rtl" : "ltr"}>
            <h2 className="mb-4 text-xl font-bold text-[color:var(--color-text)]">
                {t("checkout.paymentMethod", "Payment method")}
            </h2>

            {paymentMethods.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-custom-primary bg-custom-card px-5 py-8 text-center">
                    <p className="text-sm text-custom-secondary">
                        {t(
                            "checkout.noPaymentMethods",
                            "No payment methods are available right now.",
                        )}
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
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
                                    "flex h-full min-h-[148px] flex-col items-center gap-2.5 rounded-2xl border-2 p-4 text-center",
                                    "transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[color:color-mix(in_srgb,var(--color-main)_25%,transparent)]",
                                    !isSelected &&
                                        "border-custom-primary bg-custom-card hover:border-[color:color-mix(in_srgb,var(--color-main)_35%,transparent)]",
                                )}
                                style={
                                    isSelected
                                        ? {
                                              borderColor:
                                                  "color-mix(in srgb, var(--color-main) 55%, transparent)",
                                              backgroundColor:
                                                  "color-mix(in srgb, var(--color-main) 8%, var(--color-bg-card))",
                                              boxShadow:
                                                  "0 10px 24px -12px color-mix(in srgb, var(--color-main) 35%, transparent)",
                                          }
                                        : undefined
                                }
                            >
                                <span
                                    className={cn(
                                        "flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2",
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
                                        <span className="h-2 w-2 rounded-full bg-white" />
                                    )}
                                </span>

                                <div className="flex h-12 w-16 items-center justify-center">
                                    {method.icon ? (
                                        <img
                                            src={method.icon}
                                            alt=""
                                            className="max-h-full max-w-full object-contain"
                                        />
                                    ) : (
                                        <div
                                            className="h-10 w-10 rounded-full"
                                            style={{
                                                backgroundColor:
                                                    "color-mix(in srgb, var(--color-main) 12%, var(--color-bg-tertiary))",
                                            }}
                                        />
                                    )}
                                </div>

                                <div className="min-w-0 w-full">
                                    <p className="text-sm font-semibold leading-tight text-[color:var(--color-text)]">
                                        {method.name}
                                    </p>
                                    {method.description ? (
                                        <p className="mt-1 line-clamp-2 text-xs text-custom-secondary">
                                            {method.description}
                                        </p>
                                    ) : null}
                                </div>
                            </button>
                        );
                    })}
                </div>
            )}
        </section>
    );
}
