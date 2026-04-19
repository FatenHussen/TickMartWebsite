import type { TFunction } from "i18next";
import { Button } from "@/shared/ui";
import { cn } from "@/shared/lib/utils";
import type { Address } from "../../../types";
import { primaryGradientButtonClass } from "../constants";

type GiftAddressModalProps = {
    t: TFunction;
    addresses: Address[];
    selectedAddressId: number | null;
    onSelectAddress: (id: number) => void;
    onCancel: () => void;
    onConfirm: () => void;
    isConfirmPending: boolean;
};

export function GiftAddressModal({
    t,
    addresses,
    selectedAddressId,
    onSelectAddress,
    onCancel,
    onConfirm,
    isConfirmPending,
}: GiftAddressModalProps) {
    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-[2px] transition-opacity"
            role="dialog"
            aria-modal="true"
            aria-labelledby="gift-address-title"
        >
            <div className="w-full max-w-md rounded-2xl border border-custom-primary/10 bg-custom-card p-6 shadow-2xl transition-all duration-200">
                <h3 id="gift-address-title" className="text-lg font-bold text-custom-primary">
                    {t("account.pointsRewards.giftAddress.title", "Select Delivery Address")}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-custom-secondary">
                    {t(
                        "account.pointsRewards.giftAddress.description",
                        "Choose where to deliver your gift.",
                    )}
                </p>
                <div className="mt-4 max-h-60 space-y-2 overflow-y-auto rounded-xl border border-custom-primary/10 p-1">
                    {addresses.map((addr) => {
                        const selected = selectedAddressId === addr.id;
                        return (
                            <button
                                key={addr.id}
                                type="button"
                                onClick={() => onSelectAddress(addr.id)}
                                className={cn(
                                    "w-full rounded-lg border px-4 py-3 text-left text-sm transition-all duration-200",
                                    selected
                                        ? "border-primary-light bg-primary-light/10 text-primary-light shadow-sm ring-2 ring-primary-light/30"
                                        : "border-transparent text-custom-primary hover:border-primary-light/35 hover:bg-custom-muted/50",
                                )}
                            >
                                <span className="font-medium">{addr.label}</span>
                                {addr.street_name ? (
                                    <span className="mt-0.5 block text-xs text-custom-secondary">
                                        {addr.street_name}
                                    </span>
                                ) : null}
                            </button>
                        );
                    })}
                </div>
                <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                    <Button variant="outline" size="sm" fullWidth onClick={onCancel}>
                        {t("common.cancel", "Cancel")}
                    </Button>
                    <Button
                        variant="primary"
                        size="sm"
                        fullWidth
                        disabled={selectedAddressId == null || isConfirmPending}
                        onClick={onConfirm}
                        className={cn(primaryGradientButtonClass)}
                    >
                        {isConfirmPending ? t("common.loadingShort") : t("common.confirm", "Confirm")}
                    </Button>
                </div>
            </div>
        </div>
    );
}
