import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import SliderSection from "@/shared/component/SliderSection";
import { useHomeCategories } from "../hooks/useCategories";
import { paths } from "@/app/routes/path/paths";
import { useSections } from "../hooks/useSections";
import { useTheme } from "@/context/ThemeContext";
import {
    homeStaticSectionRowSurface,
    pickHomeSectionBySeeMorePageSlug,
} from "../lib/homeStaticSectionSurface";
import { PremiumInlineLoader } from "@/shared/component/loading";
import { getSectionCardSurfaceColor } from "@/shared/component/sections/sectionCardVariant";
import type { Category } from "../types";

export type CategoriesProps = {
    /** Overrides row vertical padding (e.g. `pb-0` when promotions sit flush underneath). */
    sectionPaddingClass?: string;
};

const PLACEHOLDER_ICON =
    "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=400&fit=crop";

function readCategoryListColor(
    category: Category & Record<string, unknown>,
    key: "main" | "second"
): string | undefined {
    const keys =
        key === "main"
            ? ["main_color", "mainColor", "color_main"]
            : ["second_color", "secondColor", "color_second", "secondary_color"];
    for (const candidate of keys) {
        const value = category[candidate];
        if (typeof value === "string" && value.trim()) return value.trim();
    }
    return undefined;
}

export default function Categories({
    sectionPaddingClass,
}: CategoriesProps = {}) {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { theme } = useTheme();
    const isDarkTheme = theme === "dark";
    const { data: homeSections } = useSections("home");
    const headlineSection = useMemo(
        () => pickHomeSectionBySeeMorePageSlug(homeSections, "categories"),
        [homeSections]
    );
    const { className: rowClassName, style: rowStyle } = useMemo(
        () =>
            homeStaticSectionRowSurface(
                isDarkTheme,
                headlineSection?.background_color,
                sectionPaddingClass
                    ? { paddingClass: sectionPaddingClass }
                    : undefined
            ),
        [isDarkTheme, headlineSection?.background_color, sectionPaddingClass]
    );

    const sectionTitle =
        headlineSection?.name?.trim() || t("home.categories");

    const { titleMainColor, titleSecondColor } = useMemo(() => {
        if (isDarkTheme || !headlineSection) {
            return { titleMainColor: null as string | null, titleSecondColor: null as string | null };
        }
        const main =
            headlineSection.main_color?.trim() ||
            headlineSection.background_color?.trim() ||
            null;
        const second =
            headlineSection.second_color?.trim() ||
            getSectionCardSurfaceColor(headlineSection)?.trim() ||
            null;
        return { titleMainColor: main, titleSecondColor: second };
    }, [isDarkTheme, headlineSection]);

    const { categories, isLoading } = useHomeCategories();

    const handleViewAll = () => {
        navigate(paths.client.categories);
    };

    if (isLoading) {
        return (
            <section className={rowClassName} style={rowStyle}>
                <div className="page-container flex min-h-[120px] justify-center py-8">
                    <PremiumInlineLoader size="sm" />
                </div>
            </section>
        );
    }

    if (categories.length === 0) {
        return null;
    }

    return (
        <section className={rowClassName} style={rowStyle}>
            <div className="page-container min-w-0">
                <SliderSection
                    title={sectionTitle}
                    titleMainColor={titleMainColor}
                    titleSecondColor={titleSecondColor}
                    viewAllLabel={t("home.viewAll")}
                    onViewAllClick={handleViewAll}
                    viewAllButtonClassName="dark:text-white dark:hover:bg-transparent dark:hover:text-white/90"
                    slidesPerView={3.5}
                    items={categories}
                    removeVerticalSpacing
                    renderItem={(category) => {
                        const cat = category as Category & Record<string, unknown>;
                        const cMain = readCategoryListColor(cat, "main");
                        const cSecond = readCategoryListColor(cat, "second");
                        const labelGradient =
                            !isDarkTheme && cMain && cSecond
                                ? `linear-gradient(100deg, ${cMain}, ${cSecond})`
                                : null;
                        const labelSolid =
                            !isDarkTheme && !labelGradient && (cMain || cSecond)
                                ? (cMain ?? cSecond)
                                : undefined;

                        return (
                            <button
                                type="button"
                                className="group flex w-full flex-col items-center gap-3 bg-transparent"
                                onClick={() =>
                                    navigate(`${paths.client.categories}?category=${category.id}`)
                                }
                            >
                                {/* Circle image with dark hover glow */}
                                <div className="relative">
                                    {/* Ambient glow ring on hover — dark only */}
                                    <div
                                        className="absolute -inset-1 rounded-full opacity-0 transition-opacity duration-300 dark:group-hover:opacity-100"
                                        style={{
                                            background:
                                                "radial-gradient(circle, color-mix(in srgb, var(--color-main) 40%, transparent) 0%, transparent 70%)",
                                            filter: "blur(6px)",
                                        }}
                                    />
                                    <div className="relative h-20 w-20 overflow-hidden rounded-full ring-1 ring-transparent transition-all duration-300 dark:ring-white/[0.08] dark:group-hover:ring-white/[0.14] dark:group-hover:shadow-[0_0_22px_-6px_color-mix(in_srgb,var(--color-main)_45%,transparent)] sm:h-24 sm:w-24 md:h-32 md:w-32">
                                        <img
                                            src={category.icon || PLACEHOLDER_ICON}
                                            alt={category.name}
                                            className="h-full w-full object-cover transition-transform duration-400 ease-out group-hover:scale-105"
                                        />
                                    </div>
                                </div>

                                {/* Label */}
                                <span
                                    className={
                                        labelGradient
                                            ? "max-w-full text-center text-sm font-semibold bg-clip-text text-transparent"
                                            : "max-w-full text-center text-sm font-semibold text-stone-800 transition-colors duration-300 dark:text-[#A1A1AA] dark:group-hover:text-white"
                                    }
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
                                    {category.name}
                                </span>
                            </button>
                        );
                    }}
                    breakpoints={{
                        640: { slidesPerView: 3.5 },
                        768: { slidesPerView: 4.5 },
                        1024: { slidesPerView: 6 },
                        1280: { slidesPerView: 7 },
                    }}
                />
            </div>
        </section>
    );
}
