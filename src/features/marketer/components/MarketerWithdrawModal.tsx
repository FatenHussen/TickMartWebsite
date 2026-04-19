import { useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { API_SECOND_FORM_SUBMIT_BTN } from "@/features/marketer/constants/apiSecondClasses";

interface MarketerWithdrawModalProps {
    availableBalance: number;
    isPending: boolean;
    onClose: () => void;
    onSubmit: (amount: number) => void;
}

export function MarketerWithdrawModal({
    availableBalance,
    isPending,
    onClose,
    onSubmit,
}: MarketerWithdrawModalProps) {
    const { t } = useTranslation();
    const [amountInput, setAmountInput] = useState("");

    const handleSubmitForm = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const parsedAmount = parseFloat(amountInput);
        if (!parsedAmount || parsedAmount <= 0) {
            toast.error(t("marketer.dashboard.invalidAmount", "Enter a valid amount"));
            return;
        }
        if (parsedAmount > availableBalance) {
            toast.error(t("marketer.dashboard.insufficientBalance", "Amount exceeds available balance"));
            return;
        }
        onSubmit(parsedAmount);
    };

    return (
        <>
            <div className="fixed inset-0 z-40 bg-black/50" onClick={onClose} />
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <div
                    className="w-full max-w-sm rounded-2xl bg-custom-card p-6 shadow-xl"
                    onClick={(e) => e.stopPropagation()}
                >
                    <h3 className="mb-4 text-lg font-bold text-text-primary">
                        {t("marketer.dashboard.withdrawTitle", "Request Withdrawal")}
                    </h3>
                    <p className="mb-4 text-sm text-text-secondary">
                        {t("marketer.dashboard.availableBalance", "Available balance")}:{""}
                        <span className="font-semibold text-success">{availableBalance.toLocaleString()}</span>
                    </p>
                    <form onSubmit={handleSubmitForm} className="space-y-4">
                        <input
                            type="number"
                            value={amountInput}
                            onChange={(e) => setAmountInput(e.target.value)}
                            placeholder={t("marketer.dashboard.enterAmount", "Enter amount")}
                            min={1}
                            max={availableBalance}
                            step="0.01"
                            className="w-full rounded-xl border border-custom-primary bg-custom-card px-4 py-3 text-text-primary focus:outline-none focus:ring-2 focus:ring-[var(--color-api-second)]"
                        />
                        <div className="flex gap-3">
                            <button
                                type="button"
                                onClick={onClose}
                                className="flex-1 rounded-xl border border-custom-primary py-3 text-text-secondary transition-colors hover:bg-custom-light"
                            >
                                {t("common.cancel", "Cancel")}
                            </button>
                            <button type="submit" disabled={isPending} className={API_SECOND_FORM_SUBMIT_BTN}>
                                {isPending
                                    ? t("common.loading", "Loading...")
                                    : t("marketer.dashboard.withdraw", "Withdraw")}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}
