import { useMemo, useState, type CSSProperties } from "react";
import { useTranslation } from "react-i18next";
import { HiChevronUp, HiChevronDown } from "react-icons/hi";
import { HiSparkles, HiAdjustmentsHorizontal } from "react-icons/hi2";
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
            <div className="mb-5 flex items-center gap-3">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-[color-mix(in_srgb,var(--review-main)_85%,white)] to-[var(--review-accent)] text-white shadow-[0_10px_24px_-10px_color-mix(in_srgb,var(--review-accent)_75%,transparent)]">
                    <HiSparkles className="h-5 w-5" />
                </span>
                <div className="flex flex-col">
                    <h2 className="text-xl font-extrabold tracking-tight text-text-primary">
                        {heading}
                    </h2>
                    <p className="flex items-center gap-1.5 text-xs font-medium text-text-secondary">
                        <span className="text-amber-400">★</span>
                        {t("product.fromReviews")} {formatCount(totalReviews)}{" "}
                        {t("product.reviews")}
                    </p>
                </div>
            </div>

            {/* TOP SUMMARY BOX (one box like the image) */}
            <div className="relative overflow-hidden rounded-3xl border-2 border-[color-mix(in_srgb,var(--review-main)_38%,var(--review-accent)_62%)] bg-[linear-gradient(130deg,color-mix(in_srgb,var(--review-main)_6%,var(--review-surface))_0%,color-mix(in_srgb,var(--review-accent)_7%,var(--review-surface))_45%,color-mix(in_srgb,var(--review-main)_4%,var(--review-accent)_5%)_100%)] p-6 ring-1 ring-[color-mix(in_srgb,var(--review-main)_22%,var(--review-accent)_38%)] shadow-[0_24px_70px_-24px_color-mix(in_srgb,var(--review-accent)_52%,transparent),0_16px_42px_-26px_color-mix(in_srgb,var(--review-main)_52%,transparent)]">
                <div className="pointer-events-none absolute -top-12 -right-10 h-40 w-40 rounded-full bg-[color-mix(in_srgb,var(--review-accent)_22%,var(--review-surface))] blur-2xl" />
                <div className="pointer-events-none absolute -bottom-12 -left-10 h-40 w-40 rounded-full bg-[color-mix(in_srgb,var(--review-main)_20%,var(--review-surface))] blur-2xl" />
                <div className="pointer-events-none absolute inset-x-8 top-3 h-12 rounded-full bg-white/25 blur-xl dark:bg-[color-mix(in_srgb,var(--review-text)_8%,transparent)]" />
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
                    {/* Left: average rating ring */}
                    <div className="lg:col-span-4">
                        <div className="flex h-full flex-col items-center justify-center gap-3 rounded-2xl border border-[color-mix(in_srgb,var(--review-accent)_42%,transparent)] bg-custom-primary/65 p-5 text-center shadow-[0_16px_38px_-22px_color-mix(in_srgb,var(--review-accent)_68%,transparent),inset_0_1px_0_rgba(255,255,255,0.2)] backdrop-blur-sm dark:shadow-[0_16px_38px_-22px_color-mix(in_srgb,var(--review-accent)_68%,transparent),inset_0_1px_0_color-mix(in_srgb,var(--review-text)_10%,transparent)]">
                            {/* circular progress ring */}
                            <div className="relative grid h-24 w-24 place-items-center">
                                <svg
                                    viewBox="0 0 80 80"
                                    className="h-24 w-24 -rotate-90"
                                    aria-hidden
                                >
                                    <circle
                                        cx="40"
                                        cy="40"
                                        r="34"
                                        fill="none"
                                        strokeWidth="7"
                                        className="stroke-amber-100 dark:stroke-[color-mix(in_srgb,var(--review-text)_12%,transparent)]"
                                    />
                                    <circle
                                        cx="40"
                                        cy="40"
                                        r="34"
                                        fill="none"
                                        strokeWidth="7"
                                        strokeLinecap="round"
                                        stroke="url(#ratingGradient)"
                                        strokeDasharray={2 * Math.PI * 34}
                                        strokeDashoffset={
                                            2 *
                                            Math.PI *
                                            34 *
                                            (1 - Math.min(averageRating, 5) / 5)
                                        }
                                        style={{ transition: "stroke-dashoffset 0.8s ease" }}
                                    />
                                    <defs>
                                        <linearGradient id="ratingGradient" x1="0" y1="0" x2="1" y2="1">
                                            <stop offset="0%" stopColor="#fbbf24" />
                                            <stop offset="100%" stopColor="#f59e0b" />
                                        </linearGradient>
                                    </defs>
                                </svg>
                                <div className="absolute flex flex-col items-center">
                                    <span className="text-2xl font-extrabold leading-none text-text-primary">
                                        {averageRating.toFixed(1)}
                                    </span>
                                    <span className="text-[10px] font-medium text-text-secondary">
                                        / 5
                                    </span>
                                </div>
                            </div>

                            <StarsRow value={averageRating} size="text-lg" />
                            <p className="text-xs font-medium text-text-secondary">
                                {t("product.fromReviews")} {formatCount(totalReviews)}{" "}
                                {t("product.reviews")}
                            </p>
                        </div>
                    </div>

                    {/* Right: distribution bars */}
                    <div className="lg:col-span-8">
                        <div className="flex h-full flex-col justify-center gap-3.5 rounded-2xl border border-[color-mix(in_srgb,var(--review-accent)_38%,transparent)] bg-custom-primary/65 p-5 shadow-[0_16px_34px_-22px_color-mix(in_srgb,var(--review-accent)_62%,transparent),inset_0_1px_0_rgba(255,255,255,0.2)] backdrop-blur-sm dark:shadow-[0_16px_34px_-22px_color-mix(in_srgb,var(--review-accent)_62%,transparent),inset_0_1px_0_color-mix(in_srgb,var(--review-text)_10%,transparent)]">
                            {[5, 4, 3, 2, 1].map((r) => {
                                const count =
                                    ratingDistribution[String(r) as keyof RatingDistribution] ??
                                    0;
                                const width = getBarWidth(count);

                                return (
                                    <div key={r} className="flex items-center gap-3">
                                        {/* label "5 ★" */}
                                        <div className="flex w-9 items-center justify-end gap-0.5 text-xs font-semibold text-text-primary">
                                            <span>{r}</span>
                                            <span className="text-amber-400">★</span>
                                        </div>

                                        {/* bar */}
                                        <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-amber-100 dark:bg-[color-mix(in_srgb,var(--review-text)_12%,transparent)]">
                                            <div
                                                className="h-full rounded-full bg-gradient-to-r from-amber-300 to-amber-500 transition-[width] duration-700 ease-out"
                                                style={{ width: `${width}%` }}
                                            />
                                        </div>

                                        {/* count right */}
                                        <div className="w-7 text-right text-xs font-semibold text-text-secondary">
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
                        <div className="mb-4 flex items-center gap-2">
                            <span className="grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-amber-300 to-amber-500 text-white shadow-sm">
                                <HiAdjustmentsHorizontal className="h-4 w-4" />
                            </span>
                            <h3 className="text-sm font-bold text-text-primary">
                                {t("product.reviewsFilter")}
                            </h3>
                        </div>

                        <button
                            type="button"
                            onClick={() => setIsRatingFilterOpen((v) => !v)}
                            className="mb-3 flex w-full items-center justify-between text-xs font-semibold text-text-primary"
                        >
                            <span className="flex items-center gap-2">
                                {t("product.rating")}
                                {selectedRatings.length > 0 && (
                                    <span className="grid h-4 min-w-4 place-items-center rounded-full bg-amber-400 px-1 text-[10px] font-bold text-white">
                                        {selectedRatings.length}
                                    </span>
                                )}
                            </span>
                            <span className="flex items-center gap-2">
                                {selectedRatings.length > 0 && (
                                    <span
                                        role="button"
                                        tabIndex={0}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setSelectedRatings([]);
                                        }}
                                        onKeyDown={(e) => {
                                            if (e.key === "Enter" || e.key === " ") {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                setSelectedRatings([]);
                                            }
                                        }}
                                        className="cursor-pointer text-[11px] font-medium text-text-secondary underline-offset-2 hover:text-amber-500 hover:underline"
                                    >
                                        {t("common.clear", "Clear")}
                                    </span>
                                )}
                                {isRatingFilterOpen ? (
                                    <HiChevronUp className="h-4 w-4" />
                                ) : (
                                    <HiChevronDown className="h-4 w-4" />
                                )}
                            </span>
                        </button>

                        {isRatingFilterOpen && (
                            <div className="space-y-2">
                                {[5, 4, 3, 2, 1].map((rating) => {
                                    const count =
                                        ratingDistribution[
                                            String(rating) as keyof RatingDistribution
                                        ] ?? 0;
                                    const width = getBarWidth(count);
                                    const active = selectedRatings.includes(rating);

                                    return (
                                        <Label
                                            key={rating}
                                            className={cn(
                                                "group/filter relative flex cursor-pointer items-center gap-2.5 overflow-hidden rounded-2xl border px-3 py-2.5 font-normal transition-all",
                                                active
                                                    ? "border-amber-400/70 bg-amber-50 shadow-[0_8px_20px_-12px_rgba(245,158,11,0.55)] dark:bg-[color-mix(in_srgb,var(--review-accent)_24%,var(--review-surface))]"
                                                    : "border-transparent bg-custom-primary/50 hover:border-amber-300/50 hover:bg-amber-50/50 dark:hover:bg-[color-mix(in_srgb,var(--review-accent)_14%,var(--review-surface))]"
                                            )}
                                        >
                                            <input
                                                type="checkbox"
                                                checked={active}
                                                onChange={() => toggleRating(rating)}
                                                className="sr-only"
                                            />
                                            {/* check indicator */}
                                            <span
                                                className={cn(
                                                    "grid h-5 w-5 shrink-0 place-items-center rounded-full border-2 text-[10px] font-bold transition-all",
                                                    active
                                                        ? "border-amber-400 bg-amber-400 text-white"
                                                        : "border-custom-secondary text-transparent group-hover/filter:border-amber-300"
                                                )}
                                            >
                                                ✓
                                            </span>

                                            <div className="flex min-w-0 flex-1 flex-col gap-1">
                                                <div className="flex items-center justify-between gap-2">
                                                    <span className="flex items-center gap-0.5 text-xs">
                                                        {[1, 2, 3, 4, 5].map((s) => (
                                                            <span
                                                                key={s}
                                                                className={cn(
                                                                    s <= rating
                                                                        ? "text-amber-400"
                                                                        : "text-slate-200 dark:text-[color-mix(in_srgb,var(--review-text)_18%,transparent)]"
                                                                )}
                                                            >
                                                                ★
                                                            </span>
                                                        ))}
                                                    </span>
                                                    <span className="shrink-0 text-[11px] font-semibold text-text-secondary">
                                                        {count}
                                                    </span>
                                                </div>
                                                {/* mini bar */}
                                                <div className="h-1.5 overflow-hidden rounded-full bg-amber-100 dark:bg-[color-mix(in_srgb,var(--review-text)_12%,transparent)]">
                                                    <div
                                                        className="h-full rounded-full bg-gradient-to-r from-amber-300 to-amber-500 transition-[width] duration-500 ease-out"
                                                        style={{ width: `${width}%` }}
                                                    />
                                                </div>
                                            </div>
                                        </Label>
                                    );
                                })}
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
                                    className="group relative overflow-hidden rounded-2xl border border-[color-mix(in_srgb,var(--review-main)_22%,var(--review-accent)_30%)] bg-custom-card p-4 pl-5 shadow-[0_10px_24px_-18px_color-mix(in_srgb,var(--review-accent)_42%,transparent)] transition-all hover:-translate-y-0.5 hover:border-[color-mix(in_srgb,var(--review-accent)_60%,transparent)] hover:shadow-[0_18px_34px_-20px_color-mix(in_srgb,var(--review-accent)_60%,transparent)]"
                                >
                                    {/* accent rail */}
                                    <span className="absolute inset-y-3 left-0 w-1 rounded-full bg-gradient-to-b from-amber-300 to-amber-500 opacity-70 transition-opacity group-hover:opacity-100" />

                                    <div className="mb-3 flex items-center justify-between gap-3">
                                        <div className="flex items-center gap-2.5">
                                            {review.reviewerAvatar ? (
                                                <img
                                                    src={review.reviewerAvatar}
                                                    alt={review.reviewerName}
                                                    className="h-10 w-10 rounded-full object-cover ring-2 ring-amber-200/60 dark:ring-amber-400/20"
                                                />
                                            ) : (
                                                <div className="grid h-10 w-10 place-items-center rounded-full bg-gradient-to-br from-amber-300 to-amber-500 text-sm font-bold text-white shadow-sm">
                                                    {review.reviewerName.charAt(0).toUpperCase()}
                                                </div>
                                            )}
                                            <div className="flex flex-col">
                                                <span className="text-sm font-bold text-text-primary">
                                                    {review.reviewerName}
                                                </span>
                                                <StarsRow value={review.rating} size="text-sm" />
                                            </div>
                                        </div>
                                        <span className="whitespace-nowrap rounded-full bg-custom-primary/70 px-2.5 py-1 text-[11px] font-medium text-text-secondary">
                                            {review.date}
                                        </span>
                                    </div>

                                    <p className="text-sm font-medium leading-6 text-text-primary">
                                        {review.text}
                                    </p>
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
