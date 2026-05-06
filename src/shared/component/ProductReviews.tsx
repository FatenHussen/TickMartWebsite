import { useMemo, useState, type CSSProperties } from "react";
import { useTranslation } from "react-i18next";
import { HiChevronUp, HiChevronDown } from "react-icons/hi";
import { cn } from "@/shared/lib/utils";
import { PremiumInlineLoader } from "@/shared/component/loading";
import Label from "@/shared/ui/Label";

export type Review = {
    id: string;
    rating: number;
    text: string;
    date: string;
    reviewerName: string;
    reviewerAvatar?: string;
};

export type RatingDistribution = {
    "5": number;
    "4": number;
    "3": number;
    "2": number;
    "1": number;
};

export type ProductReviewsProps = {
    averageRating: number;
    totalReviews: number; // for label (1.25k)
    ratingDistribution: RatingDistribution;
    reviews: Review[];
    className?: string;
    /** Optional section title (e.g. for recipe reviews instead of product) */
    sectionTitle?: string;
    /** Ref for infinite scroll sentinel - when provided, load more on scroll */
    observerTarget?: React.RefObject<HTMLDivElement | null>;
    /** Show loading spinner when fetching next page */
    isFetchingNextPage?: boolean;
    /** Optional accent color coming from API for review borders */
    reviewBorderColor?: string;
    /** Optional main API color to blend with secondary accents */
    reviewMainColor?: string;
};

