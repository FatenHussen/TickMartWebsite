import { useMemo, useState } from"react";
import { useTranslation } from"react-i18next";
import { HiChevronUp, HiChevronDown } from"react-icons/hi";
import { cn } from"@/shared/lib/utils";
import Label from"@/shared/ui/Label";

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
 .replace(/0+$/,"")
 .replace(/\.$/,"");
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

 const StarsRow = ({
 value,
 size ="text-base",
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
 s <= Math.round(value) ?"text-amber-400":"text-slate-200"
 )}
 >
 ★
 </span>
 ))}
 </div>
 );

 return (
 <div className={cn("mt-10", className)}>
 <h2 className="mb-5 text-xl font-bold text-text-primary">
 {heading}
 </h2>

 {/* TOP SUMMARY BOX (one box like the image) */}
 <div className="rounded-xl border border-custom-secondary bg-custom-primary p-6">
 <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
 {/* Left: average rating ring */}
 <div className="lg:col-span-4">
 <div className="flex items-center gap-5">
 {/* ring */}
 <div className="relative grid h-16 w-16 place-items-center rounded-full ring-2 ring-amber-400">
 <span className="text-lg font-bold text-text-primary">
 {averageRating.toFixed(1)}
 </span>
 </div>

 <div className="flex flex-col gap-1">
 <StarsRow value={averageRating} size="text-lg"/>
 <p className="text-xs text-text-secondary">
 {t("product.fromReviews")} {formatCount(totalReviews)}{""}
 {t("product.reviews")}
 </p>
 </div>
 </div>
 </div>

 {/* Right: distribution bars */}
 <div className="lg:col-span-8">
 <div className="space-y-3">
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
 <div className="col-span-8 h-2 rounded-full bg-custom-tertiary overflow-hidden">
 <div
 className="h-full rounded-full bg-text-primary transition-all"
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
 <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-12">
 {/* Left: Filter */}
 <div className="lg:col-span-3">
 <div className="rounded-xl border border-custom-secondary bg-custom-primary p-5">
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
 <HiChevronUp className="h-4 w-4"/>
 ) : (
 <HiChevronDown className="h-4 w-4"/>
 )}
 </button>

 {isRatingFilterOpen && (
 <div className="space-y-2">
 {[5, 4, 3, 2, 1].map((rating) => (
 <Label
 key={rating}
 className="flex items-center gap-2 text-xs text-text-primary cursor-pointer font-normal"
 >
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
 </Label>
 ))}
 </div>
 )}
 </div>
 </div>

 {/* Right: Review list */}
 <div className="lg:col-span-9">
 <div className="rounded-xl border border-custom-secondary bg-custom-primary p-6">
 <h3 className="mb-5 text-sm font-bold text-text-primary">
 {t("product.reviewLists")}
 </h3>

 <div className="space-y-6">
 {filteredReviews.map((review) => (
 <div
 key={review.id}
 className="border-b border-custom-secondary pb-6 last:border-b-0 last:pb-0"
 >
 {/* stars on top like image */}
 <div className="mb-2">
 <StarsRow value={review.rating} size="text-base"/>
 </div>

 <p className="text-sm font-semibold text-text-primary">
 {review.text}
 </p>
 <p className="mt-1 text-xs text-text-secondary">
 {review.date}
 </p>

 <div className="mt-3 flex items-center gap-2">
 {review.reviewerAvatar ? (
 <img
 src={review.reviewerAvatar}
 alt={review.reviewerName}
 className="h-6 w-6 rounded-full object-cover"
 />
 ) : (
 <div className="grid h-6 w-6 place-items-center rounded-full bg-custom-tertiary text-[10px] font-bold text-text-primary">
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

 {observerTarget && <div ref={observerTarget} className="h-4"/>}

 {isFetchingNextPage && (
 <div className="flex justify-center py-4">
 <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-light"/>
 </div>
 )}
 </div>
 </div>
 </div>
 </div>
 </div>
 );
}
