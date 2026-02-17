import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useLanguage } from "@/context/LanguageContext";
import { Button } from "@/shared/ui";
import { HiExclamationCircle } from "react-icons/hi";
import { cn } from "@/shared/lib/utils";
import { mockPointsHistory } from "../data/mockData";

type PointsHistoryFilter = "all" | "earned" | "redeemed" | "expired";

export default function PointsRewards() {
  const { t } = useTranslation();
  const { isRTL } = useLanguage();
  const [activeFilter, setActiveFilter] = useState<PointsHistoryFilter>("all");

  const currentPoints = 2450;
  const pointValue = 10; // 1 pt = 10 SYP
  const estimatedValue = currentPoints * pointValue;
  const nextRewardThreshold = 3000;
  const progressPercentage = (currentPoints / nextRewardThreshold) * 100;

  const nextExpiryDate = "30 Mar 2025";
  const expiringPoints = 250;

  const filteredHistory = useMemo(() => {
    if (activeFilter === "all") return mockPointsHistory;
    return mockPointsHistory.filter((item) => item.type === activeFilter);
  }, [activeFilter]);

  const filterTabs: { value: PointsHistoryFilter; label: string }[] = [
    { value: "all", label: t("account.pointsRewards.history.filters.all") },
    { value: "earned", label: t("account.pointsRewards.history.filters.earned") },
    { value: "redeemed", label: t("account.pointsRewards.history.filters.redeemed") },
    { value: "expired", label: t("account.pointsRewards.history.filters.expired") },
  ];

  const getTypeBadgeColor = (type: string) => {
    switch (type) {
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

      {/* Your Points Section */}
      <div className="bg-white dark:bg-bg-primary rounded-2xl p-6">
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-text-primary mb-4">
            {t("account.pointsRewards.yourPoints.title")}
          </h2>
          <div className="text-4xl font-bold text-primary mb-2">
            {currentPoints.toLocaleString()} {t("account.pointsRewards.points")}
          </div>
          <div className="text-sm text-text-secondary space-y-1 mb-4">
            <div>
              {t("account.pointsRewards.pointValue")}: 1 {t("account.pointsRewards.points")} = {pointValue} SYP
            </div>
            <div>
              {t("account.pointsRewards.estimatedValue")}: = {estimatedValue.toLocaleString()} SYP {t("account.pointsRewards.inRewards")}
            </div>
          </div>
          {/* Progress Bar */}
          <div className="mt-4">
            <div className="flex justify-between text-sm text-text-secondary mb-2">
              <span>{t("account.pointsRewards.nextReward")} {nextRewardThreshold.toLocaleString()} {t("account.pointsRewards.points")}</span>
              <span>{Math.round(progressPercentage)}%</span>
            </div>
            <div className="w-full h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-primary transition-all duration-300"
                style={{ width: `${Math.min(progressPercentage, 100)}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Expiry & How to Earn Section */}
      <div className="bg-white dark:bg-bg-primary rounded-2xl p-6">
        {/* Expiry Warning */}
        <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-xl p-4 mb-6 flex items-start gap-3">
          <HiExclamationCircle className="w-5 h-5 text-orange-500 shrink-0 mt-0.5" />
          <div>
            <div className="text-sm font-medium text-orange-700 dark:text-orange-400">
              {t("account.pointsRewards.expiry.nextExpiry")}: {nextExpiryDate} - {expiringPoints} {t("account.pointsRewards.points")} {t("account.pointsRewards.expiry.willExpire")}
            </div>
          </div>
        </div>

        {/* How to Earn */}
        <div>
          <h3 className="text-lg font-semibold text-text-primary mb-3">
            {t("account.pointsRewards.howToEarn.title")}
          </h3>
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

      {/* Redeem Your Points Section */}
      <div className="bg-white dark:bg-bg-primary rounded-2xl p-6">
        <h2 className="text-lg font-semibold text-text-primary mb-2">
          {t("account.pointsRewards.redeem.title")}
        </h2>
        <p className="text-sm text-text-secondary mb-6">
          {t("account.pointsRewards.redeem.description")}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Order Discount Card */}
          <div className="border border-gray-200 dark:border-gray-700 rounded-xl p-5 hover:shadow-md transition-shadow">
            <h3 className="font-semibold text-text-primary mb-2">
              {t("account.pointsRewards.redeem.options.orderDiscount.title")}
            </h3>
            <div className="text-sm text-text-secondary mb-4 space-y-1">
              <div>100 {t("account.pointsRewards.points")} = 1,000 SYP {t("account.pointsRewards.redeem.options.discount")}</div>
              <div className="text-xs">{t("account.pointsRewards.redeem.options.minPoints")} 500 {t("account.pointsRewards.points")}</div>
              <div className="text-green-600 dark:text-green-400 text-xs">
                {t("account.pointsRewards.redeem.options.validStores")}
              </div>
            </div>
            <Button variant="primary" size="sm" fullWidth>
              {t("account.pointsRewards.redeem.options.redeemPoints")}
            </Button>
          </div>

          {/* Free Delivery Coupon Card */}
          <div className="border border-gray-200 dark:border-gray-700 rounded-xl p-5 hover:shadow-md transition-shadow">
            <h3 className="font-semibold text-text-primary mb-2">
              {t("account.pointsRewards.redeem.options.freeDelivery.title")}
            </h3>
            <div className="text-sm text-text-secondary mb-4 space-y-1">
              <div>800 {t("account.pointsRewards.points")} → 1 {t("account.pointsRewards.redeem.options.freeDelivery.coupon")}</div>
              <div className="text-xs">
                {t("account.pointsRewards.redeem.options.freeDelivery.groceriesOnly")} + {t("account.pointsRewards.redeem.options.freeDelivery.minOrder")} 50,000 SYP
              </div>
            </div>
            <Button variant="primary" size="sm" fullWidth>
              {t("account.pointsRewards.redeem.options.redeemForFreeDelivery")}
            </Button>
          </div>

          {/* Gift Voucher Card */}
          <div className="border border-gray-200 dark:border-gray-700 rounded-xl p-5 hover:shadow-md transition-shadow">
            <h3 className="font-semibold text-text-primary mb-2">
              {t("account.pointsRewards.redeem.options.giftVoucher.title")}
            </h3>
            <div className="text-sm text-text-secondary mb-4 space-y-1">
              <div>1,000 {t("account.pointsRewards.points")} = 10,000 SYP {t("account.pointsRewards.redeem.options.voucher")}</div>
              <div className="text-xs">
                {t("account.pointsRewards.redeem.options.giftVoucher.singleUse")}
              </div>
            </div>
            <Button variant="primary" size="sm" fullWidth>
              {t("account.pointsRewards.redeem.options.generateVoucher")}
            </Button>
          </div>
        </div>
      </div>

      {/* Vendor Special Offers Section */}
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

      {/* Redemption Conditions Section */}
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

      {/* Points History Section */}
      <div className="bg-white dark:bg-bg-primary rounded-2xl p-6">
        <h2 className="text-lg font-semibold text-text-primary mb-4">
          {t("account.pointsRewards.history.title")}
        </h2>

        {/* Filter Tabs */}
        <div className="flex flex-wrap gap-2 mb-6 border-b border-gray-200 dark:border-gray-700 pb-4">
          {filterTabs.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setActiveFilter(tab.value)}
              className={cn(
                "px-4 py-2 rounded-lg text-sm font-medium transition-all",
                activeFilter === tab.value
                  ? "bg-primary text-white"
                  : "bg-transparent text-text-secondary hover:bg-gray-100 dark:hover:bg-gray-800"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* History Table */}
        <div className="overflow-x-auto">
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
              {filteredHistory.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-text-secondary">
                    {t("account.pointsRewards.history.noHistory")}
                  </td>
                </tr>
              ) : (
                filteredHistory.map((item) => (
                  <tr
                    key={item.id}
                    className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                  >
                    <td className="py-3 px-4 text-sm text-text-secondary">
                      {item.date}
                    </td>
                    <td className="py-3 px-4 text-sm text-text-primary">
                      {item.description}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={cn(
                          "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
                          getTypeBadgeColor(item.type)
                        )}
                      >
                        {t(`account.pointsRewards.history.types.${item.type}`)}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm font-medium text-text-primary">
                      {item.points > 0 ? "+" : ""}
                      {item.points}
                    </td>
                    <td className="py-3 px-4 text-sm text-text-secondary">
                      {item.balance.toLocaleString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
