import { useRef, useEffect, useState, useLayoutEffect } from "react";
import { createPortal } from "react-dom";
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
    const [anchorRect, setAnchorRect] = useState<{
        top: number;
        left: number;
        right: number;
        width: number;
    } | null>(null);

    const resultsOpen = isOpen && hasQuery;
    const panelOpen = resultsOpen || showTypePicker;

    useEffect(() => {
        if (!isOpen && !showTypePicker) return;
        const handleClickOutside = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            if (
                (containerRef.current &&
                    containerRef.current.contains(target)) ||
                target.closest("[data-search-portal]")
            ) {
                return;
            }
            closeDropdown();
            setShowTypePicker(false);
        };
        document.addEventListener("click", handleClickOutside);
        return () => document.removeEventListener("click", handleClickOutside);
    }, [isOpen, showTypePicker, closeDropdown]);

    // Anchor the portal dropdown to the input; escapes the navbar's
    // `overflow-x-hidden` clipping and sibling stacking contexts.
    useLayoutEffect(() => {
        if (!panelOpen) return;
        const updateRect = () => {
            const el = containerRef.current;
            if (!el) return;
            const r = el.getBoundingClientRect();
            setAnchorRect({
                top: r.bottom,
                left: r.left,
                right: window.innerWidth - r.right,
                width: r.width,
            });
        };
        updateRect();
        window.addEventListener("scroll", updateRect, true);
        window.addEventListener("resize", updateRect);
        return () => {
            window.removeEventListener("scroll", updateRect, true);
            window.removeEventListener("resize", updateRect);
        };
    }, [panelOpen]);

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
            <div className="group relative">
                <HiSearch
                    className={cn(
                        "pointer-events-none absolute top-1/2 h-5 w-5 -translate-y-1/2 text-primary transition-colors duration-200",
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
                        "h-12 w-full rounded-2xl border border-primary/35 bg-white text-[15px] leading-none text-custom-primary transition-[border-color,box-shadow] duration-200 ease-out placeholder:text-text-tertiary hover:border-primary/55 focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/12 dark:border-white/[0.08] dark:bg-custom-card",
                        isRTL ? "pr-12 pl-14" : "pl-12 pr-14",
                        inputClassName
                    )}
                />
                <button
                    type="button"
                    onClick={() => setShowTypePicker((p) => !p)}
                    className={cn(
                        "absolute top-1/2 flex h-8 -translate-y-1/2 items-center justify-center rounded-xl px-2.5 text-primary transition-[background-color,transform] duration-200 ease-out hover:bg-primary/10 active:scale-95",
                        showTypePicker && "bg-primary/10",
                        isRTL ? "left-2" : "right-2"
                    )}
                    aria-label={t("common.filter") || "Filter"}
                    aria-pressed={showTypePicker}
                >
                    <HiFilter className="h-[18px] w-[18px]" />
                </button>
            </div>

            {showTypePicker && anchorRect &&
                createPortal(
                    <div
                        data-search-portal
                        dir={isRTL ? "rtl" : "ltr"}
                        style={{
                            position: "fixed",
                            top: anchorRect.top + 8,
                            ...(isRTL
                                ? { right: anchorRect.right }
                                : { left: anchorRect.left }),
                        }}
                        className={cn(
                            "min-w-[170px] overflow-hidden rounded-2xl border border-black/[0.06] bg-custom-card p-1.5 shadow-[0_10px_40px_-12px_rgba(15,23,42,0.22)] z-[9999] dark:border-white/[0.06]"
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
                                    "w-full rounded-xl px-3.5 py-2 text-start text-sm transition-colors duration-150 hover:bg-primary/[0.08]",
                                    typeFilter === value
                                        ? "bg-primary/10 font-semibold text-primary"
                                        : "text-custom-primary"
                                )}
                            >
                                {t(labelKey)}
                            </button>
                        ))}
                    </div>,
                    document.body
                )}

            {resultsOpen && anchorRect &&
                createPortal(
                <div
                    data-search-portal
                    dir={isRTL ? "rtl" : "ltr"}
                    style={{
                        position: "fixed",
                        top: anchorRect.top + 8,
                        left: anchorRect.left,
                        width: anchorRect.width,
                    }}
                    className="bg-custom-card rounded-2xl shadow-[0_16px_50px_-12px_rgba(15,23,42,0.25)] border border-black/[0.06] z-[9999] max-h-80 overflow-y-auto dark:border-white/[0.06]"
                >
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
                </div>,
                document.body
            )}
        </div>
    );
}
