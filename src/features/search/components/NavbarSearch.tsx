import { useRef, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useLanguage } from "@/context/LanguageContext";
import { HiSearch, HiFilter } from "react-icons/hi";
import { paths } from "@/app/routes/path/paths";
import { useNavbarSearch } from "../hooks/useNavbarSearch";
import type { SearchResultType, SearchResultWithType } from "../types";
import { cn } from "@/shared/lib/utils";

const SEARCH_TYPES: { value: SearchResultType | "all"; labelKey: string }[] = [
    { value: "all", labelKey: "search.allTypes" },
    { value: "product", labelKey: "search.products" },
    { value: "brand", labelKey: "search.brands" },
    { value: "shop", labelKey: "search.shops" },
    { value: "recipe", labelKey: "search.recipes" },
];

function getDetailPath(item: SearchResultWithType): string {
    switch (item.type) {
        case "product":
            return paths.client.productDetails(item.id);
        case "brand":
            return paths.client.brandDetails(item.id);
        case "shop":
            return paths.client.shopDetails(item.id);
        case "recipe":
            return paths.client.recipeDetails(item.id);
        default:
            return "/";
    }
}

function groupResultsByType(
    results: SearchResultWithType[]
): Record<SearchResultType, SearchResultWithType[]> {
    const grouped: Record<SearchResultType, SearchResultWithType[]> = {
        product: [],
        brand: [],
        shop: [],
        recipe: [],
    };
    for (const item of results) {
        grouped[item.type].push(item);
    }
    return grouped;
}

interface NavbarSearchProps {
    className?: string;
    inputClassName?: string;
    onResultSelect?: () => void;
}

