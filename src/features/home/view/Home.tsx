import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/context/LanguageContext";
import PromotionalHeroSlider from "@/shared/component/banner/PromotionalHeroSlider";
import Categories from "../components/Categories";
import InfoCards from "../components/InfoCards";
import AllProductsSection from "../components/AllProductsSection";
import FullBleedSection from "@/shared/component/FullBleedSection";
import ApiSectionsRenderer from "@/shared/component/sections/ApiSectionsRenderer";
import { useSectionsByPosition } from "../hooks/useSections";
import { mapActionPageSlugToRoute } from "@/utils/routeMapper";

import testHeroImage from "@/assets/images/testHero.png";

const defaultHeroItems = [
  {
    id: 1,
    title: "Fresh Groceries Delivered",
    desc: "in 30 Minutes",
    image: testHeroImage,
    price: null,
    discount: null,
    top_badges: [],
    bottom_badges: [],
  },
  {
    id: 2,
    title: "Order from Local Stores",
    desc: "Get It Delivered",
    image: testHeroImage,
    price: null,
    discount: null,
    top_badges: [],
    bottom_badges: [],
  },
];

export default function Home() {
  const navigate = useNavigate();
  const { isRTL } = useLanguage();
  const { beforeSections, afterSections } = useSectionsByPosition("home");

  const heroBannerSection = beforeSections.find((s) => s.display_type_id === 1);
  const heroItems =
    heroBannerSection?.items && heroBannerSection.items.length > 0
      ? heroBannerSection.items
      : defaultHeroItems;
  const beforeSectionsFiltered = heroBannerSection
    ? beforeSections.filter((s) => s.id !== heroBannerSection.id)
    : beforeSections;

  const handleHeroItemClick = (item: import("../types").SectionItem) => {
    if (!heroBannerSection?.action?.page_slug) return;
    const data = "item" in item ? item.item : item;
    const route = mapActionPageSlugToRoute(
      heroBannerSection.action.page_slug,
      data.id,
    );
    navigate(route);
  };

  const getHeroLink = (item: import("../types").SectionItem) => {
    if ("link" in item && item.link) return item.link;
    return undefined;
  };

  const handleDefaultHeroClick = (_item: import("../types").SectionItem) => {
    navigate("/products");
  };

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
