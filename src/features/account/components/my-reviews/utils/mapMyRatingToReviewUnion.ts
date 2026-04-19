import type { MyRatingItem } from "@/features/product/types/ratings";
import type { ReviewUnion } from "../../../types";
import { formatReviewDate } from "./formatReviewDate";
import { toMyReviewsStorageUrl } from "./toStorageUrl";

export function mapMyRatingToReviewUnion(item: MyRatingItem): ReviewUnion {
    const date = formatReviewDate(item.created_at);
    const type = item.type ?? "delivery";
    const name = item.target.name ?? "";
    const imageUrl = toMyReviewsStorageUrl(item.target.image);

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
            images: item.image ? [toMyReviewsStorageUrl(item.image)] : [],
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
    return {
        ...base,
        type: "delivery",
        orderId: "",
        deliveryDate: date,
        targetName: name,
        reviewText: item.comment ?? undefined,
    } as ReviewUnion;
}
