import FlashSaleBadge from "@/shared/component/slider/core/FlashSaleBadge";
import { mapPageSlugToRoute } from "@/utils/routeMapper";
import { useNavigate } from "react-router-dom";
import { useTheme } from "@/context/ThemeContext";
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
    const bannerTextColor = isDarkTheme
        ? "var(--color-text, var(--color-text-primary))"
        : flashSale.textColor;
    const bannerMainColor = isDarkTheme
        ? "var(--color-main)"
        : flashSale.mainColor;
    const bannerSecondColor = isDarkTheme
        ? "var(--color-api-second)"
        : flashSale.secondColor;

    return (
        <div
            className="relative overflow-hidden rounded-3xl p-4 shadow-xl sm:p-5"
            style={{
                color: bannerTextColor,
                background: `linear-gradient(to left, ${bannerMainColor}, ${bannerSecondColor})`,
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
                    onClick={() => {
                        if (!flashSale.seeMore?.page_slug) return;
                        navigate(
                            mapPageSlugToRoute(
                                flashSale.seeMore.page_slug,
                                flashSale.seeMore.params
                            )
                        );
                    }}
                    className="relative z-10 rounded-xl border px-4 py-2 text-sm font-semibold transition hover:opacity-90"
                    style={{
                        borderColor: `${bannerTextColor}66`,
                        backgroundColor: `${bannerTextColor}22`,
                        color: bannerTextColor,
                    }}
                >
                    {isRTL ? "عرض الكل" : "View all"}
                </button>
            </div>
            <div className="relative z-10 mt-4">
                <FlashSaleBadge
                    endDate={flashSale.endDate}
                    mainColor={bannerMainColor}
                    secondColor={bannerSecondColor}
                />
            </div>
        </div>
    );
}
