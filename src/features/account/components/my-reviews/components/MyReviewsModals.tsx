import RatingFormModal from "../../RatingFormModal";
import type { EditRatingModalState, RateNowModalState } from "../types";

type MyReviewsModalsProps = {
    editDraft: EditRatingModalState | null;
    isEditOpen: boolean;
    onCloseEdit: () => void;
    rateNowDraft: RateNowModalState | null;
    isRateNowOpen: boolean;
    onCloseRateNow: () => void;
};

export default function MyReviewsModals({
    editDraft,
    isEditOpen,
    onCloseEdit,
    rateNowDraft,
    isRateNowOpen,
    onCloseRateNow,
}: MyReviewsModalsProps) {
    return (
        <>
            {editDraft ? (
                <RatingFormModal
                    isOpen={isEditOpen}
                    onClose={onCloseEdit}
                    onSuccess={onCloseEdit}
                    mode="edit"
                    ratingId={editDraft.ratingId}
                    initialRating={editDraft.initialRating}
                    initialComment={editDraft.initialComment}
                    initialImageUrl={editDraft.initialImageUrl}
                />
            ) : null}

            {rateNowDraft ? (
                <RatingFormModal
                    isOpen={isRateNowOpen}
                    onClose={onCloseRateNow}
                    onSuccess={onCloseRateNow}
                    mode="create"
                    rateableType={rateNowDraft.rateableType}
                    rateableId={rateNowDraft.rateableId}
                    orderId={rateNowDraft.orderId}
                />
            ) : null}
        </>
    );
}
