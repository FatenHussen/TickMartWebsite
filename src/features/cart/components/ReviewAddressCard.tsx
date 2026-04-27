import { HiOutlineLocationMarker, HiOutlinePencil } from "react-icons/hi";
import { useTranslation } from "react-i18next";
import type { DeliveryAddress } from "../types";

type ReviewAddressCardProps = {
    address: DeliveryAddress;
    onEdit: () => void;
};

export default function ReviewAddressCard({
    address,
    onEdit,
}: ReviewAddressCardProps) {
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
                        <HiOutlineLocationMarker className="w-4 h-4" />
                    </span>
                    <h3 className="text-sm font-bold text-[color:var(--color-text)]">
                        {t("checkout.deliveryAddress", "Delivery Address")}
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
            <div className="text-sm space-y-1">
                <p className="font-semibold text-[color:var(--color-text)]">
                    {address.fullName}
                </p>
                <p className="text-custom-secondary">{address.phoneNumber}</p>
                <p className="text-custom-secondary leading-relaxed whitespace-pre-line">
                    {address.address}
                </p>
            </div>
        </div>
    );
}
