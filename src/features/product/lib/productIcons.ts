import { toStorageUrl } from "@/shared/lib/storageUrl";
import type { ProductIcon } from "../types/productDetails";

export function productIconImageUrl(
    icon: Pick<ProductIcon, "icon" | "image">,
): string | null {
    return toStorageUrl(icon.icon || icon.image);
}

/** Icons that can actually be rendered. Empty / null payload → no row. */
export function visibleProductIcons(
    icons: ProductIcon[] | null | undefined,
): ProductIcon[] {
    if (!icons?.length) return [];
    return icons.filter((item) => Boolean(productIconImageUrl(item)));
}
