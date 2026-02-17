import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuthStore } from "@/store/auth";
import { useFavorites, useToggleFavorite } from "@/features/account/hooks/useFavorites";
import SliderSection from "../slider/core/SliderSection";
import ProductCard from "../card/ProductCard";
import BrandCard from "../card/BrandCard";
import BasketCard from "../card/BasketCard";
import ShopCard from "../card/ShopCard";
import PromotionalBannerCard from "../banner/PromotionalBannerCard";
import PromotionalHeroSlider from "../banner/PromotionalHeroSlider";
import type {
  Section,
  SectionItem,
  SectionItemManual,
  BrandItem,
  RecipeItem,
  ProductItem,
  BasketItem,
  ShopItem,
} from "@/features/home/types";
import {
  mapPageSlugToRoute,
  mapActionPageSlugToRoute,
} from "@/utils/routeMapper";

type ApiSectionsRendererProps = {
  sections: Section[];
};

// Helper to check if item is manual type
function isManualItem(item: SectionItem): item is SectionItemManual {
  return "item" in item && "link" in item;
}

// Type guards for different item types
function isBrandItem(item: SectionItem): item is BrandItem {
  return (
    !isManualItem(item) &&
    "name" in item &&
    "image" in item &&
    !("category" in item) &&
    !("title" in item)
  );
}

function isRecipeItem(item: SectionItem): item is RecipeItem {
  return (
    !isManualItem(item) &&
    "name" in item &&
    "description" in item &&
    "orders_count" in item &&
    "budges" in item
  );
}

function isProductItem(item: SectionItem): item is ProductItem {
  return (
    !isManualItem(item) &&
    "category" in item &&
    "name" in item &&
    "sold_number" in item
  );
}

function isBasketItem(item: SectionItem): item is BasketItem {
  return (
    !isManualItem(item) &&
    "title" in item &&
    "items_count" in item &&
    "delivery_price" in item &&
    "discount_type" in item
  );
}

function isShopItem(item: SectionItem): item is ShopItem {
  return (
    !isManualItem(item) &&
    "name" in item &&
    "vendor" in item &&
    "is_open_now" in item &&
    "average_rating" in item &&
    !("category" in item && "sold_number" in item) &&
    !("title" in item && "items_count" in item && "delivery_price" in item)
  );
}

// Helper to get item data regardless of type
function getItemData(item: SectionItem) {
  if (isManualItem(item)) {
    return item.item;
  }
  return item;
}

// Display type constants
const DISPLAY_TYPES = {
  BANNER: 1,
  PRODUCT: 2,
  SHOP: 3,
  BASKET: 4,
  BRAND: 6,
  RECIPE: 7,
} as const;

export default function ApiSectionsRenderer({
  sections,
}: ApiSectionsRendererProps) {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { authenticated } = useAuthStore();
  const { data: favoriteProducts = [] } = useFavorites("product", !!authenticated);
  const { data: favoriteRecipes = [] } = useFavorites("recipe", !!authenticated);
  const { data: favoriteBaskets = [] } = useFavorites("basket", !!authenticated);
  const toggleFavorite = useToggleFavorite();
  const productFavoriteIds = favoriteProducts.map((f) => f.id);
  const recipeFavoriteIds = favoriteRecipes.map((f) => f.id);
  const basketFavoriteIds = favoriteBaskets.map((f) => f.id);

  const handleViewAll = (section: Section) => {
    if (section.see_more?.page_slug) {
      const route = mapPageSlugToRoute(
        section.see_more.page_slug,
        section.see_more.params
      );
      navigate(route);
    }
  };

  const handleItemClick = (section: Section, item: SectionItem) => {
    if (isManualItem(item) && item.link) {
      navigate(item.link);
    } else if (section.action?.page_slug) {
      const itemData = getItemData(item);
      const route = mapActionPageSlugToRoute(
        section.action.page_slug,
        itemData.id
      );
      navigate(route);
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
          t={t}
          productFavoriteIds={productFavoriteIds}
          recipeFavoriteIds={recipeFavoriteIds}
          basketFavoriteIds={basketFavoriteIds}
          onToggleProductFavorite={(id) =>
            toggleFavorite.mutate({ type: "product", id })
          }
          onToggleRecipeFavorite={(id) =>
            toggleFavorite.mutate({ type: "recipe", id })
          }
          onToggleBasketFavorite={(id) =>
            toggleFavorite.mutate({ type: "basket", id })
          }
        />
      ))}
    </>
  );
}

