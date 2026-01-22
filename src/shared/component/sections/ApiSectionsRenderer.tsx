import { useNavigate } from "react-router-dom";
import SliderSection from "../slider/core/SliderSection";
import ProductCard from "../card/ProductCard";
import BrandCard from "../card/BrandCard";
import type {
  Section,
  SectionItem,
  SectionItemManual,
  SectionItemApi,
} from "@/features/home/types";

type ApiSectionsRendererProps = {
  sections: Section[];
};

// Helper to check if item is manual type
function isManualItem(item: SectionItem): item is SectionItemManual {
  return "item" in item && "link" in item;
}

// Helper to get item data regardless of type
function getItemData(item: SectionItem): SectionItemApi {
  if (isManualItem(item)) {
    return item.item;
  }
  return item;
}

// Display type constants
const DISPLAY_TYPES = {
  BANNER: 1,
  PRODUCT: 2,
  BRAND: 6,
  RECIPE: 7,
} as const;

export default function ApiSectionsRenderer({
  sections,
}: ApiSectionsRendererProps) {
  const navigate = useNavigate();

  const handleViewAll = (section: Section) => {
    if (section.see_more?.page_slug) {
      const params = section.see_more.params;
      const queryString =
        params && typeof params === "object" && !Array.isArray(params)
          ? "?" +
            new URLSearchParams(params as Record<string, string>).toString()
          : "";
      navigate(`/${section.see_more.page_slug}${queryString}`);
    }
  };

  const handleItemClick = (section: Section, item: SectionItem) => {
    if (isManualItem(item) && item.link) {
      navigate(item.link);
    } else if (section.action?.page_slug) {
      const itemData = getItemData(item);
      navigate(`/product/${itemData.id}`);
    }
  };

  return (
    <>
      {sections.map((section) => (
        <SectionByDisplayType
          key={section.id}
          section={section}
          onViewAll={() => handleViewAll(section)}
          onItemClick={(item) => handleItemClick(section, item)}
        />
      ))}
    </>
  );
}

type SectionByDisplayTypeProps = {
  section: Section;
  onViewAll: () => void;
  onItemClick: (item: SectionItem) => void;
};

function SectionByDisplayType({
  section,
  onViewAll,
  onItemClick,
}: SectionByDisplayTypeProps) {
  const showViewAll = section.type === "api" && section.see_more;

  switch (section.display_type_id) {
    case DISPLAY_TYPES.BANNER:
      return (
        <BannerSection
          section={section}
          showViewAll={showViewAll}
          onViewAll={onViewAll}
          onItemClick={onItemClick}
        />
      );

    case DISPLAY_TYPES.PRODUCT:
    case DISPLAY_TYPES.RECIPE:
      return (
        <ProductSection
          section={section}
          showViewAll={showViewAll}
          onViewAll={onViewAll}
          onItemClick={onItemClick}
        />
      );

    case DISPLAY_TYPES.BRAND:
      return (
        <BrandSection
          section={section}
          showViewAll={showViewAll}
          onViewAll={onViewAll}
          onItemClick={onItemClick}
        />
      );

    default:
      console.warn(
        `[ApiSectionsRenderer] Unknown display_type_id: ${section.display_type_id}`,
      );
      return null;
  }
}

type SectionProps = {
  section: Section;
  showViewAll: boolean | null;
  onViewAll: () => void;
  onItemClick: (item: SectionItem) => void;
};

function BannerSection({
  section,
  showViewAll,
  onViewAll,
  onItemClick,
}: SectionProps) {
  return (
    <SliderSection
      title={section.name}
      viewAllLabel={showViewAll ? "عرض الكل" : undefined}
      onViewAllClick={showViewAll ? onViewAll : undefined}
      items={section.items}
      breakpoints={{
        640: { slidesPerView: 1.2 },
        768: { slidesPerView: 2.2 },
        1024: { slidesPerView: 3 },
      }}
      renderItem={(item) => {
        const data = getItemData(item);
        return (
          <div
            key={data.id}
            className="relative rounded-xl overflow-hidden cursor-pointer"
            onClick={() => onItemClick(item)}
          >
            <img
              src={data.image || "/placeholder-banner.jpg"}
              alt={data.title || "Banner"}
              className="w-full h-40 object-cover"
            />
            {data.title && (
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                <p className="text-white font-semibold">{data.title}</p>
              </div>
            )}
          </div>
        );
      }}
    />
  );
}

function ProductSection({
  section,
  showViewAll,
  onViewAll,
  onItemClick,
}: SectionProps) {
  return (
    <SliderSection
      title={section.name}
      viewAllLabel={showViewAll ? "عرض الكل" : undefined}
      onViewAllClick={showViewAll ? onViewAll : undefined}
      items={section.items}
      breakpoints={{
        640: { slidesPerView: 2 },
        768: { slidesPerView: 3 },
        1024: { slidesPerView: 4 },
      }}
      renderItem={(item) => {
        const data = getItemData(item);
        const hasDiscount = data.discount && parseFloat(data.discount) > 0;

        return (
          <ProductCard
            key={data.id}
            id={data.id}
            name={data.desc || data.title || ""}
            store=""
            price={
              data.price_after_discount
                ? `${data.price_after_discount}`
                : `${data.price || 0}`
            }
            originalPrice={
              hasDiscount && data.price ? `${data.price}` : undefined
            }
            rating={0}
            image={data.image || ""}
            badge={
              hasDiscount
                ? { label: `-${data.discount}%`, className: "bg-red-500" }
                : undefined
            }
            onClick={() => onItemClick(item)}
          />
        );
      }}
    />
  );
}

function BrandSection({
  section,
  showViewAll,
  onViewAll,
  onItemClick,
}: SectionProps) {
  return (
    <SliderSection
      title={section.name}
      viewAllLabel={showViewAll ? "عرض الكل" : undefined}
      onViewAllClick={showViewAll ? onViewAll : undefined}
      items={section.items}
      breakpoints={{
        640: { slidesPerView: 2.5 },
        768: { slidesPerView: 3.5 },
        1024: { slidesPerView: 6 },
      }}
      renderItem={(item) => {
        const data = getItemData(item);
        return (
          <BrandCard
            key={data.id}
            name={data.title || ""}
            image={data.image || ""}
            rating={0}
            onClick={() => onItemClick(item)}
          />
        );
      }}
    />
  );
}
