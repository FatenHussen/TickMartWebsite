import { useLanguage } from "@/context/LanguageContext";
import { StoreDetailsCard, PromotionalBanner } from "../components";
import {
  NewArrivalsSlider,
  TopRatedSlider,
} from "@/shared/component/slider/presets";
import CategoryStore from "../components/CategoryStore";
import { store } from "../data/mockData";
import FullBleedSection from "@/shared/component/FullBleedSection";

export default function StoreDetails() {
  const { isRTL } = useLanguage();

  return (
    <div className="min-h-screen bg-custom-primary" dir={isRTL ? "rtl" : "ltr"}>
      <div className="page-container py-6">
        <StoreDetailsCard store={store} />

        <CategoryStore />

        {/* Promotional Banner */}
        <div className="mt-8">
          <PromotionalBanner illustrationImage="https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=600&q=80" />
        </div>
      </div>

      {/* New Arrivals Section */}
      <FullBleedSection>
        <NewArrivalsSlider />
      </FullBleedSection>

      {/* Top Rated Section */}
      <FullBleedSection>
        <TopRatedSlider />
      </FullBleedSection>
    </div>
  );
}
