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

const HAS_SEEN_POPUP_KEY = "hasSeenAffiliatePopup";

export default function Home() {
    const { isRTL } = useLanguage();
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

    return (
        <div
            className="min-h-screen overflow-x-clip bg-[#FFF9F5] dark:bg-custom-primary"
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
                    <HomeFlashSaleBanner flashSale={homeFlashSale} isRTL={isRTL} />
                )}

                {beforeSections.length > 0 && (
                    <ApiSectionsRenderer
                        sections={beforeSections}
                        edgeToEdgeSectionBackgrounds={false}
                        skipInnerPageContainer
                        sectionClassName="!mt-0"
                        removeSectionVerticalSpacing
                    />
                )}

                <div className="min-w-0 py-1">
                    <Categories />
                </div>

                {afterSections.length > 0 && (
                    <ApiSectionsRenderer
                        sections={afterSections}
                        edgeToEdgeSectionBackgrounds={false}
                        skipInnerPageContainer
                        sectionClassName="!mt-0"
                        removeSectionVerticalSpacing
                    />
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
