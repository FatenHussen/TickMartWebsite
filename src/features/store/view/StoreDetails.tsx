import { useTranslation } from "react-i18next";
import { useLanguage } from "@/context/LanguageContext";
import { StoreDetailsCard } from "../components";
import PromotionalHeroSlider from "@/shared/component/banner/PromotionalHeroSlider";
import {
  NewArrivalsSlider,
  TopRatedSlider,
} from "@/shared/component/slider/presets";
import CategoryStore from "../components/CategoryStore";
import { store } from "../data/mockData";
import FullBleedSection from "@/shared/component/FullBleedSection";

export default function StoreDetails() {
  const { t } = useTranslation();
  const { isRTL } = useLanguage();

  const storeBannerItems = [
    {
      id: 1,
      title: t("store.promotionalBanner.title"),
      desc: t("store.promotionalBanner.description"),
      image: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=600&q=80",
      price: null,
      discount: null,
      top_badges: [],
      bottom_badges: [],
    },
  ];

  return (
    <div className="min-h-screen bg-custom-primary" dir={isRTL ? "rtl" : "ltr"}>
      <div className="page-container py-6">
        <StoreDetailsCard store={store} />

        <CategoryStore />

        {/* Promotional Banner */}
        <PromotionalHeroSlider items={storeBannerItems} />
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
