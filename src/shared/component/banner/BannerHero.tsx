import { useState } from "react";
import { useTranslation } from "react-i18next";
import { HiArrowRight } from "react-icons/hi2";
import LazyImage from "@/shared/component/LazyImage";
import type { SectionItemBase } from "@/features/home/types";

/**
 * The inside of a promo banner frame, shared by {@link PromotionalBannerCard}
 * and {@link PromotionalHeroSlider}: the CMS artwork full-bleed, a start-side
 * scrim over it, and the item's copy on top — eyebrow pill, headline, blurb and
 * a "Shop Now" pill.
 *
 * The copy is always drawn, never a fallback for a missing image. The API hands
 * out absolute URLs it does not verify — the seeded `storage/banner/*` artwork
 * 404s on the current host — so `onError` drops the <img> and lets the frame's
 * brand gradient stand in, with the headline and CTA still on screen.
 */
export default function BannerHero({ item }: { item: SectionItemBase }) {
    const { t } = useTranslation();
    const [imageFailed, setImageFailed] = useState(false);

    const rawTitle = item.title?.trim() || "";
    const title = rawTitle || t("hero.titleFallback", "Fresh Groceries Delivered");
    const subtitle = item.desc?.trim() || "";
    const buttonText = item.button_text?.trim() || t("hero.shopNow", "Shop Now");
    const image = item.image || "";

    return (
        <>
            {image && !imageFailed && (
                <LazyImage
                    src={image}
                    alt={rawTitle}
                    className="promo-banner-bg-img"
                    wrapperClassName="promo-banner-bg"
                    onError={() => setImageFailed(true)}
                />
            )}
            <div className="promo-banner-overlay" aria-hidden />

            <div className="promo-banner-content">
                <span className="promo-banner-eyebrow">
                    <span className="promo-banner-eyebrow-dot" aria-hidden />
                    {t("hero.eyebrow", "Fast local delivery")}
                </span>

                <h2 className="promo-banner-title">
                    {title}
                    {/* Seeded rows repeat the title as the description; a second
                        identical line reads as a bug, so only a distinct desc
                        becomes the accent subtitle. */}
                    {subtitle && subtitle !== title && (
                        <>
                            <br />
                            <span className="promo-banner-title-sub">
                                {subtitle}
                            </span>
                        </>
                    )}
                </h2>

                <p className="promo-banner-desc">
                    {t(
                        "hero.description",
                        "Order from your favorite local stores and get everything delivered to your door.",
                    )}
                </p>

                {/* A span, not a button: the whole frame is already the click target. */}
                <span className="promo-banner-btn">
                    {buttonText}
                    <HiArrowRight className="promo-banner-btn-icon" />
                </span>
            </div>
        </>
    );
}
