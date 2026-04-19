import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import {
    MONTH_CHART_LABELS_AR,
    MONTH_CHART_LABELS_EN,
    MONTH_PERFORMANCE_KEYS,
} from "@/features/marketer/constants/monthlyPerformanceChart";
import type { MonthlyPerformance } from "@/features/marketer/types";

interface MarketerMonthlyPerformanceChartProps {
    monthlyPerformance: Record<string, MonthlyPerformance> | undefined;
    isRTL: boolean;
}

export function MarketerMonthlyPerformanceChart({
    monthlyPerformance,
    isRTL,
}: MarketerMonthlyPerformanceChartProps) {
    const { t } = useTranslation();
    const [hoveredMonthIndex, setHoveredMonthIndex] = useState<number | null>(null);

    const commissionValues = useMemo(
        () => MONTH_PERFORMANCE_KEYS.map((monthKey) => monthlyPerformance?.[monthKey]?.earned_commission ?? 0),
        [monthlyPerformance],
    );

    const maxCommission = Math.max(...commissionValues, 1);
    const monthLabels = isRTL ? MONTH_CHART_LABELS_AR : MONTH_CHART_LABELS_EN;

    return (
        <div className="rounded-2xl border border-custom-primary bg-custom-card p-6 shadow-sm">
            <h3 className="mb-6 font-semibold text-text-primary">
                {t("marketer.dashboard.monthlyPerformance", "Monthly Performance")}
            </h3>
            <div className="flex h-40 items-end gap-1.5" dir="ltr">
                {commissionValues.map((commission, monthIndex) => {
                    const heightPercent = (commission / maxCommission) * 100;
                    const isHovered = hoveredMonthIndex === monthIndex;
                    const barHeightPercent = Math.max(heightPercent, commission > 0 ? 4 : 2);

                    return (
                        <div
                            key={monthIndex}
                            className="group flex flex-1 cursor-pointer flex-col items-center gap-1"
                            onMouseEnter={() => setHoveredMonthIndex(monthIndex)}
                            onMouseLeave={() => setHoveredMonthIndex(null)}
                        >
                            <div
                                className={`whitespace-nowrap rounded-lg px-2 py-1 text-xs font-semibold transition-all duration-200 ${
                                    isHovered
                                        ? "bg-[var(--color-api-second)] text-white opacity-100"
                                        : "opacity-0"
                                }`}
                            >
                                {commission.toLocaleString()}
                            </div>
                            <div className="relative flex w-full items-end" style={{ height: "100px" }}>
                                <div
                                    className={`w-full rounded-t-md transition-all duration-300 ${
                                        isHovered
                                            ? "bg-[var(--color-api-second)]"
                                            : commission > 0
                                              ? "bg-[color-mix(in_srgb,var(--color-api-second)_52%,var(--color-bg-muted))]"
                                              : "bg-custom-tertiary"
                                    }`}
                                    style={{ height: `${barHeightPercent}%` }}
                                />
                            </div>
                            <span className="text-[10px] leading-none text-text-secondary">{monthLabels[monthIndex]}</span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