export default function NavbarSearch({
    className,
    inputClassName,
    onResultSelect,
}: NavbarSearchProps) {
    const { t } = useTranslation();
    const { isRTL } = useLanguage();
    const containerRef = useRef<HTMLDivElement>(null);

    const {
        query,
        setQuery,
        typeFilter,
        setTypeFilter,
        results,
        isLoading,
        isOpen,
        openDropdown,
        closeDropdown,
        clearQuery,
        hasQuery,
    } = useNavbarSearch();

    const [showTypePicker, setShowTypePicker] = useState(false);
    useEffect(() => {
        if (!isOpen) return;
        const handleClickOutside = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            if (
                containerRef.current &&
                !containerRef.current.contains(target)
            ) {
                closeDropdown();
                setShowTypePicker(false);
            }
        };
        document.addEventListener("click", handleClickOutside);
        return () => document.removeEventListener("click", handleClickOutside);
    }, [isOpen, closeDropdown]);

    const grouped =
        typeFilter === "all" && results.length > 0
            ? groupResultsByType(results)
            : null;

    const handleResultClick = () => {
        clearQuery();
        setShowTypePicker(false);
        onResultSelect?.();
    };

    return (
        <div
            ref={containerRef}
            className={cn("relative w-full", className)}
            dir={isRTL ? "rtl" : "ltr"}
        >
            <div className="relative">
                <HiSearch
                    className={cn(
                        "absolute top-1/2 -translate-y-1/2 text-gray-light w-5 h-5",
                        isRTL ? "right-4" : "left-4"
                    )}
                />
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onFocus={() => hasQuery && openDropdown()}
                    placeholder={
                        t("home.searchProducts") ||
                        "Search products and stores..."
                    }
                    className={cn(
                        "w-full py-2 bg-custom-card rounded-lg border border-gray-bold focus:outline-none focus:ring-2 focus:ring-primary-light",
                        isRTL ? "pr-12 pl-12" : "pl-12 pr-12",
                        inputClassName
                    )}
                />
                <button
                    type="button"
                    onClick={() => setShowTypePicker((p) => !p)}
                    className={cn(
                        "absolute top-1/2 -translate-y-1/2 p-1 rounded hover:bg-custom-tertiary transition-colors",
                        isRTL ? "left-3" : "right-3"
                    )}
                    aria-label={t("common.filter") || "Filter"}
                >
                    <HiFilter className="text-custom-secondary w-5 h-5" />
                </button>
            </div>

            {showTypePicker && (
                <div
                    className={cn(
                        "absolute top-full mt-1 min-w-[160px] bg-custom-card rounded-lg shadow-lg border border-gray-bold z-50"
                    )}
                >
                    {SEARCH_TYPES.map(({ value, labelKey }) => (
                        <button
                            key={value}
                            type="button"
                            onClick={() => {
                                setTypeFilter(value);
                                setShowTypePicker(false);
                            }}
                            className={cn(
                                "w-full text-left px-4 py-2 text-sm hover:bg-primary-light/10",
                                typeFilter === value &&
                                    "bg-primary-light/10 font-medium"
                            )}
                        >
                            {t(labelKey)}
                        </button>
                    ))}
                </div>
            )}

            {isOpen && hasQuery && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-custom-card rounded-lg shadow-lg border border-gray-bold z-50 max-h-80 overflow-y-auto">
                    {isLoading ? (
                        <div className="p-4 text-center text-sm text-gray-light">
                            {t("common.loading")}
                        </div>
                    ) : results.length === 0 ? (
                        <div className="p-4 text-center text-sm text-gray-light">
                            {t("search.noResults")} "{query}"
                        </div>
                    ) : typeFilter === "all" && grouped ? (
                        <div className="py-2">
                            {(
                                ["product", "brand", "shop", "recipe"] as const
                            ).map((type) => {
                                const items = grouped[type];
                                if (items.length === 0) return null;
                                const labelKey = SEARCH_TYPES.find(
                                    (s) => s.value === type
                                )?.labelKey;
                                return (
                                    <div key={type} className="mb-2 last:mb-0">
                                        <div className="px-4 py-1 text-xs font-semibold text-gray-light uppercase">
                                            {labelKey ? t(labelKey) : type}
                                        </div>
                                        {items.map((item) => (
                                            <Link
                                                key={`${item.type}-${item.id}`}
                                                to={getDetailPath(item)}
                                                onClick={handleResultClick}
                                                className="flex items-center gap-3 px-4 py-2 hover:bg-primary-light/10 transition-colors"
                                            >
                                                <div className="w-10 h-10 rounded-lg bg-gray-bold shrink-0 overflow-hidden flex items-center justify-center">
                                                    {item.image ? (
                                                        <img
                                                            src={item.image}
                                                            alt=""
                                                            className="w-full h-full object-cover"
                                                        />
                                                    ) : (
                                                        <HiSearch className="w-5 h-5 text-gray-light" />
                                                    )}
                                                </div>
                                                <span className="text-sm font-medium text-custom-primary truncate flex-1">
                                                    {item.name}
                                                </span>
                                            </Link>
                                        ))}
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="py-2">
                            {results.map((item) => (
                                <Link
                                    key={`${item.type}-${item.id}`}
                                    to={getDetailPath(item)}
                                    onClick={handleResultClick}
                                    className="flex items-center gap-3 px-4 py-2 hover:bg-primary-light/10 transition-colors"
                                >
                                    <div className="w-10 h-10 rounded-lg bg-gray-bold shrink-0 overflow-hidden flex items-center justify-center">
                                        {item.image ? (
                                            <img
                                                src={item.image}
                                                alt=""
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <HiSearch className="w-5 h-5 text-gray-light" />
                                        )}
                                    </div>
                                    <span className="text-sm font-medium text-custom-primary truncate flex-1">
                                        {item.name}
                                    </span>
                                    <span className="text-xs text-gray-light shrink-0">
                                        {t(
                                            SEARCH_TYPES.find(
                                                (s) => s.value === item.type
                                            )?.labelKey ?? ""
                                        )}
                                    </span>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
