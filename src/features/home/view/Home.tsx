import { useLanguage } from "@/context/LanguageContext";
import HeroSlider from "../components/HeroSlider";
import Categories from "../components/Categories";
import InfoCards from "../components/InfoCards";
import FullBleedSection from "@/shared/component/FullBleedSection";
import ApiSectionsRenderer from "@/shared/component/sections/ApiSectionsRenderer";
import { useSectionsByPosition } from "../hooks/useSections";

export default function Home() {
  const { isRTL } = useLanguage();
  const { beforeSections, afterSections } = useSectionsByPosition("home");

  return (
    <div className="min-h-screen bg-custom-primary" dir={isRTL ? "rtl" : "ltr"}>
      <div className="page-container">
        <HeroSlider />
        <InfoCards />
      </div>

      {/* Sections before Categories */}
      {beforeSections.length > 0 && (
        <FullBleedSection>
          <ApiSectionsRenderer sections={beforeSections} />
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
    </div>
  );
}
