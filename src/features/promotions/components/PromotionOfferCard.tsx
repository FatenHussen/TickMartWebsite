// import { ArrowRight } from "lucide-react";
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
    exploreLabel: string;
    /** Colour of the surface behind the card — used to punch the coupon notches. */
    surfaceColor: string;
}

export function PromotionOfferCard({
    promo,
    title,
    description,
    index,
    isDark,
    offerBadgeLabel,
    // exploreLabel,
    surfaceColor,
}: PromotionOfferCardProps) {
    const Icon = promotionTypeIcon(promo.type);
    const variant = PROMO_CARD_VARIANTS[index % PROMO_CARD_VARIANTS.length];
    const typeLabel = formatPromotionTypeLabel(promo.type);
    const delayMs = Math.min(index, 10) * 72;

    const borderColor = isDark
        ? "rgba(255, 255, 255, 0.08)"
        : "color-mix(in srgb, var(--color-main) 20%, transparent)";

    const shellStyle = isDark
        ? {
              background: "rgba(14, 15, 18, 0.94)",
              borderColor,
              boxShadow:
                  "0 22px 48px -22px rgba(0, 0, 0, 0.55), inset 0 1px 0 0 rgba(255, 255, 255, 0.05)",
          }
        : {
              background:
                  "linear-gradient(135deg, var(--color-bg-card) 0%, color-mix(in srgb, var(--color-bg-card) 90%, var(--color-main)) 100%)",
              borderColor,
              boxShadow:
                  "0 14px 36px -16px color-mix(in srgb, var(--color-main) 32%, transparent), inset 0 1px 0 0 rgba(255, 255, 255, 0.85)",
          };

    // Coupon notch — a punched hole that reveals the surface behind the card.
    const notchStyle = {
        background: surfaceColor,
        borderColor,
    };

    return (
        <article
            className="promotions-strip-card group relative flex overflow-hidden rounded-[1.5rem] border transition-[transform,box-shadow] duration-300 motion-safe:hover:-translate-y-1.5 motion-safe:hover:shadow-xl"
            style={{ ...shellStyle, animationDelay: `${delayMs}ms` }}
        >
            {/* Traveling shine */}
            <div
                aria-hidden
                className={`promotions-strip-card__shine pointer-events-none absolute -start-[40%] top-0 z-[2] h-full w-[45%] ${isDark ? "opacity-[0.06]" : "opacity-[0.2]"}`}
                style={{
                    background:
                        "linear-gradient(95deg, transparent 10%, rgba(255,255,255,0.95) 48%, transparent 88%)",
                }}
            />

            {/* ── Coupon stub (icon side) ─────────────────────────── */}
            <div
                className="relative z-[3] flex w-[5.25rem] shrink-0 flex-col items-center justify-center gap-2 px-2 py-5 text-white sm:w-[5.75rem]"
                style={{
                    background:
                        "linear-gradient(160deg, var(--color-gradient-from), var(--color-gradient-to))",
                }}
            >
                <div
                    aria-hidden
                    className="pointer-events-none absolute inset-0 opacity-25"
                    style={{
                        background:
                            "repeating-linear-gradient(135deg, rgba(255,255,255,0.5) 0, rgba(255,255,255,0.5) 1px, transparent 1px, transparent 12px)",
                    }}
                />
                <span
                    className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-white/20 ring-1 ring-white/30 backdrop-blur-sm transition-transform duration-300 motion-safe:group-hover:scale-110 motion-safe:group-hover:-rotate-6"
                    style={{ boxShadow: `0 10px 22px -10px ${variant.iconGlow}` }}
                >
                    <Icon className="h-6 w-6" strokeWidth={2.3} aria-hidden />
                </span>
                <span className="relative text-[10px] font-extrabold uppercase tracking-[0.14em] opacity-90">
                    {offerBadgeLabel}
                </span>
            </div>

            {/* ── Perforation + punched notches ───────────────────── */}
            <div
                aria-hidden
                className="absolute inset-y-3 z-[3] w-px border-s border-dashed start-[5.25rem] sm:start-[5.75rem]"
                style={{ borderColor: isDark ? "rgba(255,255,255,0.18)" : "color-mix(in srgb, var(--color-main) 28%, transparent)" }}
            />
            <span
                aria-hidden
                className="absolute z-[4] h-4 w-4 -translate-x-1/2 rounded-full border start-[5.25rem] -top-2 rtl:translate-x-1/2 sm:start-[5.75rem]"
                style={notchStyle}
            />
            <span
                aria-hidden
                className="absolute z-[4] h-4 w-4 -translate-x-1/2 rounded-full border start-[5.25rem] -bottom-2 rtl:translate-x-1/2 sm:start-[5.75rem]"
                style={notchStyle}
            />

            {/* ── Content ─────────────────────────────────────────── */}
            <div className="relative z-[3] min-w-0 flex-1 p-4 ps-5 sm:p-5 sm:ps-6">
                <span
                    className={`inline-flex rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide ${isDark ? "bg-white/[0.07] text-[#a1a1aa]" : "bg-black/[0.04] text-custom-secondary"}`}
                >
                    {typeLabel}
                </span>

                {title ? (
                    <h3
                        className={`brand-display mt-2 text-base font-semibold leading-snug tracking-tight sm:text-lg ${isDark ? "text-white" : "text-custom-primary"}`}
                    >
                        {title}
                    </h3>
                ) : null}

                {description ? (
                    <p
                        className={`mt-1 text-sm leading-relaxed ${isDark ? "text-[#a1a1aa]" : "text-custom-secondary"}`}
                    >
                        {description}
                    </p>
                ) : null}

                {/* <button
                    type="button"
                    className="mt-3.5 inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-bold text-white transition-transform duration-300 motion-safe:group-hover:scale-[1.03]"
                    style={{
                        background:
                            "linear-gradient(135deg, var(--color-gradient-from), var(--color-gradient-to))",
                        boxShadow:
                            "0 8px 18px -8px color-mix(in srgb, var(--color-main) 60%, transparent)",
                    }}
                >
                    {exploreLabel}
                    <ArrowRight
                        className="h-3.5 w-3.5 transition-transform duration-300 motion-safe:group-hover:translate-x-1 rtl:rotate-180 rtl:motion-safe:group-hover:-translate-x-1"
                        strokeWidth={2.6}
                        aria-hidden
                    />
                </button> */}
            </div>
        </article>
    );
}
