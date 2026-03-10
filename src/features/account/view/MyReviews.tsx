import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useLanguage } from "@/context/LanguageContext";
import { cn } from "@/shared/lib/utils";
import { HiChevronDown } from "react-icons/hi";
import ProductReviewCard from "../components/ProductReviewCard";
import StoreReviewCard from "../components/StoreReviewCard";
import DeliveryReviewCard from "../components/DeliveryReviewCard";
import RecipeReviewCard from "../components/RecipeReviewCard";
import ScheduledBasketReviewCard from "../components/ScheduledBasketReviewCard";
import BrandReviewCard from "../components/BrandReviewCard";
import BasketReviewCard from "../components/BasketReviewCard";
import UnreviewedItemCard from "../components/UnreviewedItemCard";
import RatingFormModal from "../components/RatingFormModal";
import { mockUnreviewedItems } from "../data/mockData";
import { useMyRatings, useDeleteRating } from "../hooks/useRatings";
import type { MyRatingItem } from "@/features/product/types/ratings";
import type { ReviewType, ReviewUnion } from "../types";

const STORAGE_BASE = "https://tikmool.octopus-software.online/storage";

function toStorageUrl(path: string | null | undefined): string {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  return `${STORAGE_BASE}/${path}`;
}

type ReviewFilter = ReviewType | "all";
type SortOption = "newest" | "oldest" | "rating_high" | "rating_low";
type RatingFilter = "all" | "5" | "4" | "3" | "2" | "1";

