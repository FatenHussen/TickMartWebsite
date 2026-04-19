import type { ComplaintType, ComplaintStatus } from "../../types";

/** Default categories if API doesn't return types */
export const DEFAULT_FAQ_TYPE_IDS = [
    "orders",
    "delivery",
    "payments",
    "account",
    "stores&drivers",
    "other",
] as const;

export const MAX_COMPLAINT_IMAGES = 5;

export const MAX_COMPLAINT_IMAGE_SIZE_MB = 10;

export const ALLOWED_COMPLAINT_IMAGE_MIME_TYPES = [
    "image/jpeg",
    "image/jpg",
    "image/png",
] as const;

export const COMPLAINT_TYPE_OPTIONS: { value: ComplaintType; translationKey: string }[] = [
    { value: "product", translationKey: "complaints.typeProduct" },
    { value: "order", translationKey: "complaints.typeOrder" },
    { value: "driver", translationKey: "complaints.typeDelivery" },
    { value: "merchant", translationKey: "complaints.typeStore" },
];

export const COMPLAINT_STATUS_FILTER_OPTIONS: {
    value: ComplaintStatus | "";
    translationKey: string;
}[] = [
    { value: "", translationKey: "complaints.filterAll" },
    { value: "new", translationKey: "complaints.statusNew" },
    { value: "in_review", translationKey: "complaints.statusInReview" },
    { value: "resolved", translationKey: "complaints.statusResolved" },
    { value: "rejected", translationKey: "complaints.statusRejected" },
];
