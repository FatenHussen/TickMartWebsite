import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useLanguage } from "@/context/LanguageContext";
import { Button } from "@/shared/ui";
import { HiExclamationCircle } from "react-icons/hi";
import { cn } from "@/shared/lib/utils";
import { toast } from "sonner";
import {
    usePointsSummary,
    usePointsTransactions,
    usePointsExchangeOptions,
    useExchangeCoupon,
    useExchangeGift,
    useExchangeHistory,
    useSetGiftAddress,
} from "../hooks/usePoints";
import { useAddresses } from "../hooks/useAddress";
import type { PointsTransactionItem, PointsExchangeGift } from "../types";

type PointsHistoryFilter = "all" | "earned" | "redeemed" | "expired";

/** Parse next reward threshold from string like "Next reward at 1,000 pts" */
function parseNextRewardThreshold(text: string): number | null {
    const match = text?.match(/(\d[\d,]*)/);
    if (!match) return null;
    return parseInt(match[1].replace(/,/g, ""), 10) || null;
}

/** Parse point value multiplier from string like "1 pt = 10 $" */
function getPointValueMultiplier(value?: { point_value?: string }): number {
    if (!value?.point_value) return 10;
    const match = value.point_value.match(/=\s*([\d.,]+)/);
    return match ? parseFloat(match[1].replace(/,/g, "")) || 10 : 10;
}

