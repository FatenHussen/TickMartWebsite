import { useTranslation } from "react-i18next";
import { cn } from "@/shared/lib/utils";
import type { CategoriesApiDarkSurface } from "../lib/categoriesApiDarkSurface";
import type { ApiCategory, CategoryChild } from "../types";
import CategoryFilters from "./CategoryFilters";
import type { CategoryTypeFilter } from "./CategoryFilters";

type CategoriesSidebarProps = {
    categories: ApiCategory[];
    selectedCategoryId: number | undefined;
    selectedSubcategoryId: number | undefined;
    onCategorySelect: (category: ApiCategory) => void;
    onSubcategorySelect: (subcategory: CategoryChild) => void;
    onShowAllCategories?: () => void;
    isLoading?: boolean;
    title?: string;
    /** Gradient title (light mode); when omitted, title uses theme primary text. */
    titleMainColor?: string | null;
    titleSecondColor?: string | null;
    apiSurface?: CategoriesApiDarkSurface | null;
    categoryTypeFilter?: CategoryTypeFilter;
    onCategoryTypeFilterChange?: (type: CategoryTypeFilter) => void;
    minPrice?: number;
    maxPrice?: number;
    onPriceFilterChange?: (price: { minPrice?: number; maxPrice?: number }) => void;
};

