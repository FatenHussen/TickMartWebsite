import { useMemo } from "react";
import { useAuthStore } from "@/store/auth";
import { useLanguage } from "@/context/LanguageContext";
import { useActiveOrder } from "@/features/cart/hooks/useActiveOrder";
import { useActivePoints } from "@/features/account/hooks/usePoints";
import { useInfoCardsThemeScopeStyle } from "@/features/home/hooks/useInfoCardsThemeScopeStyle";
import { useTheme } from "@/context/ThemeContext";
import { cn } from "@/shared/lib/utils";
import { homeStaticSectionRowSurface } from "../lib/homeStaticSectionSurface";
import PointsRewardsCard from "./PointsRewardsCard";
import OrderTrackingCard from "./OrderTrackingCard";

/** Root class for dark-mode text overrides in `index.css` (settings API `--color-primary` + white). */
const HOME_INFO_CARDS_SCOPE_CLASS = "home-info-cards-scope";

export default function InfoCards() {
    const authenticated = useAuthStore((s) => s.authenticated);
    const { isRTL } = useLanguage();
    const { theme } = useTheme();
    const isDarkTheme = theme === "dark";
    const { data: activeOrder } = useActiveOrder(authenticated);
    const { data: activePoints } = useActivePoints(authenticated);
    const apiThemeScopeStyle = useInfoCardsThemeScopeStyle();

    const { className: rowClassName, style: rowStyle } = useMemo(
        () => homeStaticSectionRowSurface(isDarkTheme, undefined),
        [isDarkTheme]
    );

    if (!authenticated) {
        return null;
    }

    return (
        <section className={rowClassName} style={rowStyle}>
            <div className="page-container min-w-0">
                <div
                    className={cn(
                        "space-y-6 pt-2 pb-4 sm:pb-5",
                        HOME_INFO_CARDS_SCOPE_CLASS,
                    )}
                    dir={isRTL ? "rtl" : "ltr"}
                    style={apiThemeScopeStyle}
                >
                    <PointsRewardsCard
                        points={activePoints?.points ?? 0}
                        rewardsCount={activePoints?.gifts_count ?? 0}
                        subscriptionName={activePoints?.subscription_name ?? null}
                    />
                    {activeOrder && <OrderTrackingCard order={activeOrder} />}
                </div>
            </div>
        </section>
    );
}
