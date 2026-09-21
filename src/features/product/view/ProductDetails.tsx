import { useState, useMemo, useEffect, useCallback, useRef } from "react";
import { useParams, useSearchParams, useNavigate, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useLanguage } from "@/context/LanguageContext";
import { useCurrency } from "@/context/CurrencyContext";
import ProductImageGallery from "../components/ProductImageGallery";
import ProductInfo from "../components/ProductInfo";
import AttributeSelector from "../components/AttributeSelector";
import ProductQuantitySelector from "../components/ProductQuantitySelector";
import ProductActions from "../components/ProductActions";
import ProductDescription from "../components/ProductDescription";
import ShopVariantsPreview from "../components/ShopVariantsPreview";
import ExtraDetailsTable from "../components/ExtraDetailsTable";
import ExtrasCheckboxTable from "../components/ExtrasCheckboxTable";
import {
    SoldWithThisProduct,
    SimilarProducts,
    ProductsFromSameSeller,
} from "@/shared/component/slider/presets";
import ProductReviews from "@/shared/component/ProductReviews";
import type { RatingDistribution } from "@/shared/component/ProductReviews";
import FullBleedSection from "@/shared/component/FullBleedSection";
import { useProductDetails } from "../hooks/useProductDetails";
import { useProductRatings } from "../hooks/useProductRatings";
import { useVariantSelector } from "../hooks/useVariantSelector";
import { useSimilarProducts } from "../hooks/useSimilarProducts";
import { useProductsFromSameSeller } from "../hooks/useProductsFromSameSeller";
import {
    resolveDisplayListPrice,
    resolveDisplaySalePrice,
    resolveListingCardPrices,
} from "@/shared/lib/formatApiPrice";
import { toast } from "sonner";
import { useCartStore } from "@/store/cart";
import { useAuthStore } from "@/store/auth";
import type { CartItem, CartExtraLine } from "@/features/cart/types";
import { extrasLineKeyFromExtras } from "@/features/cart/utils/cartExtras";
import { paths } from "@/app/routes/path/paths";
import { resolveProductCountry } from "../lib/resolveLocalizedOrString";
import {
    resolveVariantPriceDisplay,
} from "../lib/variantPriceDisplay";
import { formatStorefrontDiscountBadge } from "@/shared/lib/productDiscountDisplay";
import {
    isPurchasableVariant,
    firstPurchasableVariant,
    variantOrderLimit,
    exceedsVariantStock,
    warrantyTitle,
    warrantyBody,
    type AttributeMapItem,
    type ProductImage,
    type ShopVariant,
} from "../types/productDetails";
import { gallerySrcsForSelection, mediaSrc } from "../lib/productMedia";
import { postCartItemsSafe } from "@/features/cart/api/cartApi";
import { useFavorites, useToggleFavorite } from "@/features/account/hooks/useFavorites";
import { useCanRate } from "@/features/account/hooks/useRatings";
import { RatingFormModal } from "@/features/account/components";
import BasePopup from "@/shared/component/BasePopup";
import Button from "@/shared/ui/Button";
import Rating from "@/shared/component/Rating";
import { PremiumInlineLoader } from "@/shared/component/loading";
import type { ProductItem } from "@/features/home/types";
import {
    mapApiBottomBadgesToProductCard,
    mapApiTopBadgesToProductCard,
} from "@/shared/lib/mapProductBadges";
import { cn } from "@/shared/lib/utils";
import { HiEye, HiShoppingCart } from "react-icons/hi";
import { HiChevronRight, HiClock, HiHome, HiPencilSquare, HiShieldCheck } from "react-icons/hi2";

const EMPTY_SHOP_VARIANTS: ShopVariant[] = [];
const EMPTY_ATTRIBUTES_MAP: AttributeMapItem[] = [];
const EMPTY_PRODUCT_IMAGES: ProductImage[] = [];

