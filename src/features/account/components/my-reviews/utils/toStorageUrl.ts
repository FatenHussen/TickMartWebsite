import { MY_REVIEWS_STORAGE_BASE } from "../constants";

export function toMyReviewsStorageUrl(path: string | null | undefined): string {
    if (!path) return "";
    if (path.startsWith("http")) return path;
    return `${MY_REVIEWS_STORAGE_BASE}/${path}`;
}
