import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useLanguage } from "@/context/LanguageContext";
import { Button } from "@/shared/ui";
import { HiExclamationCircle } from "react-icons/hi";
import { cn } from "@/shared/lib/utils";
import {
  usePointsSummary,
  usePointsTransactions,
  usePointsExchangeOptions,
} from "../hooks/usePoints";
import type { PointsTransactionItem } from "../types";

const POINT_VALUE_SYP = 10;
const NEXT_REWARD_THRESHOLD = 3000;

type PointsHistoryFilter = "all" | "earned" | "redeemed" | "expired";

function formatDate(value: string) {
  try {
    const d = new Date(value);
    return isNaN(d.getTime()) ? value : d.toLocaleDateString(undefined, {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch {
    return value;
  }
}

export default function PointsRewards() {
  const { t } = useTranslation();
  const { isRTL } = useLanguage();
  const [activeFilter, setActiveFilter] = useState<PointsHistoryFilter>("all");
  const [historyPage, setHistoryPage] = useState(1);

  const { data: summary, isLoading: summaryLoading, isError: summaryError } = usePointsSummary();
  const { data: transactionsData, isLoading: transactionsLoading, isError: transactionsError } =
    usePointsTransactions(historyPage);
  const { data: exchangeOptions, isLoading: exchangeLoading } = usePointsExchangeOptions();

  const balance = summary?.balance ?? 0;
  const expireAt = summary?.expire_at ?? "";
  const pendingPoints = summary?.pending_points ?? 0;
  const estimatedValue = balance * POINT_VALUE_SYP;
  const progressPercentage = (balance / NEXT_REWARD_THRESHOLD) * 100;

  const items = useMemo(() => transactionsData?.items ?? [], [transactionsData]);
  const pagination = transactionsData?.pagination;

  const filteredItems = useMemo(() => {
    if (activeFilter === "all") return items;
    return items.filter((item) => item.status === activeFilter);
  }, [items, activeFilter]);

  const itemsWithBalance = useMemo(() => {
    const sorted = [...filteredItems].sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
    );
    let running = summary?.balance ?? 0;
    return sorted.map((item) => {
      const displayBalance = running;
      if (item.status === "earned") running -= item.points;
      else running += item.points;
      return { ...item, displayBalance };
    });
  }, [filteredItems, summary?.balance]);

  const filterTabs: { value: PointsHistoryFilter; label: string }[] = [
    { value: "all", label: t("account.pointsRewards.history.filters.all") },
    { value: "earned", label: t("account.pointsRewards.history.filters.earned") },
    { value: "redeemed", label: t("account.pointsRewards.history.filters.redeemed") },
    { value: "expired", label: t("account.pointsRewards.history.filters.expired") },
  ];

  const getTypeBadgeColor = (status: string) => {
    switch (status) {
      case "earned":
        return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400";
      case "redeemed":
        return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400";
      case "expired":
        return "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400";
      default:
        return "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300";
    }
  };

  const isLoading = summaryLoading;
  const hasSummaryError = summaryError;

  if (hasSummaryError) {
    return (
      <div className="space-y-6" dir={isRTL ? "rtl" : "ltr"}>
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-text-primary mb-2">
            {t("account.pointsRewards.title")}
          </h1>
        </div>
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6 text-center text-text-secondary">
          {t("account.pointsRewards.errorLoading") ?? "Failed to load points. Please try again."}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6" dir={isRTL ? "rtl" : "ltr"}>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-text-primary mb-2">
          {t("account.pointsRewards.title")}
        </h1>
        <p className="text-text-secondary text-sm">
          {t("account.pointsRewards.description")}
        </p>
      </div>

      {/* Top row: Your Points | Expiry & How to Earn */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Your Points */}
        <div className="bg-white dark:bg-bg-primary rounded-2xl p-6">
          <h2 className="text-lg font-semibold text-text-primary mb-4">
            {t("account.pointsRewards.yourPoints.title")}
          </h2>
          {isLoading ? (
            <div className="h-32 flex items-center justify-center text-text-secondary">
              {t("common.loading") ?? "Loading..."}
            </div>
          ) : (
            <>
              <div className="text-4xl font-bold text-primary mb-2">
                {balance.toLocaleString()} {t("account.pointsRewards.points")}
              </div>
              <div className="text-sm text-text-secondary space-y-1 mb-4">
                <div>
                  {t("account.pointsRewards.pointValue")}: 1 {t("account.pointsRewards.points")} = {POINT_VALUE_SYP} SYP
                </div>
                <div>
                  {t("account.pointsRewards.estimatedValue")}: {estimatedValue.toLocaleString()} SYP {t("account.pointsRewards.inRewards")}
                </div>
              </div>
              <div className="mt-4">
                <div className="flex justify-between text-sm text-text-secondary mb-2">
                  <span>{t("account.pointsRewards.nextReward")} {NEXT_REWARD_THRESHOLD.toLocaleString()} {t("account.pointsRewards.points")}</span>
                  <span>{Math.round(Math.min(progressPercentage, 100))}%</span>
                </div>
                <div className="w-full h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary transition-all duration-300"
                    style={{ width: `${Math.min(progressPercentage, 100)}%` }}
                  />
                </div>
              </div>
            </>
          )}
        </div>

        {/* Expiry & How to Earn */}
        <div className="bg-white dark:bg-bg-primary rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-text-primary mb-3">
            {t("account.pointsRewards.howToEarn.title")}
          </h3>
          {expireAt && (
            <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-xl p-4 mb-6 flex items-start gap-3">
              <HiExclamationCircle className="w-5 h-5 text-orange-500 shrink-0 mt-0.5" />
              <div className="text-sm font-medium text-orange-700 dark:text-orange-400">
                {t("account.pointsRewards.expiry.nextExpiry")}: {formatDate(expireAt)}
                {pendingPoints > 0 && ` - ${pendingPoints} ${t("account.pointsRewards.points")} ${t("account.pointsRewards.expiry.willExpire")}`}
              </div>
            </div>
          )}
          <ul className="space-y-2 text-text-secondary">
            <li className="flex items-start gap-2">
              <span className="text-primary mt-1">•</span>
              <span>{t("account.pointsRewards.howToEarn.placeOrders")}</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-1">•</span>
              <span>{t("account.pointsRewards.howToEarn.joinCampaigns")}</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-1">•</span>
              <span>{t("account.pointsRewards.howToEarn.usePackages")}</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Redeem Your Points - from API */}
      <div className="bg-white dark:bg-bg-primary rounded-2xl p-6">
        <h2 className="text-lg font-semibold text-text-primary mb-2">
          {t("account.pointsRewards.redeem.title")}
        </h2>
        <p className="text-sm text-text-secondary mb-6">
          {t("account.pointsRewards.redeem.description")}
        </p>

        {exchangeLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-text-secondary text-sm py-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="border border-gray-200 dark:border-gray-700 rounded-xl p-5 animate-pulse h-40" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {exchangeOptions?.options?.coupon?.enabled && (
              <div className="border border-gray-200 dark:border-gray-700 rounded-xl p-5 hover:shadow-md transition-shadow">
                <h3 className="font-semibold text-text-primary mb-2">
                  {t("account.pointsRewards.redeem.options.orderDiscount.title")}
                </h3>
                <div className="text-sm text-text-secondary mb-4 space-y-1">
                  <div>
                    {exchangeOptions.options.coupon.min_points}–{exchangeOptions.options.coupon.max_points} {t("account.pointsRewards.points")} = {exchangeOptions.options.coupon.discount_rate}% {t("account.pointsRewards.redeem.options.discount")}
                  </div>
                  <div className="text-xs">{t("account.pointsRewards.redeem.options.minPoints")} {exchangeOptions.options.coupon.min_points} {t("account.pointsRewards.points")}</div>
                  {exchangeOptions.options.coupon.description && (
                    <div className="text-green-600 dark:text-green-400 text-xs">
                      {exchangeOptions.options.coupon.description}
                    </div>
                  )}
                </div>
                <Button variant="primary" size="sm" fullWidth disabled={!exchangeOptions.available}>
                  {t("account.pointsRewards.redeem.options.redeemPoints")}
                </Button>
              </div>
            )}
            {exchangeOptions?.options?.free_delivery?.enabled && (
              <div className="border border-gray-200 dark:border-gray-700 rounded-xl p-5 hover:shadow-md transition-shadow">
                <h3 className="font-semibold text-text-primary mb-2">
                  {t("account.pointsRewards.redeem.options.freeDelivery.title")}
                </h3>
                <div className="text-sm text-text-secondary mb-4 space-y-1">
                  <div>{exchangeOptions.options.free_delivery.points_cost} {t("account.pointsRewards.points")} → 1 {t("account.pointsRewards.redeem.options.freeDelivery.coupon")}</div>
                  {exchangeOptions.options.free_delivery.description && (
                    <div className="text-xs">{exchangeOptions.options.free_delivery.description}</div>
                  )}
                </div>
                <Button variant="primary" size="sm" fullWidth disabled={!exchangeOptions.available}>
                  {t("account.pointsRewards.redeem.options.redeemForFreeDelivery")}
                </Button>
              </div>
            )}
            {exchangeOptions?.options?.gifts?.enabled && (
              <div className="border border-gray-200 dark:border-gray-700 rounded-xl p-5 hover:shadow-md transition-shadow">
                <h3 className="font-semibold text-text-primary mb-2">
                  {t("account.pointsRewards.redeem.options.giftVoucher.title")}
                </h3>
                <div className="text-sm text-text-secondary mb-4 space-y-1">
                  {exchangeOptions.options.gifts.available_gifts?.length ? (
                    <div className="text-xs">
                      {exchangeOptions.options.gifts.available_gifts
                        .slice(0, 2)
                        .map((g) => `${g.name} (${g.points_required} ${t("account.pointsRewards.points")})`)
                        .join(", ")}
                    </div>
                  ) : (
                    <div className="text-xs">{t("account.pointsRewards.redeem.options.giftVoucher.singleUse")}</div>
                  )}
                </div>
                <Button variant="primary" size="sm" fullWidth disabled={!exchangeOptions.available}>
                  {t("account.pointsRewards.redeem.options.generateVoucher")}
                </Button>
              </div>
            )}
            {!exchangeLoading && !exchangeOptions?.options?.coupon?.enabled && !exchangeOptions?.options?.free_delivery?.enabled && !exchangeOptions?.options?.gifts?.enabled && (
              <div className="col-span-full text-sm text-text-secondary py-2">
                {t("account.pointsRewards.redeem.noOptions") ?? "No redemption options available."}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Vendor Special Offers */}
      <div className="bg-white dark:bg-bg-primary rounded-2xl p-6">
        <h2 className="text-lg font-semibold text-text-primary mb-2">
          {t("account.pointsRewards.vendorOffers.title")}
        </h2>
        <p className="text-sm text-text-secondary mb-4">
          {t("account.pointsRewards.vendorOffers.description")}
        </p>
        <Button variant="outline" size="sm">
          {t("account.pointsRewards.vendorOffers.viewOffers")}
        </Button>
      </div>

      {/* Redemption Conditions */}
      <div className="bg-white dark:bg-bg-primary rounded-2xl p-6">
        <h2 className="text-lg font-semibold text-text-primary mb-3">
          {t("account.pointsRewards.conditions.title")}
        </h2>
        <ul className="space-y-2 text-sm text-text-secondary">
          <li className="flex items-start gap-2">
            <span className="text-primary mt-1">•</span>
            <span>{t("account.pointsRewards.conditions.expiryRule")}</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary mt-1">•</span>
            <span>{t("account.pointsRewards.conditions.minRedemption")}</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary mt-1">•</span>
            <span>{t("account.pointsRewards.conditions.noTransfer")}</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary mt-1">•</span>
            <span>{t("account.pointsRewards.conditions.storeRestrictions")}</span>
          </li>
        </ul>
      </div>

      {/* Points History */}
      <div className="bg-white dark:bg-bg-primary rounded-2xl p-6">
        <h2 className="text-lg font-semibold text-text-primary mb-4">
          {t("account.pointsRewards.history.title")}
        </h2>

        <div className="flex flex-wrap gap-2 mb-6 border-b border-gray-200 dark:border-gray-700 pb-4">
          {filterTabs.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setActiveFilter(tab.value)}
              className={cn(
                "px-4 py-2 rounded-lg text-sm font-medium transition-all",
                activeFilter === tab.value
                  ? "bg-primary text-white"
                  : "bg-transparent text-text-secondary hover:bg-gray-100 dark:hover:bg-gray-800",
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="overflow-x-auto">
          {transactionsLoading ? (
            <div className="py-8 text-center text-text-secondary">
              {t("common.loading") ?? "Loading..."}
            </div>
          ) : transactionsError ? (
            <div className="py-8 text-center text-text-secondary">
              {t("account.pointsRewards.errorLoading") ?? "Failed to load history."}
            </div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-text-secondary">
                    {t("account.pointsRewards.history.table.date")}
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-text-secondary">
                    {t("account.pointsRewards.history.table.description")}
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-text-secondary">
                    {t("account.pointsRewards.history.table.type")}
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-text-secondary">
                    {t("account.pointsRewards.history.table.points")}
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-text-secondary">
                    {t("account.pointsRewards.history.table.balance")}
                  </th>
                </tr>
              </thead>
              <tbody>
                {itemsWithBalance.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-text-secondary">
                      {t("account.pointsRewards.history.noHistory")}
                    </td>
                  </tr>
                ) : (
                  itemsWithBalance.map((item: PointsTransactionItem & { displayBalance: number }) => (
                    <tr
                      key={item.id}
                      className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                    >
                      <td className="py-3 px-4 text-sm text-text-secondary">
                        {formatDate(item.created_at)}
                      </td>
                      <td className="py-3 px-4 text-sm text-text-primary">
                        {item.rule?.title ?? item.type ?? item.reason ?? "—"}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={cn(
                            "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
                            getTypeBadgeColor(item.status),
                          )}
                        >
                          {t(`account.pointsRewards.history.types.${item.status}`)}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-sm font-medium text-text-primary">
                        {item.status === "earned" ? "+" : ""}
                        {item.points}
                      </td>
                      <td className="py-3 px-4 text-sm text-text-secondary">
                        {item.displayBalance.toLocaleString()}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>

        {pagination && pagination.last_page > 1 && (
          <div className="flex justify-center gap-2 mt-4">
            <Button
              variant="outline"
              size="sm"
              disabled={historyPage <= 1}
              onClick={() => setHistoryPage((p) => p - 1)}
            >
              {t("common.previous") ?? "Previous"}
            </Button>
            <span className="flex items-center px-3 text-sm text-text-secondary">
              {pagination.current_page} / {pagination.last_page}
            </span>
            <Button
              variant="outline"
              size="sm"
              disabled={historyPage >= pagination.last_page}
              onClick={() => setHistoryPage((p) => p + 1)}
            >
              {t("common.next") ?? "Next"}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
