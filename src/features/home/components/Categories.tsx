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
import CategoryCircle from "@/shared/component/category/CategoryCircle";
import { readCategoryColor } from "@/shared/lib/categoryColors";

export type CategoriesProps = {
    /** Overrides row vertical padding (e.g. `pb-0` when promotions sit flush underneath). */
    sectionPaddingClass?: string;
};

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
                    renderItem={(category) => (
                        <CategoryCircle
                            name={category.name}
                            icon={category.icon}
                            mainColor={readCategoryColor(category, "main")}
                            secondColor={readCategoryColor(category, "second")}
                            size="lg"
                            hasChildren={(category.children?.length ?? 0) > 0}
                            onClick={() =>
                                navigate(`${paths.client.categories}?category=${category.id}`)
                            }
                        />
                    )}
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
