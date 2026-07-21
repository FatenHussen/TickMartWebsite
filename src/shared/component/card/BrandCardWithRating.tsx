import BrandCard from "./BrandCard";
import { useBrandRatings } from "@/features/product/hooks/useBrands";
import type { SectionItemBadge, SectionCardVariant } from "@/features/home/types";
import {
    mapApiBottomBadgesToProductCard,
    mapApiTopBadgesToProductCard,
} from "@/shared/lib/mapProductBadges";
import { useTheme } from "@/context/ThemeContext";

type BrandItemWithOptionalRating = {
    id: number;
    name: string;
    image: string;
    rating?: number;
    average_rating?: number;
    orders_count?: number;
    top_badges?: SectionItemBadge[];
    bottom_badges?: SectionItemBadge[];
    budges?: SectionItemBadge[];
};

type BrandCardWithRatingProps = {
    item: BrandItemWithOptionalRating;
    onClick: () => void;
    layout?: SectionCardVariant;
    /** Optional card tint from API `section.background_card_color` or page defaults */
    surfaceColor?: string | null;
    /** API-driven gradient for the content panel (dark mode) — wins over `surfaceColor`. */
    surfaceGradient?: string | null;
};

/** Neutral translucent panel — matches home section cards; API colors stay as accents on CTAs. */
const DARK_SURFACE_FALLBACK = "var(--color-bg-card-elevated)";

export default function BrandCardWithRating({
    item,
    onClick,
    layout,
    surfaceColor,
    surfaceGradient,
}: BrandCardWithRatingProps) {
    const { theme } = useTheme();
    const isDarkTheme = theme === "dark";
    const ratingFromItem = item.rating ?? item.average_rating;
    const shouldFetch = typeof ratingFromItem !== "number";
    const { averageRating } = useBrandRatings(shouldFetch ? item.id : 0);
    const displayRating = shouldFetch ? (averageRating ?? 0) : ratingFromItem;

    const topSource =
        item.top_badges?.length ? item.top_badges : item.budges;
    const badge = mapApiTopBadgesToProductCard(topSource);
    const bottomBadges = mapApiBottomBadgesToProductCard(item.bottom_badges);

    /**
     * In dark mode, ignore any per-section/per-page `surfaceColor` and use the
     * creative API-settings-driven dark gradient (`getDarkCardSurfaceGradient`,
     * tinted by the dashboard "dark second color") so brand cards stay consistent
     * across the app. Falls back to a neutral surface if no gradient is provided.
     */
    const resolvedSurface = isDarkTheme
        ? surfaceGradient
            ? undefined
            : DARK_SURFACE_FALLBACK
        : surfaceColor;
    const resolvedGradient = isDarkTheme ? surfaceGradient : undefined;

    return (
        <BrandCard
            name={item.name}
            image={item.image}
            rating={displayRating}
            ordersCount={item.orders_count}
            badge={badge}
            bottomBadges={bottomBadges}
            onClick={onClick}
            layout={layout}
            surfaceColor={resolvedSurface}
            surfaceGradient={resolvedGradient}
        />
    );
}
