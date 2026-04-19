import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { useLanguage } from "@/context/LanguageContext";
import { getApiErrorMessage, getApiSuccessMessage } from "@/shared/lib/apiMessage";
import {
    useExchangeCoupon,
    useExchangeGift,
    useExchangeHistory,
    usePointsExchangeOptions,
    usePointsSummary,
    usePointsTransactions,
    useSetGiftAddress,
} from "../../../hooks/usePoints";
import { useAddresses } from "../../../hooks/useAddress";
import type { PointsExchangeGift, PointsTransactionItem } from "../../../types";
import { parseNextRewardThreshold } from "../utils/pointsRewardsMath";

export type PointsHistoryFilter = "all" | "earned" | "redeemed" | "expired";

export type TransactionRow = PointsTransactionItem & { displayBalance: number };

export function usePointsRewardsPage() {
    const { t } = useTranslation();
    const { isRTL } = useLanguage();
    const [activeFilter, setActiveFilter] = useState<PointsHistoryFilter>("all");
    const [historyPage, setHistoryPage] = useState(1);
    const [exchangeHistoryPage, setExchangeHistoryPage] = useState(1);
    const [pendingGiftId, setPendingGiftId] = useState<number | null>(null);
    const [selectedAddressId, setSelectedAddressId] = useState<number | null>(null);

    const { data: summary, isLoading: summaryLoading, isError: summaryError } =
        usePointsSummary();
    const {
        data: transactionsData,
        isLoading: transactionsLoading,
        isError: transactionsError,
    } = usePointsTransactions(historyPage);
    const { data: exchangeOptions, isLoading: exchangeLoading } = usePointsExchangeOptions();
    const { data: exchangeHistoryData, isLoading: exchangeHistoryLoading } =
        useExchangeHistory(exchangeHistoryPage);

    const exchangeCouponMutation = useExchangeCoupon();
    const exchangeGiftMutation = useExchangeGift();
    const setGiftAddressMutation = useSetGiftAddress();
    const { data: addresses = [] } = useAddresses();

    const handleExchangeCoupon = () => {
        const minPoints = exchangeOptions?.options?.coupon?.min_points ?? 100;
        exchangeCouponMutation.mutate(minPoints, {
            onSuccess: (res) => {
                toast.success(
                    getApiSuccessMessage(
                        res as unknown,
                        t("account.pointsRewards.redeem.success", "Exchange successful!"),
                    ),
                );
            },
            onError: (err) => {
                toast.error(
                    getApiErrorMessage(
                        err,
                        t("account.pointsRewards.redeem.error", "Exchange failed. Please try again."),
                    ),
                );
            },
        });
    };

    const handleExchangeGift = (gift: PointsExchangeGift) => {
        exchangeGiftMutation.mutate(
            { points: gift.points_required, gift_id: gift.id },
            {
                onSuccess: (res) => {
                    toast.success(
                        getApiSuccessMessage(
                            res as unknown,
                            t("account.pointsRewards.redeem.success", "Exchange successful!"),
                        ),
                    );
                    setPendingGiftId(res.data?.gift_id ?? null);
                    setSelectedAddressId(
                        addresses.find((a) => a.is_default)?.id ?? addresses[0]?.id ?? null,
                    );
                },
                onError: (err) => {
                    toast.error(
                        getApiErrorMessage(
                            err,
                            t("account.pointsRewards.redeem.error", "Exchange failed. Please try again."),
                        ),
                    );
                },
            },
        );
    };

    const handleConfirmGiftAddress = () => {
        if (pendingGiftId == null || selectedAddressId == null) return;
        setGiftAddressMutation.mutate(
            { giftId: pendingGiftId, address_id: selectedAddressId },
            {
                onSuccess: () => {
                    toast.success(
                        t("account.pointsRewards.giftAddress.success", "Delivery address set successfully!"),
                    );
                    setPendingGiftId(null);
                    setSelectedAddressId(null);
                },
                onError: (err) => {
                    toast.error(
                        getApiErrorMessage(
                            err,
                            t("account.pointsRewards.giftAddress.error", "Failed to set address. Please try again."),
                        ),
                    );
                },
            },
        );
    };

    const cancelGiftAddressModal = () => {
        setPendingGiftId(null);
        setSelectedAddressId(null);
    };

    const points = summary?.points ?? summary?.balance ?? 0;
    const value = summary?.value;
    const nextReward = summary?.next_reward ?? "";
    const expiry = summary?.expiry ?? summary?.expire_at ?? "";
    const earningRules = summary?.earning_rules ?? [];
    const nextRewardThreshold = parseNextRewardThreshold(nextReward);
    const progressPercentage = nextRewardThreshold ? (points / nextRewardThreshold) * 100 : 0;

    const items = useMemo(() => transactionsData?.items ?? [], [transactionsData]);
    const pagination = transactionsData?.pagination;

    const filteredItems = useMemo(() => {
        if (activeFilter === "all") return items;
        return items.filter((item) => item.status === activeFilter);
    }, [items, activeFilter]);

    const itemsWithBalance = useMemo((): TransactionRow[] => {
        const sorted = [...filteredItems].sort(
            (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
        );
        let running = summary?.points ?? summary?.balance ?? 0;
        return sorted.map((item) => {
            const displayBalance = running;
            if (item.status === "earned") running -= item.points;
            else running += item.points;
            return { ...item, displayBalance };
        });
    }, [filteredItems, summary?.points, summary?.balance]);

    const filterTabs: { value: PointsHistoryFilter; label: string }[] = useMemo(
        () => [
            { value: "all", label: t("account.pointsRewards.history.filters.all") },
            { value: "earned", label: t("account.pointsRewards.history.filters.earned") },
            { value: "redeemed", label: t("account.pointsRewards.history.filters.redeemed") },
            { value: "expired", label: t("account.pointsRewards.history.filters.expired") },
        ],
        [t],
    );

    return {
        isRTL,
        t,
        summaryError,
        summaryLoading,
        points,
        value,
        nextReward,
        expiry,
        earningRules,
        nextRewardThreshold,
        progressPercentage,
        activeFilter,
        setActiveFilter,
        historyPage,
        setHistoryPage,
        filterTabs,
        transactionsLoading,
        transactionsError,
        itemsWithBalance,
        pagination,
        exchangeLoading,
        exchangeOptions,
        exchangeCouponMutation,
        exchangeGiftMutation,
        exchangeHistoryPage,
        setExchangeHistoryPage,
        exchangeHistoryLoading,
        exchangeHistoryData,
        handleExchangeCoupon,
        handleExchangeGift,
        pendingGiftId,
        selectedAddressId,
        setSelectedAddressId,
        addresses,
        setGiftAddressMutation,
        handleConfirmGiftAddress,
        cancelGiftAddressModal,
    };
}
