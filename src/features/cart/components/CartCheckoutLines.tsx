import { useTranslation } from "react-i18next";
import { formatCheckoutDeliveryPrice } from "../lib/cartCheckout";
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
    const deliveryPrice = formatCheckoutDeliveryPrice(
        checkout.delivery_price,
        t("cart.deliveryFree", "Free"),
    );

    if (!showWindow && !minOrder && !deliveryPrice) return null;

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
                <Line
                    label={t("cart.nearestDelivery", "Earliest delivery")}
                    value={windowLabel}
                />
            )}
            {minOrder && (
                <Line
                    label={t("cart.minOrderAmount", "Minimum order")}
                    value={minOrder}
                    numeric
                />
            )}
            {deliveryPrice && (
                <Line
                    label={t("cart.deliveryPrice", "Delivery price")}
                    value={deliveryPrice}
                    numeric
                />
            )}
        </div>
    );
}

function Line({
    label,
    value,
    numeric = false,
}: {
    label: string;
    value: string;
    numeric?: boolean;
}) {
    return (
        <div className="flex items-center justify-between gap-3 py-1.5">
            <span className="text-custom-secondary">{label}</span>
            <span
                className={
                    numeric
                        ? "font-semibold tabular-nums text-[color:var(--color-text)]"
                        : "font-semibold text-[color:var(--color-text)]"
                }
            >
                {value}
            </span>
        </div>
    );
}
