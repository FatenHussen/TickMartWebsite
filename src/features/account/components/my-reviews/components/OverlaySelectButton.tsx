import { HiChevronDown } from "react-icons/hi";
import { cn } from "@/shared/lib/utils";

type OverlaySelectButtonProps = {
    value: string;
    onChange: (next: string) => void;
    options: { value: string; label: string }[];
    trigger: React.ReactNode;
    /** Merges with default button styles (e.g. creative toolbar variants). */
    buttonClassName?: string;
};

/**
 * Native `<select>` stretched over a visible button (same behavior as original MyReviews).
 */
export default function OverlaySelectButton({
    value,
    onChange,
    options,
    trigger,
    buttonClassName,
}: OverlaySelectButtonProps) {
    return (
        <div className="relative">
            <button
                type="button"
                className={cn(
                    "flex min-h-[42px] items-center gap-2 rounded-xl bg-custom-card/95 px-4 py-2 text-custom-primary shadow-md shadow-black/5 backdrop-blur-sm transition-all hover:bg-custom-light hover:shadow-lg dark:shadow-black/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-api-second)]/35 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-bg-card)]",
                    buttonClassName,
                )}
            >
                {trigger}
                <HiChevronDown className="h-4 w-4 shrink-0 text-[var(--color-api-second)]" />
            </button>
            <select
                value={value}
                onChange={(event) => onChange(event.target.value)}
                className="absolute inset-0 opacity-0 cursor-pointer"
            >
                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
        </div>
    );
}