function ProductDetails() {
    const { t } = useTranslation();
    const { currency } = useCurrency();
    const { isRTL, language } = useLanguage();
    const { productId } = useParams<{ productId: string }>();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const lat = parseFloat(searchParams.get("lat") || "33.51380000");
    const lng = parseFloat(searchParams.get("lng") || "36.27650000");

    const [ratingModalOpen, setRatingModalOpen] = useState(false);
    const [iconPopupOpen, setIconPopupOpen] = useState(false);
    const [selectedIcon, setSelectedIcon] = useState<{
        name: string;
        description: string;
    } | null>(null);
    const [specialInstructions, setSpecialInstructions] = useState("");
    /** Non-food: line note sent as `items[].note` (max 500). Food uses `specialInstructions` → same field. */
    const [lineItemNote, setLineItemNote] = useState("");
    const [noteOpen, setNoteOpen] = useState(false);
    const [selectedExtraIds, setSelectedExtraIds] = useState<number[]>([]);
    /** Selected extra details (product extra_details): id → quantity (min from API per row). */
    const [extraDetailQtyById, setExtraDetailQtyById] = useState<
        Record<number, number>
    >({});
    /** When set, fetches full product via `GET .../user/products/:id` for the quick-view dialog */
    const [boughtWithPreviewId, setBoughtWithPreviewId] = useState<number | null>(null);
    const [previewSelectedShopVariantId, setPreviewSelectedShopVariantId] =
        useState<number | null>(null);
    const [previewQuantity, setPreviewQuantity] = useState(1);
    const previewOpenToastRef = useRef<number | null>(null);

    const productIdNum = parseInt(productId || "0", 10);
    const token = useAuthStore((s) => s.token);
    const { data: canRateData } = useCanRate(productIdNum);

    const {
        data: product,
        isLoading,
        error,
    } = useProductDetails({
        productId: productIdNum,
        lat,
        lng,
    });

    const {
        data: boughtWithPreview,
        isLoading: isBoughtWithPreviewLoading,
        isError: isBoughtWithPreviewError,
    } = useProductDetails({
        productId: boughtWithPreviewId ?? 0,
        lat,
        lng,
    });

    useEffect(() => {
        setSelectedExtraIds([]);
        setExtraDetailQtyById({});
        setLineItemNote("");
        setSpecialInstructions("");
    }, [productIdNum]);

    const handleCloseProductPreview = useCallback(() => {
        setBoughtWithPreviewId(null);
        setPreviewSelectedShopVariantId(null);
        setPreviewQuantity(1);
        previewOpenToastRef.current = null;
        toast.message(t("product.previewModalClosed", "Quick view closed"), {
            duration: 2400,
            className: "text-start",
        });
    }, [t]);

    useEffect(() => {
        if (boughtWithPreviewId == null) return;
        if (previewOpenToastRef.current === boughtWithPreviewId) return;
        previewOpenToastRef.current = boughtWithPreviewId;
        toast.message(t("product.previewModalOpened", "Quick view opened"), {
            duration: 2600,
            className: "text-start",
        });
    }, [boughtWithPreviewId, t]);

    useEffect(() => {
        if (boughtWithPreviewId != null) {
            setPreviewQuantity(1);
        }
    }, [boughtWithPreviewId]);

    const previewSelectedVariant = useMemo(() => {
        if (!boughtWithPreview?.shop_variants?.length) return undefined;
        if (previewSelectedShopVariantId == null) return undefined;
        return boughtWithPreview.shop_variants.find(
            (x) => x.id === previewSelectedShopVariantId
        );
    }, [boughtWithPreview, previewSelectedShopVariantId]);

    useEffect(() => {
        if (!boughtWithPreview?.shop_variants?.length) {
            setPreviewSelectedShopVariantId(null);
            return;
        }
        const variants = boughtWithPreview.shop_variants;
        const firstOk = firstPurchasableVariant(variants);
        setPreviewSelectedShopVariantId((prev) => {
            if (prev != null && variants.some((v) => v.id === prev)) return prev;
            return firstOk?.id ?? null;
        });
    }, [boughtWithPreview]);

    useEffect(() => {
        const v = previewSelectedVariant;
        if (!v) return;
        if (v.quantity != null && v.quantity > 0 && previewQuantity > v.quantity) {
            setPreviewQuantity(v.quantity);
        }
    }, [previewSelectedVariant, previewQuantity]);

    const { reviews, isLoading: isRatingsLoading } =
        useProductRatings(productIdNum);

    const ratingDistribution = useMemo((): RatingDistribution => {
        const breakdown = product?.rating_breakdown || [0, 0, 0, 0, 0];
        return {
            "1": breakdown[0] ?? 0,
            "2": breakdown[1] ?? 0,
            "3": breakdown[2] ?? 0,
            "4": breakdown[3] ?? 0,
            "5": breakdown[4] ?? 0,
        };
    }, [product?.rating_breakdown]);

    const totalReviewsCount = useMemo(() => {
        return (product?.rating_breakdown || []).reduce((sum, n) => sum + n, 0);
    }, [product?.rating_breakdown]);

    const { data: similarProducts = [] } = useSimilarProducts(
        product?.category?.id
    );

    const {
        selectedAttributes,
        setAttributeOption,
        currentPrice,
        currentPriceAfterDiscount,
        currentImages,
        selectedVariant,
        availableAttributes,
    } = useVariantSelector({
        productId: productIdNum,
        attributesMap: product?.attributes_map ?? EMPTY_ATTRIBUTES_MAP,
        shopVariants: product?.shop_variants ?? EMPTY_SHOP_VARIANTS,
        defaultImages: product?.images ?? EMPTY_PRODUCT_IMAGES,
        thumbnail: product?.thumbnail,
        basePrice: product?.price || 0,
        basePriceAfterDiscount: product?.price_after_discount || 0,
    });

    const { data: sellerProducts = [] } = useProductsFromSameSeller(
        selectedVariant?.shop_id ?? undefined,
    );

    const isFoodProduct = product?.product_type === "food";

    const extraQuantityMax = useMemo(() => {
        if (!product) return 999;
        const stockCap = variantOrderLimit(
            selectedVariant,
            product.max_purchase_quantity,
        );
        return Math.min(stockCap, 999);
    }, [product, selectedVariant]);

    /** Max units per order line — variant stock capped by product.max_purchase_quantity. */
    const maxOrderQuantity = useMemo(() => {
        if (!product) return 1;
        return variantOrderLimit(selectedVariant, product.max_purchase_quantity);
    }, [product, selectedVariant]);

    const extraDetailsUnitAddon = useMemo(() => {
        if (!product?.extra_details?.length || isFoodProduct) return 0;
        return product.extra_details.reduce((sum, d) => {
            const q = extraDetailQtyById[d.id];
            if (q == null) return sum;
            return sum + (d.price ?? 0) * q;
        }, 0);
    }, [product?.extra_details, extraDetailQtyById, isFoodProduct]);

    const [quantity, setQuantity] = useState(1);
    const { data: favoriteProducts = [] } = useFavorites("product", false);

    useEffect(() => {
        setQuantity((q) => Math.min(Math.max(q, 1), Math.max(maxOrderQuantity, 1)));
    }, [maxOrderQuantity, selectedVariant?.id]);
    const toggleFavorite = useToggleFavorite();
    const isFavorite =
        product?.is_favorite ?? favoriteProducts.some((f) => f.id === productIdNum);
    const addItem = useCartStore((s) => s.addItem);

    /**
     * `shop_variants` may hold the API's fallback entry (`id`/`shop_id` null),
     * which renders fine but has no `shop_product_variant_id` for the cart.
     */
    const productVariants = product?.shop_variants ?? [];
    const hasPurchasableVariant = productVariants.some(isPurchasableVariant);
    const canAddToCart = isPurchasableVariant(selectedVariant);
    const warrantyName = product
        ? warrantyTitle(product, (months) =>
              t("product.warrantyMonths", { count: months }),
          )
        : null;
    const warrantyDescription = product ? warrantyBody(product) : null;
    const cannotAddToCartReason = !hasPurchasableVariant
        ? t("product.unavailable", "Currently unavailable")
        : selectedVariant == null
          ? t("product.selectVariant", "Select a variant")
          : t("product.outOfStock", "Out of stock");

    /** Bound to the selected shop variant via `galleryFor` (`has_variant_images` + `images[].path`). */
    const galleryImages = currentImages;

    const handleAddPreviewToCart = useCallback(() => {
        if (!boughtWithPreview) return;
        const variants = boughtWithPreview.shop_variants ?? [];
        const v = variants.find((x) => x.id === previewSelectedShopVariantId);

        // Cart needs a real `shop_product_variant_id` (`shop_variants[].id`).
        if (!isPurchasableVariant(v)) {
            toast.error(
                variants.some(isPurchasableVariant)
                    ? t("product.selectVariant", "Select a variant")
                    : t("product.unavailable", "Currently unavailable"),
            );
            return;
        }
        if (exceedsVariantStock(v, previewQuantity)) {
            toast.error(
                t(
                    "product.insufficientStock",
                    "Not enough stock for this quantity.",
                ),
            );
            return;
        }

        const sym =
            v.currency_symbol ?? boughtWithPreview.currency_symbol ?? "£";
        const unitPrice = v.price;
        const priceStr = v.price_formatted ?? `${sym}${unitPrice.toFixed(2)}`;
        const subtotalNum = unitPrice * previewQuantity;
        const subtotalStr = `${sym}${subtotalNum.toFixed(2)}`;

        const imagePath =
            gallerySrcsForSelection(v, boughtWithPreview)[0] ?? "";

        const lineId = `spv-${v.id}`;

        let selectedAttrs: Record<string, string> | undefined;
        if (v.attributes?.length) {
            selectedAttrs = {};
            for (const a of v.attributes) {
                selectedAttrs[a.attribute] = a.value;
            }
        }

        const shopIdForLine = v.shop_id;

        const cartItem: CartItem = {
            id: lineId,
            name: boughtWithPreview.name,
            description: boughtWithPreview.description,
            category: boughtWithPreview.category?.name,
            category_id: boughtWithPreview.category?.id,
            image: imagePath,
            price: priceStr,
            priceNumeric: unitPrice,
            quantity: previewQuantity,
            subtotal: subtotalStr,
            storeId: shopIdForLine ?? 0,
            hasFreeDelivery: boughtWithPreview.is_instant_delivery
                ? true
                : undefined,
            is_instant_delivery: !!boughtWithPreview.is_instant_delivery,
            productId: boughtWithPreview.id,
            variantId: v.variant_id ?? undefined,
            shop_product_variant_id: v.id,
            shopId: shopIdForLine ?? undefined,
            selectedAttributes: selectedAttrs,
        };

        const result = addItem(cartItem);
        if (result === "success") {
            postCartItemsSafe([
                {
                    shop_product_variant_id: v.id,
                    quantity: previewQuantity,
                    ...(cartItem.note ? { note: cartItem.note } : {}),
                },
            ]);
            toast.success(t("cart.addedToCart", "Added to cart"));
        } else if (result === "wrong_cart_type") {
            toast.error(
                t(
                    "cart.cartContainsDifferentType",
                    "Your cart contains recipes or baskets. Clear it to add products.",
                ),
            );
        } else {
            toast.error(
                t(
                    "cart.cannotMixInstantDelivery",
                    "Cannot mix instant delivery and scheduled delivery items in the same cart.",
                ),
            );
        }
    }, [
        boughtWithPreview,
        previewSelectedShopVariantId,
        previewQuantity,
        addItem,
        t,
    ]);

    const handleProductClick = useCallback(
        (id: number) => {
            navigate(paths.client.productDetails(id));
        },
        [navigate]
    );

    const favoriteIds = favoriteProducts.map((f) => f.id);

    const boughtWithItems = useMemo(() => {
        if (!product?.bought_with?.length) return [];
        return product.bought_with.map((item) => {
            const topBadges =
                mapApiTopBadgesToProductCard(item.top_badges) ?? [];
            const bottomBadges =
                mapApiBottomBadgesToProductCard(item.bottom_badges) ?? [];
            const listing = resolveListingCardPrices(
                item,
                t("product.youSaved", "You saved"),
                currency,
            );

            return {
                id: item.id,
                name: item.name,
                price: listing.price,
                originalPrice: listing.originalPrice,
                rating: item.rating ?? 0,
                image: item.image,
                category: item.category,
                sold: item.sold_number,
                savings: listing.savings,
                discountLabel: listing.discountLabel,
                badge: topBadges.length ? topBadges : undefined,
                bottomBadges: bottomBadges.length ? bottomBadges : undefined,
                isFavorite: item.is_favorite ?? favoriteIds.includes(item.id),
            };
        });
    }, [product?.bought_with, favoriteIds, t, currency]);

    const similarProductItems = useMemo(() => {
        return similarProducts
            .filter((p) => p.id !== product?.id)
            .map((p) => {
                const pi = p as ProductItem;
                const listing = resolveListingCardPrices(
                    pi,
                    t("product.youSaved", "You saved"),
                    currency,
                );
                return {
                    id: p.id,
                    name: p.name,
                    price: listing.price,
                    originalPrice: listing.originalPrice,
                    rating: p.rating || 0,
                    image: p.image,
                    category: p.category,
                    sold: p.sold_number,
                    savings: listing.savings,
                    discountLabel: listing.discountLabel,
                    badge: mapApiTopBadgesToProductCard(
                        pi.top_badges?.length ? pi.top_badges : pi.budges
                    ),
                    bottomBadges: mapApiBottomBadgesToProductCard(pi.bottom_badges),
                    isFavorite:
                        (p as { is_favorite?: boolean }).is_favorite ??
                        favoriteIds.includes(p.id),
                };
            });
    }, [similarProducts, product?.id, t, favoriteIds, currency]);

    const sellerProductItems = useMemo(() => {
        return sellerProducts
            .filter((p) => p.id !== product?.id)
            .map((p) => {
                const pi = p as ProductItem;
                const listing = resolveListingCardPrices(
                    pi,
                    t("product.youSaved", "You saved"),
                    currency,
                );
                return {
                    id: p.id,
                    name: p.name,
                    price: listing.price,
                    originalPrice: listing.originalPrice,
                    rating: p.rating || 0,
                    image: p.image,
                    category: p.category,
                    sold: p.sold_number,
                    savings: listing.savings,
                    discountLabel: listing.discountLabel,
                    badge: mapApiTopBadgesToProductCard(
                        pi.top_badges?.length ? pi.top_badges : pi.budges
                    ),
                    bottomBadges: mapApiBottomBadgesToProductCard(pi.bottom_badges),
                    isFavorite:
                        (p as { is_favorite?: boolean }).is_favorite ??
                        favoriteIds.includes(p.id),
                };
            });
    }, [sellerProducts, product?.id, t, favoriteIds, currency]);

    const handleAddToCart = () => {
        if (!product) return;
        if (!isPurchasableVariant(selectedVariant)) {
            toast.error(cannotAddToCartReason);
            return;
        }
        if (exceedsVariantStock(selectedVariant, quantity)) {
            toast.error(
                t("product.insufficientStock", "Not enough stock for this quantity."),
            );
            return;
        }
        const baseUnit = currentPriceAfterDiscount ?? currentPrice ?? 0;
        const price = baseUnit + (isFoodProduct ? 0 : extraDetailsUnitAddon);
        const cartCurrencySymbol =
            selectedVariant.currency_symbol ?? product.currency_symbol ?? "£";
        const extraLinesForCart: CartExtraLine[] = isFoodProduct
            ? selectedExtraIds.map((id) => ({ id, quantity: 1 }))
            : Object.entries(extraDetailQtyById).map(([id, q]) => ({
                  id: Number(id),
                  quantity: q,
              }));
        const extrasKey = extrasLineKeyFromExtras(extraLinesForCart);
        const lineId = `spv-${selectedVariant.id}${extrasKey}`;
        const imagePath = galleryImages[0] ?? "";
        const isInstant = !!product.is_instant_delivery;
        const shopIdForLine = selectedVariant.shop_id;
        const cartItem: CartItem = {
            id: lineId,
            name: product.name,
            description: product.description,
            category: product.category?.name,
            category_id: product.category?.id,
            image: imagePath,
            price: `${cartCurrencySymbol}${price.toFixed(2)}`,
            priceNumeric: price,
            quantity,
            subtotal: `${cartCurrencySymbol}${(price * quantity).toFixed(2)}`,
            storeId: shopIdForLine ?? 0,
            hasFreeDelivery: isInstant ? true : undefined,
            is_instant_delivery: isInstant,
            productId: product.id,
            variantId: selectedVariant.variant_id ?? undefined,
            shop_product_variant_id: selectedVariant.id,
            shopId: shopIdForLine ?? undefined,
            selectedAttributes:
                Object.keys(selectedAttributes).length > 0
                    ? { ...selectedAttributes }
                    : undefined,
        };
        if (extraLinesForCart.length > 0) {
            cartItem.extras = extraLinesForCart;
        }
        const rawNote = (
            isFoodProduct ? specialInstructions : lineItemNote
        ).trim();
        if (rawNote) {
            cartItem.note = rawNote.slice(0, 500);
        }
        if (
            currentPriceAfterDiscount != null &&
            currentPrice != null &&
            currentPriceAfterDiscount < currentPrice
        ) {
            cartItem.originalPrice = `${cartCurrencySymbol}${currentPrice.toFixed(2)}`;
            cartItem.savingsText = `${t("product.youSaved", "You saved")} ${cartCurrencySymbol}${(
                currentPrice - currentPriceAfterDiscount
            ).toFixed(2)}`;
        }
        const result = addItem(cartItem);
        if (result === "success") {
            postCartItemsSafe([
                {
                    shop_product_variant_id: selectedVariant.id,
                    quantity,
                    ...(cartItem.note ? { note: cartItem.note } : {}),
                },
            ]);
            toast.success(t("cart.addedToCart", "Added to cart"));
        } else if (result === "wrong_cart_type") {
            toast.error(
                t(
                    "cart.cartContainsDifferentType",
                    "Your cart contains recipes or baskets. Clear it to add products.",
                ),
            );
        } else {
            toast.error(
                t(
                    "cart.cannotMixInstantDelivery",
                    "Cannot mix instant delivery and scheduled delivery items in the same cart.",
                ),
            );
        }
    };

    const handleToggleFavorite = () => {
        toggleFavorite.mutate({ type: "product", id: productIdNum });
    };

    const handleShare = async () => {
        if (!product) return;
        const url = window.location.href;
        if (navigator.share) {
            try {
                await navigator.share({
                    title: product.name,
                    text: product.description,
                    url,
                });
                return;
            } catch (err) {
                if ((err as Error).name === "AbortError") return;
            }
        }
        try {
            await navigator.clipboard.writeText(url);
            toast.success(t("product.linkCopied", "Link copied"));
        } catch {
            toast.error(t("product.linkCopyFailed", "Could not copy link"));
        }
    };

    const handleToggleExtra = (id: number) => {
        setSelectedExtraIds((prev) =>
            prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
        );
    };

    const handleToggleExtraDetail = (id: number) => {
        if (!product?.extra_details) return;
        const detail = product.extra_details.find((d) => d.id === id);
        const minQ = Math.max(1, detail?.quantity ?? 1);
        setExtraDetailQtyById((prev) => {
            if (prev[id] != null) {
                const next = { ...prev };
                delete next[id];
                return next;
            }
            return { ...prev, [id]: minQ };
        });
    };

    const handleExtraDetailQuantityChange = (id: number, nextQty: number) => {
        if (!product?.extra_details) return;
        const detail = product.extra_details.find((d) => d.id === id);
        const minQ = Math.max(1, detail?.quantity ?? 1);
        const clamped = Math.min(
            Math.max(nextQty, minQ),
            extraQuantityMax
        );
        setExtraDetailQtyById((prev) => ({ ...prev, [id]: clamped }));
    };

    if (isLoading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-custom-primary dark:bg-[#050505]">
                <PremiumInlineLoader size="lg" />
            </div>
        );
    }

    if (error || !product) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-custom-primary dark:bg-[#050505]">
                <div className="text-center">
                    <p className="text-lg text-custom-primary dark:text-[#FFFFFF]">
                        {t("product.notFound", "Product not found")}
                    </p>
                </div>
            </div>
        );
    }

    const isFood = product.product_type === "food";

    const variantPriceDisplay = resolveVariantPriceDisplay(
        selectedVariant,
        t,
        currency,
        product,
    );

    // Build badges — variant-level discount from API (no local % math)
    const badges: Array<{ label: string; className?: string }> = [];
    const discountBadgeLabel = variantPriceDisplay?.badge ?? null;
    if (discountBadgeLabel) {
        badges.push({
            label: discountBadgeLabel,
            className:
                "bg-primary-light text-white dark:bg-[color-mix(in_srgb,var(--color-main)_32%,#242428)] dark:text-white",
        });
    }
    if (product.is_most_ordered) {
        badges.push({
            label: t("product.mostOrdered", "Most Ordered"),
            className:
                "bg-yellow-400 text-black dark:bg-[color-mix(in_srgb,var(--color-main)_18%,#1c1c18)] dark:text-[#E4E4E7]",
        });
    }
    if (product.is_instant_delivery) {
        badges.push({
            label: t("product.freeDelivery", "Free Delivery"),
            className:
                "bg-yellow-400 text-black dark:bg-[color-mix(in_srgb,var(--color-main)_18%,#1c1c18)] dark:text-[#E4E4E7]",
        });
    }

    // Prefer API `*_formatted` / `*_currencies` — never invent FX locally.
    // Extra-detail addons force a numeric compose because formatted fields are
    // for the base variant only.
    const currencySymbol =
        selectedVariant?.currency_symbol ?? product.currency_symbol ?? "";
    const formatPrice = (price: number) =>
        `${currencySymbol}${Number(price).toFixed(2)}`;

    const extraAddon = isFood ? 0 : extraDetailsUnitAddon;
    const priceSource = selectedVariant ?? product;
    const displaySalePrice =
        extraAddon > 0
            ? formatPrice(
                  (currentPriceAfterDiscount ?? currentPrice) + extraAddon,
              )
            : resolveDisplaySalePrice(priceSource, currency) ||
              formatPrice(currentPriceAfterDiscount ?? currentPrice);
    const displayListPrice =
        extraAddon > 0
            ? currentPriceAfterDiscount < currentPrice
                ? formatPrice(currentPrice + extraAddon)
                : undefined
            : resolveDisplayListPrice(priceSource, currency);

    const savings =
        variantPriceDisplay?.savedLabel
            ? `${t("product.youSaved", "You saved")} ${variantPriceDisplay.savedLabel}`
            : product.amount_saved_formatted?.trim() || undefined;

    const previewDiscountBadge = formatStorefrontDiscountBadge(
        previewSelectedVariant,
        boughtWithPreview,
        t,
    );

    const deliveryEstimate =
        product.delivery_time?.trim() || product.time_prepare?.trim() || null;

    /** API returns `country` as either a string or `{ name: { ar, en } }`. */
    const countryName = resolveProductCountry(product.country, language);
    const previewCountryName = resolveProductCountry(
        boughtWithPreview?.country,
        language
    );

    const hasDescription = Boolean(
        product.description?.trim() || product.full_description?.trim(),
    );
    const hasSpecs =
        !isFood &&
        Boolean(product.category_details && product.category_details.length > 0);

    const noteTextareaClass =
        "w-full resize-none rounded-lg border border-black/8 bg-custom-card px-3.5 py-2.5 text-sm text-custom-primary placeholder:text-custom-tertiary outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/15 dark:border-white/10 dark:bg-[#0B0B0C] dark:placeholder:text-[#71717A]";

    const crumbChevron = (
        <HiChevronRight
            className={cn("h-3.5 w-3.5 shrink-0 text-custom-tertiary", isRTL && "rotate-180")}
            aria-hidden
        />
    );

    return (
        <div className="pb-24 lg:pb-0" dir={isRTL ? "rtl" : "ltr"}>
            <div className="page-container py-6 sm:py-8">
                <nav
                    className="mb-6 flex min-w-0 flex-wrap items-center gap-1.5 text-sm text-custom-secondary"
                    aria-label="Breadcrumb"
                >
                    <HiHome className="h-4 w-4 shrink-0 text-primary/80" aria-hidden />
                    <Link
                        to={paths.client.home}
                        className="hover:text-text-primary hover:underline"
                    >
                        {t("footer.home", "Home")}
                    </Link>
                    {crumbChevron}
                    <Link
                        to={paths.client.products}
                        className="hover:text-text-primary hover:underline"
                    >
                        {t("footer.products", "Products")}
                    </Link>
                    {product.category?.name && (
                        <>
                            {crumbChevron}
                            <span className="truncate">{product.category.name}</span>
                        </>
                    )}
                    {crumbChevron}
                    <span className="max-w-[min(100%,16rem)] truncate font-medium text-text-primary sm:max-w-md">
                        {product.name}
                    </span>
                </nav>

                <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[minmax(16rem,26rem)_minmax(0,1fr)] lg:gap-10">
                    <div className="relative z-0 min-w-0">
                        <ProductImageGallery
                            key={`${selectedVariant?.id ?? "base"}:${galleryImages.join("|")}`}
                            images={galleryImages}
                            isFavorite={isFavorite}
                            onToggleFavorite={handleToggleFavorite}
                            onShare={handleShare}
                        />
                    </div>

                    <div className="flex min-w-0 flex-col gap-5">
                        <ProductInfo
                            category={product.category?.name}
                            name={product.name}
                            sku={
                                selectedVariant?.sku?.trim() ||
                                product.sku?.trim() ||
                                undefined
                            }
                            barcode={
                                selectedVariant?.barcode?.trim() ||
                                product.barcode?.trim() ||
                                undefined
                            }
                            origin={countryName || undefined}
                            price={displaySalePrice}
                            originalPrice={displayListPrice}
                            savings={savings}
                            sold={product.sold_number}
                            rating={product.rating}
                            reviewCount={totalReviewsCount}
                            badges={badges}
                        />

                        {(deliveryEstimate || warrantyName) && (
                            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                                {deliveryEstimate && (
                                    <div className="flex items-start gap-2.5 rounded-xl bg-[color-mix(in_srgb,var(--color-api-second)_7%,var(--color-bg-card))] px-3.5 py-3 dark:bg-white/[0.03]">
                                        <HiClock className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                                        <div className="min-w-0">
                                            <p className="text-xs text-custom-secondary">
                                                {t("product.deliveryTime", "Delivery")}
                                            </p>
                                            <p className="text-sm font-medium text-text-primary">
                                                {deliveryEstimate}
                                            </p>
                                        </div>
                                    </div>
                                )}
                                {warrantyName && (
                                    <div className="flex items-start gap-2.5 rounded-xl bg-[color-mix(in_srgb,var(--color-api-second)_7%,var(--color-bg-card))] px-3.5 py-3 dark:bg-white/[0.03]">
                                        <HiShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                                        <div className="min-w-0">
                                            <p className="text-xs text-custom-secondary">
                                                {t("product.warranty", "Warranty")}
                                            </p>
                                            <p className="text-sm font-medium text-text-primary">
                                                {warrantyName}
                                            </p>
                                            {warrantyDescription ? (
                                                <p className="mt-1 whitespace-pre-wrap text-xs leading-relaxed text-custom-secondary">
                                                    {warrantyDescription}
                                                </p>
                                            ) : null}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {availableAttributes.map((attribute) => (
                            <AttributeSelector
                                key={attribute.id ?? attribute.attribute}
                                attribute={attribute}
                                selectedId={attribute.selectedId}
                                onValueChange={(optionId) =>
                                    setAttributeOption(attribute, optionId)
                                }
                                activeColor={isFood ? "teal" : "dark"}
                            />
                        ))}

                        {isFood && product.extras && product.extras.length > 0 && (
                            <ExtrasCheckboxTable
                                extras={product.extras}
                                selectedIds={selectedExtraIds}
                                onToggle={handleToggleExtra}
                            />
                        )}

                        {!isFood &&
                            product.extra_details &&
                            product.extra_details.length > 0 && (
                                <div>
                                    <h3 className="mb-2 text-sm font-semibold text-text-primary">
                                        {t("product.details", "Details")}
                                    </h3>
                                    <ExtraDetailsTable
                                        details={product.extra_details}
                                        currencySymbol={
                                            product.currency_symbol ?? "$"
                                        }
                                        selectable
                                        selection={extraDetailQtyById}
                                        onToggle={handleToggleExtraDetail}
                                        onQuantityChange={
                                            handleExtraDetailQuantityChange
                                        }
                                        maxQuantityPerExtra={extraQuantityMax}
                                    />
                                </div>
                            )}

                        <div className="flex flex-col gap-2 border-t border-black/6 pt-4 dark:border-white/8">
                            <ProductQuantitySelector
                                quantity={quantity}
                                min={1}
                                max={maxOrderQuantity}
                                onQuantityChange={setQuantity}
                                onAddToCart={handleAddToCart}
                                addToCartDisabled={!canAddToCart}
                                addToCartClassName="hidden lg:inline-flex"
                                addToCartText={
                                    canAddToCart
                                        ? t("product.addToCart", "Add To Cart")
                                        : t(
                                              "product.unavailable",
                                              "Currently unavailable",
                                          )
                                }
                            />
                            {canAddToCart && selectedVariant?.quantity != null ? (
                                <p className="text-sm text-custom-secondary">
                                    {t("product.inStockCount", {
                                        count: selectedVariant.quantity,
                                    })}
                                </p>
                            ) : null}
                            {!canAddToCart && (
                                <p className="text-sm text-custom-secondary">
                                    {selectedVariant != null &&
                                    (selectedVariant.quantity == null ||
                                        selectedVariant.quantity <= 0)
                                        ? t("product.outOfStock", "Out of stock")
                                        : cannotAddToCartReason}
                                </p>
                            )}
                        </div>

                        <div>
                            <button
                                type="button"
                                onClick={() => setNoteOpen((open) => !open)}
                                className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
                                aria-expanded={noteOpen}
                            >
                                <HiPencilSquare className="h-4 w-4" aria-hidden />
                                {isFood
                                    ? t("product.specialInstructions", "Special instructions")
                                    : t("product.addANote", "Add a note")}
                            </button>
                            {noteOpen && (
                                <div className="mt-2 flex flex-col gap-1.5">
                                    {isFood ? (
                                        <>
                                            <textarea
                                                value={specialInstructions}
                                                onChange={(e) =>
                                                    setSpecialInstructions(
                                                        e.target.value.slice(0, 500),
                                                    )
                                                }
                                                placeholder={t(
                                                    "product.specialInstructionsPlaceholder",
                                                    "Any special requests...",
                                                )}
                                                rows={3}
                                                maxLength={500}
                                                className={noteTextareaClass}
                                            />
                                            <p className="text-xs text-custom-secondary">
                                                {specialInstructions.length}/500
                                            </p>
                                        </>
                                    ) : (
                                        <>
                                            <textarea
                                                value={lineItemNote}
                                                onChange={(e) =>
                                                    setLineItemNote(
                                                        e.target.value.slice(0, 500),
                                                    )
                                                }
                                                placeholder={t(
                                                    "product.lineItemNotePlaceholder",
                                                    "Optional instructions for this product (e.g. packaging, preparation)",
                                                )}
                                                rows={3}
                                                maxLength={500}
                                                className={noteTextareaClass}
                                            />
                                            <p className="text-xs text-custom-secondary">
                                                {lineItemNote.length}/500
                                            </p>
                                        </>
                                    )}
                                </div>
                            )}
                        </div>

                        <ProductActions
                            icons={product.icons ?? []}
                            className="border-t border-black/6 pt-4 dark:border-white/8"
                            onIconClick={(icon) => {
                                setSelectedIcon({
                                    name: icon.name,
                                    description: icon.description || "",
                                });
                                setIconPopupOpen(true);
                            }}
                        />
                    </div>
                </div>

                {(hasDescription || hasSpecs) && (
                    <section className="mt-10 border-t border-black/6 pt-8 dark:border-white/8">
                        <div
                            className={cn(
                                "grid gap-8",
                                hasDescription && hasSpecs && "md:grid-cols-2",
                            )}
                        >
                            {hasDescription && (
                                <div className="min-w-0">
                                    <h2 className="mb-4 text-lg font-semibold text-text-primary">
                                        {t("product.description", "Description")}
                                    </h2>
                                    <ProductDescription
                                        description={product.description}
                                        fullDescription={product.full_description}
                                    />
                                </div>
                            )}

                            {hasSpecs && (
                                <div className="min-w-0">
                                    <h2 className="mb-4 text-lg font-semibold text-text-primary">
                                        {t("product.categoryDetails", "Additional Details")}
                                    </h2>
                                    <div className="w-fit max-w-full overflow-hidden rounded-xl ring-1 ring-black/8 dark:ring-white/10">
                                        <table className="w-auto min-w-[16rem] max-w-md border-collapse text-sm">
                                            <tbody>
                                                {product.category_details!.map((detail, index) => (
                                                    <tr
                                                        key={detail.id}
                                                        className={cn(
                                                            "border-b border-black/6 last:border-b-0 dark:border-white/8",
                                                            index % 2 === 0
                                                                ? "bg-[color-mix(in_srgb,var(--color-api-second)_6%,var(--color-bg-card))] dark:bg-white/[0.03]"
                                                                : "bg-custom-card",
                                                        )}
                                                    >
                                                        <th
                                                            scope="row"
                                                            className="whitespace-nowrap px-4 py-3 text-start font-medium text-custom-secondary"
                                                        >
                                                            {detail.name}
                                                        </th>
                                                        <td className="px-4 py-3 text-start font-medium text-text-primary">
                                                            {detail.value}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}
                        </div>
                    </section>
                )}
            </div>

                {/* Bought with this product */}
                {boughtWithItems.length > 0 && (
                    <FullBleedSection>
                        <SoldWithThisProduct
                            title={t("product.soldWithThisProduct", "Sold with this product also")}
                            payload={{
                                items: boughtWithItems,
                                onProductClick: handleProductClick,
                                onToggleFavorite: (id: number) =>
                                    toggleFavorite.mutate({ type: "product", id }),
                                favoriteIds: favoriteProducts.map((f) => f.id),
                                onViewDetails: (id: number) => {
                                    setBoughtWithPreviewId(id);
                                },
                                viewDetailsLabel: t("product.viewDetails", "View details"),
                            }}
                        />
                    </FullBleedSection>
                )}

                {/* Similar Products */}
                {similarProductItems.length > 0 && (
                    <FullBleedSection>
                        <SimilarProducts
                            title={t("product.similarProducts", "Similar Products")}
                            payload={{
                                items: similarProductItems,
                                onProductClick: handleProductClick,
                                onToggleFavorite: (id: number) => toggleFavorite.mutate({ type: "product", id }),
                                favoriteIds: favoriteProducts.map((f) => f.id),
                            }}
                        />
                    </FullBleedSection>
                )}

                {/* Products from the same seller */}
                {sellerProductItems.length > 0 && (
                    <FullBleedSection>
                        <ProductsFromSameSeller
                            title={t("product.productsFromSameSeller", "Products from the same seller")}
                            payload={{
                                items: sellerProductItems,
                                onProductClick: handleProductClick,
                                onToggleFavorite: (id: number) => toggleFavorite.mutate({ type: "product", id }),
                                favoriteIds: favoriteProducts.map((f) => f.id),
                            }}
                        />
                    </FullBleedSection>
                )}

                {/* Product Reviews */}
                <div className="page-container">
                    {token && productIdNum > 0 && canRateData !== undefined && (
                        <div className="mt-10 mb-4">
                            {canRateData.can_rate ? (
                                <button
                                    type="button"
                                    onClick={() => setRatingModalOpen(true)}
                                    className="rounded-lg bg-[var(--color-api-second)] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[var(--color-api-second-hover)] focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2 dark:bg-[color-mix(in_srgb,var(--color-api-second)_40%,#2a2a2e)] dark:text-white dark:hover:bg-[color-mix(in_srgb,var(--color-api-second)_52%,#333336)] dark:focus-visible:ring-[color-mix(in_srgb,var(--color-main)_22%,transparent)] dark:focus-visible:ring-offset-[#050505]"
                                >
                                    {t("account.myReviews.rateProduct", "قيم هذا المنتج")}
                                </button>
                            ) : (
                                <p className="text-sm text-custom-secondary dark:text-[#A1A1AA]">
                                    {canRateData.reason_ar || canRateData.reason ||
                                        t("account.myReviews.mustPurchaseToRate", "يجب شراء هذا المنتج قبل تقييمه")}
                                </p>
                            )}
                        </div>
                    )}
                    {isRatingsLoading ? (
                        <div className="mt-10 flex justify-center py-8">
                            <PremiumInlineLoader size="md" />
                        </div>
                    ) : (
                        <ProductReviews
                            averageRating={product.rating ?? 0}
                            totalReviews={totalReviewsCount}
                            ratingDistribution={ratingDistribution}
                            reviews={reviews}
                        />
                    )}
                </div>

                {/* Bought-with quick view (API product details) */}
                <BasePopup
                    isOpen={boughtWithPreviewId != null}
                    onClose={handleCloseProductPreview}
                    icon={
                        <span
                            className={cn(
                                "flex h-14 w-14 items-center justify-center rounded-2xl shadow-inner",
                                "bg-gradient-to-br from-primary/25 via-[color-mix(in_srgb,var(--color-api-second)_18%,var(--color-bg-card))] to-primary/20",
                                "text-primary ring-2 ring-primary/30 dark:from-[#0B0B0C] dark:via-[rgba(16,17,20,0.85)] dark:to-[#050505] dark:text-[color-mix(in_srgb,var(--color-main)_78%,#FFFFFF)] dark:ring-[color-mix(in_srgb,var(--color-main)_16%,transparent)]"
                            )}
                        >
                            <HiEye className="h-8 w-8" aria-hidden />
                        </span>
                    }
                    title={
                        isBoughtWithPreviewLoading
                            ? t("common.loading", "Loading...")
                            : boughtWithPreview?.name ?? ""
                    }
                    description={
                        isBoughtWithPreviewLoading
                            ? undefined
                            : t(
                                  "product.quickViewSubtitle",
                                  "Options, pricing & variants at a glance"
                              )
                    }
                    maxWidth="xl"
                    backdropClassName="pv-modal-backdrop bg-gradient-to-br from-slate-950/80 via-[color-mix(in_srgb,var(--color-primary)_12%,#0f172a)] to-slate-900/80 backdrop-blur-md dark:from-[#050505]/92 dark:via-[color-mix(in_srgb,var(--color-main)_8%,#080809)] dark:to-[#050505]/94"
                    className={cn(
                        "pv-modal-panel border-0",
                        "bg-gradient-to-b from-white via-white to-slate-50/95",
                        "shadow-[0_28px_90px_-20px_color-mix(in_srgb,var(--color-primary)_32%,transparent)]",
                        "ring-2 ring-primary/25 dark:from-[rgba(16,17,20,0.92)] dark:via-[#0B0B0C] dark:to-[#050505] dark:ring-[rgba(255,255,255,0.06)]"
                    )}
                    contentClassName="!pt-14 text-start max-h-[78vh] overflow-y-auto !px-6 !pb-6"
                    actions={
                        boughtWithPreview &&
                        !isBoughtWithPreviewLoading &&
                        !isBoughtWithPreviewError ? (
                            <div className="flex w-full flex-col gap-2">
                                <Button
                                    type="button"
                                    variant="primary"
                                    fullWidth
                                    leftIcon={
                                        <HiShoppingCart
                                            className="h-5 w-5 shrink-0"
                                            aria-hidden
                                        />
                                    }
                                    disabled={
                                        !isPurchasableVariant(
                                            previewSelectedVariant
                                        ) || previewQuantity < 1
                                    }
                                    className="cursor-pointer rounded-xl border border-primary/20 bg-primary shadow-md shadow-[0_8px_28px_-6px_var(--color-shadow-accent)] !opacity-100 transition duration-200 hover:!border-primary/30 hover:!bg-[var(--color-primary-dark)] hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50"
                                    onClick={handleAddPreviewToCart}
                                >
                                    {t("product.addToCart", "Add To Cart")}
                                </Button>
                                <Button
                                    type="button"
                                    variant="outline"
                                    fullWidth
                                    className="cursor-pointer rounded-xl border-2 border-[var(--color-api-second)]/75 font-semibold text-primary hover:bg-[color-mix(in_srgb,var(--color-api-second)_12%,var(--color-bg-card))] hover:border-[var(--color-api-second)] dark:border-[rgba(255,255,255,0.1)] dark:text-[#A1A1AA] dark:hover:border-[color-mix(in_srgb,var(--color-api-second)_32%,rgba(255,255,255,0.1))] dark:hover:bg-[color-mix(in_srgb,var(--color-api-second)_10%,#0B0B0C)] dark:hover:text-[#FFFFFF]"
                                    onClick={() => {
                                        navigate(
                                            paths.client.productDetails(
                                                boughtWithPreview.id
                                            )
                                        );
                                        handleCloseProductPreview();
                                    }}
                                >
                                    {t(
                                        "product.viewFullProduct",
                                        "View full product",
                                    )}
                                </Button>
                            </div>
                        ) : undefined
                    }
                >
                    {boughtWithPreviewId != null && (
                        <div
                            dir={isRTL ? "rtl" : "ltr"}
                            className="space-y-5 text-start"
                        >
                            <div
                                className={cn(
                                    "-mx-1 flex items-center gap-2 overflow-hidden rounded-xl px-3 py-2",
                                    "bg-gradient-to-r from-primary/12 via-[color-mix(in_srgb,var(--color-api-second)_10%,transparent)] to-transparent",
                                    "text-xs font-semibold uppercase tracking-[0.2em] text-primary dark:from-[color-mix(in_srgb,var(--color-main)_10%,transparent)] dark:via-transparent dark:to-transparent dark:text-[#A1A1AA]"
                                )}
                            >
                                <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-primary shadow-[0_0_10px_var(--color-shadow-accent)] dark:bg-[color-mix(in_srgb,var(--color-main)_42%,#71717A)] dark:shadow-[0_0_8px_color-mix(in_srgb,var(--color-main)_18%,transparent)]" />
                                {t("product.quickViewBadge", "Quick view")}
                            </div>

                            {isBoughtWithPreviewLoading && (
                                <div className="flex flex-col items-center justify-center gap-3 py-14">
                                    <PremiumInlineLoader size="lg" />
                                    <p className="text-sm text-custom-secondary dark:text-[#A1A1AA]">
                                        {t(
                                            "product.quickViewLoadingHint",
                                            "Fetching photos, prices & variants…"
                                        )}
                                    </p>
                                </div>
                            )}
                            {isBoughtWithPreviewError && (
                                <p className="text-center text-sm text-red-600 dark:text-red-400">
                                    {t(
                                        "product.detailsLoadError",
                                        "Could not load product details."
                                    )}
                                </p>
                            )}
                            {boughtWithPreview && !isBoughtWithPreviewLoading && (
                                <>
                                    <div className="group relative overflow-hidden rounded-2xl shadow-xl ring-1 ring-black/5 dark:ring-[rgba(255,255,255,0.06)]">
                                        <div className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-t from-black/35 via-transparent to-transparent" />
                                        <img
                                            src={
                                                gallerySrcsForSelection(
                                                    previewSelectedVariant,
                                                    boughtWithPreview,
                                                )[0] ?? ""
                                            }
                                            alt=""
                                            className="mx-auto w-full max-h-60 object-cover transition duration-500 group-hover:scale-[1.02]"
                                        />
                                    </div>
                                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-custom-secondary dark:text-[#A1A1AA]">
                                        {boughtWithPreview.category?.name && (
                                            <span className="rounded-full bg-custom-secondary/80 px-2.5 py-0.5 text-xs font-medium dark:bg-[rgba(255,255,255,0.06)] dark:text-[#A1A1AA]">
                                                {boughtWithPreview.category.name}
                                            </span>
                                        )}
                                        {previewCountryName && (
                                            <span>
                                                {boughtWithPreview.category?.name
                                                    ? "· "
                                                    : ""}
                                                {previewCountryName}
                                            </span>
                                        )}
                                    </div>
                                    <Rating
                                        rating={boughtWithPreview.rating ?? 0}
                                        size="sm"
                                    />
                                    <div className="flex flex-wrap items-baseline gap-3">
                                        <p className="text-2xl font-bold tabular-nums text-custom-primary dark:text-[#FFFFFF]">
                                            {resolveDisplaySalePrice(
                                                previewSelectedVariant ??
                                                    boughtWithPreview,
                                                currency,
                                            )}
                                        </p>
                                        {resolveDisplayListPrice(
                                            previewSelectedVariant ??
                                                boughtWithPreview,
                                            currency,
                                        ) ? (
                                            <p className="text-base text-custom-tertiary line-through dark:text-[#71717A]">
                                                {resolveDisplayListPrice(
                                                    previewSelectedVariant ??
                                                        boughtWithPreview,
                                                    currency,
                                                )}
                                            </p>
                                        ) : null}
                                        {previewDiscountBadge ? (
                                            <span className="rounded-full bg-primary-light px-2.5 py-0.5 text-sm font-semibold text-white">
                                                {previewDiscountBadge}
                                            </span>
                                        ) : null}
                                    </div>
                                    <div className="rounded-2xl border border-custom-primary/15 bg-gradient-to-br from-custom-secondary/50 to-transparent p-4 dark:border-[rgba(255,255,255,0.06)] dark:from-[rgba(16,17,20,0.75)] dark:to-[rgba(16,17,20,0.55)]">
                                        <ProductDescription
                                            description={
                                                boughtWithPreview.description
                                            }
                                            fullDescription={
                                                boughtWithPreview.full_description
                                            }
                                        />
                                    </div>
                                    {(boughtWithPreview.shop_variants?.length ??
                                        0) > 0 && (
                                        <ShopVariantsPreview
                                            variants={
                                                boughtWithPreview.shop_variants ??
                                                []
                                            }
                                            productMedia={boughtWithPreview}
                                            selectedId={
                                                previewSelectedShopVariantId
                                            }
                                            onSelect={
                                                setPreviewSelectedShopVariantId
                                            }
                                            className="rounded-2xl border border-primary/20 bg-[color-mix(in_srgb,var(--color-api-second)_8%,var(--color-bg-card))] p-4 dark:border-[rgba(255,255,255,0.06)] dark:bg-[rgba(16,17,20,0.75)]"
                                        />
                                    )}
                                    <div className="rounded-xl border border-custom-primary/20 bg-custom-secondary/30 px-3 py-2 dark:border-[rgba(255,255,255,0.06)] dark:bg-[#0B0B0C]">
                                        <p className="mb-2 text-xs font-medium text-custom-secondary dark:text-[#A1A1AA]">
                                            {t("product.quantity", "Quantity")}
                                        </p>
                                        <ProductQuantitySelector
                                            quantity={previewQuantity}
                                            min={1}
                                            max={variantOrderLimit(
                                                previewSelectedVariant,
                                                boughtWithPreview.max_purchase_quantity,
                                            )}
                                            onQuantityChange={setPreviewQuantity}
                                        />
                                    </div>
                                </>
                            )}
                        </div>
                    )}
                </BasePopup>

                <BasePopup
                    isOpen={iconPopupOpen}
                    onClose={() => {
                        setIconPopupOpen(false);
                        setSelectedIcon(null);
                    }}
                    title={selectedIcon?.name ?? ""}
                    maxWidth="lg"
                    contentClassName="text-left max-h-[60vh] overflow-y-auto"
                >
                    {selectedIcon?.description && (
                        <p className="whitespace-pre-wrap text-sm leading-relaxed text-custom-primary dark:text-[#FFFFFF]">
                            {selectedIcon.description}
                        </p>
                    )}
                </BasePopup>

                <RatingFormModal
                    isOpen={ratingModalOpen}
                    onClose={() => setRatingModalOpen(false)}
                    onSuccess={() => setRatingModalOpen(false)}
                    mode="create"
                    rateableType="product"
                    rateableId={productIdNum}
                    productName={product?.name}
                    productImageUrl={galleryImages[0] ?? mediaSrc(product?.images?.[0])}
                    productAttributes={
                        selectedVariant?.attributes?.length
                            ? selectedVariant.attributes
                                  .map((a) => `${a.attribute}: ${a.value}`)
                                  .join(" • ")
                            : undefined
                    }
                />

                <div
                    className="fixed inset-x-0 bottom-0 z-40 border-t border-black/8 bg-custom-card/95 px-4 py-3 backdrop-blur-md lg:hidden dark:border-white/10"
                    style={{ paddingBottom: "max(0.75rem, env(safe-area-inset-bottom))" }}
                >
                    <div className="flex items-center gap-3">
                        <p className="min-w-0 truncate text-base font-semibold tabular-nums text-text-primary">
                            {displaySalePrice}
                        </p>
                        <button
                            type="button"
                            onClick={handleAddToCart}
                            disabled={!canAddToCart}
                            className="inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-xl bg-primary text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            <HiShoppingCart className="h-4 w-4" aria-hidden />
                            {canAddToCart
                                ? t("product.addToCart", "Add To Cart")
                                : t("product.unavailable", "Currently unavailable")}
                        </button>
                    </div>
                </div>
            </div>
    );
}

export default ProductDetails;