function formatDate(value: string) {
    try {
        const d = new Date(value);
        return isNaN(d.getTime())
            ? value
            : d.toLocaleDateString(undefined, {
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
    const [exchangeHistoryPage, setExchangeHistoryPage] = useState(1);

    const { data: summary, isLoading: summaryLoading, isError: summaryError } =
        usePointsSummary();
    const {
        data: transactionsData,
        isLoading: transactionsLoading,
        isError: transactionsError,
    } = usePointsTransactions(historyPage);
    const { data: exchangeOptions, isLoading: exchangeLoading } =
        usePointsExchangeOptions();
    const { data: exchangeHistoryData, isLoading: exchangeHistoryLoading } =
        useExchangeHistory(exchangeHistoryPage);

    const exchangeCouponMutation = useExchangeCoupon();
    const exchangeGiftMutation = useExchangeGift();
    const setGiftAddressMutation = useSetGiftAddress();
    const { data: addresses = [] } = useAddresses();

    // Gift address modal state
    const [pendingGiftId, setPendingGiftId] = useState<number | null>(null);
    const [selectedAddressId, setSelectedAddressId] = useState<number | null>(null);

    const handleExchangeCoupon = () => {
        const minPoints = exchangeOptions?.options?.coupon?.min_points ?? 100;
        exchangeCouponMutation.mutate(minPoints, {
            onSuccess: (res) => {
                toast.success(res.message ?? t("account.pointsRewards.redeem.success", "Exchange successful!"));
            },
            onError: () => {
                toast.error(t("account.pointsRewards.redeem.error", "Exchange failed. Please try again."));
            },
        });
    };

    const handleExchangeGift = (gift: PointsExchangeGift) => {
        exchangeGiftMutation.mutate({ points: gift.points_required, gift_id: gift.id }, {
            onSuccess: (res) => {
                toast.success(res.message ?? t("account.pointsRewards.redeem.success", "Exchange successful!"));
                // Open address selection modal
                setPendingGiftId(res.data?.gift_id ?? null);
                setSelectedAddressId(addresses.find((a) => a.is_default)?.id ?? addresses[0]?.id ?? null);
            },
            onError: () => {
                toast.error(t("account.pointsRewards.redeem.error", "Exchange failed. Please try again."));
            },
        });
    };

    const handleConfirmGiftAddress = () => {
        if (pendingGiftId == null || selectedAddressId == null) return;
        setGiftAddressMutation.mutate({ giftId: pendingGiftId, address_id: selectedAddressId }, {
            onSuccess: () => {
                toast.success(t("account.pointsRewards.giftAddress.success", "Delivery address set successfully!"));
                setPendingGiftId(null);
                setSelectedAddressId(null);
            },
            onError: () => {
                toast.error(t("account.pointsRewards.giftAddress.error", "Failed to set address. Please try again."));
            },
        });
    };

    const points = summary?.points ?? summary?.balance ?? 0;
    const value = summary?.value;
    const nextReward = summary?.next_reward ?? "";
    const expiry = summary?.expiry ?? summary?.expire_at ?? "";
    const earningRules = summary?.earning_rules ?? [];
    const nextRewardThreshold = parseNextRewardThreshold(nextReward);
    const progressPercentage = nextRewardThreshold
        ? (points / nextRewardThreshold) * 100
        : 0;

    const items = useMemo(() => transactionsData?.items ?? [], [transactionsData]);
    const pagination = transactionsData?.pagination;

    const filteredItems = useMemo(() => {
        if (activeFilter === "all") return items;
        return items.filter((item) => item.status === activeFilter);
    }, [items, activeFilter]);

    const itemsWithBalance = useMemo(() => {
        const sorted = [...filteredItems].sort(
            (a, b) =>
                new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
        );
        let running = summary?.points ?? summary?.balance ?? 0;
        return sorted.map((item) => {
            const displayBalance = running;
            if (item.status === "earned") running -= item.points;
            else running += item.points;
            return { ...item, displayBalance };
        });
    }, [filteredItems, summary?.points, summary?.balance]);

    const filterTabs: { value: PointsHistoryFilter; label: string }[] = [
        { value: "all", label: t("account.pointsRewards.history.filters.all") },
        { value: "earned", label: t("account.pointsRewards.history.filters.earned") },
        {
            value: "redeemed",
            label: t("account.pointsRewards.history.filters.redeemed"),
        },
        {
            value: "expired",
            label: t("account.pointsRewards.history.filters.expired"),
        },
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
                return "bg-custom-tertiary text-custom-primary";
        }
    };

    const isLoading = summaryLoading;
    const hasSummaryError = summaryError;

    if (hasSummaryError) {
        return (
            <div className="space-y-6" dir={isRTL ? "rtl" : "ltr"}>
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-custom-primary mb-2">
                        {t("account.pointsRewards.title")}
                    </h1>
                </div>
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6 text-center text-custom-secondary">
                    {t("account.pointsRewards.errorLoading") ??
                        "Failed to load points. Please try again."}
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8" dir={isRTL ? "rtl" : "ltr"}>
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-custom-primary mb-2">
                    {t("account.pointsRewards.title")}
                </h1>
                <p className="text-base text-custom-secondary">
                    {t("account.pointsRewards.description")}
                </p>
            </div>

            {/* Top row: Your Points | Expiry & How to Earn */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Your Points */}
                <div className="bg-custom-card rounded-xl p-6">
                    <h2 className="text-lg font-medium text-custom-primary mb-4">
                        {t("account.pointsRewards.yourPoints.title")}
                    </h2>
                    {isLoading ? (
                        <div className="h-32 flex items-center justify-center text-custom-secondary">
                            {t("common.loading") ?? "Loading..."}
                        </div>
                    ) : (
                        <>
                            <div className="mb-2">
                                <span className="text-5xl font-bold text-blue-500 dark:text-blue-400">
                                    {points.toLocaleString()}
                                </span>
                                <span className="text-3xl font-bold text-blue-500 dark:text-blue-400 ml-1">
                                    {t("account.pointsRewards.points")}
                                </span>
                            </div>
                            <div className="text-sm text-custom-primary space-y-1 mb-4">
                                <div>
                                    {t("account.pointsRewards.pointValue")}: {value?.point_value ?? `1 ${t("account.pointsRewards.points")} = 10 $`}
                                </div>
                                <div>
                                    {t("account.pointsRewards.estimatedValue")}: {value?.estimated_value_formatted ?? `≈${(points * getPointValueMultiplier(value)).toLocaleString()} $`}{" "}
                                    {t("account.pointsRewards.inRewards")}
                                </div>
                            </div>
                            {nextRewardThreshold != null && (
                                <div className="mt-4">
                                    <div className="w-full h-3 bg-custom-muted rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-blue-500 dark:bg-blue-400 transition-all duration-300 rounded-full"
                                            style={{ width: `${Math.min(progressPercentage, 100)}%` }}
                                        />
                                    </div>
                                    <p className="text-sm text-custom-primary mt-2">{nextReward}</p>
                                </div>
                            )}
                        </>
                    )}
                </div>

                {/* Expiry & How to Earn */}
                <div className="bg-custom-card rounded-xl p-6">
                    <h3 className="text-lg font-medium text-custom-primary mb-4">
                        {t("account.pointsRewards.howToEarn.title")}
                    </h3>
                    {expiry && (
                        <div className="bg-orange-100 dark:bg-orange-900/20 border border-orange-300 dark:border-orange-700 rounded-lg p-4 mb-6 flex items-start gap-3">
                            <HiExclamationCircle className="w-5 h-5 text-orange-500 shrink-0 mt-0.5" />
                            <div className="text-sm text-orange-700 dark:text-orange-400">
                                {t("account.pointsRewards.expiry.nextExpiry")}: {formatDate(expiry)}
                            </div>
                        </div>
                    )}
                    <ul className="space-y-2 text-sm text-custom-primary">
                        {earningRules.length > 0 ? (
                            earningRules.map((rule, idx) => (
                                <li key={idx} className="flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-blue-500 shrink-0" />
                                    <span>{rule}</span>
                                </li>
                            ))
                        ) : (
                            <>
                                <li className="flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-blue-500 shrink-0" />
                                    <span>{t("account.pointsRewards.howToEarn.placeOrders")}</span>
                                </li>
                                <li className="flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-blue-500 shrink-0" />
                                    <span>{t("account.pointsRewards.howToEarn.joinCampaigns")}</span>
                                </li>
                                <li className="flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-blue-500 shrink-0" />
                                    <span>{t("account.pointsRewards.howToEarn.usePackages")}</span>
                                </li>
                            </>
                        )}
                    </ul>
                </div>
            </div>

            {/* Redeem Your Points */}
            <div className="bg-custom-card rounded-xl p-6">
                <h2 className="text-2xl font-bold text-custom-primary mb-2">
                    {t("account.pointsRewards.redeem.title")}
                </h2>
                <p className="text-base text-custom-secondary mb-6">
                    {t("account.pointsRewards.redeem.description")}
                </p>

                {exchangeLoading ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {[1, 2, 3].map((i) => (
                            <div
                                key={i}
                                className="border border-custom-primary rounded-lg p-5 animate-pulse h-44 bg-blue-50/50"
                            />
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {exchangeOptions?.options?.coupon?.enabled && (
                            <div className="bg-blue-50 dark:bg-blue-900/10 border border-custom-primary rounded-lg p-5 hover:shadow-md transition-shadow">
                                <h3 className="text-lg font-medium text-custom-primary mb-2">
                                    {t("account.pointsRewards.redeem.options.orderDiscount.title")}
                                </h3>
                                <div className="text-xl font-bold text-blue-500 dark:text-blue-400 mb-2">
                                    {exchangeOptions.options.coupon.min_points}–
                                    {exchangeOptions.options.coupon.max_points}{""}
                                    {t("account.pointsRewards.points")} ={""}
                                    {exchangeOptions.options.coupon.discount_rate}%{""}
                                    {t("account.pointsRewards.redeem.options.discount")}
                                </div>
                                <div className="text-sm text-custom-primary mb-2">
                                    {t("account.pointsRewards.redeem.options.minPoints")}{""}
                                    {exchangeOptions.options.coupon.min_points}{""}
                                    {t("account.pointsRewards.points")}
                                </div>
                                {exchangeOptions.options.coupon.description && (
                                    <span className="inline-block bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs rounded-full px-2.5 py-0.5 mb-3">
                                        {exchangeOptions.options.coupon.description}
                                    </span>
                                )}
                                <Button
                                    variant="primary"
                                    size="sm"
                                    fullWidth
                                    disabled={!exchangeOptions.available || exchangeCouponMutation.isPending}
                                    onClick={handleExchangeCoupon}
                                    className="bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-md"
                                >
                                    {exchangeCouponMutation.isPending
                                        ? "..."
                                        : t("account.pointsRewards.redeem.options.redeemPoints")}
                                </Button>
                            </div>
                        )}
                        {exchangeOptions?.options?.free_delivery?.enabled && (
                            <div className="bg-blue-50 dark:bg-blue-900/10 border border-custom-primary rounded-lg p-5 hover:shadow-md transition-shadow">
                                <h3 className="text-lg font-medium text-custom-primary mb-2">
                                    {
                                        t(
                                            "account.pointsRewards.redeem.options.freeDelivery.title",
                                        )
                                    }
                                </h3>
                                <div className="text-xl font-bold text-blue-500 dark:text-blue-400 mb-2">
                                    {exchangeOptions.options.free_delivery.points_cost}{""}
                                    {t("account.pointsRewards.points")} → 1{""}
                                    {t("account.pointsRewards.redeem.options.freeDelivery.coupon")}
                                </div>
                                {exchangeOptions.options.free_delivery.description && (
                                    <div className="text-sm text-custom-primary mb-4">
                                        {exchangeOptions.options.free_delivery.description}
                                    </div>
                                )}
                                <Button
                                    variant="primary"
                                    size="sm"
                                    fullWidth
                                    disabled={!exchangeOptions.available}
                                    className="bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-md"
                                >
                                    {
                                        t(
                                            "account.pointsRewards.redeem.options.redeemForFreeDelivery",
                                        )
                                    }
                                </Button>
                            </div>
                        )}
                        {exchangeOptions?.options?.gifts?.enabled && (
                            <div className="bg-blue-50 dark:bg-blue-900/10 border border-custom-primary rounded-lg p-5 hover:shadow-md transition-shadow">
                                <h3 className="text-lg font-medium text-custom-primary mb-2">
                                    {
                                        t(
                                            "account.pointsRewards.redeem.options.giftVoucher.title",
                                        )
                                    }
                                </h3>
                                <div className="text-xl font-bold text-blue-500 dark:text-blue-400 mb-2">
                                    {exchangeOptions.options.gifts.available_gifts?.[0]
                                        ? `${exchangeOptions.options.gifts.available_gifts[0].points_required} ${t("account.pointsRewards.points")} = ${exchangeOptions.options.gifts.available_gifts[0].points_required * getPointValueMultiplier(value)} ${value?.currency_symbol ?? ""} ${t("account.pointsRewards.redeem.options.voucher")}`
                                        : `1,000 ${t("account.pointsRewards.points")} = 10,000 SYP ${t("account.pointsRewards.redeem.options.voucher")}`}
                                </div>
                                <div className="text-sm text-custom-primary mb-4">
                                    {exchangeOptions.options.gifts.available_gifts?.length ? (
                                        <div className="space-y-2">
                                            {exchangeOptions.options.gifts.available_gifts.map((gift) => (
                                                <div key={gift.id} className="flex items-center justify-between">
                                                    <span>{gift.name} ({gift.points_required} pts)</span>
                                                    <Button
                                                        variant="primary"
                                                        size="sm"
                                                        disabled={!exchangeOptions.available || exchangeGiftMutation.isPending}
                                                        onClick={() => handleExchangeGift(gift)}
                                                        className="bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-md ml-2 shrink-0"
                                                    >
                                                        {exchangeGiftMutation.isPending ? "..." : t("account.pointsRewards.redeem.options.generateVoucher")}
                                                    </Button>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        t("account.pointsRewards.redeem.options.giftVoucher.singleUse")
                                    )}
                                </div>
                            </div>
                        )}
                        {!exchangeLoading &&
                            !exchangeOptions?.options?.coupon?.enabled &&
                            !exchangeOptions?.options?.free_delivery?.enabled &&
                            !exchangeOptions?.options?.gifts?.enabled && (
                                <div className="col-span-full text-sm text-custom-secondary py-4">
                                    {t("account.pointsRewards.redeem.noOptions") ??
                                        "No redemption options available."}
                                </div>
                            )}
                    </div>
                )}
            </div>

            {/* Vendor Special Offers & Redemption Conditions - Two columns */}
            {/* <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-custom-card rounded-xl p-6">
                    <h2 className="text-lg font-medium text-custom-primary mb-2">
                        {t("account.pointsRewards.vendorOffers.title")}
                    </h2>
                    <p className="text-sm text-custom-primary mb-4">
                        {t("account.pointsRewards.vendorOffers.description")}
                    </p>
                    <Button
                        variant="primary"
                        size="sm"
                        className="bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-md"
                    >
                        {t("account.pointsRewards.vendorOffers.viewOffers")}
                    </Button>
                </div>
                <div className="bg-custom-card rounded-xl p-6">
                    <h2 className="text-lg font-medium text-custom-primary mb-4">
                        {t("account.pointsRewards.conditions.title")}
                    </h2>
                    <ul className="space-y-2 text-sm text-custom-primary">
                        <li className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-custom-hover shrink-0" />
                            <span>{t("account.pointsRewards.conditions.expiryRule")}</span>
                        </li>
                        <li className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-custom-hover shrink-0" />
                            <span>{t("account.pointsRewards.conditions.minRedemption")}</span>
                        </li>
                        <li className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-custom-hover shrink-0" />
                            <span>{t("account.pointsRewards.conditions.noTransfer")}</span>
                        </li>
                        <li className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-custom-hover shrink-0" />
                            <span>{t("account.pointsRewards.conditions.storeRestrictions")}</span>
                        </li>
                    </ul>
                </div>
            </div> */}

            {/* Points History */}
            <div className="bg-custom-card rounded-xl p-6">
                <h2 className="text-2xl font-bold text-custom-primary mb-6">
                    {t("account.pointsRewards.history.title")}
                </h2>

                <div className="flex flex-wrap gap-2 mb-6">
                    {filterTabs.map((tab) => (
                        <button
                            key={tab.value}
                            onClick={() => setActiveFilter(tab.value)}
                            className={cn(
                                "px-4 py-2 rounded-lg text-sm font-medium transition-all",
                                activeFilter === tab.value
                                    ? "bg-custom-hover text-custom-primary"
                                    : "bg-custom-muted text-custom-primary hover:bg-custom-hover/50",
                            )}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                <div className="overflow-x-auto">
                    {transactionsLoading ? (
                        <div className="py-8 text-center text-custom-secondary">
                            {t("common.loading") ?? "Loading..."}
                        </div>
                    ) : transactionsError ? (
                        <div className="py-8 text-center text-custom-secondary">
                            {t("account.pointsRewards.errorLoading") ?? "Failed to load history."}
                        </div>
                    ) : (
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-custom-primary">
                                    <th className="text-left py-3 px-4 text-base font-medium text-custom-primary">
                                        {t("account.pointsRewards.history.table.date")}
                                    </th>
                                    <th className="text-left py-3 px-4 text-base font-medium text-custom-primary">
                                        {t("account.pointsRewards.history.table.description")}
                                    </th>
                                    <th className="text-left py-3 px-4 text-base font-medium text-custom-primary">
                                        {t("account.pointsRewards.history.table.type")}
                                    </th>
                                    <th className="text-right py-3 px-4 text-base font-medium text-custom-primary">
                                        {t("account.pointsRewards.history.table.points")}
                                    </th>
                                    <th className="text-right py-3 px-4 text-base font-medium text-custom-primary">
                                        {t("account.pointsRewards.history.table.balance")}
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {itemsWithBalance.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan={5}
                                            className="py-8 text-center text-custom-secondary"
                                        >
                                            {t("account.pointsRewards.history.noHistory")}
                                        </td>
                                    </tr>
                                ) : (
                                    itemsWithBalance.map(
                                        (item: PointsTransactionItem & { displayBalance: number }) => (
                                            <tr
                                                key={item.id}
                                                className="border-b border-custom-primary hover:bg-custom-light transition-colors"
                                            >
                                                <td className="py-3 px-4 text-sm text-custom-primary">
                                                    {formatDate(item.created_at)}
                                                </td>
                                                <td className="py-3 px-4 text-sm text-custom-primary">
                                                    {item.rule?.title ?? item.type ?? item.reason ?? "—"}
                                                </td>
                                                <td className="py-3 px-4">
                                                    <span
                                                        className={cn(
                                                            "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
                                                            getTypeBadgeColor(item.status),
                                                        )}
                                                    >
                                                        {t(
                                                            `account.pointsRewards.history.types.${item.status}`,
                                                        )}
                                                    </span>
                                                </td>
                                                <td
                                                    className={cn(
                                                        "py-3 px-4 text-sm font-medium text-right",
                                                        item.status === "earned"
                                                            ? "text-green-600 dark:text-green-400"
                                                            : "text-red-600 dark:text-red-400",
                                                    )}
                                                >
                                                    {item.status === "earned" ? "+" : "-"}
                                                    {item.points}
                                                </td>
                                                <td className="py-3 px-4 text-sm text-custom-primary text-right">
                                                    {item.displayBalance.toLocaleString()}
                                                </td>
                                            </tr>
                                        ),
                                    )
                                )}
                            </tbody>
                        </table>
                    )}
                </div>

                {pagination && pagination.last_page > 1 && (
                    <div className="flex justify-center gap-2 mt-6">
                        <Button
                            variant="outline"
                            size="sm"
                            disabled={historyPage <= 1}
                            onClick={() => setHistoryPage((p) => p - 1)}
                        >
                            {t("common.previous") ?? "Previous"}
                        </Button>
                        <span className="flex items-center px-3 text-sm text-custom-secondary">
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

            {/* Exchange History */}
            <div className="bg-custom-card rounded-xl p-6">
                <h2 className="text-2xl font-bold text-custom-primary mb-6">
                    {t("account.pointsRewards.exchangeHistory.title", "Exchange History")}
                </h2>
                {exchangeHistoryLoading ? (
                    <div className="py-8 text-center text-custom-secondary">
                        {t("common.loading") ?? "Loading..."}
                    </div>
                ) : !exchangeHistoryData?.exchanges?.length ? (
                    <div className="py-8 text-center text-custom-secondary">
                        {t("account.pointsRewards.exchangeHistory.empty", "No exchanges yet.")}
                    </div>
                ) : (
                    <>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-custom-primary">
                                        <th className="text-left py-3 px-4 text-sm font-medium text-custom-primary">
                                            {t("account.pointsRewards.history.table.date", "Date")}
                                        </th>
                                        <th className="text-left py-3 px-4 text-sm font-medium text-custom-primary">
                                            {t("account.pointsRewards.exchangeHistory.type", "Type")}
                                        </th>
                                        <th className="text-left py-3 px-4 text-sm font-medium text-custom-primary">
                                            {t("account.pointsRewards.exchangeHistory.status", "Status")}
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {exchangeHistoryData.exchanges.map((item) => (
                                        <tr
                                            key={item.id}
                                            className="border-b border-custom-primary hover:bg-custom-light transition-colors"
                                        >
                                            <td className="py-3 px-4 text-sm text-custom-primary">
                                                {formatDate(item.created_at)}
                                            </td>
                                            <td className="py-3 px-4 text-sm text-custom-primary capitalize">
                                                {item.exchange_type.replace("_", "")}
                                            </td>
                                            <td className="py-3 px-4">
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                                                    {item.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        {exchangeHistoryData.pagination && exchangeHistoryData.pagination.last_page > 1 && (
                            <div className="flex justify-center gap-2 mt-6">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    disabled={exchangeHistoryPage <= 1}
                                    onClick={() => setExchangeHistoryPage((p) => p - 1)}
                                >
                                    {t("common.previous") ?? "Previous"}
                                </Button>
                                <span className="flex items-center px-3 text-sm text-custom-secondary">
                                    {exchangeHistoryData.pagination.current_page} / {exchangeHistoryData.pagination.last_page}
                                </span>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    disabled={exchangeHistoryPage >= exchangeHistoryData.pagination.last_page}
                                    onClick={() => setExchangeHistoryPage((p) => p + 1)}
                                >
                                    {t("common.next") ?? "Next"}
                                </Button>
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* Gift Address Modal */}
            {pendingGiftId != null && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                    <div className="bg-custom-card rounded-xl p-6 w-full max-w-md mx-4 space-y-4">
                        <h3 className="text-lg font-bold text-custom-primary">
                            {t("account.pointsRewards.giftAddress.title", "Select Delivery Address")}
                        </h3>
                        <p className="text-sm text-custom-secondary">
                            {t("account.pointsRewards.giftAddress.description", "Choose where to deliver your gift.")}
                        </p>
                        <div className="space-y-2 max-h-60 overflow-y-auto">
                            {addresses.map((addr) => (
                                <button
                                    key={addr.id}
                                    type="button"
                                    onClick={() => setSelectedAddressId(addr.id)}
                                    className={`w-full text-left px-4 py-3 rounded-lg border text-sm transition-colors ${selectedAddressId === addr.id
                                        ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300"
                                        : "border-custom-primary text-custom-primary hover:border-blue-300"
                                        }`}
                                >
                                    <span className="font-medium">{addr.label}</span>
                                    {addr.street_name && (
                                        <span className="block text-xs text-custom-secondary mt-0.5">
                                            {addr.street_name}
                                        </span>
                                    )}
                                </button>
                            ))}
                        </div>
                        <div className="flex gap-3 pt-2">
                            <Button
                                variant="outline"
                                size="sm"
                                fullWidth
                                onClick={() => { setPendingGiftId(null); setSelectedAddressId(null); }}
                            >
                                {t("common.cancel", "Cancel")}
                            </Button>
                            <Button
                                variant="primary"
                                size="sm"
                                fullWidth
                                disabled={selectedAddressId == null || setGiftAddressMutation.isPending}
                                onClick={handleConfirmGiftAddress}
                                className="bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-md"
                            >
                                {setGiftAddressMutation.isPending ? "..." : t("common.confirm", "Confirm")}
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
