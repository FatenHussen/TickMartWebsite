import type { TFunction } from "i18next";
import { HiGift, HiSparkles, HiTag, HiTruck } from "react-icons/hi";
import type { IconType } from "react-icons";
import { cn } from "@/shared/lib/utils";
import type { ExchangeHistoryResponse } from "../../../types";
import { historySectionShellClass } from "../constants";
import { formatPointsRewardDate } from "../utils/formatPointsRewardDate";
import { SectionShell } from "./SectionShell";
import { TablePagination } from "./TablePagination";

type ExchangeHistoryData = ExchangeHistoryResponse["data"];

type ExchangeHistorySectionProps = {
    t: TFunction;
    exchangeHistoryLoading: boolean;
    exchangeHistoryData: ExchangeHistoryData | undefined;
    exchangeHistoryPage: number;
    onExchangeHistoryPageChange: (page: number | ((p: number) => number)) => void;
};

function exchangeTypeMeta(
    t: TFunction,
    exchangeType: "coupon" | "free_delivery" | "gift",
): { Icon: IconType; label: string; accent: string } {
    switch (exchangeType) {
        case "coupon":
            return {
                Icon: HiTag,
                label: t("account.pointsRewards.exchangeHistory.types.coupon", "Order discount"),
                accent: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300",
            };
        case "free_delivery":
            return {
                Icon: HiTruck,
                label: t("account.pointsRewards.exchangeHistory.types.free_delivery", "Free delivery"),
                accent: "bg-sky-500/15 text-sky-800 dark:text-sky-200",
            };
        case "gift":
            return {
                Icon: HiGift,
                label: t("account.pointsRewards.exchangeHistory.types.gift", "Gift"),
                accent: "bg-amber-500/15 text-amber-900 dark:text-amber-200",
            };
        default:
            return {
                Icon: HiSparkles,
                label: exchangeType,
                accent: "bg-custom-muted text-custom-secondary",
            };
    }
}

function ExchangeSkeleton() {
    return (
        <ul className="space-y-3" aria-hidden>
            {[1, 2, 3].map((i) => (
                <li
                    key={i}
                    className="h-24 animate-pulse rounded-2xl bg-gradient-to-r from-custom-muted/60 to-custom-muted/30"
                />
            ))}
        </ul>
    );
}

export function ExchangeHistorySection({
    t,
    exchangeHistoryLoading,
    exchangeHistoryData,
    exchangeHistoryPage,
    onExchangeHistoryPageChange,
}: ExchangeHistorySectionProps) {
    const exchanges = exchangeHistoryData?.exchanges ?? [];
    const pagination = exchangeHistoryData?.pagination;

    return (
        <SectionShell padding="lg" className={historySectionShellClass}>
            <header className="space-y-2">
                <p className="text-xs font-bold uppercase tracking-widest text-primary-light">
                    {t("account.pointsRewards.exchangeHistory.eyebrow", "Redemptions")}
                </p>
                <h2 className="text-xl font-bold tracking-tight text-custom-primary sm:text-2xl">
                    {t("account.pointsRewards.exchangeHistory.title", "Exchange History")}
                </h2>
                <p className="max-w-2xl text-sm leading-relaxed text-custom-secondary">
                    {t(
                        "account.pointsRewards.exchangeHistory.subtitle",
                        "A simple log of what you’ve turned points into — discounts, delivery, or gifts.",
                    )}
                </p>
            </header>

            {exchangeHistoryLoading ? (
                <div className="mt-8">
                    <ExchangeSkeleton />
                </div>
            ) : exchanges.length === 0 ? (
                <div className="mt-8 flex flex-col items-center justify-center gap-3 rounded-2xl bg-gradient-to-b from-custom-muted/40 to-custom-card px-6 py-14 text-center shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
                    <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-light/12 text-primary-light">
                        <HiGift className="h-7 w-7" />
                    </span>
                    <p className="max-w-sm text-sm leading-relaxed text-custom-secondary">
                        {t("account.pointsRewards.exchangeHistory.empty", "No exchanges yet.")}
                    </p>
                    <p className="max-w-md text-xs text-custom-secondary/90">
                        {t(
                            "account.pointsRewards.exchangeHistory.emptyHint",
                            "When you redeem points above, your exchanges will show up here.",
                        )}
                    </p>
                </div>
            ) : (
                <>
                    <ul className="mt-8 space-y-3">
                        {exchanges.map((item) => {
                            const meta = exchangeTypeMeta(t, item.exchange_type);
                            const Icon = meta.Icon;
                            return (
                                <li
                                    key={item.id}
                                    className={cn(
                                        "flex flex-col gap-4 rounded-2xl bg-custom-card p-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6 sm:p-5",
                                        "shadow-[0_1px_3px_rgba(15,23,42,0.05),0_6px_20px_rgba(15,23,42,0.06)]",
                                        "dark:shadow-[0_2px_8px_rgba(0,0,0,0.35)]",
                                        "transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(15,23,42,0.08)]",
                                    )}
                                >
                                    <div className="flex min-w-0 flex-1 gap-4">
                                        <div
                                            className={cn(
                                                "flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl",
                                                meta.accent,
                                            )}
                                            aria-hidden
                                        >
                                            <Icon className="h-5 w-5" />
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-xs font-medium text-custom-secondary">
                                                <time dateTime={item.created_at}>
                                                    {formatPointsRewardDate(item.created_at)}
                                                </time>
                                            </p>
                                            <p className="mt-1 text-base font-semibold text-custom-primary">
                                                {meta.label}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex shrink-0 items-center sm:ps-4">
                                        <span
                                            className={cn(
                                                "inline-flex w-full justify-center rounded-full px-3 py-1.5 text-xs font-semibold sm:w-auto",
                                                "bg-primary-light/12 text-primary-light",
                                            )}
                                        >
                                            {t(`account.pointsRewards.exchangeHistory.statuses.${item.status}`, item.status)}
                                        </span>
                                    </div>
                                </li>
                            );
                        })}
                    </ul>
                    {pagination ? (
                        <TablePagination
                            t={t}
                            currentPage={exchangeHistoryPage}
                            lastPage={pagination.last_page}
                            onPrev={() => onExchangeHistoryPageChange((p) => p - 1)}
                            onNext={() => onExchangeHistoryPageChange((p) => p + 1)}
                        />
                    ) : null}
                </>
            )}
        </SectionShell>
    );
}
