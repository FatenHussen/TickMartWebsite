import { useEffect, useLayoutEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { Link, useNavigate, useParams, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { HiArrowLeft, HiSearch, HiShoppingBag, HiViewGrid, HiX } from "react-icons/hi";
import { useLanguage } from "@/context/LanguageContext";
import { useAuthStore } from "@/store/auth";
import { paths } from "@/app/routes/path/paths";
import { toast } from "sonner";
import Button from "@/shared/ui/Button";
import { PremiumInlineLoader } from "@/shared/component/loading";
import { useInfiniteList } from "@/shared/hooks/useInfiniteList";
import { _ProductsApi } from "@/features/home/api/products.service";
import { _CategoriesApi } from "@/features/home/api/categories.service";
import { _BrandApi } from "@/features/product/api/brandApi";
import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/utils/queryKeys";
import type { ProductItem } from "@/features/home/types";
import type { Category } from "@/features/home/types";
import type { BrandListItem } from "@/features/product/types/brand";
import { useScheduleCatalog, useScheduleDetail } from "../hooks/useScheduleCatalog";
import { useCustomBasket } from "../hooks/useCustomBasket";
import AddToCustomBasketPopup from "../components/AddToCustomBasketPopup";
import CustomBasketPanel from "../components/CustomBasketPanel";
import ConfirmCustomBasketPopup from "../components/ConfirmCustomBasketPopup";
import ScheduleProductTile, {
    ScheduleProductTileSkeleton,
} from "../components/ScheduleProductTile";
import {
    buildCartItemsFromConfirm,
    pushConfirmItemsToCart,
} from "../lib/pushConfirmToCart";
import { cn } from "@/shared/lib/utils";
import { getCategoryInitials } from "@/shared/lib/getCategoryInitials";
import RevealOnScroll from "@/shared/component/RevealOnScroll";
import CategoryCircle, {
    CATEGORY_CIRCLE_ITEM_WIDTH,
} from "@/shared/component/category/CategoryCircle";

function displayScheduleName(name?: string) {
    const value = name?.trim();
    if (!value) return "";
    return value.charAt(0).toUpperCase() + value.slice(1);
}

function heroIntervalName(
    name: string,
    days: number,
    t: (key: string) => string,
) {
    const key = name.toLowerCase();
    if (days === 7 || (key.includes("week") && !key.includes("two") && !key.includes("bi"))) {
        return t("customBasket.weeklyHero");
    }
    if (days === 30 || key.includes("month")) {
        return t("customBasket.monthlyHero");
    }
    if (days === 14 || key.includes("biweek") || key.includes("two week")) {
        return t("customBasket.biweeklyHero");
    }
    return displayScheduleName(name);
}

/** Pin the shop search under the live navbar, including when the bar condenses. */
function useStickyNavbarOffset() {
    const [offset, setOffset] = useState(0);

    useLayoutEffect(() => {
        const nav = document.querySelector<HTMLElement>(".navbar-elevate");
        if (!nav) return;

        const sync = () => {
            setOffset(Math.max(0, Math.round(nav.getBoundingClientRect().bottom)));
        };

        const observer = new ResizeObserver(sync);
        observer.observe(nav);
        window.addEventListener("resize", sync, { passive: true });
        window.addEventListener("scroll", sync, { passive: true });
        sync();

        return () => {
            observer.disconnect();
            window.removeEventListener("resize", sync);
            window.removeEventListener("scroll", sync);
        };
    }, []);

    return offset;
}

export default function ScheduleCustomize() {
    const { t } = useTranslation();
    const { isRTL } = useLanguage();
    const navigate = useNavigate();
    const location = useLocation();
    const { id } = useParams<{ id: string }>();
    const scheduleId = Number(id);
    const isAuthed = useAuthStore((s) => s.isAuthenticated());
    const navOffset = useStickyNavbarOffset();
    const searchBarRef = useRef<HTMLDivElement>(null);
    const [searchBarHeight, setSearchBarHeight] = useState(56);

    const [searchInput, setSearchInput] = useState("");
    const [search, setSearch] = useState("");
    const [categoryId, setCategoryId] = useState<number | undefined>();
    const [brandId, setBrandId] = useState<number | undefined>();
    const [pickProduct, setPickProduct] = useState<ProductItem | null>(null);
    const [basketOpen, setBasketOpen] = useState(false);
    const [confirmOpen, setConfirmOpen] = useState(false);

    useEffect(() => {
        const timer = window.setTimeout(() => setSearch(searchInput.trim()), 400);
        return () => window.clearTimeout(timer);
    }, [searchInput]);

    useLayoutEffect(() => {
        const el = searchBarRef.current;
        if (!el) return;
        const sync = () => setSearchBarHeight(Math.round(el.getBoundingClientRect().height));
        const observer = new ResizeObserver(sync);
        observer.observe(el);
        sync();
        return () => observer.disconnect();
    }, []);

    const { items: catalogItems } = useScheduleCatalog();
    const fromCatalog = catalogItems.find((s) => s.id === scheduleId);

    const { data: schedule, isLoading: scheduleLoading } =
        useScheduleDetail(Number.isFinite(scheduleId) ? scheduleId : undefined);

    const custom = useCustomBasket(scheduleId, {
        enabled: isAuthed && Number.isFinite(scheduleId),
        fallbackSchedule: schedule ?? fromCatalog,
    });

    const { data: categories = [] } = useQuery({
        queryKey: queryKeys.categories.list({ page: 1 }),
        queryFn: async () => {
            const res = await _CategoriesApi.getCategories(1);
            return res.data.items as Category[];
        },
        staleTime: 30_000,
    });

    const { data: brands = [] } = useQuery({
        queryKey: queryKeys.brands.list({ page: 1 }),
        queryFn: async () => {
            const res = await _BrandApi.getBrands({ per_page: 24 });
            return res.data.items as BrandListItem[];
        },
        staleTime: 30_000,
    });

    const listFilters = useMemo(
        () => ({
            category_id: categoryId,
            brand_id: brandId,
            search: search.trim() || undefined,
        }),
        [categoryId, brandId, search],
    );

    const {
        items: products,
        observerTarget,
        isLoading: productsLoading,
        isFetchingNextPage,
        hasNextPage,
        totalCount,
    } = useInfiniteList<ProductItem>({
        queryKey: ["products", "custom-basket", listFilters],
        fetchFn: (page) =>
            _ProductsApi.getProducts({
                ...listFilters,
                page,
                per_page: 20,
            }).then((r) => r.data),
        threshold: 400,
    });

    const requireAuth = () => {
        navigate(paths.auth.jwt.signIn, {
            state: { from: location.pathname },
        });
    };

    const headerSchedule = custom.basket.schedule ?? schedule ?? fromCatalog;
    const headerImage =
        headerSchedule?.image || headerSchedule?.images?.[0] || "";
    const scheduleName = displayScheduleName(
        headerSchedule?.name ?? t("customBasket.title"),
    );
    const intervalDays = headerSchedule?.interval_days ?? 0;
    const heroDescription = t("customBasket.composeHint", {
        days: intervalDays || 7,
    });
    const itemCount = custom.basket.summary.items_count;
    const hasFilters = Boolean(categoryId || brandId || search);
    const selectedBrand = brands.find((b) => b.id === brandId);

    const handleProductClick = (product: ProductItem) => {
        if (!isAuthed) {
            requireAuth();
            return;
        }
        setPickProduct(product);
    };

    const handleViewBasket = () => {
        if (!isAuthed) {
            requireAuth();
            return;
        }
        setBasketOpen(true);
    };

    const finishConfirm = (
        cartItems: { shop_product_variant_id: number; quantity: number }[],
        draftItems: typeof custom.basket.items,
    ) => {
        const lines = buildCartItemsFromConfirm(cartItems, draftItems);
        const result = pushConfirmItemsToCart(lines);
        if (result === "replaced") {
            toast.success(t("customBasket.cartReplaced"));
        }
        setConfirmOpen(false);
        setBasketOpen(false);
        navigate(paths.client.cart);
    };

    const clearFilters = () => {
        setCategoryId(undefined);
        setBrandId(undefined);
        setSearchInput("");
        setSearch("");
    };

    if (!Number.isFinite(scheduleId) || scheduleId <= 0) {
        return (
            <div className="page-container py-16 text-center">
                <p className="text-zinc-500">{t("customBasket.failedToLoad")}</p>
            </div>
        );
    }

    return (
        <div
            className="relative min-h-screen overflow-hidden bg-gradient-to-b from-[#FFFDFB] via-[#F7F4F0] to-[#F1EEE9] pb-24 dark:bg-zinc-950 sm:pb-10"
            dir={isRTL ? "rtl" : "ltr"}
        >
            <div
                className="animate-schedules-orb pointer-events-none absolute -start-16 top-28 h-56 w-56 rounded-full bg-[#F3E6D4]/45 blur-3xl dark:bg-white/5"
                aria-hidden
            />
            <div
                className="animate-schedules-orb pointer-events-none absolute -end-12 top-80 h-64 w-64 rounded-full bg-white/50 blur-3xl [animation-delay:2s] dark:bg-[#00AED1]/10"
                aria-hidden
            />
            <div
                ref={searchBarRef}
                className="fixed inset-x-0 z-40 border-b border-zinc-200/70 bg-white dark:border-white/10 dark:bg-zinc-950"
                style={{ top: navOffset }}
            >
                <div className="page-container flex items-center gap-2 py-2.5 sm:gap-3 sm:py-3">
                    <Link
                        to={paths.client.schedules}
                        className="grid h-10 w-10 shrink-0 place-items-center rounded-full text-zinc-700 transition hover:bg-zinc-100 hover:text-zinc-900 dark:text-white dark:hover:bg-white/10"
                        aria-label={t("customBasket.backToSchedules")}
                    >
                        <HiArrowLeft className="h-5 w-5 rtl:rotate-180" />
                    </Link>
                    <div className="relative min-w-0 flex-1">
                        <HiSearch className="pointer-events-none absolute start-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
                        <input
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                            placeholder={t("customBasket.searchPlaceholder")}
                            className="h-10 w-full rounded-2xl border border-zinc-200 bg-zinc-50 ps-10 pe-10 text-sm text-zinc-900 outline-none transition focus:border-[#00AED1] focus:bg-white focus:ring-2 focus:ring-[#00AED1]/15 dark:border-white/10 dark:bg-zinc-900 dark:text-white dark:focus:ring-[#00AED1]/25"
                        />
                        {searchInput ? (
                            <button
                                type="button"
                                onClick={() => {
                                    setSearchInput("");
                                    setSearch("");
                                }}
                                className="absolute end-2 top-1/2 grid h-7 w-7 -translate-y-1/2 place-items-center rounded-full text-slate-400 hover:bg-slate-100 hover:text-zinc-700 dark:hover:bg-white/10"
                                aria-label={t("common.clear")}
                            >
                                <HiX className="h-3.5 w-3.5" />
                            </button>
                        ) : null}
                    </div>
                    <Button
                        type="button"
                        variant="primary"
                        onClick={handleViewBasket}
                        className="hidden h-10 shrink-0 rounded-full !bg-zinc-900 px-4 text-[13px] hover:!bg-primary hover:!opacity-100 sm:inline-flex dark:!bg-white dark:!text-zinc-900 dark:hover:!bg-primary dark:hover:!text-white"
                        leftIcon={<HiShoppingBag className="h-4 w-4" />}
                    >
                        {t("customBasket.viewBasket")}
                        {itemCount > 0 && (
                            <span className="ms-1 inline-flex min-w-5 items-center justify-center rounded-full bg-white/20 px-1.5 text-xs font-bold">
                                {itemCount}
                            </span>
                        )}
                    </Button>
                </div>
            </div>
            <div aria-hidden style={{ height: searchBarHeight }} />

            <div className="page-container space-y-10 py-7 sm:space-y-14 sm:py-10">
                {scheduleLoading && !headerSchedule ? (
                    <div className="flex min-h-24 items-center">
                        <PremiumInlineLoader size="sm" />
                    </div>
                ) : (
                    <section className="schedules-hero animate-schedules-header rounded-[1.85rem] px-5 py-7 sm:px-8 sm:py-9">
                        <div className="relative mb-5 flex items-center gap-1.5" aria-hidden>
                            <span className="schedules-beat-dot" />
                            <span className="schedules-beat-dot" />
                            <span className="schedules-beat-dot" />
                        </div>
                        <div className="relative flex items-start gap-5 sm:gap-8">
                            <div className="animate-schedules-mark shrink-0 leading-none">
                                <p className="text-[4.25rem] font-semibold tracking-[-0.07em] text-zinc-900 dark:text-white sm:text-[5.25rem]">
                                    {intervalDays || "—"}
                                </p>
                                {intervalDays ? (
                                    <p className="mt-1 text-[13px] font-medium text-[#0A8AA8] dark:text-[#7AD4EA]">
                                        {t("customBasket.daysUnit")}
                                    </p>
                                ) : null}
                            </div>
                            <div className="animate-schedules-copy min-w-0 pt-1 sm:pt-2">
                                <p className="text-[12px] font-semibold text-[#0A8AA8] dark:text-[#7AD4EA]">
                                    {t("customBasket.heroKicker")}
                                </p>
                                <h1 className="mt-1.5 text-[1.45rem] font-semibold tracking-[-0.04em] text-zinc-900 dark:text-white sm:text-[2.05rem] sm:leading-[1.15]">
                                    {t("customBasket.heroTitle", {
                                        name:
                                            heroIntervalName(
                                                headerSchedule?.name ?? "",
                                                intervalDays,
                                                t,
                                            ) || scheduleName,
                                    })}
                                </h1>
                                <p className="mt-3 max-w-xl text-[0.95rem] leading-[1.7] text-slate-500 dark:text-zinc-400 sm:text-[1.02rem]">
                                    {heroDescription}
                                </p>
                                {headerSchedule?.discount_type === "percentage" &&
                                (headerSchedule.discount_value ?? 0) > 0 ? (
                                    <span className="animate-schedules-chip mt-4 inline-flex rounded-full bg-red-50 px-3 py-1 text-[13px] font-semibold text-red-600 dark:bg-red-500/15 dark:text-red-400">
                                        {t("customBasket.percentageOff", {
                                            value: headerSchedule.discount_value,
                                        })}
                                    </span>
                                ) : headerSchedule?.discount_type === "fixed" &&
                                  (headerSchedule.discount_value ?? 0) > 0 ? (
                                    <span className="animate-schedules-chip mt-4 inline-flex rounded-full bg-red-50 px-3 py-1 text-[13px] font-semibold text-red-600 dark:bg-red-500/15 dark:text-red-400">
                                        {t("customBasket.fixedOff", {
                                            value: headerSchedule.discount_value,
                                        })}
                                    </span>
                                ) : null}
                            </div>
                            {headerImage ? (
                                <div className="animate-schedules-chip ms-auto hidden h-[6.25rem] w-[6.25rem] shrink-0 overflow-hidden rounded-full ring-2 ring-white shadow-[0_12px_28px_-16px_rgba(28,25,23,0.16)] sm:block">
                                    <img
                                        src={headerImage}
                                        alt=""
                                        className="h-full w-full object-cover"
                                    />
                                </div>
                            ) : null}
                        </div>
                    </section>
                )}

                {(categories.length > 0 || brands.length > 0) && (
                    <RevealOnScroll className="space-y-4 sm:space-y-5">
                        {categories.length > 0 && (
                            <section className="rounded-[1.5rem] border border-stone-200/80 bg-white/80 px-4 py-5 shadow-[0_4px_16px_-12px_rgba(28,25,23,0.12)] dark:border-white/10 dark:bg-zinc-900/70 sm:px-5 sm:py-6">
                                <SectionLabel>{t("customBasket.categories")}</SectionLabel>
                                <div className="schedules-stagger -mx-1 flex gap-1 overflow-x-auto px-1 pb-1 scrollbar-custom">
                                    <div className={cn("shrink-0", CATEGORY_CIRCLE_ITEM_WIDTH.md)}>
                                        <button
                                            type="button"
                                            onClick={() => setCategoryId(undefined)}
                                            className="group flex w-full flex-col items-center gap-2.5 bg-transparent outline-none"
                                        >
                                            <span
                                                className={cn(
                                                    "flex h-16 w-16 items-center justify-center rounded-full ring-1 transition sm:h-[4.5rem] sm:w-[4.5rem] md:h-24 md:w-24",
                                                    categoryId == null
                                                        ? "bg-[#00AED1] text-white ring-[#00AED1] shadow-[0_10px_24px_-12px_rgba(0,174,209,0.55)]"
                                                        : "bg-zinc-100 text-slate-500 ring-slate-200 group-hover:ring-primary dark:bg-zinc-800 dark:text-zinc-300 dark:ring-white/10",
                                                )}
                                            >
                                                <HiViewGrid className="h-7 w-7 md:h-8 md:w-8" />
                                            </span>
                                            <span
                                                className={cn(
                                                    "line-clamp-2 text-center text-[13px] leading-snug",
                                                    categoryId == null
                                                        ? "font-semibold text-zinc-900 dark:text-white"
                                                        : "font-medium text-zinc-500 dark:text-zinc-400",
                                                )}
                                            >
                                                {t("customBasket.allCategories")}
                                            </span>
                                        </button>
                                    </div>
                                    {categories.map((cat) => (
                                        <div
                                            key={cat.id}
                                            className={cn("shrink-0", CATEGORY_CIRCLE_ITEM_WIDTH.md)}
                                        >
                                            <CategoryCircle
                                                name={cat.name}
                                                icon={cat.icon}
                                                mainColor={cat.main_color ?? cat.mainColor}
                                                secondColor={cat.second_color ?? cat.secondColor}
                                                size="md"
                                                selected={categoryId === cat.id}
                                                onClick={() =>
                                                    setCategoryId((prev) =>
                                                        prev === cat.id ? undefined : cat.id,
                                                    )
                                                }
                                            />
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {brands.length > 0 && (
                            <section className="rounded-[1.5rem] border border-stone-200/80 bg-white/80 px-4 py-5 shadow-[0_4px_16px_-12px_rgba(28,25,23,0.12)] dark:border-white/10 dark:bg-zinc-900/70 sm:px-5 sm:py-6">
                                <SectionLabel delayMs={120}>{t("customBasket.brands")}</SectionLabel>
                                <div className="schedules-stagger -mx-1 flex gap-3 overflow-x-auto px-1 pb-1 scrollbar-custom sm:gap-4">
                                    {brands.map((brand) => {
                                        const active = brandId === brand.id;
                                        return (
                                            <button
                                                key={brand.id}
                                                type="button"
                                                onClick={() =>
                                                    setBrandId((prev) =>
                                                        prev === brand.id ? undefined : brand.id,
                                                    )
                                                }
                                                className="group flex w-[5.25rem] shrink-0 flex-col items-center gap-2 sm:w-24 md:w-28"
                                            >
                                                <span
                                                    className={cn(
                                                        "flex h-16 w-16 items-center justify-center overflow-hidden rounded-full bg-zinc-100 ring-1 transition sm:h-[4.5rem] sm:w-[4.5rem] md:h-24 md:w-24",
                                                        active
                                                            ? "bg-white ring-2 ring-[#00AED1] shadow-[0_10px_24px_-12px_rgba(0,174,209,0.55)]"
                                                            : "ring-slate-200/80 group-hover:ring-primary dark:bg-zinc-800 dark:ring-white/10",
                                                    )}
                                                >
                                                    {brand.image ? (
                                                        <img
                                                            src={brand.image}
                                                            alt={brand.name}
                                                            className="h-full w-full object-contain p-2.5 md:p-3"
                                                        />
                                                    ) : (
                                                        <span className="text-lg font-semibold text-[#00AED1] md:text-xl">
                                                            {getCategoryInitials(brand.name) ||
                                                                brand.name.slice(0, 1)}
                                                        </span>
                                                    )}
                                                </span>
                                                <span
                                                    className={cn(
                                                        "line-clamp-2 text-center text-[13px] leading-snug",
                                                        active
                                                            ? "font-bold text-zinc-900 dark:text-white"
                                                            : "font-medium text-zinc-500 dark:text-zinc-400",
                                                    )}
                                                >
                                                    {brand.name}
                                                </span>
                                            </button>
                                        );
                                    })}
                                </div>
                            </section>
                        )}
                    </RevealOnScroll>
                )}

                <RevealOnScroll delayMs={80}>
                <section className="border-t border-stone-200/80 pt-8 dark:border-white/10 sm:pt-10">
                <div className="mb-5 flex items-end justify-between gap-3">
                    <p className="text-[13px] text-zinc-500 dark:text-zinc-400">
                        {productsLoading && products.length === 0
                            ? t("common.loading")
                            : t("customBasket.pickProductsHint", {
                                  count: totalCount || products.length,
                              })}
                        {selectedBrand ? ` · ${selectedBrand.name}` : ""}
                    </p>
                    {hasFilters && (
                        <button
                            type="button"
                            onClick={clearFilters}
                            className="inline-flex shrink-0 items-center gap-1 text-[13px] font-medium text-zinc-500 transition hover:text-[#00AED1] dark:text-zinc-400"
                        >
                            <HiX className="h-3.5 w-3.5" />
                            {t("customBasket.clearFilters")}
                        </button>
                    )}
                </div>

                {productsLoading && products.length === 0 ? (
                    <div className="schedules-stagger grid grid-cols-2 items-start gap-x-3 gap-y-6 sm:grid-cols-3 sm:gap-x-5 sm:gap-y-8 lg:grid-cols-4">
                        {Array.from({ length: 8 }).map((_, i) => (
                            <ScheduleProductTileSkeleton key={i} />
                        ))}
                    </div>
                ) : products.length > 0 ? (
                    <>
                        <div className="schedules-stagger grid grid-cols-2 items-start gap-x-3 gap-y-6 sm:grid-cols-3 sm:gap-x-5 sm:gap-y-8 lg:grid-cols-4">
                            {products.map((product) => (
                                <ScheduleProductTile
                                    key={product.id}
                                    product={product}
                                    onAdd={() => handleProductClick(product)}
                                />
                            ))}
                        </div>
                        {isFetchingNextPage && (
                            <div className="mt-3 grid grid-cols-2 items-start gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
                                {Array.from({ length: 4 }).map((_, i) => (
                                    <ScheduleProductTileSkeleton key={`more-${i}`} />
                                ))}
                            </div>
                        )}
                        {hasNextPage && (
                            <div ref={observerTarget} className="h-20 w-full" />
                        )}
                    </>
                ) : (
                    <div className="py-12 text-center">
                        <p className="text-slate-500">
                            {t("customBasket.emptyProducts")}
                        </p>
                        {hasFilters && (
                            <Button
                                type="button"
                                variant="outline"
                                className="mt-4 !border-slate-300 !text-zinc-800"
                                onClick={clearFilters}
                            >
                                {t("customBasket.clearFilters")}
                            </Button>
                        )}
                    </div>
                )}
                </section>
                </RevealOnScroll>
            </div>

            <div className="fixed inset-x-0 bottom-0 z-40 border-t border-zinc-200 bg-white/95 px-3 pt-3 backdrop-blur-md dark:border-white/10 dark:bg-zinc-950/95 sm:hidden pb-[max(0.75rem,env(safe-area-inset-bottom))]">
                <Button
                    type="button"
                    variant="primary"
                    fullWidth
                    onClick={handleViewBasket}
                    className="h-12 rounded-full !bg-zinc-900 hover:!bg-primary hover:!opacity-100 dark:!bg-white dark:!text-zinc-900"
                    leftIcon={<HiShoppingBag className="h-5 w-5" />}
                >
                    {t("customBasket.viewBasket")}
                    {itemCount > 0
                        ? ` · ${t("customBasket.itemsCount", { count: itemCount })}`
                        : ""}
                    {custom.basket.summary.final_price_formatted
                        ? ` · ${custom.basket.summary.final_price_formatted}`
                        : ""}
                </Button>
            </div>

            <AddToCustomBasketPopup
                isOpen={pickProduct != null}
                onClose={() => setPickProduct(null)}
                product={pickProduct}
                addMutation={custom.addItem}
            />

            <CustomBasketPanel
                isOpen={basketOpen}
                onClose={() => setBasketOpen(false)}
                basket={custom.basket}
                isLoading={custom.isLoading}
                updateItem={custom.updateItem}
                deleteItem={custom.deleteItem}
                onConfirm={() => {
                    if (custom.basket.items.length === 0) return;
                    setBasketOpen(false);
                    setConfirmOpen(true);
                }}
            />

            <ConfirmCustomBasketPopup
                isOpen={confirmOpen}
                onClose={() => setConfirmOpen(false)}
                schedule={headerSchedule ?? null}
                isPending={custom.confirm.isPending}
                onYes={(startDate) => {
                    const snapshot = custom.basket.items;
                    custom.confirm.mutate(
                        { confirm_schedule: true, start_date: startDate },
                        {
                            onSuccess: (res) =>
                                finishConfirm(res.cart_items, snapshot),
                        },
                    );
                }}
                onNo={() => {
                    const snapshot = custom.basket.items;
                    custom.confirm.mutate(
                        { confirm_schedule: false },
                        {
                            onSuccess: (res) =>
                                finishConfirm(res.cart_items, snapshot),
                        },
                    );
                }}
            />
        </div>
    );
}

function SectionLabel({
    children,
    delayMs = 0,
}: {
    children: ReactNode;
    delayMs?: number;
}) {
    return (
        <div
            className="animate-schedules-title mb-5 flex items-center gap-2.5"
            style={{ animationDelay: `${delayMs}ms` }}
        >
            <span
                className="animate-schedules-title-bar h-4 w-0.5 shrink-0 rounded-full bg-orange-400"
                style={{ animationDelay: `${delayMs + 80}ms` }}
                aria-hidden
            />
            <p className="text-sm font-semibold tracking-tight text-zinc-800 dark:text-white">
                {children}
            </p>
        </div>
    );
}
