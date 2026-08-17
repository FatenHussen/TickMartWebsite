import { useTranslation } from "react-i18next";
import { cn } from "@/shared/lib/utils";
import type { CategoriesApiDarkSurface } from "../lib/categoriesApiDarkSurface";

type CategoryDrillHeaderProps = {
    /** Resolved ancestors, root first. Empty at the top level. */
    trail: { id: number; name: string }[];
    rootLabel: string;
    /** `0` = back to the root level. */
    onNavigateToDepth: (depth: number) => void;
    /** Current category brand color, used to tint the active crumb. */
    accentColor?: string | null;
    apiSurface?: CategoriesApiDarkSurface | null;
    className?: string;
};

function Chevron({ className }: { className?: string }) {
    return (
        <svg
            className={cn("rtl:rotate-180", className)}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden
        >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
        </svg>
    );
}

/** Back control + breadcrumb for the circular category drill-down. */
export default function CategoryDrillHeader({
    trail,
    rootLabel,
    onNavigateToDepth,
    accentColor,
    apiSurface,
    className,
}: CategoryDrillHeaderProps) {
    const { t } = useTranslation();
    const crumbs = [{ id: 0, name: rootLabel }, ...trail];
    const accent = accentColor?.trim() || apiSurface?.main || undefined;

    return (
        <nav
            aria-label="Breadcrumb"
            className={cn("flex min-w-0 flex-wrap items-center gap-x-3 gap-y-2", className)}
        >
            {trail.length > 0 && (
                <button
                    type="button"
                    onClick={() => onNavigateToDepth(trail.length - 1)}
                    className={cn(
                        "inline-flex h-9 shrink-0 items-center gap-1.5 rounded-full border px-3 text-sm font-medium transition-all duration-200 active:scale-[0.97]",
                        apiSurface
                            ? "border-solid hover:opacity-90"
                            : "border-slate-200/80 bg-custom-card text-custom-secondary shadow-sm hover:border-primary-light/45 hover:text-primary-light",
                    )}
                    style={
                        apiSurface
                            ? {
                                  backgroundColor: apiSurface.cardBackground,
                                  borderColor: apiSurface.cardBorder,
                                  color: apiSurface.pageColor,
                              }
                            : undefined
                    }
                >
                    <Chevron className="h-3.5 w-3.5 rotate-180 rtl:rotate-0" />
                    <span className="hidden sm:inline">{t("categories.back", "Back")}</span>
                </button>
            )}

            <ol className="flex min-w-0 flex-wrap items-center gap-x-1 gap-y-1 text-sm">
                {crumbs.map((crumb, index) => {
                    const isLast = index === crumbs.length - 1;
                    return (
                        <li key={`${crumb.id}-${index}`} className="flex min-w-0 items-center gap-1">
                            {index > 0 && (
                                <Chevron
                                    className={cn(
                                        "h-3 w-3 shrink-0 opacity-50",
                                        !apiSurface && "text-custom-tertiary",
                                    )}
                                />
                            )}
                            {isLast ? (
                                <span
                                    aria-current="page"
                                    className={cn(
                                        "truncate rounded-full px-2.5 py-1 font-semibold",
                                        !accent &&
                                            !apiSurface &&
                                            "bg-primary-light/10 text-primary-light",
                                    )}
                                    style={
                                        accent
                                            ? {
                                                  backgroundColor: `color-mix(in srgb, ${accent} 14%, transparent)`,
                                                  color: apiSurface ? apiSurface.pageColor : accent,
                                              }
                                            : apiSurface
                                              ? { color: apiSurface.pageColor }
                                              : undefined
                                    }
                                >
                                    {crumb.name}
                                </span>
                            ) : (
                                <button
                                    type="button"
                                    onClick={() => onNavigateToDepth(index)}
                                    className={cn(
                                        "truncate rounded-full px-2 py-1 transition-colors",
                                        !apiSurface &&
                                            "text-custom-secondary hover:bg-primary-light/10 hover:text-primary-light",
                                        apiSurface && "hover:opacity-80",
                                    )}
                                    style={apiSurface ? { color: apiSurface.mutedColor } : undefined}
                                >
                                    {crumb.name}
                                </button>
                            )}
                        </li>
                    );
                })}
            </ol>
        </nav>
    );
}
