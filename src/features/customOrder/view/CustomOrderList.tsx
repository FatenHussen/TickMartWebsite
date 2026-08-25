import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Plus, Zap } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { paths } from "@/app/routes/path/paths";
import Button from "@/shared/ui/Button";
import { cn } from "@/shared/lib/utils";
import { PremiumAppLoader } from "@/shared/component/loading";
import { useCustomOrders } from "../hooks/useCustomOrders";
import CustomOrderStatusBadge from "../components/CustomOrderStatusBadge";
import { resolveCustomOrderImageUrl } from "../utils/customOrderHelpers";

const STATUS_FILTERS = [
  "all",
  "pending_pricing",
  "waiting_approval",
  "approved",
  "cancelled",
] as const;

export default function CustomOrderList() {
  const { t } = useTranslation();
  const { isRTL } = useLanguage();
  const navigate = useNavigate();
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const listParams = useMemo(
    () => (statusFilter === "all" ? undefined : { status: statusFilter }),
    [statusFilter]
  );

  const { data, isLoading, isError, refetch } = useCustomOrders(listParams);
  const items = data?.items ?? [];

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6" dir={isRTL ? "rtl" : "ltr"}>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-bold text-custom-primary sm:text-3xl">
            <Zap className="h-7 w-7 text-primary" aria-hidden />
            {t("customOrder.title")}
          </h1>
          <p className="mt-1 text-sm text-custom-secondary">{t("customOrder.listDescription")}</p>
        </div>
        <Button
          type="button"
          variant="primary"
          onClick={() => navigate(paths.client.customOrderCreate)}
          className="inline-flex min-h-11 rounded-xl px-5"
        >
          <Plus className="h-4 w-4" />
          {t("customOrder.newRequest")}
        </Button>
      </div>

      <div className="mb-6 flex flex-wrap gap-2">
        {STATUS_FILTERS.map((key) => {
          const active = statusFilter === key;
          return (
            <button
              key={key}
              type="button"
              onClick={() => setStatusFilter(key)}
              className={cn(
                "rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors",
                active
                  ? "bg-primary text-white"
                  : "bg-custom-tertiary/50 text-custom-secondary hover:bg-custom-hover"
              )}
            >
              {key === "all"
                ? t("orders.all")
                : key === "cancelled"
                  ? t("customOrder.status.cancelled")
                  : t(`customOrder.status.${key}`)}
            </button>
          );
        })}
      </div>

      {isLoading && <PremiumAppLoader minHeight="min-h-[280px]" />}

      {isError && (
        <div className="rounded-2xl border border-custom-primary/15 bg-custom-card p-8 text-center">
          <p className="text-custom-secondary">{t("errors.somethingWentWrong")}</p>
          <Button type="button" variant="outline" className="mt-4" onClick={() => refetch()}>
            {t("errors.retry")}
          </Button>
        </div>
      )}

      {!isLoading && !isError && items.length === 0 && (
        <div className="rounded-2xl border border-dashed border-custom-primary/25 bg-custom-card p-10 text-center">
          <p className="text-custom-secondary">{t("customOrder.empty")}</p>
          <Button
            type="button"
            variant="primary"
            className="mt-4"
            onClick={() => navigate(paths.client.customOrderCreate)}
          >
            {t("customOrder.newRequest")}
          </Button>
        </div>
      )}

      {!isLoading && items.length > 0 && (
        <ul className="space-y-3">
          {items.map((item) => {
            const firstImage = resolveCustomOrderImageUrl(item.images?.[0]);
            return (
              <li key={item.id}>
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
                    <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <Zap className="h-7 w-7" />
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <CustomOrderStatusBadge status={item.status} />
                      {item.created_at && (
                        <time className="text-xs text-custom-tertiary">
                          {new Date(item.created_at).toLocaleString()}
                        </time>
                      )}
                    </div>
                    <p className="mt-2 line-clamp-2 text-sm text-custom-primary">
                      {item.description}
                    </p>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
