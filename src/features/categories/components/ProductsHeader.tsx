import { useTranslation } from "react-i18next";
import { cn } from "@/shared/lib/utils";
import type { CategoriesApiDarkSurface } from "../lib/categoriesApiDarkSurface";

type ProductsHeaderProps = {
    categoryName: string;
    subcategoryName?: string;
    /** Optional API-driven gradient on the highlighted category name (light mode). */
    highlightMainColor?: string | null;
    highlightSecondColor?: string | null;
    apiSurface?: CategoriesApiDarkSurface | null;
    sortBy?: string;
    onSortChange?: (sort: string) => void;
};

export default function ProductsHeader({
    categoryName,
    subcategoryName,
    highlightMainColor,
    highlightSecondColor,
    apiSurface,
    sortBy = "recommended",
    onSortChange,
}: ProductsHeaderProps) {
    const { t } = useTranslation();
    const displayName = subcategoryName || categoryName;
    const gradMain = highlightMainColor?.trim() || highlightSecondColor?.trim();
    const gradSecond = highlightSecondColor?.trim() || highlightMainColor?.trim();
    const useHighlightGradient = Boolean(gradMain && gradSecond);

    const sortOptions = [
        { value: "recommended", label: t("categories.sortRecommended", "Recommended") },
        { value: "priceLow", label: t("categories.sortPriceLow", "Price: Low to High") },
        { value: "priceHigh", label: t("categories.sortPriceHigh", "Price: High to Low") },
        { value: "rating", label: t("categories.sortRating", "Rating") },
        { value: "newest", label: t("categories.sortNewest", "Newest") },
        { value: "oldest", label: t("categories.sortOldest", "Oldest") },
    ];

    return (
        <div
            className={cn(
                "mb-6 flex flex-wrap items-center justify-between gap-3 rounded-[20px] border px-4 py-3",
                !apiSurface &&
                    "border-slate-200/70 bg-custom-card shadow-[0_1px_3px_rgba(15,23,42,0.04),0_10px_30px_-20px_rgba(15,23,42,0.2)]",
            )}
            style={
                apiSurface
                    ? {
                          backgroundColor: apiSurface.cardBackground,
                          borderColor: apiSurface.cardBorder,
                          color: apiSurface.mutedColor,
                      }
                    : undefined
            }
        >
            <p
                className={cn("min-w-0 text-sm", !apiSurface && "text-custom-secondary")}
                style={apiSurface ? { color: apiSurface.mutedColor } : undefined}
            >
                {t("categories.showingProductsIn", "Showing products in")}{" "}
                {useHighlightGradient ? (
                    <span
                        className="font-bold bg-clip-text text-transparent"
                        style={{
                            backgroundImage: `linear-gradient(105deg, ${gradMain}, ${gradSecond})`,
                            WebkitBackgroundClip: "text",
                            backgroundClip: "text",
                        }}
                    >
                        {displayName}
                    </span>
                ) : (
                    <span
                        className={cn("font-bold", !apiSurface && "text-primary-light")}
                        style={apiSurface ? { color: apiSurface.pageColor } : undefined}
                    >
                        {displayName}
                    </span>
                )}
            </p>

            <div className="flex shrink-0 items-center gap-2">
                <span
                    className={cn(
                        "hidden text-sm sm:inline",
                        !apiSurface && "text-custom-secondary",
                    )}
                    style={apiSurface ? { color: apiSurface.mutedColor } : undefined}
                >
                    {t("categories.sortBy", "Sort by")}
                </span>
                <div className="relative">
                    <select
                        value={sortBy}
                        onChange={(e) => onSortChange?.(e.target.value)}
                        aria-label={t("categories.sortBy", "Sort by")}
                        className={cn(
                            "appearance-none rounded-full border px-4 py-2 pe-9 ps-3 text-sm font-semibold shadow-sm transition-all duration-200 cursor-pointer focus:outline-none focus:ring-2",
                            !apiSurface &&
                                "border-slate-200/80 bg-white text-custom-primary hover:border-primary-light/45 focus:ring-primary-light/20",
                        )}
                        style={
                            apiSurface
                                ? {
                                      borderColor: apiSurface.cardBorder,
                                      backgroundColor: `color-mix(in srgb, ${apiSurface.cardBackground} 55%, #020617)`,
                                      color: apiSurface.pageColor,
                                  }
                                : undefined
                        }
                    >
                        {sortOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                    <div
                        className={cn(
                            "pointer-events-none absolute inset-y-0 end-0 flex items-center px-3",
                            !apiSurface && "text-custom-secondary",
                        )}
                        style={apiSurface ? { color: apiSurface.mutedColor } : undefined}
                    >
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 9l-7 7-7-7"
                            />
                        </svg>
                    </div>
                </div>
            </div>
        </div>
    );
}
