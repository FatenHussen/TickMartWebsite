import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/context/LanguageContext";
import { paths } from "@/app/routes/path/paths";
import {
    useMyBaskets,
    type MyBasketFilterType,
} from "../hooks/useMyBaskets";
import {
    useDeleteScheduledBasket,
    usePauseScheduledBasket,
    useResumeScheduledBasket,
} from "../hooks/useScheduledBaskets";
import {
    usePauseSubscription,
    useResumeSubscription,
} from "../hooks/useMyBasketMutations";
import type { MyBasketListItem } from "../types/myBasket";
import DeleteBasketPopup from "../components/DeleteBasketPopup";
import {
    HiTrash,
    HiCalendar,
    HiPencil,
    HiPause,
    HiPlay,
} from "react-icons/hi";
import { HiOutlineShoppingBag } from "react-icons/hi2";
import Button from "@/shared/ui/Button";

const CARD_BORDER = "border-[#E0F2F7]";
const SECONDARY_BTN =
    "flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium border border-[#E0E0E0] bg-white text-custom-primary hover:bg-gray-50 dark:bg-transparent dark:border-custom-primary dark:hover:bg-custom-card";

function formatBasketListDate(iso: string): string {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return iso;
    return d.toLocaleDateString(undefined, {
        day: "numeric",
        month: "short",
        year: "numeric",
    });
}

function getBasketPriceDisplay(basket: MyBasketListItem) {
    const sym = basket.currency_symbol ?? "$";
    const original =
        basket.original_price_formatted ??
        `${sym}${Number(basket.original_price).toFixed(2)}`;
    const final =
        basket.final_price_formatted ??
        `${sym}${Number(basket.final_price).toFixed(2)}`;
    const save =
        basket.discount_amount_formatted ??
        `${sym}${Number(basket.discount_amount).toFixed(2)}`;
    return { original, final, save };
}

