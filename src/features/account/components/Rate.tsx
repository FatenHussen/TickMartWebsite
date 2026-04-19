import { HiStar } from "react-icons/hi";
import { cn } from "@/shared/lib/utils";

export type RateProps = {
    /** Localized label, e.g. `t("account.myReviews.rateNow")` */
    label: string;
    onClick: () => void;
    className?: string;
    disabled?: boolean;
};

/**
 * Primary CTA for leaving a rating (unreviewed items, etc.).
 * Uses API secondary color with white label — consistent with account CTAs.
 */
export default function Rate({
    label,
    onClick,
    className,
    disabled = false,
}: RateProps) {
    return (
        <button
            type="button"
            onClick={onClick}
            disabled={disabled}
            className={cn(
                "inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-lg px-4 py-2 text-sm font-semibold text-white transition-colors",
                "bg-[var(--color-api-second)] hover:bg-[var(--color-api-second-hover)]",
                "disabled:pointer-events-none disabled:opacity-50",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-api-second)]/40 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-bg-card)]",
                className,
            )}
        >
            <HiStar className="h-4 w-4 shrink-0 opacity-95" aria-hidden />
            {label}
        </button>
    );
}