type SectionByDisplayTypeProps = {
  section: Section;
  onViewAll: () => void;
  onItemClick: (item: SectionItem) => void;
  t: (key: string) => string;
  productFavoriteIds: number[];
  recipeFavoriteIds: number[];
  basketFavoriteIds: number[];
  onToggleProductFavorite: (id: number) => void;
  onToggleRecipeFavorite: (id: number) => void;
  onToggleBasketFavorite: (id: number) => void;
};

function SectionByDisplayType({
  section,
  onViewAll,
  onItemClick,
  t,
  productFavoriteIds,
  recipeFavoriteIds,
  basketFavoriteIds,
  onToggleProductFavorite,
  onToggleRecipeFavorite,
  onToggleBasketFavorite,
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
          t={t}
        />
      );

    case DISPLAY_TYPES.PRODUCT:
      return (
        <ProductSection
          section={section}
          showViewAll={showViewAll}
          onViewAll={onViewAll}
          onItemClick={onItemClick}
          t={t}
          favoriteIds={productFavoriteIds}
          onToggleFavorite={onToggleProductFavorite}
        />
      );

    case DISPLAY_TYPES.SHOP:
      return (
        <ShopSection
          section={section}
          showViewAll={showViewAll}
          onViewAll={onViewAll}
          onItemClick={onItemClick}
          t={t}
        />
      );

    case DISPLAY_TYPES.BASKET:
      return (
        <BasketSection
          section={section}
          showViewAll={showViewAll}
          onViewAll={onViewAll}
          onItemClick={onItemClick}
          t={t}
          favoriteIds={basketFavoriteIds}
          onToggleFavorite={onToggleBasketFavorite}
        />
      );

    case DISPLAY_TYPES.BRAND:
      return (
        <BrandSection
          section={section}
          showViewAll={showViewAll}
          onViewAll={onViewAll}
          onItemClick={onItemClick}
          t={t}
        />
      );

    case DISPLAY_TYPES.RECIPE:
      return (
        <RecipeSection
          section={section}
          showViewAll={showViewAll}
          onViewAll={onViewAll}
          onItemClick={onItemClick}
          t={t}
          favoriteIds={recipeFavoriteIds}
          onToggleFavorite={onToggleRecipeFavorite}
        />
      );

    default:
      console.warn(
        `[ApiSectionsRenderer] Unknown display_type_id: ${section.display_type_id}`
      );
      return null;
  }
}

type SectionProps = {
  section: Section;
  showViewAll: boolean | any;
  onViewAll: () => void;
  onItemClick: (item: SectionItem) => void;
  t: (key: string) => string;
};

type SectionPropsWithFavorites = SectionProps & {
  favoriteIds: number[];
  onToggleFavorite: (id: number) => void;
};

function BannerSection({
  section,
  showViewAll,
  onViewAll,
  onItemClick,
  t,
}: SectionProps) {
  // If only one item, show promotional banner with container
  if (section.items.length === 1) {
    const item = section.items[0];
    const itemData = getItemData(item);
    const link = isManualItem(item) ? item.link : undefined;

    return (
      <div className="w-full">
        {showViewAll && section.name && (
          <div className="page-container mb-4 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-custom-primary">
              {section.name}
            </h2>
            <button
              onClick={onViewAll}
              className="text-primary-light hover:underline text-sm font-medium"
            >
              عرض الكل
            </button>
          </div>
        )}
        <div className="page-container">
          <PromotionalBannerCard
            item={itemData as any}
            link={link}
            onClick={() => onItemClick(item)}
            className="w-full"
          />
        </div>
      </div>
    );
  }

  // Multiple items - use hero-style slider (like HeroSlider)
  return (
    <div className="page-container">
      {showViewAll && section.name && (
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-custom-primary">
            {section.name}
          </h2>
          <button
            onClick={onViewAll}
            className="text-primary-light hover:underline text-sm font-medium"
          >
            {t("common.viewAll")}
          </button>
        </div>
      )}
      <PromotionalHeroSlider
        items={section.items}
        getLink={(item) => (isManualItem(item) ? item.link : undefined)}
        onItemClick={onItemClick}
      />
    </div>
  );
}

