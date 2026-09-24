import { useState } from "react";
import { HiArrowRight } from "react-icons/hi2";
import LazyImage from "@/shared/component/LazyImage";
import type { SectionItemBase } from "@/features/home/types";
import { bannerText } from "./utils";

/**
 * The inside of a promo banner frame, shared by {@link PromotionalBannerCard}
 * and {@link PromotionalHeroSlider}: the CMS artwork full-bleed, and — only
 * when the dashboard left them filled — title, description and CTA.
 *
 * `null` and `""` are empty. The image still renders; cleared copy is not
 * shown and is never filled from a previous value.
 */
export default function BannerHero({ item }: { item: SectionItemBase }) {
    const [imageFailed, setImageFailed] = useState(false);

    const title = bannerText(item.title);
    const desc = bannerText(item.desc);
    const buttonText = bannerText(item.button_text);
    const image = bannerText(item.image);
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
            {hasCopy ? <div className="promo-banner-overlay" aria-hidden /> : null}

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
