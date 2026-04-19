export type EditRatingModalState = {
    ratingId: number;
    initialRating: number;
    initialComment: string;
    initialImageUrl: string | null;
};

export type RateNowModalState = {
    rateableType: string;
    rateableId: number;
    orderId?: number;
};
