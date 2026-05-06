import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Sparkles } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { useTheme } from "@/context/ThemeContext";
import { pickLocalizedPromotionText } from "../utils/pickLocalizedPromotionText";
import { useUserPromotions } from "../hooks/useUserPromotions";
import type { UserPromotion } from "../types";
import { PromotionOfferCard } from "./PromotionOfferCard";
import "./screen-promotions.css";

export type ScreenPromotionsPlacement = "top" | "bottom";

function normalizePlacement(value: string | null | undefined): string {
    return String(value ?? "")
        .trim()
        .toLowerCase();
}

function filterByPlacement(
    list: UserPromotion[],
    placement: ScreenPromotionsPlacement
): UserPromotion[] {
    return list.filter((p) => normalizePlacement(p.position) === placement);
}

export interface ScreenPromotionsProps {
    /** CMS `pages.slug` for the current screen (e.g. `home`, `cart`). */
    pageSlug: string;
    placement: ScreenPromotionsPlacement;
    className?: string;
}

/**
 * Renders active CMS promotions with a richer card layout (light / dark aware).
 */
export function ScreenPromotions({
    pageSlug,
    placement,
    className = "",
}: ScreenPromotionsProps) {
    const { t } = useTranslation();
    const { language } = useLanguage();
    const { theme } = useTheme();
    const isDark = theme === "dark";

    const { data, isLoading, isError } = useUserPromotions(pageSlug.trim());

    const items = useMemo(
        () => (data?.length ? filterByPlacement(data, placement) : []),
        [data, placement]
    );

    const rows = useMemo(
        () =>
            items
                .map((promo) => {
                    const title = pickLocalizedPromotionText(promo.name, language);
                    const description = pickLocalizedPromotionText(
                        promo.description,
                        language
                    );
                    if (!title && !description) return null;
                    return { promo, title, description };
                })
                .filter(
                    (row): row is { promo: UserPromotion; title: string; description: string } =>
                        row != null
                ),
        [items, language]
    );

    if (isLoading || isError || rows.length === 0) return null;

    const gridClass =
        rows.length === 1
            ? "max-w-3xl"
            : "grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3";

    const sectionBandStyle = isDark
        ? {
              backgroundColor: "#0B0B0C",
              boxShadow:
                  "inset 0 1px 0 0 rgba(255,255,255,0.085), inset 0 -1px 0 0 rgba(0,0,0,0.35)",
          }
        : undefined;

    return (
        <section
            className={`relative w-screen max-w-[100vw] [margin-inline-start:calc(50%-50vw)] pt-4 sm:pt-5 pb-4 sm:pb-5 ${!isDark ? "bg-custom-card" : ""} ${className}`.trim()}
            style={sectionBandStyle}
            aria-label={t("promotions.regionLabel", "Active promotions")}
        >
            {/* Ambient brand blobs — light mode only */}
            {!isDark && (
                <div
                    aria-hidden
                    className="pointer-events-none absolute inset-0 overflow-hidden"
                    style={{
                        background: [
                            "radial-gradient(ellipse 55% 90% at 2% 50%, color-mix(in srgb, var(--color-main) 7%, transparent), transparent 65%)",
                            "radial-gradient(ellipse 45% 75% at 98% 50%, color-mix(in srgb, var(--color-api-second) 6%, transparent), transparent 60%)",
                        ].join(", "),
                    }}
                />
            )}

            <div className="page-container relative min-w-0 flex flex-col gap-4">
                {rows.length > 1 && (
                    <div className="flex flex-wrap items-center gap-3">
                        <div
                            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl"
                            style={{
                                background:
                                    "linear-gradient(135deg, var(--color-gradient-from), var(--color-gradient-to))",
                                boxShadow:
                                    "0 8px 20px -8px color-mix(in srgb, var(--color-main) 52%, transparent)",
                            }}
                        >
                            <Sparkles
                                className="h-[1.1rem] w-[1.1rem] text-white"
                                strokeWidth={2.2}
                                aria-hidden
                            />
                        </div>

                        <div className="min-w-0 flex-1">
                            <p
                                className={`text-[10px] font-bold uppercase tracking-[0.22em] ${isDark ? "text-[#52525b]" : "text-custom-secondary"}`}
                            >
                                {t("promotions.eyebrow", "Rewards & perks")}
                            </p>
                            <p
                                className={`mt-0.5 text-sm font-semibold sm:text-base ${isDark ? "text-white" : "text-custom-primary"}`}
                            >
                                {t(
                                    "promotions.subtitle",
                                    "Curated offers running right now"
                                )}
                            </p>
                        </div>

                        <div
                            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white tabular-nums"
                            style={{
                                background:
                                    "linear-gradient(135deg, var(--color-gradient-from), var(--color-gradient-to))",
                                boxShadow:
                                    "0 4px 12px -4px color-mix(in srgb, var(--color-main) 55%, transparent)",
                            }}
                        >
                            {rows.length}
                        </div>
                    </div>
                )}

                <div className={`${gridClass} ${rows.length === 1 ? "mx-auto w-full" : ""}`}>
                    {rows.map(({ promo, title, description }, index) => (
                        <PromotionOfferCard
                            key={promo.id}
                            promo={promo}
                            title={title}
                            description={description}
                            index={index}
                            isDark={isDark}
                            offerBadgeLabel={t("promotions.offerBadge", "Offer")}
                        />
                    ))}
                </div>

                {rows.length > 2 && (
                    <p
                        className={`text-center text-[11px] font-medium ${isDark ? "text-[#52525b]" : "text-custom-secondary"}`}
                    >
                        {t(
                            "promotions.stackHint",
                            "Explore each perk — some combine at checkout."
                        )}
                    </p>
                )}
            </div>
        </section>
    );
}
