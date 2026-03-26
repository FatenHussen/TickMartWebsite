import BrandCard from "./BrandCard";
import { useBrandRatings } from "@/features/product/hooks/useBrands";

type BrandItemWithOptionalRating = {
    id: number;
    name: string;
    image: string;
    rating?: number;
    average_rating?: number;
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

    return (
        <BrandCard
            name={item.name}
            image={item.image}
            rating={displayRating}
            onClick={onClick}
        />
    );
}
