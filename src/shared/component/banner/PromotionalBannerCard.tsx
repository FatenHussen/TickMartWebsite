import { useNavigate } from "react-router-dom";
import BannerHero from "./BannerHero";
import { cn } from "@/shared/lib/utils";
import { openSectionLink } from "@/shared/lib/sectionLink";
import type { SectionItemBase } from "@/features/home/types";
import "./promotional-banner.css";

type PromotionalBannerCardProps = {
    item: SectionItemBase;
    link?: string;
    onClick?: () => void;
    className?: string;
};

/**
 * A single promotional banner - the one-item counterpart to
 * {@link PromotionalHeroSlider}, rendering the same {@link BannerHero} frame
 * without the carousel around it. `promo-banner-static` is what tells the CSS
 * to run the entrance animations here, since there is no active Swiper slide to
 * hang them on.
 */
export default function PromotionalBannerCard({
    item,
    link,
    onClick,
    className,
}: PromotionalBannerCardProps) {
    const navigate = useNavigate();

    const interactive = Boolean(onClick || link);

    const handleClick = () => {
        if (onClick) {
            onClick();
        } else if (link) {
            openSectionLink(link, navigate);
        }
    };

    return (
        <div
            className={cn(
                "promo-banner-frame promo-banner-static",
                interactive &&
                    "cursor-pointer transition-shadow duration-200 hover:shadow-xl",
                className,
            )}
            onClick={interactive ? handleClick : undefined}
            role={interactive ? "button" : undefined}
            tabIndex={interactive ? 0 : undefined}
            onKeyDown={
                interactive
                    ? (e) => {
                          if (e.key === "Enter" || e.key === " ") {
                              e.preventDefault();
                              handleClick();
                          }
                      }
                    : undefined
            }
        >
            <BannerHero item={item} />
        </div>
    );
}
