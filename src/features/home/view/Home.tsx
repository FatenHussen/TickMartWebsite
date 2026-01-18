import { useLanguage } from "@/context/LanguageContext";
import HeroSlider from "../components/HeroSlider";
import Categories from "../components/Categories";
import InfoCards from "../components/InfoCards";
import FullBleedSection from "@/shared/component/FullBleedSection";
import SectionsRenderer from "@/shared/component/sections/SectionsRenderer";
import { homeSections } from "../sections/home.sections.mock";

export default function Home() {
  const { isRTL } = useLanguage();

  return (
    <div className="min-h-screen bg-custom-primary" dir={isRTL ? "rtl" : "ltr"}>
      <div className="page-container">
        <HeroSlider />
        <InfoCards />
      </div>

      <FullBleedSection>
        <Categories />
      </FullBleedSection>

      <FullBleedSection>
        <SectionsRenderer sections={homeSections} />
      </FullBleedSection>
    </div>
  );
}
