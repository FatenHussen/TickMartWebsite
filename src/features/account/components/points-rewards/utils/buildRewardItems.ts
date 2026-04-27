import type { TFunction } from "i18next";
import { HiGift, HiTag, HiTruck } from "react-icons/hi";
import type { PointsExchangeGift, PointsExchangeOptionsData } from "../../../types";
import type { RewardItem } from "../types";
import { getPointValueMultiplier } from "./pointsRewardsMath";

type SummaryValue = { point_value?: string; currency_symbol?: string } | undefined;

type Args = {
    t: TFunction;
    exchangeOptions: PointsExchangeOptionsData | undefined;
    value: SummaryValue;
    isCouponExchangePending: boolean;
    isGiftExchangePending: boolean;
    onExchangeCoupon: () => void;
    onExchangeGift: (gift: PointsExchangeGift) => void;
};

export function buildRewardItems({
    t,
    exchangeOptions,
    value,
    isCouponExchangePending,
    isGiftExchangePending,
    onExchangeCoupon,
    onExchangeGift,
}: Args): RewardItem[] {
    if (!exchangeOptions) return [];

    const opts = exchangeOptions.options;
    if (!opts) return [];

    const available = exchangeOptions.available;
    const pointsWord = t("account.pointsRewards.points");
    const items: RewardItem[] = [];

    if (opts.coupon?.enabled) {
        const c = opts.coupon;
        items.push({
            id: "coupon",
            category: "discount",
            icon: HiTag,
            title: t("account.pointsRewards.redeem.options.orderDiscount.title"),
            description:
                c.description ||
                t(
                    "account.pointsRewards.redeem.options.orderDiscount.fallbackDesc",
                    "Apply a percentage discount on your next order.",
                ),
            detailLabel: `${t("account.pointsRewards.redeem.options.minPoints")}${c.min_points} ${pointsWord}`,
            cost: c.min_points,
            costLabel: `${c.min_points}–${c.max_points} ${pointsWord}`,
            rewardLabel: `${c.discount_rate}% ${t("account.pointsRewards.redeem.options.discount")}`,
            actionLabel: t("account.pointsRewards.redeem.options.redeemPoints"),
            isPending: isCouponExchangePending,
            isAvailable: available,
            onAction: onExchangeCoupon,
        });
    }

    if (opts.free_delivery?.enabled) {
        const d = opts.free_delivery;
        items.push({
            id: "free_delivery",
            category: "delivery",
            icon: HiTruck,
            title: t("account.pointsRewards.redeem.options.freeDelivery.title"),
            description:
                d.description ||
                t(
                    "account.pointsRewards.redeem.options.freeDelivery.fallbackDesc",
                    "Get a free-delivery coupon you can apply at checkout.",
                ),
            cost: d.points_cost,
            costLabel: `${d.points_cost} ${pointsWord}`,
            rewardLabel: `1 ${t("account.pointsRewards.redeem.options.freeDelivery.coupon")}`,
            actionLabel: t("account.pointsRewards.redeem.options.redeemForFreeDelivery"),
            isPending: false,
            isAvailable: available,
        });
    }

    if (opts.gifts?.enabled) {
        const gifts = opts.gifts.available_gifts ?? [];
        const multiplier = getPointValueMultiplier(value);
        const currency = value?.currency_symbol ?? "";

        if (gifts.length === 0) {
            items.push({
                id: "gift_default",
                category: "gift",
                icon: HiGift,
                title: t("account.pointsRewards.redeem.options.giftVoucher.title"),
                description: t("account.pointsRewards.redeem.options.giftVoucher.singleUse"),
                cost: 1000,
                costLabel: `1,000 ${pointsWord}`,
                rewardLabel: `10,000 SYP ${t("account.pointsRewards.redeem.options.voucher")}`,
                actionLabel: t("account.pointsRewards.redeem.options.generateVoucher"),
                isPending: isGiftExchangePending,
                isAvailable: available,
            });
        } else {
            for (const gift of gifts) {
                const valueAmount = gift.points_required * multiplier;
                items.push({
                    id: `gift_${gift.id}`,
                    category: "gift",
                    icon: HiGift,
                    title: gift.name,
                    description:
                        gift.description ||
                        t(
                            "account.pointsRewards.redeem.options.giftVoucher.fallbackDesc",
                            "Redeem your points for this gift voucher.",
                        ),
                    cost: gift.points_required,
                    costLabel: `${gift.points_required} ${pointsWord}`,
                    rewardLabel: currency
                        ? `${valueAmount.toLocaleString()} ${currency} ${t("account.pointsRewards.redeem.options.voucher")}`
                        : `${valueAmount.toLocaleString()} ${t("account.pointsRewards.redeem.options.voucher")}`,
                    actionLabel: t("account.pointsRewards.redeem.options.generateVoucher"),
                    isPending: isGiftExchangePending,
                    isAvailable: available,
                    onAction: () => onExchangeGift(gift),
                });
            }
        }
    }

    return items;
}
