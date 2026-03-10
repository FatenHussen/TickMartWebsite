import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/context/LanguageContext";
import { paths } from "@/app/routes/path/paths";
import {
  useMyBaskets,
  type MyBasketFilterType,
} from "../hooks/useMyBaskets";
import { useDeleteScheduledBasket } from "../hooks/useScheduledBaskets";
import type { MyBasketListItem } from "../types/myBasket";
import DeleteBasketPopup from "../components/DeleteBasketPopup";
import {
  HiTrash,
  HiCalendar,
  HiPencil,
  HiClock,
} from "react-icons/hi";
import Button from "@/shared/ui/Button";

const TYPE_FILTER_OPTIONS: { value: MyBasketFilterType; labelKey: string }[] = [
  { value: "all", labelKey: "baskets.filters.all" },
  { value: "subscription", labelKey: "baskets.filters.subscription" },
  { value: "custom", labelKey: "baskets.filters.custom" },
  { value: "user-schedule", labelKey: "baskets.filters.userSchedule" },
];

export default function MyBaskets() {
  const { t } = useTranslation();
  const { isRTL } = useLanguage();
  const navigate = useNavigate();

  const [typeFilter, setTypeFilter] = useState<MyBasketFilterType>("all");
  const { data: baskets = [], isLoading, error } = useMyBaskets(typeFilter);
  const deleteBasketMutation = useDeleteScheduledBasket();

  const [sortBy, setSortBy] = useState<"next_delivery" | "created" | "name">(
    "next_delivery"
  );
  const [deletePopupOpen, setDeletePopupOpen] = useState(false);
  const [basketToDelete, setBasketToDelete] =
    useState<MyBasketListItem | null>(null);

  // Helper: get category name from basket (object or legacy string)
  const getCategoryName = (basket: MyBasketListItem): string => {
    if (!("category" in basket) || !basket.category) return "";
    const cat = basket.category;
    if (typeof cat === "string") return cat;
    return cat.name;
  };

  // Helper: get schedule text from schedules array
  const getScheduleText = (basket: MyBasketListItem): string => {
    const s = basket.schedules?.[0];
    if (!s) return "";
    return `${t("baskets.every")} ${s.number_of_days} ${t("baskets.days")}`;
  };

  // Helper: get next run date
  const getNextRunDate = (basket: MyBasketListItem): string => {
    if ("next_run_date" in basket && basket.next_run_date) {
      return basket.next_run_date;
    }
    return "";
  };

  // Sort baskets
  const sortedBaskets = useMemo(() => {
    const result = [...baskets];
    result.sort((a, b) => {
      if (sortBy === "next_delivery") {
        const dateA = getNextRunDate(a) ? new Date(getNextRunDate(a)).getTime() : 0;
        const dateB = getNextRunDate(b) ? new Date(getNextRunDate(b)).getTime() : 0;
        return dateA - dateB;
      }
      if (sortBy === "created" && "start_date" in a && "start_date" in b) {
        return (
          new Date((b as { start_date: string }).start_date).getTime() -
          new Date((a as { start_date: string }).start_date).getTime()
        );
      }
      if (sortBy === "name") {
        return a.name.localeCompare(b.name);
      }
      return 0;
    });
    return result;
  }, [baskets, sortBy]);

  // Group into active vs paused (by is_active)
  const { activeBaskets, pausedBaskets } = useMemo(() => {
    const active: MyBasketListItem[] = [];
    const paused: MyBasketListItem[] = [];
    for (const b of sortedBaskets) {
      if (!b.is_active) {
        paused.push(b);
      } else {
        active.push(b);
      }
    }
    return { activeBaskets: active, pausedBaskets: paused };
  }, [sortedBaskets]);

  const handleViewDetails = (basketId: number, basketType: MyBasketListItem["basket_type"]) => {
    if (basketType === "user-schedule") {
      navigate(paths.account.basketDetails(basketId));
    } else {
      navigate(paths.client.basketDetails(basketId));
    }
  };

  const handleEditItems = (basketId: number, basketType: MyBasketListItem["basket_type"]) => {
    handleViewDetails(basketId, basketType);
  };

  const handleDeleteClick = (basket: MyBasketListItem) => {
    if (basket.basket_type !== "user-schedule") return;
    setBasketToDelete(basket);
    setDeletePopupOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (basketToDelete && basketToDelete.basket_type === "user-schedule") {
      deleteBasketMutation.mutate(basketToDelete.id, {
        onSuccess: () => {
          setDeletePopupOpen(false);
          setBasketToDelete(null);
        },
      });
    }
  };

  const handleDeleteClose = () => {
    setDeletePopupOpen(false);
    setBasketToDelete(null);
  };

  const renderBasketCard = (basket: MyBasketListItem) => {
    const isPaused = !basket.is_active;
    const categoryName = getCategoryName(basket);
    const scheduleText = getScheduleText(basket);
    const nextRunDate = getNextRunDate(basket);

    const badgeLabel =
      basket.basket_type === "user-schedule"
        ? t("baskets.scheduled")
        : basket.basket_type === "subscription"
          ? t("baskets.subscription")
          : t("baskets.filters.custom");

    return (
      <div
        key={`${basket.basket_type}-${basket.id}`}
        className="bg-blue-50 dark:bg-gray-800 rounded-2xl border border-blue-100 dark:border-gray-700 p-6 shadow-sm hover:shadow-md transition-shadow"
      >
        {/* Header: Title + Badges */}
        <div className="flex items-start justify-between gap-4 mb-4">
          <div>
            <h3 className="font-semibold text-lg text-gray-900 dark:text-gray-100">
              {basket.name}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-0.5">
              {basket.num_varieties} {t("checkout.items")}
              {categoryName && ` • ${categoryName}`}
            </p>
          </div>
          <div className="flex flex-wrap gap-2 shrink-0">
            <span
              className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                isPaused
                  ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                  : "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
              }`}
            >
              {isPaused ? t("baskets.paused") : t("baskets.active")}
            </span>
            {basket.discount_amount > 0 && (
              <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400">
                {basket.discount_value}
                {basket.discount_type === "percentage" ? "%" : ""} OFF
              </span>
            )}
            <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300">
              {badgeLabel}
            </span>
          </div>
        </div>

        {/* Schedule & Next delivery */}
        {(scheduleText || nextRunDate) && (
          <div className="space-y-1.5 text-sm text-gray-600 dark:text-gray-400 mb-4">
            {scheduleText && (
              <div className="flex items-center gap-1.5">
                <HiCalendar className="w-4 h-4 text-cyan-500 shrink-0" />
                <span>{scheduleText}</span>
              </div>
            )}
            {nextRunDate && (
              <div className="flex items-center gap-1.5">
                <span className="font-medium text-gray-900 dark:text-gray-100">
                  {isPaused
                    ? `${t("baskets.pausedSince")} ${nextRunDate}`
                    : `${t("baskets.nextDelivery")}: ${nextRunDate}`}
                </span>
              </div>
            )}
          </div>
        )}

        {/* Summary */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-600 dark:text-gray-400 mb-4">
          <span>
            {t("checkout.items")}: {basket.num_varieties}
          </span>
          {basket.discount_amount > 0 ? (
            <>
              <span className="line-through">{basket.original_price}</span>
              <span className="font-semibold text-gray-900 dark:text-gray-100">
                {basket.final_price}
              </span>
              <span className="text-green-600 dark:text-green-400 font-medium">
                {t("baskets.youSave")} {basket.discount_amount}
              </span>
            </>
          ) : (
            <span className="font-semibold text-gray-900 dark:text-gray-100">
              {basket.final_price}
            </span>
          )}
          {"start_date" in basket && basket.start_date && (
            <span className="text-gray-500 dark:text-gray-500">
              {t("baskets.createdOn")} {basket.start_date}
            </span>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2 pt-4 border-t border-blue-100 dark:border-gray-600">
          <Button
            type="button"
            variant="primary"
            size="sm"
            onClick={() => handleViewDetails(basket.id, basket.basket_type)}
            className="bg-primary hover:bg-teal-600 text-white px-3 py-2 rounded-lg text-sm font-medium"
          >
            {t("baskets.viewBasketDetails")}
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => handleEditItems(basket.id, basket.basket_type)}
            className="flex items-center gap-1.5 px-3 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg text-sm font-medium"
          >
            <HiPencil className="w-4 h-4" />
            {t("baskets.editItems")}
          </Button>
          {basket.basket_type === "user-schedule" && (
            <>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => handleViewDetails(basket.id, basket.basket_type)}
                className="flex items-center gap-1.5 px-3 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg text-sm font-medium"
              >
                <HiCalendar className="w-4 h-4" />
                {isPaused ? t("baskets.reschedule") : t("baskets.editSchedule")}
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => handleViewDetails(basket.id, basket.basket_type)}
                className="flex items-center gap-1.5 px-3 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg text-sm font-medium"
              >
                <HiClock className="w-4 h-4" />
                {isPaused ? t("baskets.resumeBasket") : t("baskets.pauseBasket")}
              </Button>
              <button
                type="button"
                onClick={() => handleDeleteClick(basket)}
                className="flex items-center gap-1.5 ml-auto text-sm text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300"
              >
                <HiTrash className="w-4 h-4" />
                {t("baskets.deleteBasket")}
              </button>
            </>
          )}
        </div>
      </div>
    );
  };

  // Loading state
  if (isLoading) {
    return (
      <div dir={isRTL ? "rtl" : "ltr"}>
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1">
            {t("baskets.myBaskets")}
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {t("baskets.myBasketsDescription")}
          </p>
        </div>
        <div className="flex items-center justify-center py-14">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div dir={isRTL ? "rtl" : "ltr"}>
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1">
            {t("baskets.myBaskets")}
          </h1>
        </div>
        <div className="py-14 text-center text-red-500">
          {t("baskets.failedToLoad")}
        </div>
      </div>
    );
  }

  return (
    <div dir={isRTL ? "rtl" : "ltr"}>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1">
          {t("baskets.myBaskets")}
        </h1>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {t("baskets.myBasketsDescription")}
        </p>
      </div>

      {/* Filter Tabs (by type) */}
      <div className="flex flex-wrap gap-2 mb-4">
        {TYPE_FILTER_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => setTypeFilter(opt.value)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              typeFilter === opt.value
                ? "bg-primary text-white"
                : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-600 hover:border-primary"
            }`}
          >
            {t(opt.labelKey)}
          </button>
        ))}
      </div>

      {/* Sort + Content */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
        <div className="lg:ml-auto">
          <select
            value={sortBy}
            onChange={(e) =>
              setSortBy(e.target.value as "next_delivery" | "created" | "name")
            }
            className="px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="next_delivery">
              {t("baskets.sort.nextDelivery")}
            </option>
            <option value="created">{t("baskets.sort.created")}</option>
            <option value="name">{t("baskets.sort.name")}</option>
          </select>
        </div>
      </div>

      {/* Baskets List */}
      {sortedBaskets.length > 0 ? (
        <div className="space-y-8">
          {activeBaskets.length > 0 && (
            <section>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                {t("baskets.activeAndUpcoming")}
              </h2>
              <div className="space-y-4">
                {activeBaskets.map(renderBasketCard)}
              </div>
            </section>
          )}
          {pausedBaskets.length > 0 && (
            <section>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                {t("baskets.pausedBaskets")}
              </h2>
              <div className="space-y-4">
                {pausedBaskets.map(renderBasketCard)}
              </div>
            </section>
          )}
        </div>
      ) : (
        <div className="py-14 text-center text-gray-500 dark:text-gray-400">
          {t("baskets.noBasketsFound")}
        </div>
      )}

      {/* Delete Basket Popup (only for user-schedule) */}
      {basketToDelete && basketToDelete.basket_type === "user-schedule" && (
        <DeleteBasketPopup
          isOpen={deletePopupOpen}
          basketName={basketToDelete.name}
          nextRunDate={
            "next_run_date" in basketToDelete
              ? basketToDelete.next_run_date
              : ""
          }
          isDeleting={deleteBasketMutation.isPending}
          onClose={handleDeleteClose}
          onConfirm={handleDeleteConfirm}
        />
      )}
    </div>
  );
}
