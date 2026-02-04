import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useLanguage } from "@/context/LanguageContext";
import { cn } from "@/shared/lib/utils";
import { HiChevronDown } from "react-icons/hi";
import ProductReviewCard from "../components/ProductReviewCard";
import StoreReviewCard from "../components/StoreReviewCard";
import DeliveryReviewCard from "../components/DeliveryReviewCard";
import RecipeReviewCard from "../components/RecipeReviewCard";
import UnreviewedItemCard from "../components/UnreviewedItemCard";
import { mockReviews, mockUnreviewedItems } from "../data/mockData";
import type { ReviewType, ReviewUnion } from "../types";

type ReviewFilter = ReviewType | "all";
type SortOption = "newest" | "oldest" | "rating_high" | "rating_low";
type RatingFilter = "all" | "5" | "4" | "3" | "2" | "1";

export default function MyReviews() {
  const { t } = useTranslation();
  const { isRTL } = useLanguage();
  const [activeFilter, setActiveFilter] = useState<ReviewFilter>("all");
  const [sortBy, setSortBy] = useState<SortOption>("newest");
  const [ratingFilter, setRatingFilter] = useState<RatingFilter>("all");

  const filterTabs: { value: ReviewFilter; label: string }[] = [
    { value: "all", label: t("account.myReviews.filters.all") },
    { value: "product", label: t("account.myReviews.filters.products") },
    { value: "store", label: t("account.myReviews.filters.stores") },
    { value: "delivery", label: t("account.myReviews.filters.delivery") },
    {
      value: "scheduled_basket",
      label: t("account.myReviews.filters.scheduledBaskets"),
    },
    { value: "recipe", label: t("account.myReviews.filters.recipes") },
  ];

  const sortOptions: { value: SortOption; label: string }[] = [
    { value: "newest", label: t("account.myReviews.sort.newest") },
    { value: "oldest", label: t("account.myReviews.sort.oldest") },
    {
      value: "rating_high",
      label: t("account.myReviews.sort.highestRating"),
    },
    { value: "rating_low", label: t("account.myReviews.sort.lowestRating") },
  ];

  const ratingOptions: { value: RatingFilter; label: string }[] = [
    { value: "all", label: t("account.myReviews.ratingFilter.all") },
    { value: "5", label: t("account.myReviews.ratingFilter.fiveStars") },
    { value: "4", label: t("account.myReviews.ratingFilter.fourStars") },
    { value: "3", label: t("account.myReviews.ratingFilter.threeStars") },
    { value: "2", label: t("account.myReviews.ratingFilter.twoStars") },
    { value: "1", label: t("account.myReviews.ratingFilter.oneStar") },
  ];

  const filteredAndSortedReviews = useMemo(() => {
    let reviews = [...mockReviews];

    // Filter by type
    if (activeFilter !== "all") {
      reviews = reviews.filter((review) => review.type === activeFilter);
    }

    // Filter by rating
    if (ratingFilter !== "all") {
      const ratingValue = parseInt(ratingFilter);
      reviews = reviews.filter((review) => {
        const roundedRating = Math.round(review.rating);
        return roundedRating === ratingValue;
      });
    }

    // Sort reviews
    reviews.sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case "oldest":
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case "rating_high":
          return b.rating - a.rating;
        case "rating_low":
          return a.rating - b.rating;
        default:
          return 0;
      }
    });

    return reviews;
  }, [activeFilter, sortBy, ratingFilter]);

  const handleClearFilters = () => {
    setActiveFilter("all");
    setSortBy("newest");
    setRatingFilter("all");
  };

  const handleEditReview = (id: string | number) => {
    // TODO: Navigate to edit review page
    console.log("Edit review:", id);
  };

  const handleDeleteReview = (id: string | number) => {
    // TODO: Delete review logic
    console.log("Delete review:", id);
  };

  const handleRateNow = (id: string | number) => {
    // TODO: Navigate to rate item page
    console.log("Rate now:", id);
  };

  const renderReviewCard = (review: ReviewUnion) => {
    switch (review.type) {
      case "product":
        return (
          <ProductReviewCard
            key={review.id}
            review={review}
            onEdit={handleEditReview}
            onDelete={handleDeleteReview}
          />
        );
      case "store":
        return (
          <StoreReviewCard
            key={review.id}
            review={review}
            onEdit={handleEditReview}
          />
        );
      case "delivery":
        return (
          <DeliveryReviewCard
            key={review.id}
            review={review}
            onEdit={handleEditReview}
          />
        );
      case "recipe":
        return (
          <RecipeReviewCard
            key={review.id}
            review={review}
            onEdit={handleEditReview}
          />
        );
      case "scheduled_basket":
        // For now, use delivery card style
        return (
          <DeliveryReviewCard
            key={review.id}
            review={{
              ...review,
              type: "delivery",
              orderId: review.orderId || "",
              deliveryDate: review.date,
            }}
            onEdit={handleEditReview}
          />
        );
      default:
        return null;
    }
  };

  const hasActiveFilters =
    activeFilter !== "all" || sortBy !== "newest" || ratingFilter !== "all";

  return (
    <div className="space-y-6" dir={isRTL ? "rtl" : "ltr"}>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-gray-900 dark:text-white mb-1">
          {t("account.myReviews.title")}
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {t("account.myReviews.description")}
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-sm text-gray-700 dark:text-gray-300 whitespace-nowrap">
            {t("account.myReviews.reviewType")}:
          </span>
          <div className="flex flex-wrap gap-2">
            {filterTabs.map((tab) => (
              <button
                key={tab.value}
                onClick={() => setActiveFilter(tab.value)}
                className={cn(
                  "px-4 py-1.5 rounded-full text-xs font-medium transition-all",
                  activeFilter === tab.value
                    ? "bg-cyan-500 text-white"
                    : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Sort & Filter Controls */}
      <div
        className={cn(
          "flex flex-col md:flex-row items-start md:items-center gap-3 mb-6",
          isRTL && "md:flex-row-reverse"
        )}
      >
        {/* Sort Dropdown */}
        <div className="relative">
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors">
            <span className="text-sm">
              {t("account.myReviews.sortBy")}: {sortOptions.find((o) => o.value === sortBy)?.label}
            </span>
            <HiChevronDown className="w-4 h-4 text-gray-400" />
          </button>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOption)}
            className="absolute inset-0 opacity-0 cursor-pointer"
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Rating Filter Dropdown */}
        <div className="relative">
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors">
            <span className="text-sm">
              {ratingOptions.find((o) => o.value === ratingFilter)?.label}
            </span>
            <HiChevronDown className="w-4 h-4 text-gray-400" />
          </button>
          <select
            value={ratingFilter}
            onChange={(e) => setRatingFilter(e.target.value as RatingFilter)}
            className="absolute inset-0 opacity-0 cursor-pointer"
          >
            {ratingOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Clear Filters Link */}
        {hasActiveFilters && (
          <button
            onClick={handleClearFilters}
            className="text-sm text-cyan-500 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors"
          >
            {t("account.myReviews.clearFilters")}
          </button>
        )}
      </div>

      {/* Reviews List */}
      {filteredAndSortedReviews.length === 0 ? (
        <div className="py-14 text-center">
          <p className="text-gray-500 dark:text-gray-400">
            {t("account.myReviews.noReviewsFound")}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredAndSortedReviews.map((review) => renderReviewCard(review))}
        </div>
      )}

      {/* Unreviewed Items Section */}
      {mockUnreviewedItems.length > 0 && (
        <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
          <div className="mb-6">
            <h2 className="text-base font-semibold text-gray-900 dark:text-white mb-2">
              {t("account.myReviews.unreviewed.title")}
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {t("account.myReviews.unreviewed.description")}
            </p>
          </div>
          <div className="space-y-3">
            {mockUnreviewedItems.map((item) => (
              <UnreviewedItemCard
                key={item.id}
                item={item}
                onRateNow={handleRateNow}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
