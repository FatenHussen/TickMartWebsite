import { useLanguage } from "@/context/LanguageContext";
import Categories from "../components/Categories";
import InfoCards from "../components/InfoCards";
import AllProductsSection from "../components/AllProductsSection";
import FullBleedSection from "@/shared/component/FullBleedSection";
import ApiSectionsRenderer from "@/shared/component/sections/ApiSectionsRenderer";
import { useSectionsByPosition } from "../hooks/useSections";

export default function Home() {
  const { isRTL } = useLanguage();
  const { beforeSections, afterSections } = useSectionsByPosition("home");

  const heroBannerSection = beforeSections.find((s) => s.display_type_id === 1);
  const beforeSectionsFiltered = heroBannerSection
    ? beforeSections.filter((s) => s.id !== heroBannerSection.id)
    : beforeSections;

  return (
    <div className="min-h-screen bg-custom-primary" dir={isRTL ? "rtl" : "ltr"}>
      <div className="page-container">
        {/* <PromotionalHeroSlider
          items={heroItems}
          getLink={heroBannerSection ? undefined : getHeroLink}
          onItemClick={
            heroBannerSection ? handleHeroItemClick : handleDefaultHeroClick
          }
        /> */}
        <InfoCards />
      </div>

      {/* Sections before Categories */}
      {beforeSectionsFiltered.length > 0 && (
        <FullBleedSection>
          <ApiSectionsRenderer sections={beforeSectionsFiltered} />
        </FullBleedSection>
      )}

      <FullBleedSection>
        <Categories />
      </FullBleedSection>

      {/* Sections after Categories */}
      {afterSections.length > 0 && (
        <FullBleedSection>
          <ApiSectionsRenderer sections={afterSections} />
        </FullBleedSection>
      )}

      {/* All Products Section */}
      <AllProductsSection />
    </div>
  );
}
