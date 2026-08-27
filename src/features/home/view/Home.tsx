import { useState, useEffect, useMemo } from "react";
import { useLanguage } from "@/context/LanguageContext";
import Categories from "../components/Categories";
import InfoCards from "../components/InfoCards";
import QuickOrderHomeBanner from "../components/QuickOrderHomeBanner";
import AllProductsSection from "../components/AllProductsSection";
import ApiSectionsRenderer from "@/shared/component/sections/ApiSectionsRenderer";
import { useSectionsByPosition } from "../hooks/useSections";
import { useAuthStore } from "@/store/auth";
import { usePackages } from "@/features/account/hooks/usePackages";
import AffiliatePackagesPopup from "@/components/AffiliatePackagesPopup";
import { useTheme } from "@/context/ThemeContext";
import { getHomeRootSurfaceStyle } from "../lib/homeRootSurface";
import { homeStaticSectionRowSurface } from "../lib/homeStaticSectionSurface";
import { ScreenPromotions } from "@/features/promotions";

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
                <QuickOrderHomeBanner pageSlug="home" />

                <InfoCards />

                <ScreenPromotions pageSlug="home" placement="top" />

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
                    {/* Bottom padding is the seam with the next API row: with `pb-0`
                        the category labels sat ~10px above the tinted band edge. */}
                    <Categories sectionPaddingClass="pt-4 pb-6 sm:pt-5 sm:pb-8" />
                </div>

                <ScreenPromotions pageSlug="home" placement="bottom" />

                {afterSections.length > 0 && (
                    <section
                        className={`${homeSectionBandSurface.className} !pt-0`}
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
