import { useEffect, useRef, useState } from "react";
import { HiChevronDown } from "react-icons/hi";
import { HiCheck } from "react-icons/hi2";
import { useTranslation } from "react-i18next";
import { useLanguage } from "@/context/LanguageContext";
import { cn } from "@/shared/lib/utils";
import type { OrderStatus } from "../types";

type Props = {
    activeFilter: OrderStatus | "all";
    onFilterChange: (filter: OrderStatus | "all") => void;
    sortBy?: string;
    onSortChange?: (sort: string) => void;
    sortOptions?: { value: string; label: string }[];
};

export default function OrderFilters({
    activeFilter,
    onFilterChange,
    sortBy = "Newest",
    onSortChange,
    sortOptions = [
        { value: "newest", label: "Newest" },
        { value: "oldest", label: "Oldest" },
        { value: "amount_high", label: "Amount: High to Low" },
        { value: "amount_low", label: "Amount: Low to High" },
    ],
}: Props) {
    const { t } = useTranslation();
    const { isRTL } = useLanguage();
    const [isSortOpen, setIsSortOpen] = useState(false);
    const sortRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!isSortOpen) return;
        const handler = (e: MouseEvent) => {
            if (sortRef.current && !sortRef.current.contains(e.target as Node)) {
                setIsSortOpen(false);
            }
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, [isSortOpen]);

    const filters: { key: OrderStatus | "all"; label: string }[] = [
        { key: "all", label: t("orders.all") },
        { key: "pending", label: t("orders.pending") },
        { key: "preparing", label: t("orders.preparing") },
        { key: "out_for_delivery", label: t("orders.out_for_delivery") },
        { key: "delivered", label: t("orders.delivered") },
        { key: "cancelled", label: t("orders.cancelled") },
    ];

    return (
        <div
            className="flex items-center gap-2 flex-wrap"
            dir={isRTL ? "rtl" : "ltr"}
        >
            {/* Filter pills */}
            <div className="flex items-center gap-1.5 flex-wrap">
                {filters.map((filter) => {
                    const isActive = activeFilter === filter.key;
                    return (
                        <button
                            key={filter.key}
                            type="button"
                            onClick={() => onFilterChange(filter.key)}
                            className={cn(
                                "px-3.5 py-2 text-xs font-semibold rounded-full",
                                "border transition-all duration-200",
                                "focus:outline-none focus-visible:ring-2 focus-visible:ring-[color:color-mix(in_srgb,var(--color-main)_25%,transparent)]",
                                isActive
                                    ? "text-custom-inverse border-transparent shadow-sm bg-[color:var(--color-main)] hover:bg-[color:var(--color-api-second-hover)]"
                                    : "bg-custom-card text-[color:var(--color-text)]/70 border-custom-primary hover:text-[color:var(--color-text)] hover:bg-custom-hover hover:border-[color:color-mix(in_srgb,var(--color-main)_35%,transparent)]",
                            )}
                        >
                            {filter.label}
                        </button>
                    );
                })}
            </div>

            {/* Sort dropdown */}
            <div className="relative" ref={sortRef}>
                <button
                    type="button"
                    onClick={() => setIsSortOpen((v) => !v)}
                    aria-haspopup="listbox"
                    aria-expanded={isSortOpen}
                    className={cn(
                        "inline-flex items-center gap-2",
                        "px-3.5 py-2 text-xs font-semibold rounded-full",
                        "border border-custom-primary bg-custom-card",
                        "text-[color:var(--color-text)]",
                        "hover:bg-custom-hover hover:border-[color:color-mix(in_srgb,var(--color-main)_35%,transparent)]",
                        "transition-all duration-200",
                        "focus:outline-none focus-visible:ring-2 focus-visible:ring-[color:color-mix(in_srgb,var(--color-main)_25%,transparent)]",
                    )}
                >
                    <span className="text-custom-tertiary">
                        {t("orders.sortBy")}:
                    </span>
                    <span>{sortBy}</span>
                    <HiChevronDown
                        className={cn(
                            "w-3.5 h-3.5 transition-transform text-custom-tertiary",
                            isSortOpen && "rotate-180",
                        )}
                    />
                </button>

                {isSortOpen && (
                    <div
                        role="listbox"
                        className={cn(
                            "absolute z-30 mt-2 w-56",
                            "bg-custom-card border border-custom-primary rounded-xl",
                            "shadow-[0_8px_24px_-6px_color-mix(in_srgb,var(--color-primary)_18%,transparent)]",
                            "overflow-hidden",
                            isRTL ? "left-0" : "right-0",
                        )}
                    >
                        {sortOptions.map((option) => {
                            const isSelected = sortBy === option.label;
                            return (
                                <button
                                    key={option.value}
                                    type="button"
                                    role="option"
                                    aria-selected={isSelected}
                                    onClick={() => {
                                        onSortChange?.(option.label);
                                        setIsSortOpen(false);
                                    }}
                                    className={cn(
                                        "w-full px-4 py-2.5 text-sm",
                                        "transition-colors flex items-center justify-between gap-2",
                                        isRTL ? "text-right" : "text-left",
                                        isSelected
                                            ? "bg-custom-hover text-[color:var(--color-main)] font-semibold"
                                            : "text-[color:var(--color-text)] hover:bg-custom-hover",
                                    )}
                                >
                                    <span>{option.label}</span>
                                    {isSelected && (
                                        <HiCheck className="w-4 h-4 text-[color:var(--color-main)] shrink-0" />
                                    )}
                                </button>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
