import { useCallback, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import type { MyRatingItem } from "@/features/product/types/ratings";
import { useDeleteRating, useMyRatings } from "../../../hooks/useRatings";
import type { ReviewUnion } from "../../../types";
import {
    MY_REVIEWS_FILTER_DEFS,
    MY_REVIEWS_RATING_FILTER_DEFS,
    MY_REVIEWS_SORT_DEFS,
    type MyReviewsRatingFilter,
    type MyReviewsSortBy,
    type MyReviewsUiFilterValue,
} from "../constants";
import type { EditRatingModalState, RateNowModalState } from "../types";
import { applyClientSortAndRatingFilter } from "../utils/applyClientSortAndRatingFilter";
import { mapMyRatingToReviewUnion } from "../utils/mapMyRatingToReviewUnion";
import { mapUiFilterToApiRatingType } from "../utils/mapUiFilterToApiRatingType";

export function useMyReviewsPage() {
    const { t } = useTranslation();

    const [uiFilter, setUiFilter] = useState<MyReviewsUiFilterValue>("all");
    const [sortBy, setSortBy] = useState<MyReviewsSortBy>("newest");
    const [ratingFilter, setRatingFilter] =
        useState<MyReviewsRatingFilter>("all");

    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editRatingDraft, setEditRatingDraft] =
        useState<EditRatingModalState | null>(null);

    const [isRateNowModalOpen, setIsRateNowModalOpen] = useState(false);
    const [rateNowDraft, setRateNowDraft] = useState<RateNowModalState | null>(
        null
    );

    const apiRatingType = useMemo(
        () => mapUiFilterToApiRatingType(uiFilter),
        [uiFilter]
    );

    const { data: myRatingsData = [], isLoading: isLoadingMyRatings } =
        useMyRatings({
            type: apiRatingType,
        });

    const deleteRatingMutation = useDeleteRating();

    const apiItems: MyRatingItem[] = useMemo(
        () => (Array.isArray(myRatingsData) ? myRatingsData : []),
        [myRatingsData]
    );

    const filterTabs = useMemo(
        () =>
            MY_REVIEWS_FILTER_DEFS.map((def) => ({
                value: def.value,
                label: t(def.labelKey),
            })),
        [t]
    );

    const sortOptions = useMemo(
        () =>
            MY_REVIEWS_SORT_DEFS.map((def) => ({
                value: def.value,
                label: t(def.labelKey),
            })),
        [t]
    );

    const ratingOptions = useMemo(
        () =>
            MY_REVIEWS_RATING_FILTER_DEFS.map((def) => ({
                value: def.value,
                label: t(def.labelKey),
            })),
        [t]
    );

    const mappedReviews = useMemo(
        () => apiItems.map(mapMyRatingToReviewUnion),
        [apiItems]
    );

    const filteredAndSortedReviews = useMemo((): ReviewUnion[] => {
        return applyClientSortAndRatingFilter(
            mappedReviews,
            sortBy,
            ratingFilter
        );
    }, [mappedReviews, sortBy, ratingFilter]);

    const hasActiveFilters =
        uiFilter !== "all" || sortBy !== "newest" || ratingFilter !== "all";

    const clearFilters = useCallback(() => {
        setUiFilter("all");
        setSortBy("newest");
        setRatingFilter("all");
    }, []);

    const openEditReview = useCallback(
        (id: string | number) => {
            const raw = apiItems.find((item) => item.id === Number(id));
            if (!raw) return;
            setEditRatingDraft({
                ratingId: raw.id,
                initialRating: raw.rating,
                initialComment: raw.comment ?? "",
                initialImageUrl: raw.image ?? null,
            });
            setIsEditModalOpen(true);
        },
        [apiItems]
    );

    const confirmDeleteReview = useCallback(
        (id: string | number) => {
            if (
                !window.confirm(
                    t(
                        "account.myReviews.confirmDelete",
                        "هل أنت متأكد من حذف هذا التقييم؟"
                    )
                )
            ) {
                return;
            }
            deleteRatingMutation.mutate(Number(id));
        },
        [deleteRatingMutation, t]
    );

    const openRateNow = useCallback(
        (id: string | number, orderId?: string) => {
            setRateNowDraft({
                rateableType: "product",
                rateableId: Number(id),
                orderId: orderId ? parseInt(orderId, 10) : undefined,
            });
            setIsRateNowModalOpen(true);
        },
        []
    );

    const closeEditModal = useCallback(() => {
        setIsEditModalOpen(false);
        setEditRatingDraft(null);
    }, []);

    const closeRateNowModal = useCallback(() => {
        setIsRateNowModalOpen(false);
        setRateNowDraft(null);
    }, []);

    const selectedSortLabel =
        sortOptions.find((option) => option.value === sortBy)?.label ?? "";
    const selectedRatingLabel =
        ratingOptions.find((option) => option.value === ratingFilter)?.label ??
        "";

    return {
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
    };
}