function formatReviewDate(createdAt: string): string {
  try {
    return new Date(createdAt).toLocaleDateString(undefined, {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch {
    return createdAt;
  }
}

function mapMyRatingToReviewUnion(item: MyRatingItem): ReviewUnion {
  const date = formatReviewDate(item.created_at);
  const type = item.type ?? "delivery";
  const name = item.target.name ?? "";
  const imageUrl = toStorageUrl(item.target.image);

  const base = {
    id: item.id,
    type,
    rating: item.rating,
    date,
    createdAt: item.created_at,
  };

  if (type === "product") {
    return {
      ...base,
      type: "product",
      productName: name,
      productImage: imageUrl,
      seller: "",
      reviewText: item.comment ?? "",
      images: item.image ? [toStorageUrl(item.image)] : [],
      orderId: "",
    } as ReviewUnion;
  }
  if (type === "shop") {
    return {
      ...base,
      type: "store",
      storeName: name,
      storeIcon: imageUrl || undefined,
      reviewText: item.comment ?? undefined,
    } as ReviewUnion;
  }
  if (type === "delivery") {
    return {
      ...base,
      type: "delivery",
      orderId: "",
      deliveryDate: date,
      reviewText: item.comment ?? undefined,
    } as ReviewUnion;
  }
  if (type === "recipe") {
    return {
      ...base,
      type: "recipe",
      recipeName: name,
      recipeImage: imageUrl || undefined,
      triedDate: date,
      reviewText: item.comment ?? undefined,
    } as ReviewUnion;
  }
  if (type === "schedule_basket" || type === "scheduled_basket") {
    return {
      ...base,
      type: "scheduled_basket",
      basketName: name,
      basketImage: imageUrl || undefined,
      orderId: "",
      reviewText: item.comment ?? undefined,
    } as ReviewUnion;
  }
  if (type === "brand") {
    return {
      ...base,
      type: "brand",
      brandName: name,
      brandIcon: imageUrl || undefined,
      reviewText: item.comment ?? undefined,
    } as ReviewUnion;
  }
  if (type === "basket") {
    return {
      ...base,
      type: "basket",
      basketName: name,
      basketImage: imageUrl || undefined,
      reviewText: item.comment ?? undefined,
    } as ReviewUnion;
  }
  // type === null or unknown: treat as delivery (e.g. driver/person rating)
  return {
    ...base,
    type: "delivery",
    orderId: "",
    deliveryDate: date,
    targetName: name,
    reviewText: item.comment ?? undefined,
  } as ReviewUnion;
}

export default function MyReviews() {
  const { t } = useTranslation();
  const { isRTL } = useLanguage();
  const [activeFilter, setActiveFilter] = useState<ReviewFilter>("all");
  const [sortBy, setSortBy] = useState<SortOption>("newest");
  const [ratingFilter, setRatingFilter] = useState<RatingFilter>("all");
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editRatingState, setEditRatingState] = useState<{
    ratingId: number;
    initialRating: number;
    initialComment: string;
    initialImageUrl: string | null;
  } | null>(null);
  const [rateNowModalOpen, setRateNowModalOpen] = useState(false);
  const [rateNowState, setRateNowState] = useState<{
    rateableType: string;
    rateableId: number;
    orderId?: number;
  } | null>(null);

  const apiType =
    activeFilter === "all"
      ? undefined
      : activeFilter === "scheduled_basket"
        ? "schedule_basket"
        : activeFilter === "store"
          ? "shop"
          : activeFilter === "basket"
            ? "basket"
            : activeFilter;

  const { data: myRatingsData = [], isLoading: isLoadingMyRatings } = useMyRatings({
    type: apiType,
  });
  const deleteRating = useDeleteRating();

  const apiItems: MyRatingItem[] = Array.isArray(myRatingsData) ? myRatingsData : [];

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
    { value: "brand", label: t("account.myReviews.filters.brands") },
    { value: "basket", label: t("account.myReviews.filters.baskets") },
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
    let reviews = apiItems.map(mapMyRatingToReviewUnion);

    if (ratingFilter !== "all") {
      const ratingValue = parseInt(ratingFilter);
      reviews = reviews.filter((review) => Math.round(review.rating) === ratingValue);
    }

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
  }, [apiItems, sortBy, ratingFilter]);

  const handleClearFilters = () => {
    setActiveFilter("all");
    setSortBy("newest");
    setRatingFilter("all");
  };

  const handleEditReview = (id: string | number) => {
    const raw = apiItems.find((i) => i.id === Number(id));
    if (!raw) return;
    setEditRatingState({
      ratingId: raw.id,
      initialRating: raw.rating,
      initialComment: raw.comment ?? "",
      initialImageUrl: raw.image ?? null,
    });
    setEditModalOpen(true);
  };

  const handleDeleteReview = (id: string | number) => {
    if (!window.confirm(t("account.myReviews.confirmDelete", "هل أنت متأكد من حذف هذا التقييم؟")))
      return;
    deleteRating.mutate(Number(id));
  };

  const handleRateNow = (id: string | number, orderId?: string) => {
    setRateNowState({
      rateableType: "product",
      rateableId: Number(id),
      orderId: orderId ? parseInt(orderId, 10) : undefined,
    });
    setRateNowModalOpen(true);
  };

  const handleEditModalClose = () => {
    setEditModalOpen(false);
    setEditRatingState(null);
  };

  const handleRateNowModalClose = () => {
    setRateNowModalOpen(false);
    setRateNowState(null);
  };

  const renderReviewCard = (review: ReviewUnion) => {
    const compact = true;
    switch (review.type) {
      case "product":
        return (
          <ProductReviewCard
            key={review.id}
            review={review}
            onEdit={handleEditReview}
            onDelete={handleDeleteReview}
            compact={compact}
          />
        );
      case "store":
        return (
          <StoreReviewCard
            key={review.id}
            review={review}
            onEdit={handleEditReview}
            compact={compact}
          />
        );
      case "delivery":
        return (
          <DeliveryReviewCard
            key={review.id}
            review={review}
            onEdit={handleEditReview}
            compact={compact}
          />
        );
      case "recipe":
        return (
          <RecipeReviewCard
            key={review.id}
            review={review}
            onEdit={handleEditReview}
            compact={compact}
          />
        );
      case "scheduled_basket":
        return (
          <ScheduledBasketReviewCard
            key={review.id}
            review={review}
            onEdit={handleEditReview}
            compact={compact}
          />
        );
      case "brand":
        return (
          <BrandReviewCard
            key={review.id}
            review={review}
            onEdit={handleEditReview}
            compact={compact}
          />
        );
      case "basket":
        return (
          <BasketReviewCard
            key={review.id}
            review={review}
            onEdit={handleEditReview}
            compact={compact}
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
      {/* Header: title left, edit note top right */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
            {t("account.myReviews.title")}
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {t("account.myReviews.description")}
          </p>
        </div>
        <p className="text-xs text-gray-400 dark:text-gray-500 sm:text-right whitespace-nowrap">
          {t("account.myReviews.editDeleteNote")}
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2 mb-4">
        <span className="text-sm text-gray-700 dark:text-gray-300 whitespace-nowrap">
          {t("account.myReviews.reviewType")}:
        </span>
        {filterTabs.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setActiveFilter(tab.value)}
            className={cn(
              "px-4 py-2 rounded-full text-sm font-medium transition-all",
              activeFilter === tab.value
                ? "bg-cyan-500 text-white"
                : "border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Sort & Filter Controls */}
      <div
        className={cn(
          "flex flex-wrap items-center gap-3 mb-6",
          isRTL && "flex-row-reverse"
        )}
      >
        {/* Sort Dropdown */}
        <div className="relative">
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            <span className="text-sm">
              {t("account.myReviews.sortBy")}:{" "}
              {sortOptions.find((o) => o.value === sortBy)?.label}
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
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
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
            className="text-sm text-blue-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            {t("account.myReviews.clearFilters")}
          </button>
        )}
      </div>

      {/* Reviews List */}
      {isLoadingMyRatings ? (
        <div className="py-14 flex justify-center">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500" />
        </div>
      ) : filteredAndSortedReviews.length === 0 ? (
        <div className="py-14 text-center">
          <p className="text-gray-500 dark:text-gray-400">
            {t("account.myReviews.noReviewsFound")}
          </p>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 divide-y divide-gray-200 dark:divide-gray-700 overflow-hidden">
          {filteredAndSortedReviews.map((review) => (
            <div key={review.id} className="p-5">
              {renderReviewCard(review)}
            </div>
          ))}
        </div>
      )}

      {/* Unreviewed Items Section */}
      {!isLoadingMyRatings && mockUnreviewedItems.length > 0 && (
        <div className="mt-8 p-6 rounded-xl bg-blue-50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/50">
          <div className="mb-4">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
              {t("account.myReviews.unreviewed.title")}
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {t("account.myReviews.unreviewed.description")}
            </p>
          </div>
          <div className="divide-y divide-blue-200 dark:divide-blue-800/50">
            {mockUnreviewedItems.map((item) => (
              <UnreviewedItemCard
                key={item.id}
                item={item}
                onRateNow={(id, orderId) => handleRateNow(id, orderId)}
                compact
              />
            ))}
          </div>
        </div>
      )}

      {/* Edit rating modal */}
      {editRatingState && (
        <RatingFormModal
          isOpen={editModalOpen}
          onClose={handleEditModalClose}
          onSuccess={handleEditModalClose}
          mode="edit"
          ratingId={editRatingState.ratingId}
          initialRating={editRatingState.initialRating}
          initialComment={editRatingState.initialComment}
          initialImageUrl={editRatingState.initialImageUrl}
        />
      )}

      {/* Rate now (create) modal */}
      {rateNowState && (
        <RatingFormModal
          isOpen={rateNowModalOpen}
          onClose={handleRateNowModalClose}
          onSuccess={handleRateNowModalClose}
          mode="create"
          rateableType={rateNowState.rateableType}
          rateableId={rateNowState.rateableId}
          orderId={rateNowState.orderId}
        />
      )}
    </div>
  );
}
