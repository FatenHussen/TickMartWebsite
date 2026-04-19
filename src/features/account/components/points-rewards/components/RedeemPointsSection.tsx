import type { TFunction } from "i18next";
import { HiSparkles } from "react-icons/hi";
import { historySectionShellClass } from "../constants";
import type { PointsExchangeGift, PointsExchangeOptionsData } from "../../../types";
import { useRedeemCatalog } from "../hooks/useRedeemCatalog";
import { SectionShell } from "./SectionShell";
import { RedeemBalanceBar } from "./redeem/RedeemBalanceBar";
import { RedeemFilterTabs } from "./redeem/RedeemFilterTabs";
import { RedeemRewardItemCard } from "./redeem/RedeemRewardItemCard";

type SummaryValue = { point_value?: string; estimated_value_formatted?: string; currency_symbol?: string };

type RedeemPointsSectionProps = {
    t: TFunction;
    userPoints: number;
    exchangeLoading: boolean;
    exchangeOptions: PointsExchangeOptionsData | undefined;
    value: SummaryValue | undefined;
    isCouponExchangePending: boolean;
    isGiftExchangePending: boolean;
    onExchangeCoupon: () => void;
    onExchangeGift: (gift: PointsExchangeGift) => void;
};

function RedeemSkeleton() {
    return (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            {[1, 2, 3, 4].map((i) => (
                <div
                    key={i}
                    className="h-56 animate-pulse rounded-2xl bg-gradient-to-br from-primary-light/5 via-custom-muted/40 to-custom-card shadow-sm"
                />
            ))}
        </div>
    );
}

function RedeemEmptyState({
    t,
    isFiltered,
}: {
    t: TFunction;
    isFiltered: boolean;
}) {
    return (
        <div className="flex flex-col items-center justify-center gap-3 rounded-2xl bg-custom-card px-6 py-14 text-center shadow-sm shadow-black/[0.04] dark:shadow-black/30">
            <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-light/15 text-primary-light shadow-md shadow-primary-light/15">
                <HiSparkles className="h-7 w-7" />
            </span>
            <p className="max-w-md text-sm leading-relaxed text-custom-secondary">
                {isFiltered
                    ? t(
                          "account.pointsRewards.redeem.emptyFilter",
                          "No rewards available in this category right now.",
                      )
                    : (t("account.pointsRewards.redeem.noOptions") ??
                      "No redemption options available.")}
            </p>
        </div>
    );
}

export function RedeemPointsSection({
    t,
    userPoints,
    exchangeLoading,
    exchangeOptions,
    value,
    isCouponExchangePending,
    isGiftExchangePending,
    onExchangeCoupon,
    onExchangeGift,
}: RedeemPointsSectionProps) {
    const catalog = useRedeemCatalog({
        t,
        exchangeOptions,
        value,
        isCouponExchangePending,
        isGiftExchangePending,
        onExchangeCoupon,
        onExchangeGift,
        userPoints,
    });

    return (
        <SectionShell padding="lg" className={historySectionShellClass}>
            <header className="space-y-3">
                <h2 className="text-xl font-bold tracking-tight text-custom-primary sm:text-2xl">
                    {t("account.pointsRewards.redeem.title")}
                </h2>
                <p className="max-w-3xl text-sm leading-relaxed text-custom-secondary">
                    {t(
                        "account.pointsRewards.redeem.helper",
                        "Pick your favorite reward and turn your points into something useful today.",
                    )}
                </p>
            </header>

            <div className="mt-6">
                <RedeemBalanceBar
                    t={t}
                    userPoints={userPoints}
                    affordableCount={catalog.affordableCount}
                    totalCount={catalog.totalCount}
                />
            </div>

            <div className="mt-6">
                <RedeemFilterTabs
                    tabs={catalog.filterTabs}
                    activeFilter={catalog.activeFilter}
                    onChange={catalog.setActiveFilter}
                />
            </div>

            <div className="mt-6">
                {exchangeLoading ? (
                    <RedeemSkeleton />
                ) : catalog.items.length === 0 ? (
                    <RedeemEmptyState t={t} isFiltered={catalog.totalCount > 0} />
                ) : (
                    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                        {catalog.items.map((item) => (
                            <RedeemRewardItemCard
                                key={item.id}
                                t={t}
                                item={item}
                                userPoints={userPoints}
                            />
                        ))}
                    </div>
                )}
            </div>
        </SectionShell>
    );
}
