import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import { HiChevronLeft, HiChevronRight } from "react-icons/hi2";
import BannerHero from "./BannerHero";
import { openSectionLink } from "@/shared/lib/sectionLink";
import type { SectionItem, SectionItemBase } from "@/features/home/types";
import { getItemData } from "./utils";
import "./promotional-banner.css";

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

/**
 * Carousel of CMS promo banners — the multi-item counterpart to
 * {@link PromotionalBannerCard}. Each slide is the landscape artwork the CMS
 * uploaded with the slide's own title, description and button text layered over
 * it by {@link BannerHero}; when the artwork is missing or 404s that copy
 * carries the slide on its own.
 * Autoplay plus arrows and dots, per the sections contract.
 */
export default function PromotionalHeroSlider({
    items,
    getLink,
    onItemClick,
}: PromotionalHeroSliderProps) {
    const navigate = useNavigate();
    const { t } = useTranslation();
    /**
     * State, not refs: Swiper needs the real elements in its `navigation`
     * params, and a ref's `current` is still null on the render that builds
     * them. Setting state from the ref callback re-renders once the buttons
     * exist, so Swiper wires the arrows up on that pass.
     */
    const [prevEl, setPrevEl] = useState<HTMLButtonElement | null>(null);
    const [nextEl, setNextEl] = useState<HTMLButtonElement | null>(null);

    const handleSlideClick = (item: SectionItem) => {
        if (onItemClick) {
            onItemClick(item);
            return;
        }
        const link = getItemLink(item, getLink);
        if (link) openSectionLink(link, navigate);
    };

    if (!items.length) return null;

    return (
        <div className="promo-banner-wrap">
            <button
                ref={setPrevEl}
                type="button"
                className="promo-banner-nav promo-banner-nav-prev"
                aria-label={t("hero.prevSlide", "Previous slide")}
            >
                <HiChevronLeft className="promo-banner-nav-icon" />
            </button>
            <button
                ref={setNextEl}
                type="button"
                className="promo-banner-nav promo-banner-nav-next"
                aria-label={t("hero.nextSlide", "Next slide")}
            >
                <HiChevronRight className="promo-banner-nav-icon" />
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
                    bulletClass: "promo-banner-bullet",
                    bulletActiveClass: "promo-banner-bullet-active",
                }}
                navigation={{ prevEl, nextEl }}
                className="promo-banner-swiper"
            >
                {items.map((item) => {
                    const data = getItemData(item) as SectionItemBase;
                    return (
                        <SwiperSlide key={data.id}>
                            <div
                                className="promo-banner-slide promo-banner-frame"
                                onClick={() => handleSlideClick(item)}
                                role="button"
                                tabIndex={0}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter" || e.key === " ") {
                                        e.preventDefault();
                                        handleSlideClick(item);
                                    }
                                }}
                            >
                                <BannerHero item={data} />
                            </div>
                        </SwiperSlide>
                    );
                })}
            </Swiper>
        </div>
    );
}
