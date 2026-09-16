import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Clock, MapPin, Zap } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { useCurrency } from "@/context/CurrencyContext";
import { paths } from "@/app/routes/path/paths";
import type { CustomOrderRequest } from "../types";
import CustomOrderStatusBadge from "./CustomOrderStatusBadge";
import {
  formatCustomOrderAddress,
  formatCustomOrderDate,
  getCustomOrderDisplayTotal,
  resolveCustomOrderImageUrl,
} from "../utils/customOrderHelpers";

type CustomOrderListCardProps = {
  item: CustomOrderRequest;
};

export default function CustomOrderListCard({ item }: CustomOrderListCardProps) {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const { formatPrice } = useCurrency();
  const firstImage = resolveCustomOrderImageUrl(item.images?.[0]);
  const created = formatCustomOrderDate(item.created_at, language);
  const expected = formatCustomOrderDate(item.expected_at, language);
  const address = formatCustomOrderAddress(item.address, language);
  const total = getCustomOrderDisplayTotal(item);

  return (
    <Link
      to={paths.client.customOrderDetails(item.id)}
      className="flex gap-4 rounded-2xl border border-custom-primary/12 bg-custom-card p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
    >
      {firstImage ? (
        <img
          src={firstImage}
          alt=""
          className="h-20 w-20 shrink-0 rounded-xl object-cover"
        />
      ) : (
        <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-xl bg-[color-mix(in_srgb,var(--color-main)_12%,var(--color-bg-card))] text-[color:var(--color-main)]">
          <Zap className="h-7 w-7" />
        </div>
      )}
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm font-bold text-custom-primary">
            {t("customOrder.requestNumber", { id: item.id })}
          </span>
          <CustomOrderStatusBadge status={item.status} />
          {created && (
            <time className="text-xs text-custom-tertiary" dateTime={item.created_at}>
              {created}
            </time>
          )}
        </div>
        <p className="mt-2 line-clamp-2 text-sm text-custom-primary">
          {item.description}
        </p>
        <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-custom-secondary">
          {address && (
            <span className="inline-flex min-w-0 items-center gap-1">
              <MapPin className="h-3.5 w-3.5 shrink-0" aria-hidden />
              <span className="line-clamp-1">{address}</span>
            </span>
          )}
          {expected && (
            <span className="inline-flex items-center gap-1">
              <Clock className="h-3.5 w-3.5 shrink-0" aria-hidden />
              {expected}
            </span>
          )}
          {total != null && (
            <span className="font-semibold text-custom-primary">
              {formatPrice(total)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
