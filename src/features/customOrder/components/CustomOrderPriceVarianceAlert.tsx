import { useTranslation } from "react-i18next";
import type { CustomOrderLinkedOrder } from "../types";

type CustomOrderPriceVarianceAlertProps = {
  order: Pick<
    CustomOrderLinkedOrder,
    "has_external_items" | "price_variance_type" | "price_variance_value"
  >;
};

export default function CustomOrderPriceVarianceAlert({
  order,
}: CustomOrderPriceVarianceAlertProps) {
  const { t } = useTranslation();

  if (!order.has_external_items) return null;

  const variance =
    order.price_variance_type === "percent"
      ? `±${order.price_variance_value ?? 0}%`
      : `±${order.price_variance_value ?? 0}`;

  return (
    <div
      role="status"
      className="rounded-xl border border-warning/30 bg-warning/10 px-4 py-3 text-sm text-custom-primary"
    >
      {t("customOrder.externalPriceVariance", { variance })}
    </div>
  );
}