export default function ProductReviews({
    averageRating,
    totalReviews,
    ratingDistribution,
    reviews,
    className,
    sectionTitle,
    observerTarget,
    isFetchingNextPage = false,
    reviewBorderColor,
    reviewMainColor,
}: ProductReviewsProps) {
    const { t } = useTranslation();
    const [isRatingFilterOpen, setIsRatingFilterOpen] = useState(true);
    const [selectedRatings, setSelectedRatings] = useState<number[]>([]);
    const heading = sectionTitle ?? t("product.productReviews");

    const totalReviewsCount = useMemo(() => {
        return Object.values(ratingDistribution).reduce((sum, n) => sum + n, 0);
    }, [ratingDistribution]);

    const formatCount = (count: number) => {
        if (count >= 1000)
            return `${(count / 1000).toFixed(2)}k`
                .replace(/0+$/, "")
                .replace(/\.$/, "");
        return `${count}`;
    };

    const toggleRating = (rating: number) => {
        setSelectedRatings((prev) =>
            prev.includes(rating)
                ? prev.filter((r) => r !== rating)
                : [...prev, rating]
        );
    };

    const filteredReviews = selectedRatings.length
        ? reviews.filter((r) => selectedRatings.includes(r.rating))
        : reviews;

    const getBarWidth = (count: number) => {
        if (!totalReviewsCount) return 0;
        return (count / totalReviewsCount) * 100;
    };
    /** Surfaces + accents follow `settingsApi` palettes via root CSS vars (`ThemeContext`). */
    const reviewAccentStyle = useMemo(
        () =>
            ({
                "--review-accent": reviewBorderColor?.trim() || "var(--color-api-second)",
                "--review-main": reviewMainColor?.trim() || "var(--color-main)",
                "--review-surface": "var(--color-bg-card)",
                "--review-text": "var(--color-text)",
            }) as CSSProperties,
        [reviewBorderColor, reviewMainColor]
    );

    const StarsRow = ({
        value,
        size = "text-base",
    }: {
        value: number;
        size?: string;
    }) => (
        <div className="flex items-center gap-0.5">
            {[1, 2, 3, 4, 5].map((s) => (
                <span
                    key={s}
                    className={cn(
                        size,
                        s <= Math.round(value)
                            ? "text-amber-400"
                            : "text-slate-200 dark:text-[color-mix(in_srgb,var(--review-text)_18%,transparent)]"
                    )}
                >
                    ★
                </span>
            ))}
        </div>
    );

    return (
        <div className={cn("mt-10 space-y-6", className)} style={reviewAccentStyle}>
            <h2 className="mb-5 text-xl font-bold text-text-primary">
                {heading}
            </h2>

            {/* TOP SUMMARY BOX (one box like the image) */}
            <div className="relative overflow-hidden rounded-3xl border-2 border-[color-mix(in_srgb,var(--review-main)_38%,var(--review-accent)_62%)] bg-[linear-gradient(130deg,color-mix(in_srgb,var(--review-main)_6%,var(--review-surface))_0%,color-mix(in_srgb,var(--review-accent)_7%,var(--review-surface))_45%,color-mix(in_srgb,var(--review-main)_4%,var(--review-accent)_5%)_100%)] p-6 ring-1 ring-[color-mix(in_srgb,var(--review-main)_22%,var(--review-accent)_38%)] shadow-[0_24px_70px_-24px_color-mix(in_srgb,var(--review-accent)_52%,transparent),0_16px_42px_-26px_color-mix(in_srgb,var(--review-main)_52%,transparent)]">
                <div className="pointer-events-none absolute -top-12 -right-10 h-40 w-40 rounded-full bg-[color-mix(in_srgb,var(--review-accent)_22%,var(--review-surface))] blur-2xl" />
                <div className="pointer-events-none absolute -bottom-12 -left-10 h-40 w-40 rounded-full bg-[color-mix(in_srgb,var(--review-main)_20%,var(--review-surface))] blur-2xl" />
                <div className="pointer-events-none absolute inset-x-8 top-3 h-12 rounded-full bg-white/25 blur-xl dark:bg-[color-mix(in_srgb,var(--review-text)_8%,transparent)]" />
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
                    {/* Left: average rating ring */}
                    <div className="lg:col-span-4">
                        <div className="flex items-center gap-5 rounded-2xl border border-[color-mix(in_srgb,var(--review-accent)_42%,transparent)] bg-custom-primary/65 p-4 shadow-[0_16px_38px_-22px_color-mix(in_srgb,var(--review-accent)_68%,transparent),inset_0_1px_0_rgba(255,255,255,0.2)] backdrop-blur-sm dark:shadow-[0_16px_38px_-22px_color-mix(in_srgb,var(--review-accent)_68%,transparent),inset_0_1px_0_color-mix(in_srgb,var(--review-text)_10%,transparent)]">
                            {/* ring */}
                            <div className="relative grid h-16 w-16 place-items-center rounded-full bg-gradient-to-br from-amber-100 to-amber-300/40 ring-4 ring-amber-300/50 dark:from-amber-500/20 dark:to-amber-300/10">
                                <span className="text-lg font-bold text-text-primary">
                                    {averageRating.toFixed(1)}
                                </span>
                            </div>

                            <div className="flex flex-col gap-1">
                                <StarsRow value={averageRating} size="text-lg" />
                                <p className="text-xs text-text-secondary">
                                    {t("product.fromReviews")} {formatCount(totalReviews)}{""}
                                    {t("product.reviews")}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Right: distribution bars */}
                    <div className="lg:col-span-8">
                        <div className="space-y-3 rounded-2xl border border-[color-mix(in_srgb,var(--review-accent)_38%,transparent)] bg-custom-primary/65 p-4 shadow-[0_16px_34px_-22px_color-mix(in_srgb,var(--review-accent)_62%,transparent),inset_0_1px_0_rgba(255,255,255,0.2)] backdrop-blur-sm dark:shadow-[0_16px_34px_-22px_color-mix(in_srgb,var(--review-accent)_62%,transparent),inset_0_1px_0_color-mix(in_srgb,var(--review-text)_10%,transparent)]">
                            {[5, 4, 3, 2, 1].map((r) => {
                                const count =
                                    ratingDistribution[String(r) as keyof RatingDistribution] ??
                                    0;
                                const width = getBarWidth(count);

                                return (
                                    <div key={r} className="grid grid-cols-12 items-center gap-3">
                                        {/* label"5.0 ⭐"*/}
                                        <div className="col-span-2 flex items-center gap-1 text-xs text-text-secondary">
                                            <span className="w-6 text-right">{r}.0</span>
                                            <span className="text-amber-400">★</span>
                                        </div>

                                        {/* bar */}
                                        <div className="col-span-8 h-2 rounded-full bg-custom-tertiary/70 overflow-hidden">
                                            <div
                                                className="h-full rounded-full bg-gradient-to-r from-text-primary to-primary-light transition-all"
                                                style={{ width: `${width}%` }}
                                            />
                                        </div>

                                        {/* count right */}
                                        <div className="col-span-2 text-right text-xs text-text-secondary">
                                            {count}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>

            {/* LOWER GRID */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
                {/* Left: Filter */}
                <div className="lg:col-span-3">
                    <div className="sticky top-24 rounded-3xl border-2 border-[color-mix(in_srgb,var(--review-main)_38%,var(--review-accent)_62%)] bg-custom-card p-5 ring-1 ring-[color-mix(in_srgb,var(--review-main)_22%,var(--review-accent)_38%)] shadow-[0_22px_52px_-24px_color-mix(in_srgb,var(--review-accent)_52%,transparent),0_14px_32px_-22px_color-mix(in_srgb,var(--review-main)_45%,transparent)]">
                        <h3 className="mb-4 text-sm font-bold text-text-primary">
                            {t("product.reviewsFilter")}
                        </h3>

                        <button
                            type="button"
                            onClick={() => setIsRatingFilterOpen((v) => !v)}
                            className="mb-3 flex w-full items-center justify-between text-xs font-semibold text-text-primary"
                        >
                            <span>{t("product.rating")}</span>
                            {isRatingFilterOpen ? (
                                <HiChevronUp className="h-4 w-4" />
                            ) : (
                                <HiChevronDown className="h-4 w-4" />
                            )}
                        </button>

                        {isRatingFilterOpen && (
                            <div className="space-y-2.5">
                                {[5, 4, 3, 2, 1].map((rating) => (
                                    <Label
                                        key={rating}
                                        className={cn(
                                            "flex items-center justify-between gap-2 rounded-xl px-2.5 py-2 text-xs text-text-primary cursor-pointer font-normal transition-all",
                                            selectedRatings.includes(rating)
                                                ? "bg-amber-50 text-text-primary dark:bg-[color-mix(in_srgb,var(--review-accent)_24%,var(--review-surface))]"
                                                : "bg-custom-primary/50 hover:bg-custom-secondary/30"
                                        )}
                                    >
                                        <span className="flex items-center gap-2">
                                            <input
                                                type="checkbox"
                                                checked={selectedRatings.includes(rating)}
                                                onChange={() => toggleRating(rating)}
                                                className="h-4 w-4 rounded border-custom-secondary text-primary focus:ring-primary"
                                            />
                                            <span className="flex items-center gap-1">
                                                <span className="text-amber-400">★</span>
                                                <span>{rating}</span>
                                            </span>
                                        </span>
                                        <span className="text-[11px] text-text-secondary">
                                            {ratingDistribution[String(rating) as keyof RatingDistribution] ?? 0}
                                        </span>
                                    </Label>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Right: Review list */}
                <div className="lg:col-span-9">
                    <div className="relative rounded-3xl border-2 border-[color-mix(in_srgb,var(--review-main)_38%,var(--review-accent)_62%)] bg-custom-card p-6 ring-1 ring-[color-mix(in_srgb,var(--review-main)_22%,var(--review-accent)_38%)] shadow-[0_24px_60px_-24px_color-mix(in_srgb,var(--review-accent)_50%,transparent),0_16px_36px_-24px_color-mix(in_srgb,var(--review-main)_48%,transparent)] before:pointer-events-none before:absolute before:inset-0 before:rounded-3xl before:p-[1px]">
                        <h3 className="mb-5 text-sm font-bold text-text-primary">
                            {t("product.reviewLists")}
                        </h3>

                        <div className="space-y-4">
                            {filteredReviews.map((review) => (
                                <div
                                    key={review.id}
                                    className="rounded-2xl border border-[color-mix(in_srgb,var(--review-main)_35%,var(--review-accent)_65%)] bg-custom-card p-4 shadow-[0_16px_30px_-20px_color-mix(in_srgb,var(--review-accent)_42%,transparent),0_10px_24px_-18px_color-mix(in_srgb,var(--review-main)_38%,transparent),inset_0_1px_0_rgba(255,255,255,0.75)] transition-all hover:-translate-y-0.5 hover:border-[color-mix(in_srgb,var(--review-main)_35%,var(--review-accent)_85%)] hover:bg-custom-card hover:shadow-[0_24px_42px_-20px_color-mix(in_srgb,var(--review-accent)_65%,transparent),0_14px_30px_-20px_color-mix(in_srgb,var(--review-main)_52%,transparent)] dark:shadow-[0_16px_30px_-20px_color-mix(in_srgb,var(--review-accent)_42%,transparent),0_10px_24px_-18px_color-mix(in_srgb,var(--review-main)_38%,transparent),inset_0_1px_0_color-mix(in_srgb,var(--review-text)_8%,transparent)] dark:hover:shadow-[0_24px_42px_-20px_color-mix(in_srgb,var(--review-accent)_65%,transparent),0_14px_30px_-20px_color-mix(in_srgb,var(--review-main)_52%,transparent),inset_0_1px_0_color-mix(in_srgb,var(--review-text)_10%,transparent)]"
                                >
                                    <div className="mb-2 flex items-center justify-between gap-3">
                                        <StarsRow value={review.rating} size="text-base" />
                                        <p className="text-xs text-text-secondary whitespace-nowrap">
                                            {review.date}
                                        </p>
                                    </div>

                                    <p className="text-sm font-semibold leading-6 text-text-primary">
                                        {review.text}
                                    </p>

                                    <div className="mt-4 flex items-center gap-2">
                                        {review.reviewerAvatar ? (
                                            <img
                                                src={review.reviewerAvatar}
                                                alt={review.reviewerName}
                                                className="h-8 w-8 rounded-full object-cover shadow-sm"
                                            />
                                        ) : (
                                            <div className="grid h-8 w-8 place-items-center rounded-full bg-gradient-to-br from-primary/20 to-primary/5 text-xs font-bold text-primary">
                                                {review.reviewerName.charAt(0).toUpperCase()}
                                            </div>
                                        )}
                                        <span className="text-xs font-semibold text-text-primary">
                                            {review.reviewerName}
                                        </span>
                                    </div>
                                </div>
                            ))}

                            {filteredReviews.length === 0 && (
                                <div className="py-10 text-center text-sm text-text-secondary">
                                    {t("product.noReviewsMatch")}
                                </div>
                            )}

                            {observerTarget && <div ref={observerTarget} className="h-4" />}

                            {isFetchingNextPage && (
                                <div className="flex justify-center py-4">
                                    <PremiumInlineLoader size="sm" />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
