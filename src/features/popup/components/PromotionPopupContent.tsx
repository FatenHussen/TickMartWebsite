import { useCallback, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Sparkles } from "lucide-react";
import FlashSaleBadge from "@/shared/component/slider/core/FlashSaleBadge";
import SliderSection from "@/shared/component/slider/core/SliderSection";
import { useLanguage } from "@/context/LanguageContext";
import { usePopupContext } from "../providers/PopupProvider";
import { localize } from "../utils/localize";
import { flattenPromotionEntities } from "../utils/flattenPromotionEntities";
import { entityTypeToPath } from "../utils/entityRoute";
import { PopupTracker } from "../tracking/popupTracking";
import type { PopupCampaign, PromotionListItem } from "../types";
import PromotionEntityCard from "./PromotionEntityCard";

type Props = {
    popup: PopupCampaign;
    mainColor: string;
    secondColor: string;
};

/**
 * Renders a promotion popup: flattens the nested entity payload, shows a header
 * with the campaign title + countdown, then a horizontal slider of entity cards.
 * Clicking a card routes (SPA) to the entity's detail page and closes the popup.
 */
export default function PromotionPopupContent({
    popup,
    mainColor,
    secondColor,
}: Props) {
    const { language } = useLanguage();
    const { t } = useTranslation();
    const { close, trackClick, trackPayload } = usePopupContext();
    const navigate = useNavigate();
    const [expired, setExpired] = useState<Set<string>>(() => new Set());

    const allItems = useMemo(
        () => flattenPromotionEntities(popup, language),
        [popup, language]
    );

    const items = useMemo(
        () => allItems.filter((it) => !expired.has(it.key)),
        [allItems, expired]
    );

    const markExpired = useCallback((key: string) => {
        setExpired((prev) => {
            if (prev.has(key)) return prev;
            const next = new Set(prev);
            next.add(key);
            return next;
        });
    }, []);

    // Soonest end time across items drives the header countdown; FlashSaleBadge
    // handles the "ended" state itself, so we don't filter on the current time.
    const headerEndDate = useMemo(() => {
        const dates = allItems
            .map((it) => it.endTime)
            .filter((d): d is string => Boolean(d) && Number.isFinite(Date.parse(d!)))
            .sort((a, b) => Date.parse(a) - Date.parse(b));
        return dates[0] ?? null;
    }, [allItems]);

    const handleSelect = useCallback(
        (item: PromotionListItem) => {
            trackClick();
            PopupTracker.trackClick(popup.id, trackPayload);
            navigate(entityTypeToPath(item.entityType, item.entityId));
            close("primary_cta");
        },
        [navigate, close, trackClick, trackPayload, popup.id]
    );

    const heading =
        localize(popup.content?.headline, language) ||
        localize(popup.title, language);
    const subheading = localize(popup.content?.subheadline, language);

    return (
        <div className="relative w-full bg-white dark:bg-[var(--color-bg-card)]">
            {/* Header */}
            <div className="flex flex-col gap-3 px-5 pb-1 pt-6 sm:px-6">
                <div className="flex items-center gap-2">
                    <span
                        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-white shadow-md"
                        style={{
                            background: `linear-gradient(135deg, ${mainColor}, ${secondColor})`,
                        }}
                        aria-hidden
                    >
                        <Sparkles className="h-4 w-4" />
                    </span>
                    {heading && (
                        <h2 className="line-clamp-2 text-lg font-extrabold leading-tight tracking-tight text-custom-primary dark:text-white">
                            {heading}
                        </h2>
                    )}
                </div>
                {subheading && (
                    <p className="text-[13px] leading-relaxed text-custom-secondary/80 dark:text-zinc-400">
                        {subheading}
                    </p>
                )}
                {headerEndDate && (
                    <FlashSaleBadge
                        endDate={headerEndDate}
                        mainColor={mainColor}
                        secondColor={secondColor}
                    />
                )}
            </div>

            {/* Entity slider / empty state */}
            <div className="pb-5 pt-2">
                {items.length > 0 ? (
                    <SliderSection
                        items={items.map((it) => ({ ...it, id: it.key }))}
                        renderItem={(it) => (
                            <PromotionEntityCard
                                item={it}
                                onSelect={handleSelect}
                                onExpire={markExpired}
                            />
                        )}
                        slidesPerView={1.6}
                        spaceBetween={14}
                        breakpoints={{
                            480: { slidesPerView: 2.1 },
                            640: { slidesPerView: 2.6 },
                            1024: { slidesPerView: 3.2 },
                        }}
                        removeVerticalSpacing
                    />
                ) : (
                    <p className="px-6 py-8 text-center text-sm text-custom-secondary/70 dark:text-zinc-500">
                        {t("popup.promotion.empty")}
                    </p>
                )}
            </div>
        </div>
    );
}
