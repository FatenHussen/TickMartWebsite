import { useMemo, useState } from "react";
import type { TFunction } from "i18next";
import type { PointsExchangeGift, PointsExchangeOptionsData } from "../../../types";
import type { RewardCategory, RewardItem } from "../types";
import { buildRewardItems } from "../utils/buildRewardItems";

export type RedeemFilter = "all" | RewardCategory;

type SummaryValue = { point_value?: string; currency_symbol?: string } | undefined;

type Args = {
    t: TFunction;
    exchangeOptions: PointsExchangeOptionsData | undefined;
    value: SummaryValue;
    isCouponExchangePending: boolean;
    isGiftExchangePending: boolean;
    onExchangeCoupon: () => void;
    onExchangeGift: (gift: PointsExchangeGift) => void;
    userPoints: number;
};

export type RedeemFilterTab = {
    value: RedeemFilter;
    label: string;
    count: number;
};

export function useRedeemCatalog({
    t,
    exchangeOptions,
    value,
    isCouponExchangePending,
    isGiftExchangePending,
    onExchangeCoupon,
    onExchangeGift,
    userPoints,
}: Args) {
    const [activeFilter, setActiveFilter] = useState<RedeemFilter>("all");

    const items = useMemo(
        () =>
            buildRewardItems({
                t,
                exchangeOptions,
                value,
                isCouponExchangePending,
                isGiftExchangePending,
                onExchangeCoupon,
                onExchangeGift,
            }),
        [
            t,
            exchangeOptions,
            value,
            isCouponExchangePending,
            isGiftExchangePending,
            onExchangeCoupon,
            onExchangeGift,
        ],
    );

    const filteredItems = useMemo(
        () => (activeFilter === "all" ? items : items.filter((it) => it.category === activeFilter)),
        [items, activeFilter],
    );

    const counts = useMemo(() => {
        const result: Record<RewardCategory, number> = { discount: 0, delivery: 0, gift: 0 };
        for (const it of items) result[it.category] += 1;
        return result;
    }, [items]);

    const filterTabs: RedeemFilterTab[] = useMemo(
        () => [
            {
                value: "all",
                label: t("account.pointsRewards.redeem.filters.all", "All"),
                count: items.length,
            },
            {
                value: "discount",
                label: t("account.pointsRewards.redeem.filters.discount", "Discounts"),
                count: counts.discount,
            },
            {
                value: "delivery",
                label: t("account.pointsRewards.redeem.filters.delivery", "Delivery"),
                count: counts.delivery,
            },
            {
                value: "gift",
                label: t("account.pointsRewards.redeem.filters.gift", "Gifts"),
                count: counts.gift,
            },
        ],
        [t, items.length, counts],
    );

    const affordableCount = useMemo(
        () => items.filter((it) => userPoints >= it.cost).length,
        [items, userPoints],
    );

    return {
        items: filteredItems as RewardItem[],
        totalCount: items.length,
        affordableCount,
        activeFilter,
        setActiveFilter,
        filterTabs,
    };
}
