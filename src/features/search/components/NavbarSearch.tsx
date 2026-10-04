import { useRef, useEffect, useState, useLayoutEffect } from "react";
import { createPortal } from "react-dom";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useLanguage } from "@/context/LanguageContext";
import { HiSearch, HiFilter } from "react-icons/hi";
import { paths } from "@/app/routes/path/paths";
import { useNavbarSearch } from "../hooks/useNavbarSearch";
import type { SearchResultType, SearchResultWithType } from "../types";
import { resolveLocalizedText } from "@/shared/lib/localizedText";
import { cn } from "@/shared/lib/utils";
import { listingImageSrc } from "@/features/product/lib/productMedia";

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
    autoFocus?: boolean;
}

export default function NavbarSearch({
    className,
    inputClassName,
    onResultSelect,
    autoFocus = false,
}: NavbarSearchProps) {
    const { t } = useTranslation();
    const { isRTL, language } = useLanguage();
    const navigate = useNavigate();
    const containerRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

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
        if (!autoFocus) return;
        const id = requestAnimationFrame(() => inputRef.current?.focus());
        return () => cancelAnimationFrame(id);
    }, [autoFocus]);

    const resultLabel = (item: SearchResultWithType) =>
        resolveLocalizedText(item.name, language);

    const handleSubmitSearch = () => {
        const trimmed = query.trim();
        if (!trimmed) return;
        clearQuery();
        setShowTypePicker(false);
        onResultSelect?.();
        navigate(`${paths.client.products}?search=${encodeURIComponent(trimmed)}`);
    };

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
            <div
                className="group flex h-11 w-full items-center gap-2 rounded-full border border-primary/35 bg-white px-3.5 transition-[border-color,box-shadow] duration-200 ease-out hover:border-primary/50 focus-within:border-primary focus-within:ring-4 focus-within:ring-primary/10 dark:border-white/[0.08] dark:bg-custom-card"
            >
                <button
                    type="button"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => setShowTypePicker((p) => !p)}
                    className={cn(
                        "flex shrink-0 items-center justify-center text-primary transition-opacity duration-200 hover:opacity-80",
                        showTypePicker && "opacity-100"
                    )}
                    aria-label={t("common.filter") || "Filter"}
                    aria-pressed={showTypePicker}
                >
                    <HiFilter className="h-5 w-5" />
                </button>
                <input
                    ref={inputRef}
                    type="search"
                    enterKeyHint="search"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onFocus={() => hasQuery && openDropdown()}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            e.preventDefault();
                            handleSubmitSearch();
                        }
                    }}
                    placeholder={
                        t("home.searchProducts") ||
                        "Search products and stores..."
                    }
                    dir={isRTL ? "rtl" : "ltr"}
                    className={cn(
                        "min-w-0 flex-1 border-0 bg-transparent text-[15px] leading-none text-custom-primary outline-none placeholder:text-text-tertiary",
                        inputClassName
                    )}
                />
                <HiSearch
                    className="pointer-events-none h-5 w-5 shrink-0 text-primary"
                    aria-hidden
                />
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
                        ...(isRTL
                            ? { right: anchorRect.right, left: "auto" }
                            : { left: anchorRect.left, right: "auto" }),
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
                                                    {listingImageSrc(item) ? (
                                                        <img
                                                            src={listingImageSrc(item)}
                                                            alt=""
                                                            className="w-full h-full object-cover"
                                                        />
                                                    ) : (
                                                        <HiSearch className="w-5 h-5 text-gray-light" />
                                                    )}
                                                </div>
                                                <span className="text-sm font-medium text-custom-primary truncate flex-1">
                                                    {resultLabel(item)}
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
                                        {listingImageSrc(item) ? (
                                            <img
                                                src={listingImageSrc(item)}
                                                alt=""
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <HiSearch className="w-5 h-5 text-gray-light" />
                                        )}
                                    </div>
                                    <span className="text-sm font-medium text-custom-primary truncate flex-1">
                                        {resultLabel(item)}
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
