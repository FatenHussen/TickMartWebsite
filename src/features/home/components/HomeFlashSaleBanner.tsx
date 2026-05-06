import FlashSaleBadge from "@/shared/component/slider/core/FlashSaleBadge";
import { mapPageSlugToRoute } from "@/utils/routeMapper";
import { useNavigate } from "react-router-dom";
import { useTheme } from "@/context/ThemeContext";
import { ArrowRight, Zap } from "lucide-react";
import type { SectionSeeMore } from "../types";

type HomeFlashSale = {
    endDate: string;
    title: string;
    mainColor: string;
    secondColor: string;
    textColor: string;
    seeMore: SectionSeeMore | null;
};

type HomeFlashSaleBannerProps = {
    flashSale: HomeFlashSale;
    isRTL: boolean;
};

export default function HomeFlashSaleBanner({
    flashSale,
    isRTL,
}: HomeFlashSaleBannerProps) {
    const navigate = useNavigate();
    const { theme } = useTheme();
    const isDarkTheme = theme === "dark";

    const handleViewAll = () => {
        if (!flashSale.seeMore?.page_slug) return;
        navigate(mapPageSlugToRoute(flashSale.seeMore.page_slug, flashSale.seeMore.params));
    };

    if (isDarkTheme) {
        return (
            <div
                className="relative overflow-hidden rounded-3xl p-5 sm:p-6"
                style={{
                    background: "rgba(14,15,18,0.96)",
                    border: "1px solid rgba(255,255,255,0.06)",
                    boxShadow: "0 24px 64px -20px rgba(0,0,0,0.6), inset 0 1px 0 0 rgba(255,255,255,0.04)",
                }}
            >
                {/* Cinematic ambient glow — API colors as radial accents only */}
                <div
                    aria-hidden
                    className="pointer-events-none absolute inset-0"
                    style={{
                        background: [
                            "radial-gradient(ellipse 85% 130% at 110% -15%, color-mix(in srgb, var(--color-main) 18%, transparent) 0%, transparent 60%)",
                            "radial-gradient(ellipse 65% 90% at -10% 115%, color-mix(in srgb, var(--color-api-second) 12%, transparent) 0%, transparent 55%)",
                        ].join(", "),
                    }}
                />

                {/* Ultra-subtle diagonal mesh */}
                <div
                    aria-hidden
                    className="pointer-events-none absolute inset-0 opacity-[0.035]"
                    style={{
                        background:
                            "repeating-linear-gradient(135deg, rgba(255,255,255,0.5) 0, rgba(255,255,255,0.5) 1px, transparent 1px, transparent 20px)",
                    }}
                />

                {/* Content */}
                <div className="relative z-10 flex flex-wrap items-center justify-between gap-4">
                    {/* Left: badge + title */}
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <div
                                className="flex h-6 w-6 items-center justify-center rounded-lg"
                                style={{
                                    background: "linear-gradient(135deg, var(--color-gradient-from) 0%, var(--color-gradient-to) 100%)",
                                    boxShadow: "0 0 14px -4px color-mix(in srgb, var(--color-main) 60%, transparent)",
                                }}
                            >
                                <Zap className="h-3.5 w-3.5 text-white" fill="currentColor" />
                            </div>
                            <span
                                className="text-xs font-semibold tracking-widest uppercase"
                                style={{ color: "var(--color-text, var(--color-text-primary))", opacity: 0.7 }}
                            >
                                {isRTL ? "تخفيضات سريعة" : "Limited Time"}
                            </span>
                        </div>
                        <h2 className="text-xl font-bold tracking-tight text-white sm:text-2xl">
                            {isRTL ? `عروض ${flashSale.title}` : `${flashSale.title} Flash Sale`}
                        </h2>
                    </div>

                    {/* Right: CTA */}
                    <button
                        type="button"
                        onClick={handleViewAll}
                        className="group inline-flex shrink-0 items-center gap-2 rounded-2xl px-5 py-2.5 text-sm font-semibold text-white transition-all duration-300 hover:brightness-110 active:scale-[0.98]"
                        style={{
                            background: "linear-gradient(135deg, var(--color-gradient-from) 0%, var(--color-gradient-to) 100%)",
                            boxShadow: "0 8px 28px -8px color-mix(in srgb, var(--color-main) 50%, transparent)",
                        }}
                    >
                        {isRTL ? "عرض الكل" : "View all"}
                        <ArrowRight
                            className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5"
                            style={{ transform: isRTL ? "scaleX(-1)" : undefined }}
                        />
                    </button>
                </div>

                {/* Countdown */}
                <div className="relative z-10 mt-5">
                    <FlashSaleBadge
                        endDate={flashSale.endDate}
                        mainColor="var(--color-main)"
                        secondColor="var(--color-api-second)"
                    />
                </div>
            </div>
        );
    }

    /* ── Light mode (unchanged) ── */
    return (
        <div
            className="relative overflow-hidden rounded-3xl p-4 shadow-xl sm:p-5"
            style={{
                color: flashSale.textColor,
                background: `linear-gradient(to left, ${flashSale.mainColor}, ${flashSale.secondColor})`,
            }}
        >
            <div
                aria-hidden
                className="pointer-events-none absolute inset-0 opacity-20"
                style={{
                    background:
                        "repeating-linear-gradient(135deg, rgba(255,255,255,0.16) 0, rgba(255,255,255,0.16) 2px, transparent 2px, transparent 18px)",
                }}
            />
            <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="relative z-10 space-y-1">
                    <p className="text-sm font-semibold tracking-wide opacity-90">
                        {isRTL ? "تخفيضات سريعة" : "Limited Time Deals"}
                    </p>
                    <h2 className="text-xl font-extrabold sm:text-2xl">
                        {isRTL
                            ? `عروض ${flashSale.title}`
                            : `${flashSale.title} Flash Sale`}
                    </h2>
                </div>
                <button
                    type="button"
                    onClick={handleViewAll}
                    className="relative z-10 rounded-xl border px-4 py-2 text-sm font-semibold transition hover:opacity-90"
                    style={{
                        borderColor: `${flashSale.textColor}66`,
                        backgroundColor: `${flashSale.textColor}22`,
                        color: flashSale.textColor,
                    }}
                >
                    {isRTL ? "عرض الكل" : "View all"}
                </button>
            </div>
            <div className="relative z-10 mt-4">
                <FlashSaleBadge
                    endDate={flashSale.endDate}
                    mainColor={flashSale.mainColor}
                    secondColor={flashSale.secondColor}
                />
            </div>
        </div>
    );
}
