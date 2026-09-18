import type { ProductImage, ShopVariant } from "../types/productDetails";

export type ProductMediaSource = {
    images?: Array<ProductImage | string | null | undefined> | null;
    thumbnail?: string | null;
};

export type VariantMediaSource = {
    has_variant_images?: ShopVariant["has_variant_images"];
    images?: Array<ProductImage | string | null | undefined> | null;
};

/** Web/Flutter use `path`; admin payloads use `url`. Storefront prefers `path`. */
export function mediaSrc(
    image: ProductImage | string | null | undefined,
): string {
    if (!image) return "";
    if (typeof image === "string") return image.trim();
    return (image.path || image.url || "").trim();
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

function productGallery(
    product?: ProductMediaSource | null,
): Array<ProductImage | string> {
    if (product?.images?.length) {
        return product.images.filter((image): image is ProductImage | string =>
            Boolean(image),
        );
    }
    const thumb = product?.thumbnail?.trim();
    return thumb ? [{ path: thumb }] : [];
}

/**
 * Gallery for `/product/{id}`: own variant photos only when
 * `has_variant_images` is true. A filled `images[]` with the flag false is
 * the product fallback — do not treat it as a color-specific gallery.
 */
export function galleryFor(
    product?: ProductMediaSource | null,
    selected?: VariantMediaSource | null,
): Array<ProductImage | string> {
    const variantImages = (selected?.images ?? []).filter(
        (image): image is ProductImage | string => Boolean(image),
    );
    const owns = variantOwnsImagesFlag(selected?.has_variant_images);

    if (owns === true && variantImages.length) {
        return variantImages;
    }
    if (owns === false) {
        return productGallery(product);
    }
    if (owns == null && variantImages.length) {
        return variantImages;
    }
    return productGallery(product);
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
