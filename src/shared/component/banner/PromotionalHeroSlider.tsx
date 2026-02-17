import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import { HiChevronLeft, HiChevronRight } from "react-icons/hi2";
import Button from "@/shared/ui/Button";
import type { SectionItemBase } from "@/features/home/types";
import { getItemData } from "./utils";
import type { SectionItem } from "@/features/home/types";
import "./promotional-hero-slider.css";

type PromotionalHeroSliderProps = {
  items: SectionItem[];
  /** Optional: link for manual items, or from action */
  getLink?: (item: SectionItem) => string | undefined;
  onItemClick?: (item: SectionItem) => void;
};

function getItemLink(
  item: SectionItem,
  getLink?: (item: SectionItem) => string | undefined,
): string | undefined {
  if (getLink) return getLink(item);
  if ("link" in item && item.link) return item.link;
  return undefined;
}

export default function PromotionalHeroSlider({
  items,
  getLink,
  onItemClick,
}: PromotionalHeroSliderProps) {
  const navigate = useNavigate();
  const prevRef = useRef<HTMLButtonElement | null>(null);
  const nextRef = useRef<HTMLButtonElement | null>(null);

  const handleSlideClick = (item: SectionItem) => {
    if (onItemClick) {
      onItemClick(item);
      return;
    }
    const link = getItemLink(item, getLink);
    if (link) navigate(link);
  };

  if (!items.length) return null;

  return (
    <div className="promo-hero-wrap mt-8">
      <button
        ref={prevRef}
        className="promo-hero-nav promo-hero-nav-prev"
        aria-label="Previous slide"
      >
        <HiChevronLeft className="promo-hero-nav-icon" />
      </button>
      <button
        ref={nextRef}
        className="promo-hero-nav promo-hero-nav-next"
        aria-label="Next slide"
      >
        <HiChevronRight className="promo-hero-nav-icon" />
      </button>

      <Swiper
        modules={[Autoplay, Pagination, Navigation]}
        slidesPerView={1}
        loop={items.length > 1}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        pagination={{
          clickable: true,
          bulletClass: "promo-hero-bullet",
          bulletActiveClass: "promo-hero-bullet-active",
        }}
        navigation={{
          prevEl: prevRef.current,
          nextEl: nextRef.current,
        }}
        onBeforeInit={(swiper) => {
          (swiper.params.navigation as any).prevEl = prevRef.current;
          (swiper.params.navigation as any).nextEl = nextRef.current;
        }}
        className="promo-hero-swiper"
      >
        {items.map((item) => {
          const data = getItemData(item) as SectionItemBase;
          const title = data.title || "Fresh Groceries Delivered";
          const subtitle = data.desc || "";
          const image = data.image || "";
          const link = getItemLink(item, getLink);

          return (
            <SwiperSlide key={data.id}>
              <div
                className="promo-hero-slide"
                onClick={() => handleSlideClick(item)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    handleSlideClick(item);
                  }
                }}
              >
                {/* Background - full image or gradient */}
                <div
                  className="promo-hero-slide-bg"
                  style={
                    image
                      ? {
                          backgroundImage: `url(${image})`,
                          backgroundSize: "cover",
                          backgroundPosition: "center",
                        }
                      : undefined
                  }
                />
                {/* Overlay - darker on left for text readability */}
                <div className="promo-hero-overlay" />

                {/* Content */}
                <div className="promo-hero-content">
                  <h1 className="promo-hero-title">
                    {title}
                    <br />
                    <span className="promo-hero-title-sub">{subtitle}</span>
                  </h1>
                  <p className="promo-hero-desc">
                    Order from your favorite local stores and get everything
                    delivered to your door.
                  </p>
                  <Button
                    className="promo-hero-btn"
                    variant="secondary"
                    size="lg"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (onItemClick) onItemClick(item);
                      else if (link) navigate(link);
                    }}
                  >
                    Shop Now
                  </Button>
                </div>
              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>
    </div>
  );
}
