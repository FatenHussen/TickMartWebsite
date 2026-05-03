import { useState, useEffect, useMemo } from "react";
import { useLanguage } from "@/context/LanguageContext";
import Categories from "../components/Categories";
import InfoCards from "../components/InfoCards";
import AllProductsSection from "../components/AllProductsSection";
import HomeFlashSaleBanner from "../components/HomeFlashSaleBanner";
import ApiSectionsRenderer from "@/shared/component/sections/ApiSectionsRenderer";
import { useSectionsByPosition } from "../hooks/useSections";
import { useAuthStore } from "@/store/auth";
import { usePackages } from "@/features/account/hooks/usePackages";
import AffiliatePackagesPopup from "@/components/AffiliatePackagesPopup";
import { useTheme } from "@/context/ThemeContext";
import { getHomeRootSurfaceStyle } from "../lib/homeRootSurface";
import { homeStaticSectionRowSurface } from "../lib/homeStaticSectionSurface";

const HAS_SEEN_POPUP_KEY = "hasSeenAffiliatePopup";

export default function Home() {
    const { isRTL } = useLanguage();
    const { theme } = useTheme();
    const isDarkTheme = theme === "dark";
    const { beforeSections, afterSections } = useSectionsByPosition("home");
    const authenticated = useAuthStore((s) => s.authenticated);
    const { data: packages = [], isLoading: packagesLoading } = usePackages(
        authenticated
    );
    const [showPackagesPopup, setShowPackagesPopup] = useState(false);

    useEffect(() => {
        if (!authenticated) return;
        const hasSeen = localStorage.getItem(HAS_SEEN_POPUP_KEY);
        if (!hasSeen) {
            setShowPackagesPopup(true);
        }
    }, [authenticated]);

    const handleClosePackagesPopup = () => {
        setShowPackagesPopup(false);
        localStorage.setItem(HAS_SEEN_POPUP_KEY, "true");
    };

    const homeFlashSale = useMemo(() => {
        const firstFlashSection = [...beforeSections, ...afterSections].find(
            (section) =>
                typeof section.end_date === "string" &&
                section.end_date.trim().length > 0 &&
                Number.isFinite(Date.parse(section.end_date))
        );

        if (!firstFlashSection?.end_date) return null;

        return {
            endDate: firstFlashSection.end_date,
            title: firstFlashSection.name,
            mainColor:
                firstFlashSection.main_color ??
                firstFlashSection.background_color ??
                "#ef4444",
            secondColor: firstFlashSection.second_color ?? "#f59e0b",
            textColor: firstFlashSection.text_color ?? "#ffffff",
            seeMore: firstFlashSection.see_more,
        };
    }, [beforeSections, afterSections]);

    /** Same full-bleed band as InfoCards / API sliders (`getDarkSectionBackground` in dark). */
    const homeSectionBandSurface = useMemo(
        () => homeStaticSectionRowSurface(isDarkTheme, undefined),
        [isDarkTheme]
    );

    return (
        <div
            className="min-h-screen overflow-x-clip"
            style={getHomeRootSurfaceStyle(isDarkTheme)}
            dir={isRTL ? "rtl" : "ltr"}
        >
            {/* One `.page-container` for the whole home column (matches Navbar width). */}
            <div className="page-container flex flex-col gap-0 pb-12 pt-4  sm:pt-6">
                {/* <PromotionalHeroSlider
 items={heroItems}
 getLink={heroBannerSection ? undefined : getHeroLink}
 onItemClick={
 heroBannerSection ? handleHeroItemClick : handleDefaultHeroClick
 }
 /> */}
                <InfoCards />

                {homeFlashSale && (
                    <section
                        className={homeSectionBandSurface.className}
                        style={homeSectionBandSurface.style}
                    >
                        <div className="page-container min-w-0">
                            <HomeFlashSaleBanner
                                flashSale={homeFlashSale}
                                isRTL={isRTL}
                            />
                        </div>
                    </section>
                )}

                {beforeSections.length > 0 && (
                    <section
                        className={homeSectionBandSurface.className}
                        style={homeSectionBandSurface.style}
                    >
                        <div className="page-container min-w-0">
                            <ApiSectionsRenderer
                                sections={beforeSections}
                                edgeToEdgeSectionBackgrounds={false}
                                skipInnerPageContainer
                                sectionClassName="!mt-0"
                                removeSectionVerticalSpacing
                            />
                        </div>
                    </section>
                )}

                <div className="min-w-0">
                    <Categories />
                </div>

                {afterSections.length > 0 && (
                    <section
                        className={homeSectionBandSurface.className}
                        style={homeSectionBandSurface.style}
                    >
                        <div className="page-container min-w-0">
                            <ApiSectionsRenderer
                                sections={afterSections}
                                edgeToEdgeSectionBackgrounds={false}
                                skipInnerPageContainer
                                sectionClassName="!mt-0"
                                removeSectionVerticalSpacing
                            />
                        </div>
                    </section>
                )}

                <AllProductsSection disablePageContainer />
            </div>

            <AffiliatePackagesPopup
                isOpen={showPackagesPopup}
                onClose={handleClosePackagesPopup}
                packages={packages}
                isLoading={packagesLoading}
            />
        </div>
    );
}
