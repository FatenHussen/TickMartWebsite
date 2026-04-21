import { useTranslation } from "react-i18next";
import type { UnreviewedItem } from "../types";
import Rate from "./Rate";

type UnreviewedItemCardProps = {
    item: UnreviewedItem;
    onRateNow?: (id: string | number, orderId?: string) => void;
    /** When true, render as row without card styling (for divided list inside colored section) */
    compact?: boolean;
};

export default function UnreviewedItemCard({
    item,
    onRateNow,
    compact = false,
}: UnreviewedItemCardProps) {
    const { t } = useTranslation();

    const content = (
        <div className="flex items-center gap-4 py-4">
            <div className="w-12 h-12 shrink-0 overflow-hidden rounded-lg bg-custom-tertiary">
                <img
                    src={item.productImage}
                    alt={item.productName}
                    className="h-full w-full object-cover"
                />
            </div>

            <div className="min-w-0 flex-1">
                <h3 className="truncate text-sm font-semibold text-custom-primary">
                    {item.productName}
                </h3>
                <p className="text-xs text-custom-secondary">
                    {t("account.myReviews.deliveredOn")} {item.deliveryDate}
                </p>
            </div>

            <Rate
                label={t("account.myReviews.rateNow")}
                onClick={() => onRateNow?.(item.id, item.orderId)}
            />
        </div>
    );

    if (compact) {
        return content;
    }

    return (
        <div className="rounded-xl border border-custom-primary bg-custom-card p-4">
            {content}
        </div>
    );
}
