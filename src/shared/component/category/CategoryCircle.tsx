import { useState } from "react";
import type { CSSProperties } from "react";
import { cn } from "@/shared/lib/utils";
import { useTheme } from "@/context/ThemeContext";
import { buildCategoryLabelGradient } from "@/shared/lib/categoryColors";
import { getCategoryInitials } from "@/shared/lib/getCategoryInitials";
import type { CategoriesApiDarkSurface } from "@/features/categories/lib/categoriesApiDarkSurface";

export type CategoryCircleSize = "lg" | "md" | "sm";

const SIZES: Record<
    CategoryCircleSize,
    {
        circle: string;
        gap: string;
        label: string;
        initials: string;
        badge: string;
        badgeIcon: string;
    }
> = {
    lg: {
        circle: "h-20 w-20 sm:h-24 sm:w-24 md:h-32 md:w-32",
        gap: "gap-3",
        label: "text-sm",
        initials: "text-xl sm:text-2xl md:text-3xl",
        badge: "h-5 w-5",
        badgeIcon: "h-3 w-3",
    },
    md: {
        circle: "h-16 w-16 sm:h-[4.5rem] sm:w-[4.5rem] md:h-24 md:w-24",
        gap: "gap-2.5",
        label: "text-[13px]",
        initials: "text-lg sm:text-xl md:text-2xl",
        badge: "h-5 w-5",
        badgeIcon: "h-3 w-3",
    },
    sm: {
        circle: "h-14 w-14 sm:h-16 sm:w-16 md:h-20 md:w-20",
        gap: "gap-2",
        label: "text-xs",
        initials: "text-base sm:text-lg md:text-xl",
        badge: "h-4 w-4",
        badgeIcon: "h-2.5 w-2.5",
    },
};

/** Width of a whole item (disc + label) — keeps wrapped rows on a tidy grid. */
export const CATEGORY_CIRCLE_ITEM_WIDTH: Record<CategoryCircleSize, string> = {
    lg: "w-24 sm:w-28 md:w-36",
    md: "w-20 sm:w-24 md:w-28",
    sm: "w-[4.5rem] sm:w-20 md:w-24",
};

export type CategoryCircleProps = {
    name: string;
    icon?: string | null;
    mainColor?: string | null;
    secondColor?: string | null;
    size?: CategoryCircleSize;
    selected?: boolean;
    /** Renders the drill-down chevron badge. */
    hasChildren?: boolean;
    onClick?: () => void;
    className?: string;
    /** Categories-page dark accents; omit on the home strip. */
    apiSurface?: CategoriesApiDarkSurface | null;
};

/**
 * The circular category avatar used for every level of the tree.
 * Falls back to the category's initials when the dashboard attached no icon.
 */