function getDiscountBadgeText(basket: MyBasketListItem): string {
    if (basket.discount_type === "percentage") {
        const n = Number.parseFloat(basket.discount_value);
        const pct = Number.isFinite(n) ? Math.round(n) : basket.discount_value;
        return `${pct}% OFF`;
    }
    return `${basket.discount_value} OFF`;
}

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
    const pauseScheduledMutation = usePauseScheduledBasket();
    const resumeScheduledMutation = useResumeScheduledBasket();
    const pauseSubscriptionMutation = usePauseSubscription();
    const resumeSubscriptionMutation = useResumeSubscription();

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

    // Helper: schedule line (title + frequency when API provides schedules)
    const getScheduleSubtitle = (basket: MyBasketListItem): string => {
        const s = basket.schedules?.[0];
        if (!s) return "";
        const freq = `${t("baskets.every")} ${s.number_of_days} ${t("baskets.days")}`;
        if (s.title?.trim()) return `${s.title.trim()} • ${freq}`;
        return freq;
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
            if (sortBy === "created") {
                const dateA = ("start_date" in a && a.start_date) || a.created_at || "";
                const dateB = ("start_date" in b && b.start_date) || b.created_at || "";
                return new Date(dateB).getTime() - new Date(dateA).getTime();
            }
            if (sortBy === "name") {
                return a.name.localeCompare(b.name);
            }
            return 0;
        });
        return result;
    }, [baskets, sortBy]);

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

    const handlePauseResume = (basket: MyBasketListItem) => {
        const isPaused = basket.is_paused ?? !basket.is_active;
        if (basket.basket_type === "user-schedule") {
            if (isPaused) {
                resumeScheduledMutation.mutate(basket.id);
            } else {
                pauseScheduledMutation.mutate(basket.id);
            }
        } else if (basket.basket_type === "subscription") {
            if (isPaused) {
                resumeSubscriptionMutation.mutate(basket.id);
            } else {
                pauseSubscriptionMutation.mutate(basket.id);
            }
        }
    };

    const isPauseResumePending = (basket: MyBasketListItem) => {
        if (basket.basket_type === "user-schedule") {
            return (
                (pauseScheduledMutation.isPending && pauseScheduledMutation.variables === basket.id) ||
                (resumeScheduledMutation.isPending && resumeScheduledMutation.variables === basket.id)
            );
        }
        if (basket.basket_type === "subscription") {
            return (
                (pauseSubscriptionMutation.isPending && pauseSubscriptionMutation.variables === basket.id) ||
                (resumeSubscriptionMutation.isPending && resumeSubscriptionMutation.variables === basket.id)
            );
        }
        return false;
    };

    const renderBasketCard = (basket: MyBasketListItem) => {
        const isPaused = basket.is_paused ?? !basket.is_active;
        const categoryName = getCategoryName(basket);
        const scheduleSubtitle = getScheduleSubtitle(basket);
        const nextRunDate = getNextRunDate(basket);
        const prices = getBasketPriceDisplay(basket);
        const createdRaw =
            ("start_date" in basket && basket.start_date) || basket.created_at || "";
        const createdLabel = createdRaw ? formatBasketListDate(createdRaw) : "";

        const badgeLabel =
            basket.basket_type === "user-schedule"
                ? t("baskets.scheduled")
                : basket.basket_type === "subscription"
                  ? t("baskets.subscription")
                  : t("baskets.filters.custom");

        const itemsCategoryLine = [
            `${basket.num_varieties} ${t("checkout.items")}`,
            categoryName,
        ]
            .filter(Boolean)
            .join(" • ");

        const nextDeliveryLine = (() => {
            if (isPaused && (basket.paused_at || nextRunDate)) {
                const raw = basket.paused_at ?? nextRunDate ?? "";
                return `${t("baskets.pausedSince")} ${raw ? formatBasketListDate(raw) : raw}`;
            }
            if (!isPaused && nextRunDate) {
                return `${t("baskets.nextDelivery")}: ${formatBasketListDate(nextRunDate)}`;
            }
            return "";
        })();

        return (
            <div
                key={`${basket.basket_type}-${basket.id}`}
                className={`bg-white dark:bg-custom-card rounded-xl ${CARD_BORDER} border p-5 md:p-6 shadow-sm hover:shadow-md transition-shadow`}
            >
                {/* Header: icon, title, status + discount badges | type pill */}
                <div className="flex items-start justify-between gap-3 mb-5">
                    <div className="flex items-center gap-3 min-w-0 flex-wrap">
                        {basket.image ? (
                            <img
                                src={basket.image}
                                alt=""
                                className="w-11 h-11 rounded-xl object-cover shrink-0 border border-[#E0E0E0] dark:border-custom-primary"
                            />
                        ) : (
                            <div
                                className="w-11 h-11 rounded-xl shrink-0 flex items-center justify-center bg-amber-50 dark:bg-amber-900/20 border border-[#E0E0E0] dark:border-custom-primary"
                                aria-hidden
                            >
                                <HiOutlineShoppingBag className="w-6 h-6 text-amber-800/80 dark:text-amber-200/90" />
                            </div>
                        )}
                        <h3 className="font-semibold text-lg text-custom-primary shrink-0">
                            {basket.name}
                        </h3>
                        <span
                            className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                                isPaused
                                    ? "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400"
                                    : "bg-green-100 text-[#2E7D32] dark:bg-green-900/30 dark:text-green-400"
                            }`}
                        >
                            {isPaused ? t("baskets.paused") : t("baskets.active")}
                        </span>
                        {basket.discount_amount > 0 && (
                            <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-sky-100 text-sky-800 dark:bg-sky-900/30 dark:text-sky-300">
                                {getDiscountBadgeText(basket)}
                            </span>
                        )}
                    </div>
                    <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 shrink-0">
                        {badgeLabel}
                    </span>
                </div>

                {/* Two columns: details (left) + pricing (right) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 mb-5">
                    <div className="space-y-1.5 text-sm text-[#666666] dark:text-custom-secondary">
                        <p>{itemsCategoryLine}</p>
                        {scheduleSubtitle ? <p>{scheduleSubtitle}</p> : null}
                        {nextDeliveryLine ? <p>{nextDeliveryLine}</p> : null}
                    </div>
                    <div className="space-y-1.5 text-sm md:text-end text-[#666666] dark:text-custom-secondary">
                        <p>
                            {t("trackOrder.items")}: {basket.num_varieties}
                        </p>
                        {basket.discount_amount > 0 ? (
                            <>
                                <p>
                                    <span className="line-through text-gray-400 dark:text-gray-500">
                                        {prices.original}
                                    </span>{" "}
                                    <span className="font-semibold text-custom-primary">
                                        {prices.final}
                                    </span>
                                </p>
                                <p className="text-[#2E7D32] dark:text-green-400 font-medium">
                                    {t("baskets.youSave")} {prices.save}
                                </p>
                            </>
                        ) : (
                            <p className="font-semibold text-custom-primary">{prices.final}</p>
                        )}
                        {createdLabel ? (
                            <p className="text-xs text-gray-500 dark:text-gray-400 pt-0.5">
                                {t("baskets.createdOn")}: {createdLabel}
                            </p>
                        ) : null}
                    </div>
                </div>

                {/* Action Buttons */}
                <div
                    className={`flex flex-wrap items-center gap-3 pt-4 border-t ${CARD_BORDER} dark:border-custom-primary`}
                >
                    <Button
                        type="button"
                        variant="primary"
                        size="sm"
                        onClick={() => handleViewDetails(basket.id, basket.basket_type)}
                        className="!bg-[#00ACC1] hover:!bg-[#0097A7] text-white px-4 py-2.5 rounded-lg text-sm font-semibold border-0 shadow-none focus:ring-[#00ACC1]"
                    >
                        {t("baskets.viewBasketDetails")}
                    </Button>
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditItems(basket.id, basket.basket_type)}
                        className={SECONDARY_BTN}
                    >
                        <HiPencil className="w-4 h-4 shrink-0" />
                        {t("baskets.editItems")}
                    </Button>
                    {basket.basket_type === "user-schedule" && (
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewDetails(basket.id, basket.basket_type)}
                            className={SECONDARY_BTN}
                        >
                            <HiCalendar className="w-4 h-4 shrink-0" />
                            {isPaused ? t("baskets.reschedule") : t("baskets.editSchedule")}
                        </Button>
                    )}
                    {(basket.basket_type === "user-schedule" ||
                        basket.basket_type === "subscription") && (
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            disabled={isPauseResumePending(basket)}
                            onClick={() => handlePauseResume(basket)}
                            className={SECONDARY_BTN}
                        >
                            {isPaused ? (
                                <HiPlay className="w-4 h-4 shrink-0" />
                            ) : (
                                <HiPause className="w-4 h-4 shrink-0" />
                            )}
                            {isPaused ? t("baskets.resumeBasket") : t("baskets.pauseBasket")}
                        </Button>
                    )}
                    {basket.basket_type === "user-schedule" && (
                        <button
                            type="button"
                            onClick={() => handleDeleteClick(basket)}
                            className="flex items-center gap-1.5 ms-auto text-sm text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300"
                        >
                            <HiTrash className="w-4 h-4 shrink-0" />
                            {t("baskets.deleteBasket")}
                        </button>
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
                    <h1 className="text-2xl font-bold text-custom-primary mb-1">
                        {t("baskets.myBaskets")}
                    </h1>
                    <p className="text-sm text-custom-secondary">
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
                    <h1 className="text-2xl font-bold text-custom-primary mb-1">
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
                <h1 className="text-2xl font-bold text-custom-primary mb-1">
                    {t("baskets.myBaskets")}
                </h1>
                <p className="text-sm text-custom-secondary">
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
                                : "bg-custom-card text-custom-secondary border border-custom-primary hover:border-primary"
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
                        className="px-3 py-2 rounded-lg border border-custom-primary bg-custom-card text-custom-primary text-sm focus:ring-2 focus:ring-primary focus:border-transparent"
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
                <div className="space-y-4">
                    {sortedBaskets.map(renderBasketCard)}
                </div>
            ) : (
                <div className="py-14 text-center text-custom-secondary">
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
