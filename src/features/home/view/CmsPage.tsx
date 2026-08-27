import { useMemo } from "react";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useLanguage } from "@/context/LanguageContext";
import { useTheme } from "@/context/ThemeContext";
import { useSections } from "@/features/home/hooks/useSections";
import ApiSectionsRenderer from "@/shared/component/sections/ApiSectionsRenderer";
import QuickOrderHomeBanner from "@/features/home/components/QuickOrderHomeBanner";
import { resolveLocalizedText } from "@/shared/lib/localizedText";
import { getHomeRootSurfaceStyle } from "@/features/home/lib/homeRootSurface";
import type { Section } from "@/features/home/types";
import { cn } from "@/shared/lib/utils";

/**
 * CMS / Page Builder page: `GET /user/sections?page_slug={slug}`.
 * Same section renderer as home and category pages.
 */
export default function CmsPage() {
    const { slug = "" } = useParams<{ slug: string }>();
    const { t } = useTranslation();
    const { language, isRTL } = useLanguage();
    const { theme } = useTheme();
    const isDarkTheme = theme === "dark";

    const { data: sections = [], isLoading, isError } = useSections(slug);

    const sortedSections = useMemo(
        () =>
            [...sections]
                .filter((s) => Array.isArray(s.items) && s.items.length > 0)
                .sort((a, b) => a.order - b.order),
        [sections],
    );

    const pageTitle = useMemo(() => {
        const named = sortedSections.find((s) => {
            const n = resolveLocalizedText(s.name as unknown as string, language);
            return n.trim().length > 0;
        });
        if (!named) return slug;
        return resolveLocalizedText(named.name as unknown as string, language) || slug;
    }, [sortedSections, language, slug]);

    return (
        <div
            className={cn("min-h-screen", !isDarkTheme && "bg-custom-light")}
            style={getHomeRootSurfaceStyle(isDarkTheme)}
            dir={isRTL ? "rtl" : "ltr"}
        >
            <div className="page-container pb-12 pt-6 sm:pt-8">
                {slug ? <QuickOrderHomeBanner pageSlug={slug} /> : null}

                <header className="mb-6 sm:mb-8">
                    <h1 className="text-2xl font-extrabold tracking-tight text-custom-primary sm:text-3xl">
                        {pageTitle}
                    </h1>
                </header>

                {isLoading && (
                    <p className="text-sm text-custom-secondary">{t("common.loading")}</p>
                )}

                {isError && (
                    <p className="text-sm text-red-600">
                        {t("errors.pageLoadFailed")}
                    </p>
                )}

                {!isLoading && !isError && sortedSections.length === 0 && (
                    <p className="text-sm text-custom-secondary">
                        {t("errors.pageLoadFailed")}
                    </p>
                )}

                {sortedSections.length > 0 && (
                    <ApiSectionsRenderer
                        sections={sortedSections as Section[]}
                        skipInnerPageContainer
                        sectionClassName="!mt-0"
                    />
                )}
            </div>
        </div>
    );
}