function ProductSection({
  section,
  showViewAll,
  onViewAll,
  onItemClick,
  t,
  favoriteIds,
  onToggleFavorite,
}: SectionPropsWithFavorites) {
  return (
    <SliderSection
      title={section.name}
      viewAllLabel={showViewAll ? t("common.viewAll") : undefined}
      onViewAllClick={showViewAll ? onViewAll : undefined}
      items={section.items}
      breakpoints={{
        640: { slidesPerView: 2 },
        768: { slidesPerView: 3 },
        1024: { slidesPerView: 4 },
      }}
      renderItem={(item) => {
        if (isProductItem(item)) {
          const hasDiscount = item.discount && parseFloat(item.discount) > 0;
          // Get badges - support both "budges" (typo) and "badges"
          const badges = (item as any).budges || (item as any).badges || [];
          const topBadge = badges.find(
            (b: any) => (b.postion === "top" || b.position === "top") && b.color
          );

          return (
            <ProductCard
              key={item.id}
              id={item.id}
              name={item.name}
              store=""
              price={`${item.price_after_discount}`}
              originalPrice={
                hasDiscount && item.price ? `${item.price}` : undefined
              }
              rating={item.rating || 0}
              image={item.image}
              badge={
                hasDiscount
                  ? {
                      label: `-${item.discount}%`,
                      className: "bg-red-500",
                    }
                  : topBadge
                  ? {
                      label: topBadge.name,
                      className: `bg-${topBadge.color}-500`,
                    }
                  : undefined
              }
              isFavorite={favoriteIds.includes(item.id)}
              onClick={() => onItemClick(item)}
              onToggleFavorite={onToggleFavorite}
            />
          );
        }
        // Fallback for backward compatibility
        const data = getItemData(item) as any;
        const hasDiscount = data.discount && parseFloat(data.discount) > 0;

        return (
          <ProductCard
            key={data.id}
            id={data.id}
            name={data.name || data.desc || data.title || ""}
            store=""
            price={
              data.price_after_discount
                ? `${data.price_after_discount}`
                : `${data.price || 0}`
            }
            originalPrice={
              hasDiscount && data.price ? `${data.price}` : undefined
            }
            rating={data.rating || 0}
            image={data.image || ""}
            badge={
              hasDiscount
                ? { label: `-${data.discount}%`, className: "bg-red-500" }
                : undefined
            }
            isFavorite={favoriteIds.includes(data.id)}
            onClick={() => onItemClick(item)}
            onToggleFavorite={onToggleFavorite}
          />
        );
      }}
    />
  );
}

function RecipeSection({
  section,
  showViewAll,
  onViewAll,
  onItemClick,
  t,
  favoriteIds,
  onToggleFavorite,
}: SectionPropsWithFavorites) {
  return (
    <SliderSection
      title={section.name}
      viewAllLabel={showViewAll ? t("common.viewAll") : undefined}
      onViewAllClick={showViewAll ? onViewAll : undefined}
      items={section.items}
      breakpoints={{
        640: { slidesPerView: 2 },
        768: { slidesPerView: 3 },
        1024: { slidesPerView: 4 },
      }}
      renderItem={(item) => {
        if (isRecipeItem(item)) {
          const hasDiscount = item.discount && parseFloat(item.discount) > 0;
          const badges = item.budges || [];
          const topBadge = badges.find(
            (b) => (b.postion === "top" || b.position === "top") && b.color
          );

          return (
            <ProductCard
              key={item.id}
              id={item.id}
              name={item.name}
              store=""
              price={`${item.price_after_discount}`}
              originalPrice={
                hasDiscount && item.price ? `${item.price}` : undefined
              }
              rating={item.rating || 0}
              image={item.image}
              badge={
                hasDiscount
                  ? {
                      label: `-${item.discount}%`,
                      className: "bg-red-500",
                    }
                  : topBadge
                  ? {
                      label: topBadge.name,
                      className: `bg-${topBadge.color}-500`,
                    }
                  : undefined
              }
              isFavorite={favoriteIds.includes(item.id)}
              onClick={() => onItemClick(item)}
              onToggleFavorite={onToggleFavorite}
            />
          );
        }
        // Fallback
        const data = getItemData(item) as any;
        const hasDiscount = data.discount && parseFloat(data.discount) > 0;

        return (
          <ProductCard
            key={data.id}
            id={data.id}
            name={data.name || data.desc || data.title || ""}
            store=""
            price={
              data.price_after_discount
                ? `${data.price_after_discount}`
                : `${data.price || 0}`
            }
            originalPrice={
              hasDiscount && data.price ? `${data.price}` : undefined
            }
            rating={data.rating || 0}
            image={data.image || ""}
            badge={
              hasDiscount
                ? { label: `-${data.discount}%`, className: "bg-red-500" }
                : undefined
            }
            isFavorite={favoriteIds.includes(data.id)}
            onClick={() => onItemClick(item)}
            onToggleFavorite={onToggleFavorite}
          />
        );
      }}
    />
  );
}

