import { toStorageUrl } from "@/shared/lib/storageUrl";
import type { ProductIcon } from "../types/productDetails";

/**
 * Image URL from the latest product payload. `icon` and `image` are the same
 * link. Keep the string as returned, including `?v=` — that query is what
 * makes the browser fetch the file after an admin replaces it.
 */
export function productIconImageUrl(
    icon: Pick<ProductIcon, "icon" | "image">,
): string | null {
    const raw = (icon.icon || icon.image)?.trim();
    if (!raw) return null;
    return toStorageUrl(raw);
}

/** Icons that can actually be rendered. Empty / null payload → no row. */
export function visibleProductIcons(
    icons: ProductIcon[] | null | undefined,
): ProductIcon[] {
    if (!icons?.length) return [];
    return icons.filter((item) => Boolean(productIconImageUrl(item)));
}