export default function CategoriesSidebar({
    categories,
    selectedCategoryId,
    selectedSubcategoryId,
    onCategorySelect,
    onSubcategorySelect,
    onShowAllCategories,
    isLoading,
    title,
    titleMainColor,
    titleSecondColor,
    apiSurface,
    categoryTypeFilter,
    onCategoryTypeFilterChange,
    minPrice,
    maxPrice,
    onPriceFilterChange,
}: CategoriesSidebarProps) {
    const { t } = useTranslation();
    const readCategoryColor = (
        category: ApiCategory,
        key: "main" | "second",
    ) => {
        const source = category as ApiCategory & Record<string, unknown>;
        const keys =
            key === "main"
                ? ["main_color", "mainColor", "color_main"]
                : ["second_color", "secondColor", "color_second", "secondary_color"];

        for (const candidate of keys) {
            const value = source[candidate];
            if (typeof value === "string" && value.trim()) return value.trim();
        }

        return undefined;
    };
    const getCategoryGradient = (category: ApiCategory) => {
        const mainColor = readCategoryColor(category, "main");
        const secondColor = readCategoryColor(category, "second");

        if (!mainColor && !secondColor) return undefined;

        return {
            background: `linear-gradient(135deg, ${mainColor ?? secondColor} 0%, ${secondColor ?? mainColor} 100%)`,
        };
    };

    // Get children of selected category
    const selectedCategory = categories.find((c) => c.id === selectedCategoryId);
    const subcategories = selectedCategory?.children || [];
    const sidebarTitleText = title || t("categories.categoriesTitle", "Categories");
    const sidebarGradMain = titleMainColor?.trim() || titleSecondColor?.trim();
    const sidebarGradSecond = titleSecondColor?.trim() || titleMainColor?.trim();
    const sidebarTitleGradient = Boolean(sidebarGradMain && sidebarGradSecond);

    const cardShell = (extraClass: string) =>
        cn(
            "rounded-2xl border p-5 shadow-sm",
            apiSurface
                ? "border-solid"
                : "border-primary-light/15 bg-gradient-to-b from-custom-card to-blue-50/40",
            extraClass,
        );

    const cardStyle = apiSurface
        ? {
            backgroundColor: apiSurface.cardBackground,
            borderColor: apiSurface.cardBorder,
            color: apiSurface.mutedColor,
        }
        : undefined;

    return (
        <div className="space-y-6">
            {/* Categories Section */}
            <div className={cardShell("")} style={cardStyle}>
                {sidebarTitleGradient ? (
                    <h2
                        className="text-base font-bold mb-4 bg-clip-text text-transparent"
                        style={{
                            backgroundImage: `linear-gradient(105deg, ${sidebarGradMain}, ${sidebarGradSecond})`,
                            WebkitBackgroundClip: "text",
                            backgroundClip: "text",
                        }}
                    >
                        {sidebarTitleText}
                    </h2>
                ) : (
                    <h2
                        className={cn("text-base font-bold mb-4", !apiSurface && "text-custom-primary")}
                        style={apiSurface ? { color: apiSurface.pageColor } : undefined}
                    >
                        {sidebarTitleText}
                    </h2>
                )}

                {isLoading ? (
                    <div className="space-y-2">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <div
                                key={i}
                                className="h-10 bg-custom-tertiary rounded-lg animate-pulse"
                            />
                        ))}
                    </div>
                ) : (
                    <div className="space-y-1">
                        {onShowAllCategories && (
                            <button
                                type="button"
                                onClick={onShowAllCategories}
                                className={cn(
                                    "w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-all font-medium",
                                    !selectedCategoryId
                                        ? apiSurface
                                            ? "shadow-sm font-semibold"
                                            : "bg-primary-light/10 text-primary-light shadow-sm font-semibold"
                                        : apiSurface
                                            ? "font-medium"
                                            : "text-custom-primary font-medium hover:bg-custom-light",
                                )}
                                style={
                                    apiSurface
                                        ? {
                                            backgroundColor: !selectedCategoryId
                                                ? `color-mix(in srgb, ${apiSurface.main} 22%, ${apiSurface.cardBackground})`
                                                : "transparent",
                                            color: !selectedCategoryId ? apiSurface.pageColor : apiSurface.mutedColor,
                                            border: !selectedCategoryId ? `1px solid ${apiSurface.cardBorder}` : "none",
                                        }
                                        : undefined
                                }
                            >
                                <span className="w-6 h-6 flex items-center justify-center text-lg">
                                    📂
                                </span>
                                <span className="text-sm">
                                    {t("categories.showAllCategories", "Show all categories")}
                                </span>
                            </button>
                        )}
                        {categories.map((category) => {
                            const isSelected = selectedCategoryId === category.id;
                            const hasChildren = category.children.length > 0;
                            const gradientStyle = getCategoryGradient(category);
                            const hasApiGradient = Boolean(gradientStyle);

                            return (
                                <div key={category.id}>
                                    {/* Category Item */}
                                    <button
                                        onClick={() => onCategorySelect(category)}
                                        className={cn(
                                            "w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-all",
                                            isSelected
                                                ? hasApiGradient
                                                    ? "text-white shadow-md ring-1 ring-white/25"
                                                    : apiSurface
                                                        ? "shadow-sm"
                                                        : "bg-primary-light/10 text-primary-light shadow-sm"
                                                : hasApiGradient
                                                    ? "text-white/95 shadow-sm hover:opacity-95"
                                                    : apiSurface
                                                        ? "hover:opacity-95"
                                                        : "text-custom-primary hover:bg-custom-light",
                                        )}
                                        style={
                                            hasApiGradient
                                                ? gradientStyle
                                                : apiSurface
                                                    ? {
                                                        backgroundColor: isSelected
                                                            ? `color-mix(in srgb, ${apiSurface.main} 20%, ${apiSurface.cardBackground})`
                                                            : "transparent",
                                                        color: isSelected ? apiSurface.pageColor : apiSurface.mutedColor,
                                                        border: isSelected ? `1px solid ${apiSurface.cardBorder}` : "none",
                                                    }
                                                    : undefined
                                        }
                                    >
                                        {/* Icon */}
                                        {category.icon ? (
                                            <img
                                                src={category.icon}
                                                alt={category.name}
                                                className="w-6 h-6 rounded object-cover"
                                            />
                                        ) : (
                                            <span className="w-6 h-6 flex items-center justify-center text-lg">
                                                📁
                                            </span>
                                        )}
                                        <span
                                            className={cn(
                                                "text-sm flex-1",
                                                isSelected
                                                    ? hasApiGradient
                                                        ? "font-semibold text-white"
                                                        : apiSurface
                                                            ? "font-semibold"
                                                            : "font-semibold text-primary-light"
                                                    : hasApiGradient
                                                        ? "font-medium text-white"
                                                        : apiSurface
                                                            ? "font-medium"
                                                            : "font-medium",
                                            )}
                                            style={
                                                apiSurface && !hasApiGradient
                                                    ? { color: isSelected ? apiSurface.pageColor : apiSurface.mutedColor }
                                                    : undefined
                                            }
                                        >
                                            {category.name}
                                        </span>
                                        {/* Arrow - only for categories with children */}
                                        {hasChildren && (
                                            <svg
                                                className={`w-4 h-4 transition-transform ${isSelected ? "rotate-90" : ""} ${hasApiGradient ? "text-white" : "text-current"}`}
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M9 5l7 7-7 7"
                                                />
                                            </svg>
                                        )}
                                    </button>

                                    {/* Subcategories - show when category is selected and has children */}
                                    {isSelected && hasChildren && subcategories.length > 0 && (
                                        <div className="ml-9 mt-1 space-y-0.5">
                                            {subcategories.map((subcategory) => {
                                                const isSubSelected =
                                                    selectedSubcategoryId === subcategory.id;
                                                return (
                                                    <button
                                                        key={subcategory.id}
                                                        onClick={() => onSubcategorySelect(subcategory)}
                                                        className={cn(
                                                            "w-full text-left flex items-center gap-2 px-3 py-2 rounded-lg transition-all text-sm",
                                                            isSubSelected
                                                                ? apiSurface
                                                                    ? "font-semibold"
                                                                    : "bg-primary-light/15 text-primary-light font-semibold"
                                                                : apiSurface
                                                                    ? "hover:opacity-90"
                                                                    : "text-custom-secondary hover:text-custom-primary hover:bg-custom-light",
                                                        )}
                                                        style={
                                                            apiSurface
                                                                ? {
                                                                    backgroundColor: isSubSelected
                                                                        ? `color-mix(in srgb, ${apiSurface.main} 16%, ${apiSurface.cardBackground})`
                                                                        : "transparent",
                                                                    color: isSubSelected ? apiSurface.pageColor : apiSurface.mutedColor,
                                                                }
                                                                : undefined
                                                        }
                                                    >
                                                        {subcategory.name}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Filters Section - Separate card */}
            <div className={cardShell("")} style={cardStyle}>
                <CategoryFilters
                    typeFilter={categoryTypeFilter}
                    onTypeFilterChange={onCategoryTypeFilterChange}
                    minPrice={minPrice}
                    maxPrice={maxPrice}
                    onPriceChange={onPriceFilterChange}
                    apiSurface={apiSurface}
                />
            </div>
        </div>
    );
}
