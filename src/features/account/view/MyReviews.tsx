import { useLanguage } from "@/context/LanguageContext";
import MyReviewsFilterTabs from "../components/my-reviews/components/MyReviewsFilterTabs";
import MyReviewsListStates from "../components/my-reviews/components/MyReviewsListStates";
import MyReviewsModals from "../components/my-reviews/components/MyReviewsModals";
import MyReviewsPageHeader from "../components/my-reviews/components/MyReviewsPageHeader";
import MyReviewsToolbar from "../components/my-reviews/components/MyReviewsToolbar";
import MyReviewsUnreviewedSection from "../components/my-reviews/components/MyReviewsUnreviewedSection";
import { useMyReviewsPage } from "../components/my-reviews/hooks/useMyReviewsPage";

export default function MyReviews() {
    const { isRTL } = useLanguage();

    const {
        filterTabs,
        sortOptions,
        ratingOptions,
        uiFilter,
        setUiFilter,
        sortBy,
        setSortBy,
        ratingFilter,
        setRatingFilter,
        hasActiveFilters,
        clearFilters,
        filteredAndSortedReviews,
        isLoadingMyRatings,
        openEditReview,
        confirmDeleteReview,
        openRateNow,
        isEditModalOpen,
        editRatingDraft,
        closeEditModal,
        isRateNowModalOpen,
        rateNowDraft,
        closeRateNowModal,
        selectedSortLabel,
        selectedRatingLabel,
    } = useMyReviewsPage();

    return (
        <div className="relative space-y-5" dir={isRTL ? "rtl" : "ltr"}>
            <div
                className="pointer-events-none absolute inset-x-0 -top-6 -z-10 h-48 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,color-mix(in_srgb,var(--color-api-second)_14%,transparent),transparent_70%)]"
                aria-hidden
            />
            <MyReviewsPageHeader />

            <MyReviewsFilterTabs
                tabs={filterTabs}
                activeValue={uiFilter}
                onSelect={setUiFilter}
            />

            <MyReviewsToolbar
                isRTL={isRTL}
                sortOptions={sortOptions}
                sortBy={sortBy}
                onSortChange={setSortBy}
                selectedSortLabel={selectedSortLabel}
                ratingOptions={ratingOptions}
                ratingFilter={ratingFilter}
                onRatingFilterChange={setRatingFilter}
                selectedRatingLabel={selectedRatingLabel}
                showClearFilters={hasActiveFilters}
                onClearFilters={clearFilters}
            />

            <MyReviewsListStates
                isLoading={isLoadingMyRatings}
                reviews={filteredAndSortedReviews}
                onEdit={openEditReview}
                onDelete={confirmDeleteReview}
            />

            <MyReviewsUnreviewedSection
                isParentLoading={isLoadingMyRatings}
                onRateNow={openRateNow}
            />

            <MyReviewsModals
                editDraft={editRatingDraft}
                isEditOpen={isEditModalOpen}
                onCloseEdit={closeEditModal}
                rateNowDraft={rateNowDraft}
                isRateNowOpen={isRateNowModalOpen}
                onCloseRateNow={closeRateNowModal}
            />
        </div>
    );
}
