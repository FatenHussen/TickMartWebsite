import { useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import { HiChevronLeft, HiChevronRight } from "react-icons/hi2";

import { useTranslation } from "react-i18next";
import Button from "@/shared/ui/Button";
import type { SlideData } from "../types";

import image1 from "@/assets/images/testHero.png";
import "./hero-slider.css";

const slides: SlideData[] = [
  {
    id: 1,
    title: "freshGroceries",
    subtitle: "in30Minutes",
    description: "orderFromStores",
    image: image1,
  },
  {
    id: 2,
    title: "freshGroceries",
    subtitle: "in30Minutes",
    description: "orderFromStores",
    image: image1,
  },
  {
    id: 3,
    title: "freshGroceries",
    subtitle: "in30Minutes",
    description: "orderFromStores",
    image: image1,
  },
];

export default function HeroSlider() {
  const { t } = useTranslation();

  const prevRef = useRef<HTMLButtonElement | null>(null);
  const nextRef = useRef<HTMLButtonElement | null>(null);

  return (
    <div className="hero-wrap mt-8">
      {/* Custom nav (like the image: circular buttons on sides) */}
      <button
        ref={prevRef}
        className="hero-nav hero-nav-prev"
        aria-label="Previous slide"
      >
        <HiChevronLeft className="hero-nav-icon" />
      </button>
      <button
        ref={nextRef}
        className="hero-nav hero-nav-next"
        aria-label="Next slide"
      >
        <HiChevronRight className="hero-nav-icon" />
      </button>

      <Swiper
        modules={[Autoplay, Pagination, Navigation]}
        slidesPerView={1}
        loop
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        pagination={{
          clickable: true,
          bulletClass: "hero-bullet",
          bulletActiveClass: "hero-bullet-active",
        }}
        navigation={{
          prevEl: prevRef.current,
          nextEl: nextRef.current,
        }}
        onBeforeInit={(swiper) => {
          // IMPORTANT: attach refs before init
          // @ts-expect-error Swiper types
          swiper.params.navigation.prevEl = prevRef.current;
          // @ts-expect-error Swiper types
          swiper.params.navigation.nextEl = nextRef.current;
        }}
        className="hero-swiper"
      >
        {slides.map((slide) => (
          <SwiperSlide key={slide.id}>
            <div
              className="hero-slide"
              style={{
                backgroundImage: `url(${slide.image})`,
              }}
            >
              {/* overlay like in the image (left dark overlay so text is readable) */}
              <div className="hero-overlay" />

              <div className="hero-content">
                <h1 className="hero-title">
                  {t(`home.${slide.title}`)} <br />
                  <span className="hero-title-sub">
                    {t(`home.${slide.subtitle}`)}
                  </span>
                </h1>

                <p className="hero-desc">{t(`home.${slide.description}`)}</p>

                <Button className="hero-btn" variant="secondary" size="lg">
                  {t("home.shopNow")}
                </Button>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
