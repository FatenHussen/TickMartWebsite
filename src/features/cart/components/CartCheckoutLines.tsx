import { useTranslation } from "react-i18next";
import type { CartCheckout } from "../types";

type CartCheckoutLinesProps = {
    checkout: CartCheckout;
};

export default function CartCheckoutLines({ checkout }: CartCheckoutLinesProps) {
    const { t } = useTranslation();
    const minHours = checkout.delivery_min_hours;
    const maxHours = checkout.delivery_max_hours;
    const showWindow = minHours != null && maxHours != null;
    const minOrder = checkout.min_order_amount.formatted.trim();

    if (!showWindow && !minOrder) return null;

    const windowLabel =
        minHours != null && maxHours != null && minHours === maxHours
            ? t("cart.deliveryWindowSame", "{{hours}} hours", { hours: minHours })
            : t("cart.deliveryWindow", "{{min}}–{{max}} hours", {
                  min: minHours,
                  max: maxHours,
              });

    return (
        <div className="rounded-2xl border border-custom-primary bg-custom-card px-4 py-3 text-sm">
            {showWindow && (
                <div className="flex items-center justify-between gap-3 py-1.5">
                    <span className="text-custom-secondary">
                        {t("cart.nearestDelivery", "Earliest delivery")}
                    </span>
                    <span className="font-semibold text-[color:var(--color-text)]">
                        {windowLabel}
                    </span>
                </div>
            )}
            {minOrder && (
                <div className="flex items-center justify-between gap-3 py-1.5">
                    <span className="text-custom-secondary">
                        {t("cart.minOrderAmount", "Minimum order")}
                    </span>
                    <span className="font-semibold tabular-nums text-[color:var(--color-text)]">
                        {minOrder}
                    </span>
                </div>
            )}
        </div>
    );
}
