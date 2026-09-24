import { useState } from "react";
import { HiArrowRight } from "react-icons/hi2";
import LazyImage from "@/shared/component/LazyImage";
import type { SectionItemBase } from "@/features/home/types";

/**
 * The inside of a promo banner frame, shared by {@link PromotionalBannerCard}
 * and {@link PromotionalHeroSlider}: the CMS artwork full-bleed, a start-side
 * scrim over it, and the item's copy on top — title, description and CTA from
 * the dashboard (`title` / `desc` / `button_text`).
 *
 * Empty strings are the fallback for legacy rows that pre-date required fields;
 * the frame (and image) still render — never hide the card for missing copy.
 * Absolute CMS image URLs are not verified upstream, so `onError` drops the
 * <img> and lets the frame background stand in.
 */
export default function BannerHero({ item }: { item: SectionItemBase }) {
    const [imageFailed, setImageFailed] = useState(false);

    const title = item.title?.trim() ?? "";
    const desc = item.desc?.trim() ?? "";
    const buttonText = item.button_text?.trim() ?? "";
    const image = item.image || "";
    const hasCopy = Boolean(title || desc || buttonText);

    return (
        <>
            {image && !imageFailed && (
                <LazyImage
                    src={image}
                    alt={title}
                    className="promo-banner-bg-img"
                    wrapperClassName="promo-banner-bg"
                    onError={() => setImageFailed(true)}
                />
            )}
            <div className="promo-banner-overlay" aria-hidden />

            {hasCopy && (
                <div className="promo-banner-content">
                    {title ? (
                        <h2 className="promo-banner-title">{title}</h2>
                    ) : null}

                    {desc ? (
                        <p className="promo-banner-desc">{desc}</p>
                    ) : null}

                    {/* A span, not a button: the whole frame is already the click target. */}
                    {buttonText ? (
                        <span className="promo-banner-btn">
                            {buttonText}
                            <HiArrowRight className="promo-banner-btn-icon" />
                        </span>
                    ) : null}
                </div>
            )}
        </>
    );
}
