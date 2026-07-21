import { useId, useState } from "react";
import { cn } from "../lib/utils";

/** Fixed frame + max constraints so flex layouts cannot stretch the circle */
const SIZE_CLASS = {
    sm: "h-[28px] w-[28px] min-h-[28px] min-w-[28px] max-h-[28px] max-w-[28px]",
    /** Default: larger tap target than original 24px Figma frame */
    md: "h-[32px] w-[32px] min-h-[32px] min-w-[32px] max-h-[32px] max-w-[32px]",
    lg: "h-[40px] w-[40px] min-h-[40px] min-w-[40px] max-h-[40px] max-w-[40px]",
} as const;

/** Heart SVG render size inside the circle (scales with button) */
const ICON_PX = {
    sm: 15,
    md: 19,
    lg: 24,
} as const;

export type FavoriteButtonProps = {
    isFavorite?: boolean;
    onToggle?: (e: React.MouseEvent) => void;
    /** Frame: `sm` 28px · `md` 32px (default) · `lg` 40px — circular, 1px gradient border */
    size?: "sm" | "md" | "lg";
    className?: string;
    ariaLabel?: string;
};

export default function FavoriteButton({
    isFavorite = false,
    onToggle,
    size = "md",
    className,
    ariaLabel = "Toggle favorite",
}: FavoriteButtonProps) {
    const uid = useId().replace(/:/g, "");
    const gradId = `favorite-btn-grad-${uid}`;
    const [pop, setPop] = useState(false);

    const icon = ICON_PX[size];

    const heartFillPath =
        "M11.645 20.428l-7.981-8.725A5.422 5.422 0 012.75 7.5v0A5.422 5.422 0 017.172 2.128c1.481 0 2.904.601 3.923 1.662l.427.438.427-.438a5.421 5.421 0 013.923-1.662 5.422 5.422 0 013.422 5.372v0a5.422 5.422 0 01-1.914 3.203l-7.981 8.725a.75.75 0 01-1.09 0z";

    return (
        <button
            type="button"
            aria-label={ariaLabel}
            aria-pressed={isFavorite}
            onClick={(e) => {
                setPop(true);
                onToggle?.(e);
            }}
            onAnimationEnd={() => setPop(false)}
            className={cn(
                "favorite-button group relative box-border shrink-0 rounded-[9999px] p-0",
                "flex items-center justify-center",
                "border border-transparent",
                SIZE_CLASS[size],
                "cursor-pointer touch-manipulation",
                "transition-[transform,box-shadow] duration-200 ease-out",
                "hover:scale-110 hover:shadow-[0_4px_14px_-4px_color-mix(in_srgb,var(--color-gradient-to)_55%,transparent)]",
                "active:scale-90",
                pop && "favorite-button--pop",
                "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-light/50 focus-visible:ring-offset-1",
                className
            )}
            style={{
                backgroundImage:
                    "linear-gradient(#FFFFFF, #FFFFFF), linear-gradient(180deg, var(--color-gradient-from) 0%, var(--color-gradient-to) 100%)",
                backgroundOrigin: "border-box",
                backgroundClip: "padding-box, border-box",
            }}
        >
            <svg
                width={icon}
                height={icon}
                viewBox="0 0 24 24"
                className="pointer-events-none"
                aria-hidden
            >
                <defs>
                    <linearGradient
                        id={gradId}
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                        gradientUnits="objectBoundingBox"
                    >
                        <stop offset="0%" stopColor="var(--color-gradient-from)" />
                        <stop offset="100%" stopColor="var(--color-gradient-to)" />
                    </linearGradient>
                </defs>
                {/* Outline — fades out as the fill takes over on hover/active */}
                <path
                    fill="none"
                    stroke={`url(#${gradId})`}
                    strokeWidth={1.5}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
                    className={cn(
                        "transition-opacity duration-200",
                        isFavorite ? "opacity-0" : "opacity-100 group-hover:opacity-0",
                    )}
                />
                {/* Fill — solid when favorited, softly previewed on hover */}
                <path
                    fill={`url(#${gradId})`}
                    d={heartFillPath}
                    className={cn(
                        "origin-center transition-opacity duration-200",
                        isFavorite ? "opacity-100" : "opacity-0 group-hover:opacity-100",
                    )}
                />
            </svg>
        </button>
    );
}
