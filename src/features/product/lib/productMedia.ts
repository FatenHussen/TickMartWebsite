import type { ProductImage, ShopVariant } from "../types/productDetails";

export type ProductMediaSource = {
    images?: Array<ProductImage | string | null | undefined> | null;
    thumbnail?: string | null;
};

export type VariantMediaSource = {
    has_variant_images?: ShopVariant["has_variant_images"];
    images?: Array<ProductImage | string | null | undefined> | null;
};

/**
 * Storefront gallery field is `path`. `url` is the dashboard field and is ignored.
 * The value is already a full URL (`https://.../storage/...`). Return it as-is —
 * never prefix `/storage` onto a link that already starts with `http`.
 * `id: null` is the synthetic thumbnail row and is a normal gallery image.
 */
export function mediaSrc(
    image: ProductImage | string | null | undefined,
): string {
    if (!image) return "";
    if (typeof image === "string") return image.trim();
    return (image.path ?? "").trim();
}

function asMediaString(value: unknown): string {
    return typeof value === "string" ? value.trim() : "";
}

/** List / section / search / bought-with cards: `image`, then `thumbnail`. */
export function listingImageSrc(
    product?: {
        image?: string | null;
        thumbnail?: string | null;
    } | null,
): string {
    const image = asMediaString(product?.image);
    if (image) return image;
    return asMediaString(product?.thumbnail);
}

export function mediaSrcs(
    images?: Array<ProductImage | string | null | undefined> | null,
): string[] {
    if (!images?.length) return [];
    const seen = new Set<string>();
    const out: string[] = [];
    for (const image of images) {
        const src = mediaSrc(image);
        if (!src || seen.has(src)) continue;
        seen.add(src);
        out.push(src);
    }
    return out;
}

/**
 * `true` / `false` when the API sent the flag; `null` when it was omitted
 * (older payloads — then non-empty `images` is treated as own gallery).
 */
export function variantOwnsImagesFlag(
    value: unknown,
): boolean | null {
    if (value === true || value === 1 || value === "1" || value === "true") {
        return true;
    }
    if (value === false || value === 0 || value === "0" || value === "false") {
        return false;
    }
    return null;
}

function usableImages(
    images?: Array<ProductImage | string | null | undefined> | null,
): Array<ProductImage | string> {
    if (!images?.length) return [];
    return images.filter((image): image is ProductImage | string =>
        Boolean(mediaSrc(image)),
    );
}

/**
 * Gallery for `/product/{id}`:
 * 1. `shop_variants[i].images` only when `has_variant_images === true`
 * 2. otherwise `product.images` (`path`, including the synthetic thumbnail)
 * 3. `product.thumbnail` when both are empty
 * 4. a variant with `has_variant_images === false` inherits that same `path`
 */
export function galleryFor(
    product?: ProductMediaSource | null,
    selected?: VariantMediaSource | null,
): Array<ProductImage | string> {
    const variantImages = usableImages(selected?.images);
    const productImages = usableImages(product?.images);
    const owns = variantOwnsImagesFlag(selected?.has_variant_images);

    if (owns === true && variantImages.length) {
        return variantImages;
    }
    // Older payloads omit the flag; a non-empty variant gallery was its own.
    if (owns == null && variantImages.length) {
        return variantImages;
    }
    if (productImages.length) {
        return productImages;
    }
    const thumb = product?.thumbnail?.trim();
    if (thumb) return [{ path: thumb }];
    if (owns === false && variantImages.length) {
        return variantImages;
    }
    return [];
}

/**
 * String URLs for the selected shop variant:
 * own variant images → product images → thumbnail.
 */
export function gallerySrcsForSelection(
    selectedVariant: VariantMediaSource | null | undefined,
    product?: ProductMediaSource | null,
): string[] {
    return mediaSrcs(galleryFor(product, selectedVariant));
}
