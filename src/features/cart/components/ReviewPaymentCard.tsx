import { HiCreditCard, HiOutlinePencil, HiOutlineCreditCard } from "react-icons/hi";
import { FaMoneyBillWave, FaMobileAlt } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import type { PaymentMethodOption } from "../types";

type ReviewPaymentCardProps = {
    paymentMethod: PaymentMethodOption;
    onEdit: () => void;
};

function getPaymentIcon(type?: string) {
    switch (type) {
        case "credit_card":
            return <HiCreditCard className="w-5 h-5 text-white" />;
        case "cash_on_delivery":
            return <FaMoneyBillWave className="w-5 h-5 text-white" />;
        case "syriatel_cash":
        case "mtn_cash":
            return <FaMobileAlt className="w-5 h-5 text-white" />;
        default:
            return <HiCreditCard className="w-5 h-5 text-white" />;
    }
}

export default function ReviewPaymentCard({
    paymentMethod,
    onEdit,
}: ReviewPaymentCardProps) {
    const { t } = useTranslation();
    return (
        <div className="rounded-2xl bg-custom-card border border-custom-primary shadow-sm p-4 transition-shadow hover:shadow-md">
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                    <span
                        className="flex h-7 w-7 items-center justify-center rounded-lg"
                        style={{
                            background:
                                "color-mix(in srgb, var(--color-main) 14%, var(--color-bg-card))",
                            color: "var(--color-main)",
                        }}
                    >
                        <HiOutlineCreditCard className="w-4 h-4" />
                    </span>
                    <h3 className="text-sm font-bold text-[color:var(--color-text)]">
                        {t("checkout.paymentMethod", "Payment Method")}
                    </h3>
                </div>
                <button
                    type="button"
                    onClick={onEdit}
                    className="inline-flex items-center gap-1 text-xs font-semibold rounded-full px-2.5 py-1 transition-colors"
                    style={{
                        color: "var(--color-main)",
                        backgroundColor:
                            "color-mix(in srgb, var(--color-main) 10%, transparent)",
                    }}
                >
                    <HiOutlinePencil className="w-3.5 h-3.5" />
                    {t("common.edit", "Edit")}
                </button>
            </div>
            <div className="flex items-center gap-3">
                <div
                    className="w-12 h-12 shrink-0 rounded-xl flex items-center justify-center"
                    style={{
                        background:
                            "linear-gradient(135deg, var(--color-main) 0%, var(--color-api-second) 100%)",
                        boxShadow:
                            "0 4px 12px -4px color-mix(in srgb, var(--color-main) 40%, transparent)",
                    }}
                >
                    {getPaymentIcon(paymentMethod?.type)}
                </div>
                <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-[color:var(--color-text)] truncate">
                        {paymentMethod?.name || t("checkout.paymentMethod", "Payment Method")}
                    </p>
                    <p className="text-xs text-custom-tertiary leading-snug">
                        {paymentMethod?.description ||
                            t(
                                "checkout.selectPaymentMethod",
                                "Select a payment method",
                            )}
                    </p>
                </div>
            </div>
        </div>
    );
}
