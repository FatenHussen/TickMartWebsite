import { useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Plus, Zap } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { paths } from "@/app/routes/path/paths";
import Button from "@/shared/ui/Button";
import { PremiumAppLoader } from "@/shared/component/loading";
import { useInfiniteScroll } from "@/shared/hooks/useInfiniteScroll";
import { useAddresses } from "@/features/account/hooks/useAddress";
import {
  useCustomOrderStatusCounts,
  useCustomOrdersInfinite,
} from "../hooks/useCustomOrders";
import CustomOrderEmptyState from "../components/CustomOrderEmptyState";
import CustomOrderListCard from "../components/CustomOrderListCard";
import CustomOrderStatusFilters from "../components/CustomOrderStatusFilters";
import {
  parseCustomOrderStatusFilter,
  type CustomOrderStatusFilter,
} from "../constants";
import { formatCustomOrderAddress } from "../utils/customOrderHelpers";

export default function CustomOrderList() {
  const { t } = useTranslation();
  const { isRTL, language } = useLanguage();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const statusFilter = parseCustomOrderStatusFilter(searchParams.get("status"));

  const {
    items,
    isLoading,
    isError,
    refetch,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useCustomOrdersInfinite(statusFilter);
  const counts = useCustomOrderStatusCounts();
  const { data: addresses = [] } = useAddresses();

  const setStatusFilter = (value: CustomOrderStatusFilter) => {
    if (value === "all") {
      setSearchParams({}, { replace: true });
      return;
    }
    setSearchParams({ status: value }, { replace: true });
  };

  const observerTarget = useInfiniteScroll({
    onLoadMore: () => fetchNextPage(),
    hasMore: Boolean(hasNextPage),
    isLoading: isFetchingNextPage || isLoading,
  });

  const decoratedItems = useMemo(
    () =>
      items.map((item) => {
        if (formatCustomOrderAddress(item.address, language)) return item;
        const fallback = addresses.find((addr) => addr.id === item.address_id);
        if (!fallback) return item;
        return { ...item, address: fallback };
      }),
    [items, addresses, language]
  );

  const isFilteredEmpty = !isLoading && !isError && items.length === 0 && statusFilter !== "all";
  const isTrueEmpty = !isLoading && !isError && items.length === 0 && statusFilter === "all";
  const showHeaderCta = !isTrueEmpty;
  const showCounts = !isTrueEmpty;

  return (
    <div
      className="mx-auto flex w-full max-w-5xl flex-1 flex-col px-4 py-8 sm:px-6"
      dir={isRTL ? "rtl" : "ltr"}
    >
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-bold text-custom-primary sm:text-3xl">
            <Zap className="h-7 w-7 text-[color:var(--color-main)]" aria-hidden />
            {t("customOrder.title")}
          </h1>
          <p className="mt-1 text-sm text-custom-secondary">
            {t("customOrder.listDescription")}
          </p>
        </div>
        {showHeaderCta && (
          <Button
            type="button"
            variant="primary"
            onClick={() => navigate(paths.client.customOrderCreate)}
            className="inline-flex min-h-11 rounded-xl px-5"
          >
            <Plus className="h-4 w-4" />
            {t("customOrder.newRequest")}
          </Button>
        )}
      </div>

      <div className="mb-6">
        <CustomOrderStatusFilters
          value={statusFilter}
          onChange={setStatusFilter}
          counts={
            showCounts
              ? {
                  all:
                    typeof counts.pending_pricing === "number" &&
                    typeof counts.waiting_approval === "number" &&
                    typeof counts.approved === "number" &&
                    typeof counts.cancelled === "number"
                      ? counts.pending_pricing +
                        counts.waiting_approval +
                        counts.approved +
                        counts.cancelled
                      : undefined,
                  pending_pricing: counts.pending_pricing,
                  waiting_approval: counts.waiting_approval,
                  approved: counts.approved,
                  cancelled: counts.cancelled,
                }
              : undefined
          }
        />
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

      {(isTrueEmpty || isFilteredEmpty) && (
        <CustomOrderEmptyState
          filtered={isFilteredEmpty}
          onCreate={() => navigate(paths.client.customOrderCreate)}
          onViewAll={() => setStatusFilter("all")}
        />
      )}

      {!isLoading && decoratedItems.length > 0 && (
        <>
          <ul className="space-y-3">
            {decoratedItems.map((item) => (
              <li key={item.id}>
                <CustomOrderListCard item={item} />
              </li>
            ))}
          </ul>
          <div ref={observerTarget} className="h-8" />
          {isFetchingNextPage && (
            <p className="py-4 text-center text-sm text-custom-secondary">
              {t("common.loading")}
            </p>
          )}
        </>
      )}
    </div>
  );
}
