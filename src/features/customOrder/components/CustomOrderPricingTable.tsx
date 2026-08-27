import { useTranslation } from "react-i18next";
import { useCurrency } from "@/context/CurrencyContext";
import type { CustomOrderLinkedOrder } from "../types";
import { getItemLineTotal, getItemUnitPrice } from "../utils/customOrderHelpers";
import CustomOrderPriceVarianceAlert from "./CustomOrderPriceVarianceAlert";

type CustomOrderPricingTableProps = {
  order: CustomOrderLinkedOrder;
};

function formatDualPrices(
  item: CustomOrderLinkedOrder["items"][number]
): string | null {
  // Prefer API-formatted dual currencies when present.
  const currencies = (item as { price_currencies?: Record<string, { formatted?: string }> })
    .price_currencies;
  if (currencies) {
    const parts = [currencies.USD?.formatted, currencies.SYP?.formatted]
      .filter(Boolean) as string[];
    if (parts.length) return parts.join(" / ");
  }

  const parts: string[] = [];
  if (typeof item.price_syp === "number") parts.push(`${item.price_syp.toLocaleString()} ل.س`);
  if (typeof item.price_usd === "number") parts.push(`$${item.price_usd.toLocaleString()}`);
  if (item.prices) {
    for (const [code, value] of Object.entries(item.prices)) {
      if (code.toLowerCase() === "syp" || code.toLowerCase() === "usd") continue;
      parts.push(`${value.toLocaleString()} ${code}`);
    }
  }
  if (parts.length === 0) return null;
  return parts.join(" · ");
}

export default function CustomOrderPricingTable({ order }: CustomOrderPricingTableProps) {
  const { t } = useTranslation();
  const { formatPrice } = useCurrency();

  return (
    <div className="space-y-4">
      <CustomOrderPriceVarianceAlert order={order} />

      <div className="overflow-x-auto rounded-2xl border border-custom-primary/15 bg-custom-card">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="border-b border-custom-primary/10 bg-custom-tertiary/30 text-custom-secondary">
              <th className="px-4 py-3 text-start font-semibold">{t("customOrder.item")}</th>
              <th className="px-4 py-3 text-center font-semibold">{t("customOrder.qty")}</th>
              <th className="px-4 py-3 text-end font-semibold">{t("customOrder.unitPrice")}</th>
              <th className="px-4 py-3 text-end font-semibold">{t("customOrder.lineTotal")}</th>
            </tr>
          </thead>
          <tbody>
            {(order.items ?? []).map((item, index) => {
              const dual = formatDualPrices(item);
              return (
                <tr
                  key={item.id ?? `${item.product_name}-${index}`}
                  className="border-b border-custom-primary/8 last:border-0"
                >
                  <td className="px-4 py-3">
                    <div className="font-medium text-custom-primary">{item.product_name}</div>
                    {item.is_external && (
                      <span className="mt-1 inline-block rounded-full bg-warning/15 px-2 py-0.5 text-[11px] font-semibold text-warning">
                        {t("customOrder.externalItem")}
                      </span>
                    )}
                    {dual && (
                      <p className="mt-1 text-xs text-custom-secondary">{dual}</p>
                    )}
                    {item.invoice_image && (
                      <a
                        href={item.invoice_image}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-1 inline-block text-xs font-medium text-primary hover:underline"
                      >
                        {t("customOrder.viewInvoice")}
                      </a>
                    )}
                  </td>
                  <td className="px-4 py-3 text-center text-custom-secondary">{item.quantity}</td>
                  <td className="px-4 py-3 text-end text-custom-secondary">
                    {formatPrice(getItemUnitPrice(item))}
                  </td>
                  <td className="px-4 py-3 text-end font-semibold text-custom-primary">
                    {formatPrice(getItemLineTotal(item))}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="rounded-2xl border border-custom-primary/15 bg-custom-card p-4 space-y-2 text-sm">
        <div className="flex justify-between text-custom-secondary">
          <span>{t("orders.subtotal")}</span>
          <span>{formatPrice(order.subtotal)}</span>
        </div>
        <div className="flex justify-between text-custom-secondary">
          <span>{t("orders.delivery")}</span>
          <span>
            {order.delivery_price === 0
              ? t("orders.free")
              : formatPrice(order.delivery_price)}
          </span>
        </div>
        <div className="flex justify-between border-t border-custom-primary/10 pt-2 text-base font-bold text-custom-primary">
          <span>{t("orders.total")}</span>
          <span>{formatPrice(order.total)}</span>
        </div>
        {typeof order.approximate_total === "number" && (
          <p className="text-xs text-custom-secondary">
            {t("customOrder.approximateTotal")}: {formatPrice(order.approximate_total)}
          </p>
        )}
      </div>
    </div>
  );
}
