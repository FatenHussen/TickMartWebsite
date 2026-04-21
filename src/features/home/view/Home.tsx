import { useState, useEffect } from "react";
import { useLanguage } from "@/context/LanguageContext";
import Categories from "../components/Categories";
import InfoCards from "../components/InfoCards";
import AllProductsSection from "../components/AllProductsSection";
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

    const heroBannerSection = beforeSections.find((s) => s.display_type_id === 1);
    const beforeSectionsFiltered = heroBannerSection
        ? beforeSections.filter((s) => s.id !== heroBannerSection.id)
        : beforeSections;

    return (
        <div
            className="min-h-screen bg-[#FFF9F5] dark:bg-custom-primary"
            dir={isRTL ? "rtl" : "ltr"}
        >
            {/* One `.page-container` for the whole home column (matches Navbar width). */}
            <div className="page-container flex flex-col gap-8 pb-12 pt-4 sm:gap-10 sm:pt-6">
                {/* <PromotionalHeroSlider
 items={heroItems}
 getLink={heroBannerSection ? undefined : getHeroLink}
 onItemClick={
 heroBannerSection ? handleHeroItemClick : handleDefaultHeroClick
 }
 /> */}
                <InfoCards />

                {beforeSectionsFiltered.length > 0 && (
                    <ApiSectionsRenderer
                        sections={beforeSectionsFiltered}
                        edgeToEdgeSectionBackgrounds={false}
                        skipInnerPageContainer
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
