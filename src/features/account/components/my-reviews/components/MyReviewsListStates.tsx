import { useTranslation } from "react-i18next";
import { HiStar } from "react-icons/hi";
import { cn } from "@/shared/lib/utils";
import type { ReviewUnion } from "../../../types";
import BasketReviewCard from "../../BasketReviewCard";
import BrandReviewCard from "../../BrandReviewCard";
import DeliveryReviewCard from "../../DeliveryReviewCard";
import ProductReviewCard from "../../ProductReviewCard";
import RecipeReviewCard from "../../RecipeReviewCard";
import ScheduledBasketReviewCard from "../../ScheduledBasketReviewCard";
import StoreReviewCard from "../../StoreReviewCard";
import MyReviewCardShell from "./MyReviewCardShell";

type MyReviewsListStatesProps = {
    isLoading: boolean;
    reviews: ReviewUnion[];
    onEdit: (id: string | number) => void;
    onDelete: (id: string | number) => void;
};

function ReviewCardByType({
    review,
    onEdit,
    onDelete,
}: {
    review: ReviewUnion;
    onEdit: (id: string | number) => void;
    onDelete: (id: string | number) => void;
}) {
    const compact = true;

    switch (review.type) {
        case "product":
            return (
                <ProductReviewCard
                    review={review}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    compact={compact}
                />
            );
        case "store":
            return (
                <StoreReviewCard
                    review={review}
                    onEdit={onEdit}
                    compact={compact}
                />
            );
        case "delivery":
            return (
                <DeliveryReviewCard
                    review={review}
                    onEdit={onEdit}
                    compact={compact}
                />
            );
        case "recipe":
            return (
                <RecipeReviewCard
                    review={review}
                    onEdit={onEdit}
                    compact={compact}
                />
            );
        case "scheduled_basket":
            return (
                <ScheduledBasketReviewCard
                    review={review}
                    onEdit={onEdit}
                    compact={compact}
                />
            );
        case "brand":
            return (
                <BrandReviewCard
                    review={review}
                    onEdit={onEdit}
                    compact={compact}
                />
            );
        case "basket":
            return (
                <BasketReviewCard
                    review={review}
                    onEdit={onEdit}
                    compact={compact}
                />
            );
        default:
            return null;
    }
}

export default function MyReviewsListStates({
    isLoading,
    reviews,
    onEdit,
    onDelete,
}: MyReviewsListStatesProps) {
    const { t } = useTranslation();

    if (isLoading) {
        return (
            <div
                className="flex flex-col items-center justify-center gap-4 py-16"
                role="status"
                aria-live="polite"
            >
                <div className="relative h-14 w-14">
                    <div className="absolute inset-0 rounded-full bg-custom-primary/12" />
                    <div
                        className="absolute inset-0 animate-spin rounded-full bg-[conic-gradient(from_0deg,var(--color-api-second),var(--color-main),transparent_65%)] opacity-95 [mask:radial-gradient(farthest-side,transparent_calc(100%-3px),#000_100%)]"
                        aria-hidden
                    />
                </div>
                <p className="text-sm text-custom-tertiary">
                    {t("common.loading")}
                </p>
            </div>
        );
    }

    if (reviews.length === 0) {
        return (
            <div
                className={cn(
                    "relative overflow-hidden rounded-2xl px-6 py-14 text-center shadow-inner",
                    "bg-[linear-gradient(160deg,color-mix(in_srgb,var(--color-api-second)_10%,var(--color-bg-card))_0%,var(--color-bg-card)_50%,var(--color-bg-card)_100%)]",
                    "shadow-[0_12px_36px_-16px_color-mix(in_srgb,var(--color-api-second)_20%,transparent)]",
                )}
            >
                <div
                    className="pointer-events-none absolute -top-8 start-1/2 h-24 w-48 -translate-x-1/2 rounded-full bg-[var(--color-api-second)] opacity-[0.08] blur-2xl"
                    aria-hidden
                />
                <div className="relative mx-auto flex max-w-sm flex-col items-center gap-3">
                    <div
                        className={cn(
                            "flex h-16 w-16 items-center justify-center rounded-2xl",
                            "bg-[color-mix(in_srgb,var(--color-api-second)_14%,var(--color-bg-muted))] text-[var(--color-api-second)] shadow-inner",
                            "shadow-[0_0_0_6px_color-mix(in_srgb,var(--color-api-second)_10%,transparent)]",
                        )}
                    >
                        <HiStar className="h-8 w-8 opacity-90" aria-hidden />
                    </div>
                    <p className="text-base font-medium text-custom-primary">
                        {t("account.myReviews.noReviewsFound")}
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {reviews.map((review) => (
                <MyReviewCardShell key={review.id}>
                    <ReviewCardByType
                        review={review}
                        onEdit={onEdit}
                        onDelete={onDelete}
                    />
                </MyReviewCardShell>
            ))}
        </div>
    );
}