function BasketSection({
  section,
  showViewAll,
  onViewAll,
  onItemClick,
  t,
  favoriteIds,
  onToggleFavorite,
}: SectionPropsWithFavorites) {
  return (
    <SliderSection
      title={section.name}
      viewAllLabel={showViewAll ? t("common.viewAll") : undefined}
      onViewAllClick={showViewAll ? onViewAll : undefined}
      items={section.items}
      breakpoints={{
        640: { slidesPerView: 1.2 },
        768: { slidesPerView: 2 },
        1024: { slidesPerView: 3 },
      }}
      renderItem={(item) => {
        if (isBasketItem(item)) {
          const saveAmount =
            item.saving > 0 ? `${t("baskets.save")} ${item.saving}` : undefined;
          const savings =
            item.original_price > 0 && item.saving > 0
              ? `${t("baskets.youSave")} ${item.saving}`
              : undefined;
          const offerEndingDate = item.is_on_offer
            ? `${t("baskets.offerEnding")}: ${new Date(
                item.offer_ends_at
              ).toLocaleDateString()}`
            : undefined;

          return (
            <BasketCard
              key={item.id}
              id={item.id}
              name={item.name || item.title || ""}
              description={item.desc || ""}
              price={`${item.final_price ?? item.price_after_discount ?? 0}`}
              originalPrice={
                item.original_price > 0 ? `${item.original_price}` : undefined
              }
              rating={item.rating}
              image={item.image}
              saveAmount={saveAmount}
              savings={savings}
              offerEndingDate={offerEndingDate}
              isFavorite={favoriteIds.includes(item.id)}
              onClick={() => onItemClick(item)}
              onToggleFavorite={onToggleFavorite}
            />
          );
        }
        // Fallback for backward compatibility
        const data = getItemData(item) as any;
        return (
          <BasketCard
            key={data.id}
            id={data.id}
            name={data.title || data.name || ""}
            description={data.desc || data.description || ""}
            price={
              data.price_after_discount
                ? `${data.price_after_discount}`
                : `${data.price || 0}`
            }
            originalPrice={
              data.price &&
              data.price_after_discount &&
              data.price > data.price_after_discount
                ? `${data.price}`
                : undefined
            }
            image={data.image || ""}
            isFavorite={favoriteIds.includes(data.id)}
            onClick={() => onItemClick(item)}
            onToggleFavorite={onToggleFavorite}
          />
        );
      }}
    />
  );
}

function ShopSection({
  section,
  showViewAll,
  onViewAll,
  onItemClick,
  t,
}: SectionProps) {
  return (
    <SliderSection
      title={section.name}
      viewAllLabel={showViewAll ? t("common.viewAll") : undefined}
      onViewAllClick={showViewAll ? onViewAll : undefined}
      items={section.items}
      breakpoints={{
        640: { slidesPerView: 1.2 },
        768: { slidesPerView: 2 },
        1024: { slidesPerView: 3 },
      }}
      renderItem={(item) => {
        if (isShopItem(item)) {
          return (
            <ShopCard
              key={item.id}
              id={item.id}
              name={item.name}
              description={item.description}
              image={item.image ?? item.logo_url}
              isOpenNow={item.is_open_now}
              rating={item.average_rating}
              deliveryPrice={item.delivery_price}
              discountLabel={item.discount_label}
              onClick={() => onItemClick(item)}
            />
          );
        }
        const data = getItemData(item) as unknown as Record<string, unknown>;
        return (
          <ShopCard
            key={data.id as number}
            id={data.id as number}
            name={(data.name as string) ?? ""}
            description={(data.description as string) ?? null}
            image={(data.image as string) ?? (data.logo_url as string) ?? null}
            isOpenNow={(data.is_open_now as boolean) ?? false}
            rating={(data.average_rating as number) ?? 0}
            deliveryPrice={(data.delivery_price as string | number) ?? null}
            discountLabel={(data.discount_label as string) ?? null}
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
  t,
}: SectionProps) {
  return (
    <SliderSection
      title={section.name}
      viewAllLabel={showViewAll ? t("common.viewAll") : undefined}
      onViewAllClick={showViewAll ? onViewAll : undefined}
      items={section.items}
      breakpoints={{
        640: { slidesPerView: 2.5 },
        768: { slidesPerView: 3.5 },
        1024: { slidesPerView: 6 },
      }}
      renderItem={(item) => {
        if (isBrandItem(item)) {
          return (
            <BrandCard
              key={item.id}
              name={item.name}
              image={item.image}
              rating={0}
              onClick={() => onItemClick(item)}
            />
          );
        }
        // Fallback for backward compatibility
        const data = getItemData(item);
        return (
          <BrandCard
            key={data.id}
            name={(data as any).name || (data as any).title || ""}
            image={data.image || ""}
            rating={0}
            onClick={() => onItemClick(item)}
          />
        );
      }}
    />
  );
}
