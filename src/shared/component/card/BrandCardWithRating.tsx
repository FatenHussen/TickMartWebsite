import BrandCard from "./BrandCard";
import { useBrandRatings } from "@/features/product/hooks/useBrands";
import type { SectionItemBadge } from "@/features/home/types";
import {
    mapApiBottomBadgesToProductCard,
    mapApiTopBadgesToProductCard,
} from "@/shared/lib/mapProductBadges";

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
};

export default function BrandCardWithRating({
    item,
    onClick,
}: BrandCardWithRatingProps) {
    const ratingFromItem = item.rating ?? item.average_rating;
    const shouldFetch = typeof ratingFromItem !== "number";
    const { averageRating } = useBrandRatings(shouldFetch ? item.id : 0);
    const displayRating = shouldFetch ? (averageRating ?? 0) : ratingFromItem;

    const topSource =
        item.top_badges?.length ? item.top_badges : item.budges;
    const badge = mapApiTopBadgesToProductCard(topSource);
    const bottomBadges = mapApiBottomBadgesToProductCard(item.bottom_badges);

    return (
        <BrandCard
            name={item.name}
            image={item.image}
            rating={displayRating}
            ordersCount={item.orders_count}
            badge={badge}
            bottomBadges={bottomBadges}
            onClick={onClick}
        />
    );
}
