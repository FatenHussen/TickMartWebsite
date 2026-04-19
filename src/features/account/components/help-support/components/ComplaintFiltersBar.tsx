import { useTranslation } from "react-i18next";
import { cn } from "@/shared/lib/utils";
import type { ComplaintStatus, ComplaintType } from "@/features/account/types";
import { COMPLAINT_STATUS_FILTER_OPTIONS, COMPLAINT_TYPE_OPTIONS } from "../constants";
import { HELP_FOCUS_RING } from "../focusRingClasses";

type ComplaintFiltersBarProps = {
    typeFilter: ComplaintType | "";
    statusFilter: ComplaintStatus | "";
    onToggleType: (value: ComplaintType) => void;
    onSelectStatus: (value: ComplaintStatus | "") => void;
};

export function ComplaintFiltersBar({
    typeFilter,
    statusFilter,
    onToggleType,
    onSelectStatus,
}: ComplaintFiltersBarProps) {
    const { t } = useTranslation();

    const chipBase = cn(
        "px-3.5 py-1.5 rounded-full text-sm font-semibold transition-all duration-200",
        HELP_FOCUS_RING
    );
    const chipInactive =
        "bg-custom-tertiary/85 text-custom-primary hover:bg-primary/[0.1] dark:hover:bg-primary/14";
    const chipActive =
        "bg-gradient-to-r from-primary to-primary-dark text-white shadow-lg shadow-primary/25";

    return (
        <div className="mb-4 flex flex-wrap items-center gap-2">
            {COMPLAINT_TYPE_OPTIONS.map((opt) => (
                <button
                    key={opt.value}
                    type="button"
                    onClick={() => onToggleType(opt.value)}
                    className={cn(chipBase, typeFilter === opt.value ? chipActive : chipInactive)}
                >
                    {t(opt.translationKey)}
                </button>
            ))}
            <span className="select-none px-1.5 text-custom-secondary/35 sm:hidden" aria-hidden>
                ·
            </span>
            <span className="hidden px-1 text-custom-secondary/35 sm:inline" aria-hidden>
                ·
            </span>
            {COMPLAINT_STATUS_FILTER_OPTIONS.map((opt) => (
                <button
                    key={opt.value || "all"}
                    type="button"
                    onClick={() => onSelectStatus(opt.value)}
                    className={cn(chipBase, statusFilter === opt.value ? chipActive : chipInactive)}
                >
                    {t(opt.translationKey)}
                </button>
            ))}
        </div>
    );
}
