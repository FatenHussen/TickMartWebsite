import {
    PROMO_CARD_VARIANTS,
    formatPromotionTypeLabel,
    promotionTypeIcon,
} from "./promotionVisuals";
import type { UserPromotion } from "../types";

export interface PromotionOfferCardProps {
    promo: UserPromotion;
    title: string;
    description: string;
    index: number;
    isDark: boolean;
    offerBadgeLabel: string;
}

export function PromotionOfferCard({
    promo,
    title,
    description,
    index,
    isDark,
    offerBadgeLabel,
}: PromotionOfferCardProps) {
    const Icon = promotionTypeIcon(promo.type);
    const variant = PROMO_CARD_VARIANTS[index % PROMO_CARD_VARIANTS.length];
    const typeLabel = formatPromotionTypeLabel(promo.type);
    const delayMs = Math.min(index, 10) * 72;

    const shellStyle = isDark
        ? {
              background: "rgba(14, 15, 18, 0.94)",
              borderColor: "rgba(255, 255, 255, 0.07)",
              boxShadow:
                  "0 22px 48px -22px rgba(0, 0, 0, 0.55), inset 0 1px 0 0 rgba(255, 255, 255, 0.05)",
          }
        : {
              background:
                  "linear-gradient(155deg, var(--color-bg-card) 0%, color-mix(in srgb, var(--color-bg-card) 88%, var(--color-main)) 55%, color-mix(in srgb, var(--color-bg-card) 92%, var(--color-api-second)) 100%)",
              borderColor:
                  "color-mix(in srgb, var(--color-main) 22%, transparent)",
              boxShadow:
                  "0 14px 36px -16px color-mix(in srgb, var(--color-main) 32%, transparent), inset 0 1px 0 0 rgba(255, 255, 255, 0.85)",
          };

    return (
        <article
            className="promotions-strip-card group relative overflow-hidden rounded-3xl border p-4 transition-[transform,box-shadow] duration-300 sm:p-5 motion-safe:hover:-translate-y-1 motion-safe:hover:shadow-xl"
            style={{
                ...shellStyle,
                animationDelay: `${delayMs}ms`,
            }}
        >
            {/* Ambient mesh */}
            <div
                aria-hidden
                className="pointer-events-none absolute inset-0 z-0 opacity-[0.92]"
                style={{
                    background: [
                        `radial-gradient(ellipse 85% 75% at 105% -25%, ${variant.meshFrom}, transparent 58%)`,
                        `radial-gradient(ellipse 70% 65% at -15% 115%, ${variant.meshTo}, transparent 52%)`,
                    ].join(", "),
                }}
            />

            {/* Fine diagonal noise */}
            <div
                aria-hidden
                className={`pointer-events-none absolute inset-0 z-[1] ${isDark ? "opacity-[0.04]" : "opacity-[0.06]"}`}
                style={{
                    background:
                        "repeating-linear-gradient(135deg, currentColor 0, currentColor 1px, transparent 1px, transparent 22px)",
                    color: isDark ? "#ffffff" : "var(--color-main)",
                }}
            />

            {/* Traveling shine */}
            <div
                aria-hidden
                className={`promotions-strip-card__shine pointer-events-none absolute -start-[40%] top-0 z-[2] h-full w-[45%] ${isDark ? "opacity-[0.06]" : "opacity-[0.22]"}`}
                style={{
                    background:
                        "linear-gradient(95deg, transparent 10%, rgba(255,255,255,0.95) 48%, transparent 88%)",
                }}
            />

            {/* Accent rail */}
            <div
                aria-hidden
                className="absolute start-0 top-5 bottom-5 z-[3] w-[3px] rounded-full opacity-90"
                style={{ background: variant.accentBar }}
            />

            <div className="relative z-[4] flex gap-4 ps-2">
                <div
                    className="relative flex h-[3.25rem] w-[3.25rem] shrink-0 items-center justify-center rounded-2xl transition-transform duration-300 motion-safe:group-hover:scale-[1.06]"
                    style={{
                        background:
                            "linear-gradient(145deg, var(--color-gradient-from), var(--color-gradient-to))",
                        boxShadow: `0 12px 26px -10px ${variant.iconGlow}`,
                    }}
                >
                    <Icon
                        className="h-[1.35rem] w-[1.35rem] text-white opacity-[0.96]"
                        strokeWidth={2.25}
                        aria-hidden
                    />
                </div>

                <div className="min-w-0 flex-1 space-y-2 pt-0.5">
                    <div className="flex flex-wrap items-center gap-2">
                        <span
                            className="inline-flex rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white shadow-sm"
                            style={{
                                background:
                                    "linear-gradient(135deg, color-mix(in srgb, var(--color-api-second) 95%, white), var(--color-main))",
                                boxShadow:
                                    "0 6px 14px -6px color-mix(in srgb, var(--color-main) 55%, transparent)",
                            }}
                        >
                            {offerBadgeLabel}
                        </span>
                        <span
                            className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${isDark ? "bg-white/[0.06] text-[#a1a1aa]" : "bg-black/[0.04] text-custom-secondary"}`}
                        >
                            {typeLabel}
                        </span>
                    </div>

                    {title ? (
                        <h3
                            className={`text-base font-bold leading-snug tracking-tight sm:text-lg ${isDark ? "text-white" : "text-custom-primary"}`}
                        >
                            {title}
                        </h3>
                    ) : null}

                    {description ? (
                        <p
                            className={`text-sm leading-relaxed ${isDark ? "text-[#a1a1aa]" : "text-custom-secondary"}`}
                        >
                            {description}
                        </p>
                    ) : null}
                </div>
            </div>
        </article>
    );
}