export default function CategoryCircle({
    name,
    icon,
    mainColor,
    secondColor,
    size = "lg",
    selected = false,
    hasChildren = false,
    onClick,
    className,
    apiSurface,
}: CategoryCircleProps) {
    const { theme } = useTheme();
    const isDarkTheme = theme === "dark";
    const [imageFailed, setImageFailed] = useState(false);

    const s = SIZES[size];
    const main = mainColor?.trim() || undefined;
    const second = secondColor?.trim() || undefined;
    const accent = apiSurface?.main ?? "var(--color-main)";
    const ringColor = main ?? second ?? (selected ? "var(--color-main)" : undefined);

    const initials = getCategoryInitials(name);
    const showImage = Boolean(icon) && !imageFailed;

    const labelGradient = !isDarkTheme ? buildCategoryLabelGradient(main, second) : null;
    const labelSolid = !isDarkTheme && !labelGradient ? (main ?? second) : undefined;

    /** Light mode tints the disc with the category's own colors; dark stays on the luxury foundation. */
    const initialsStyle = isDarkTheme
        ? {
              boxShadow: `inset 0 0 0 1px color-mix(in srgb, ${accent} 18%, transparent)`,
          }
        : main || second
          ? {
                background: `linear-gradient(135deg, color-mix(in srgb, ${main ?? second} 22%, #ffffff) 0%, color-mix(in srgb, ${second ?? main} 30%, #ffffff) 100%)`,
                color: `color-mix(in srgb, ${main ?? second} 78%, #0f172a)`,
            }
          : undefined;

    return (
        <button
            type="button"
            onClick={onClick}
            title={name}
            className={cn(
                "group flex w-full flex-col items-center bg-transparent outline-none transition-transform duration-300 ease-out hover:-translate-y-0.5 focus-visible:-translate-y-0.5 active:translate-y-0 active:scale-[0.98]",
                s.gap,
                className,
            )}
        >
            {/* Circle with dark hover glow */}
            <div className="relative">
                {/* Ambient glow ring on hover — dark only */}
                <div
                    className="absolute -inset-1 rounded-full opacity-0 transition-opacity duration-300 dark:group-hover:opacity-100"
                    style={{
                        background: `radial-gradient(circle, color-mix(in srgb, ${accent} 40%, transparent) 0%, transparent 70%)`,
                        filter: "blur(6px)",
                    }}
                />
                <div
                    className={cn(
                        "relative overflow-hidden rounded-full ring-1 transition-all duration-300",
                        // Light mode had no hover feedback at all: give the disc a
                        // hairline edge that thickens and lifts on hover.
                        "ring-black/[0.06] shadow-[0_1px_2px_rgba(15,23,42,0.06)] group-hover:shadow-[0_10px_24px_-12px_rgba(15,23,42,0.45)] group-hover:ring-2",
                        "dark:shadow-none dark:ring-white/[0.08] dark:group-hover:ring-white/[0.14] dark:group-hover:shadow-[0_0_22px_-6px_color-mix(in_srgb,var(--color-main)_45%,transparent)]",
                        s.circle,
                        selected && "ring-2 dark:ring-white/25",
                    )}
                    style={
                        !isDarkTheme && ringColor
                            ? ({
                                  // Same hue at rest and on hover — only the ring
                                  // width changes, so the accent never flashes.
                                  "--tw-ring-color": `color-mix(in srgb, ${ringColor} ${selected ? 75 : 28}%, transparent)`,
                              } as CSSProperties)
                            : undefined
                    }
                >
                    {showImage ? (
                        <img
                            src={icon as string}
                            alt={name}
                            onError={() => setImageFailed(true)}
                            className="h-full w-full object-cover transition-transform duration-400 ease-out group-hover:scale-105"
                        />
                    ) : (
                        <span
                            aria-hidden
                            className={cn(
                                "flex h-full w-full select-none items-center justify-center font-extrabold tracking-wide transition-transform duration-400 ease-out group-hover:scale-105",
                                s.initials,
                                !initialsStyle &&
                                    "bg-gradient-to-br from-slate-100 to-slate-200 text-slate-600",
                                "dark:bg-white/[0.06] dark:text-[#E4E4E7]",
                            )}
                            style={initialsStyle}
                        >
                            {initials || "•"}
                        </span>
                    )}
                </div>

                {/* Drill-down affordance */}
                {hasChildren && (
                    <span
                        aria-hidden
                        className={cn(
                            "absolute bottom-0 end-0 flex items-center justify-center rounded-full bg-white/90 shadow-sm ring-1 ring-black/5 dark:bg-white/10 dark:ring-white/10",
                            s.badge,
                        )}
                    >
                        <svg
                            className={cn("rtl:rotate-180", s.badgeIcon)}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={3}
                                d="M9 5l7 7-7 7"
                            />
                        </svg>
                    </span>
                )}
            </div>

            {/* Label */}
            <span
                className={cn(
                    "line-clamp-2 max-w-full text-center leading-snug break-words",
                    s.label,
                    selected ? "font-bold" : "font-semibold",
                    labelGradient
                        ? "bg-clip-text text-transparent"
                        : "text-stone-800 transition-colors duration-300 dark:text-[#A1A1AA] dark:group-hover:text-white",
                )}
                style={
                    labelGradient
                        ? {
                              backgroundImage: labelGradient,
                              WebkitBackgroundClip: "text",
                              backgroundClip: "text",
                          }
                        : labelSolid
                          ? { color: labelSolid }
                          : undefined
                }
            >
                {name}
            </span>
        </button>
    );
}
