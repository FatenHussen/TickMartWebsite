import { Star } from "lucide-react";
import { cn } from "@/shared/lib/utils";

/** Fixed gold for My reviews (`variant="brand"`). Literal `#FFD700` for Tailwind JIT. */

type StarRatingProps = {
    rating: number;
    size?: "sm" | "md" | "lg";
    showNumber?: boolean;
    className?: string;
    /** `brand`: fixed gold `#FFD700` (My reviews). `amber`: theme yellow. */
    variant?: "brand" | "amber";
};

const sizeIcon = {
    sm: "h-4 w-4",
    md: "h-5 w-5",
    lg: "h-6 w-6",
} as const;

const sizeText = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base",
} as const;

export default function StarRating({
    rating,
    size = "md",
    showNumber = true,
    className,
    variant = "brand",
}: StarRatingProps) {
    const roundedRating = Math.round(rating * 10) / 10;

    const filledClass =
        variant === "amber"
            ? "!text-[var(--color-ui-yellow-400)] !fill-[var(--color-ui-yellow-400)]"
            : "!text-[#FFD700] !fill-[#FFD700]";

    const emptyClass =
        "!fill-[color-mix(in_srgb,var(--color-text-tertiary)_42%,var(--color-bg-card))] !text-[color-mix(in_srgb,var(--color-text-tertiary)_55%,var(--color-bg-card))]";

    return (
        <div className={cn("inline-flex items-center gap-1.5", className)}>
            <div
                className="flex items-center gap-0.5"
                role="img"
                aria-label={`${roundedRating.toFixed(1)} out of 5`}
            >
                {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                        key={star}
                        className={cn(
                            sizeIcon[size],
                            "shrink-0 stroke-[0.6]",
                            star <= roundedRating ? filledClass : emptyClass,
                        )}
                        aria-hidden
                    />
                ))}
            </div>
            {showNumber && (
                <span
                    className={cn(
                        sizeText[size],
                        "font-bold tabular-nums",
                        variant === "brand"
                            ? "!text-[#FFD700]"
                            : "text-text-primary",
                    )}
                >
                    {roundedRating.toFixed(1)}
                </span>
            )}
        </div>
    );
}

export { StarRating as Rating };
