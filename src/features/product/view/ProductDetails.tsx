import { useState, useMemo, useEffect, useCallback, useRef } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useLanguage } from "@/context/LanguageContext";
import ProductImageGallery from "../components/ProductImageGallery";
import ProductInfo from "../components/ProductInfo";
import AttributeSelector from "../components/AttributeSelector";
import ProductQuantitySelector from "../components/ProductQuantitySelector";
import ProductActions from "../components/ProductActions";
import ProductDescription from "../components/ProductDescription";
import ShopVariantsPreview from "../components/ShopVariantsPreview";
import ExtraDetailsTable from "../components/ExtraDetailsTable";
import CategoryDetailsTable from "../components/CategoryDetailsTable";
import ExtrasCheckboxTable from "../components/ExtrasCheckboxTable";
import ShopSelector from "../components/ShopSelector";
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
import { toast } from "sonner";
import { useCartStore } from "@/store/cart";
import { useAuthStore } from "@/store/auth";
import type { CartItem } from "@/features/cart/types";
import { paths } from "@/app/routes/path/paths";
import { useFavorites, useToggleFavorite } from "@/features/account/hooks/useFavorites";
import { useCanRate } from "@/features/account/hooks/useRatings";
import { RatingFormModal } from "@/features/account/components";
import BasePopup from "@/shared/component/BasePopup";
import Button from "@/shared/ui/Button";
import Rating from "@/shared/component/Rating";
import type { ProductItem } from "@/features/home/types";
import {
    mapApiBottomBadgesToProductCard,
    mapApiTopBadgesToProductCard,
} from "@/shared/lib/mapProductBadges";
import { cn } from "@/shared/lib/utils";
import { HiEye } from "react-icons/hi";

function ProductDetails() {
    const { t } = useTranslation();
    const { productId } = useParams<{ productId: string }>();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { isRTL } = useLanguage();

    const lat = parseFloat(searchParams.get("lat") || "33.51380000");
    const lng = parseFloat(searchParams.get("lng") || "36.27650000");
    const initialShopId = parseInt(searchParams.get("shop_id") || "0", 10);

    const [selectedShopId, setSelectedShopId] = useState(initialShopId);
    const [ratingModalOpen, setRatingModalOpen] = useState(false);
    const [iconPopupOpen, setIconPopupOpen] = useState(false);
    const [selectedIcon, setSelectedIcon] = useState<{
        name: string;
        description: string;
    } | null>(null);
    const [specialInstructions, setSpecialInstructions] = useState("");
    const [selectedExtraIds, setSelectedExtraIds] = useState<number[]>([]);
    const [selectedExtraDetailIds, setSelectedExtraDetailIds] = useState<number[]>([]);
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
        shopId: selectedShopId,
    });

    const {
        data: boughtWithPreview,
        isLoading: isBoughtWithPreviewLoading,
        isError: isBoughtWithPreviewError,
    } = useProductDetails({
        productId: boughtWithPreviewId ?? 0,
        lat,
        lng,
        shopId: selectedShopId,
    });

    useEffect(() => {
        if (product?.available_shops?.length) {
            const shopExists = product.available_shops.some(
                (s) => s.id === selectedShopId
            );
            if (!shopExists) {
                setSelectedShopId(product.available_shops[0].id);
            }
        }
    }, [product?.available_shops, selectedShopId]);

    useEffect(() => {
        setSelectedExtraIds([]);
        setSelectedExtraDetailIds([]);
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
        const firstOk = variants.find((x) => x.quantity > 0) ?? variants[0];
        setPreviewSelectedShopVariantId((prev) => {
            if (prev != null && variants.some((v) => v.id === prev)) return prev;
            return firstOk.id;
        });
    }, [boughtWithPreview]);

    useEffect(() => {
        const v = previewSelectedVariant;
        if (!v || v.quantity <= 0) return;
        if (previewQuantity > v.quantity) {
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

    const { data: sellerProducts = [] } =
        useProductsFromSameSeller(selectedShopId);

    const {
        selectedAttributes,
        setAttributeValue,
        currentPrice,
        currentPriceAfterDiscount,
        currentImages,
        currentQuantity,
        selectedVariant,
        availableAttributes,
    } = useVariantSelector({
        attributesMap: product?.attributes_map || [],
        shopVariants: product?.shop_variants || [],
        defaultImages: product?.images || [],
        basePrice: product?.price || 0,
        basePriceAfterDiscount: product?.price_after_discount || 0,
    });

    const [quantity, setQuantity] = useState(1);
    const { data: favoriteProducts = [] } = useFavorites("product", false);
    const toggleFavorite = useToggleFavorite();
    const isFavorite =
        product?.is_favorite ?? favoriteProducts.some((f) => f.id === productIdNum);
    const addItem = useCartStore((s) => s.addItem);

    const handleAddPreviewToCart = useCallback(() => {
        if (!boughtWithPreview) return;
        const variants = boughtWithPreview.shop_variants ?? [];
        const v =
            variants.length > 0
                ? variants.find((x) => x.id === previewSelectedShopVariantId)
                : undefined;

        if (variants.length > 0) {
            if (!v) {
                toast.error(
                    t("product.selectVariant", "Select a variant"),
                );
                return;
            }
            if (v.quantity <= 0) {
                toast.error(t("product.outOfStock", "Out of stock"));
                return;
            }
            if (previewQuantity > v.quantity) {
                toast.error(
                    t(
                        "product.insufficientStock",
                        "Not enough stock for this quantity.",
                    ),
                );
                return;
            }
        }

        const sym =
            v?.currency_symbol ?? boughtWithPreview.currency_symbol ?? "£";
        const unitPrice = v
            ? v.price
            : boughtWithPreview.price_after_discount ??
              boughtWithPreview.price;
        const priceStr =
            v?.price_formatted ?? `${sym}${unitPrice.toFixed(2)}`;
        const subtotalNum = unitPrice * previewQuantity;
        const subtotalStr = `${sym}${subtotalNum.toFixed(2)}`;

        const imagePath =
            v?.images?.[0]?.path ?? boughtWithPreview.images?.[0]?.path ?? "";

        const lineId =
            v != null ? `spv-${v.id}` : `${boughtWithPreview.id}-base`;

        let selectedAttrs: Record<string, string> | undefined;
        if (v?.attributes?.length) {
            selectedAttrs = {};
            for (const a of v.attributes) {
                selectedAttrs[a.attribute] = a.value;
            }
        }

        const shopIdForLine = v?.shop_id ?? selectedShopId;
        const selectedShop = boughtWithPreview.available_shops?.find(
            (s) => s.id === shopIdForLine,
        );

        const cartItem: CartItem = {
            id: lineId,
            name: boughtWithPreview.name,
            description: boughtWithPreview.description,
            category: boughtWithPreview.category?.name,
            category_id: boughtWithPreview.category?.id,
            image: imagePath,
            store: selectedShop?.name,
            price: priceStr,
            priceNumeric: unitPrice,
            quantity: previewQuantity,
            subtotal: subtotalStr,
            storeId: shopIdForLine,
            hasFreeDelivery: boughtWithPreview.is_instant_delivery
                ? true
                : undefined,
            is_instant_delivery: !!boughtWithPreview.is_instant_delivery,
            productId: boughtWithPreview.id,
            variantId: v?.variant_id,
            shop_product_variant_id: v?.id,
            shopId: shopIdForLine,
            selectedAttributes: selectedAttrs,
        };

        if (
            !v &&
            boughtWithPreview.price > boughtWithPreview.price_after_discount
        ) {
            cartItem.originalPrice =
                boughtWithPreview.price_formatted ??
                `${sym}${boughtWithPreview.price.toFixed(2)}`;
            cartItem.savingsText = `${t("product.youSaved", "You saved")} ${sym}${(
                boughtWithPreview.price - boughtWithPreview.price_after_discount
            ).toFixed(2)}`;
        }

        const result = addItem(cartItem);
        if (result === "success") {
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
        selectedShopId,
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

            const priceDisplay =
                item.price_after_discount_formatted ??
                item.price_formatted ??
                `${item.currency_symbol ?? product.currency_symbol ?? "£"}${(
                    item.price_after_discount ?? item.price
                ).toFixed(2)}`;

            const originalPrice =
                item.price_after_discount != null &&
                item.price_after_discount < item.price
                    ? item.price_formatted ??
                      `${item.currency_symbol ?? product.currency_symbol ?? "£"}${item.price.toFixed(2)}`
                    : undefined;

            const savings =
                item.amount_saved != null && item.amount_saved > 0
                    ? `${t("product.youSaved", "You saved")} ${item.amount_saved_formatted ?? ""}`
                    : undefined;

            return {
                id: item.id,
                name: item.name,
                price: priceDisplay,
                originalPrice,
                rating: item.rating ?? 0,
                image: item.image,
                category: item.category,
                sold: item.sold_number,
                savings,
                badge: topBadges.length ? topBadges : undefined,
                bottomBadges: bottomBadges.length ? bottomBadges : undefined,
                isFavorite: item.is_favorite ?? favoriteIds.includes(item.id),
            };
        });
    }, [product?.bought_with, product?.currency_symbol, favoriteIds, t]);

    const similarProductItems = useMemo(() => {
        return similarProducts
            .filter((p) => p.id !== product?.id)
            .map((p) => {
                const pi = p as ProductItem;
                return {
                    id: p.id,
                    name: p.name,
                    price: `£${p.price_after_discount.toFixed(2)}`,
                    originalPrice:
                        p.price > p.price_after_discount
                            ? `£${p.price.toFixed(2)}`
                            : undefined,
                    rating: p.rating || 0,
                    image: p.image,
                    category: p.category,
                    sold: p.sold_number,
                    savings:
                        p.amount_saved > 0
                            ? `${t("product.youSaved", "You saved")} £${p.amount_saved.toFixed(2)}`
                            : undefined,
                    badge: mapApiTopBadgesToProductCard(
                        pi.top_badges?.length ? pi.top_badges : pi.budges
                    ),
                    bottomBadges: mapApiBottomBadgesToProductCard(pi.bottom_badges),
                    isFavorite:
                        (p as { is_favorite?: boolean }).is_favorite ??
                        favoriteIds.includes(p.id),
                };
            });
    }, [similarProducts, product?.id, t, favoriteIds]);

    const sellerProductItems = useMemo(() => {
        return sellerProducts
            .filter((p) => p.id !== product?.id)
            .map((p) => {
                const pi = p as ProductItem;
                return {
                    id: p.id,
                    name: p.name,
                    price: `£${p.price_after_discount.toFixed(2)}`,
                    originalPrice:
                        p.price > p.price_after_discount
                            ? `£${p.price.toFixed(2)}`
                            : undefined,
                    rating: p.rating || 0,
                    image: p.image,
                    category: p.category,
                    sold: p.sold_number,
                    savings:
                        p.amount_saved > 0
                            ? `${t("product.youSaved", "You saved")} £${p.amount_saved.toFixed(2)}`
                            : undefined,
                    badge: mapApiTopBadgesToProductCard(
                        pi.top_badges?.length ? pi.top_badges : pi.budges
                    ),
                    bottomBadges: mapApiBottomBadgesToProductCard(pi.bottom_badges),
                    isFavorite:
                        (p as { is_favorite?: boolean }).is_favorite ??
                        favoriteIds.includes(p.id),
                };
            });
    }, [sellerProducts, product?.id, t, favoriteIds]);

    const handleAddToCart = () => {
        if (!product) return;
        const price = currentPriceAfterDiscount ?? currentPrice ?? 0;
        const extraIdsForCart =
            product.product_type === "food"
                ? selectedExtraIds
                : selectedExtraDetailIds;
        const extrasKey =
            extraIdsForCart.length > 0
                ? `-e-${[...extraIdsForCart].sort((a, b) => a - b).join("-")}`
                : "";
        const lineId =
            selectedVariant?.id != null
                ? `spv-${selectedVariant.id}${extrasKey}`
                : `${product.id}-${selectedVariant?.variant_id ?? "base"}${extrasKey}`;
        const imagePath = currentImages?.[0] ?? product?.images?.[0]?.path ?? "";
        const isInstant = !!product.is_instant_delivery;
        const selectedShop = product.available_shops?.find(
            (s) => s.id === selectedShopId
        );
        const cartItem: CartItem = {
            id: lineId,
            name: product.name,
            description: product.description,
            category: product.category?.name,
            category_id: product.category?.id,
            image: imagePath,
            store: selectedShop?.name,
            price: `£${price.toFixed(2)}`,
            priceNumeric: price,
            quantity,
            subtotal: `£${(price * quantity).toFixed(2)}`,
            storeId: selectedShopId,
            hasFreeDelivery: isInstant ? true : undefined,
            is_instant_delivery: isInstant,
            productId: product.id,
            variantId: selectedVariant?.variant_id,
            shop_product_variant_id: selectedVariant?.id,
            shopId: selectedVariant?.shop_id ?? selectedShopId,
            selectedAttributes:
                Object.keys(selectedAttributes).length > 0
                    ? { ...selectedAttributes }
                    : undefined,
        };
        if (extraIdsForCart.length > 0) {
            cartItem.extras = [...extraIdsForCart];
        }
        if (
            currentPriceAfterDiscount != null &&
            currentPrice != null &&
            currentPriceAfterDiscount < currentPrice
        ) {
            cartItem.originalPrice = `£${currentPrice.toFixed(2)}`;
            cartItem.savingsText = `${t("product.youSaved", "You saved")} £${(
                currentPrice - currentPriceAfterDiscount
            ).toFixed(2)}`;
        }
        const result = addItem(cartItem);
        if (result === "success") {
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

    const handleShare = () => {
        if (navigator.share && product) {
            navigator.share({
                title: product.name,
                text: product.description,
                url: window.location.href,
            });
        }
    };

    const handleToggleExtra = (id: number) => {
        setSelectedExtraIds((prev) =>
            prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
        );
    };

    const handleToggleExtraDetail = (id: number) => {
        setSelectedExtraDetailIds((prev) =>
            prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
        );
    };

    if (isLoading) {
        return (
            <div className="bg-custom-primary min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-light"></div>
            </div>
        );
    }

    if (error || !product) {
        return (
            <div className="bg-custom-primary min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <p className="text-custom-primary text-lg">
                        {t("product.notFound", "Product not found")}
                    </p>
                </div>
            </div>
        );
    }

    const isFood = product.product_type === "food";

    // Build badges array from API fields
    const badges: Array<{ label: string; className?: string }> = [];
    if (product.price > product.price_after_discount) {
        const pct = Math.round(
            ((product.price - product.price_after_discount) / product.price) * 100
        );
        badges.push({
            label: `${pct}% OFF`,
            className: "bg-primary-light text-white",
        });
    }
    if (product.is_most_ordered) {
        badges.push({
            label: t("product.mostOrdered", "Most Ordered"),
            className: "bg-yellow-400 text-black",
        });
    }
    if (product.is_instant_delivery) {
        badges.push({
            label: t("product.freeDelivery", "Free Delivery"),
            className: "bg-yellow-400 text-black",
        });
    }

    const savings =
        product.price > product.price_after_discount
            ? `${t("product.youSaved", "You saved")} £${(
                product.price - product.price_after_discount
            ).toFixed(2)}`
            : undefined;

    const formatPrice = (price: number) => `£${price.toFixed(2)}`;

    const hasShops =
        !isFood &&
        product.available_shops &&
        product.available_shops.length > 0;

    return (
        <div className="bg-custom-primary">
            <div className="page-container py-8" dir={isRTL ? "rtl" : "ltr"}>
                <div className="grid grid-cols-1 gap-24 lg:grid-cols-2">
                    {/* Left – Product Images */}
                    <div className="flex flex-col gap-8">
                        <ProductImageGallery
                            key={selectedVariant?.id ?? "base"}
                            images={currentImages}
                            isFavorite={isFavorite}
                            onToggleFavorite={handleToggleFavorite}
                            onShare={handleShare}
                        />

                        <ProductDescription
                            description={product.description}
                            fullDescription={product.full_description}
                        />
                    </div>

                    {/* Right – Product Details */}
                    <div className="flex flex-col gap-6">
                        <ProductInfo
                            category={product.category?.name}
                            name={product.name}
                            sku={isFood ? undefined : product.sku}
                            origin={isFood ? undefined : product.country}
                            price={formatPrice(currentPriceAfterDiscount || currentPrice)}
                            originalPrice={
                                currentPriceAfterDiscount < currentPrice
                                    ? formatPrice(currentPrice)
                                    : undefined
                            }
                            savings={savings}
                            sold={product.sold_number}
                            rating={product.rating}
                            badges={badges}
                            topRightSlot={
                                hasShops ? (
                                    <ShopSelector
                                        compact
                                        shops={product.available_shops}
                                        selectedShopId={selectedShopId}
                                        onShopChange={setSelectedShopId}
                                    />
                                ) : undefined
                            }
                        />

                        {/* Attribute Selectors (color, size, etc.) */}
                        {availableAttributes.map((attribute) => (
                            <AttributeSelector
                                key={attribute.attribute}
                                attribute={attribute}
                                selectedValue={selectedAttributes[attribute.attribute]}
                                onValueChange={(value) =>
                                    setAttributeValue(attribute.attribute, value)
                                }
                                activeColor={isFood ? "teal" : "dark"}
                            />
                        ))}

                        {/* Food: Extras table with checkboxes */}
                        {isFood && product.extras && product.extras.length > 0 && (
                            <ExtrasCheckboxTable
                                extras={product.extras}
                                selectedIds={selectedExtraIds}
                                onToggle={handleToggleExtra}
                            />
                        )}

                        {/* Food: Special instructions textarea */}
                        {isFood && (
                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-semibold text-text-primary">
                                    {t("product.specialInstructions", "Special instructions")}
                                </label>
                                <textarea
                                    value={specialInstructions}
                                    onChange={(e) => setSpecialInstructions(e.target.value)}
                                    placeholder={t(
                                        "product.specialInstructionsPlaceholder",
                                        "Any special requests..."
                                    )}
                                    rows={3}
                                    className="w-full resize-none rounded-lg border border-custom-primary bg-custom-primary px-4 py-3 text-sm text-custom-primary placeholder-gray-400 outline-none transition-colors focus:border-primary-light focus:ring-1 focus:ring-primary-light"
                                />
                            </div>
                        )}

                        {/* Quantity + Add to Cart */}
                        <ProductQuantitySelector
                            quantity={quantity}
                            min={1}
                            max={currentQuantity || 10}
                            onQuantityChange={setQuantity}
                            onAddToCart={handleAddToCart}
                            addToCartText={t("product.addToCart", "Add To Cart")}
                        />

                        <ProductActions
                            icons={product.icons}
                            onIconClick={(icon) => {
                                setSelectedIcon({
                                    name: icon.name,
                                    description: icon.description || "",
                                });
                                setIconPopupOpen(true);
                            }}
                        />

                        {/* Category Details Table */}
                        {!isFood &&
                            product.category_details &&
                            product.category_details.length > 0 && (
                                <div className="">
                                    <h3 className="text-lg font-semibold text-custom-primary mb-3">
                                        {t(
                                            "product.categoryDetails",
                                            "Category Details"
                                        )}
                                    </h3>
                                    <CategoryDetailsTable
                                        details={product.category_details}
                                    />
                                </div>
                            )}

                        {/* Extra Details Table (non-food static key/value + price) */}
                        {!isFood &&
                            product.extra_details &&
                            product.extra_details.length > 0 && (
                                <div className="mt-4">
                                    <h3 className="text-lg font-semibold text-custom-primary mb-3">
                                        {t("product.details", "Details")}
                                    </h3>
                                    <ExtraDetailsTable
                                        details={product.extra_details}
                                        currencySymbol={
                                            product.currency_symbol ?? "$"
                                        }
                                        selectable
                                        selectedIds={selectedExtraDetailIds}
                                        onToggle={handleToggleExtraDetail}
                                    />
                                </div>
                            )}

                    </div>
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
                                    className="px-4 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-600 text-white font-medium text-sm"
                                >
                                    {t("account.myReviews.rateProduct", "قيم هذا المنتج")}
                                </button>
                            ) : (
                                <p className="text-sm text-custom-secondary">
                                    {canRateData.reason_ar || canRateData.reason ||
                                        t("account.myReviews.mustPurchaseToRate", "يجب شراء هذا المنتج قبل تقييمه")}
                                </p>
                            )}
                        </div>
                    )}
                    {isRatingsLoading ? (
                        <div className="mt-10 flex justify-center py-8">
                            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary-light" />
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
                                "bg-gradient-to-br from-cyan-400/30 via-sky-400/20 to-primary/25",
                                "text-cyan-700 ring-2 ring-cyan-400/35 dark:text-cyan-200 dark:ring-cyan-400/25"
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
                    backdropClassName="pv-modal-backdrop bg-gradient-to-br from-slate-950/80 via-cyan-950/45 to-slate-900/75 backdrop-blur-md"
                    className={cn(
                        "pv-modal-panel border-0",
                        "bg-gradient-to-b from-white via-white to-slate-50/95",
                        "shadow-[0_28px_90px_-20px_rgba(0,174,209,0.38)]",
                        "ring-2 ring-cyan-400/30 dark:from-slate-900 dark:via-slate-950 dark:to-slate-950 dark:ring-cyan-500/25"
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
                                    disabled={
                                        (boughtWithPreview.shop_variants
                                            ?.length ?? 0) > 0
                                            ? !previewSelectedVariant ||
                                              previewSelectedVariant.quantity <=
                                                  0 ||
                                              previewQuantity < 1
                                            : false
                                    }
                                    className="rounded-xl bg-gradient-to-r from-cyan-500 to-primary shadow-lg shadow-cyan-500/25 transition hover:brightness-105 disabled:opacity-50"
                                    onClick={handleAddPreviewToCart}
                                >
                                    {t("product.addToCart", "Add To Cart")}
                                </Button>
                                <Button
                                    type="button"
                                    variant="outline"
                                    fullWidth
                                    className="rounded-xl border-2 border-cyan-500/40 font-semibold"
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
                                    "bg-gradient-to-r from-cyan-500/12 via-sky-400/10 to-transparent",
                                    "text-xs font-semibold uppercase tracking-[0.2em] text-cyan-800 dark:text-cyan-200/90"
                                )}
                            >
                                <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.9)]" />
                                {t("product.quickViewBadge", "Quick view")}
                            </div>

                            {isBoughtWithPreviewLoading && (
                                <div className="flex flex-col items-center justify-center gap-3 py-14">
                                    <div className="h-12 w-12 animate-spin rounded-full border-2 border-b-2 border-t-2 border-cyan-400/80 border-t-transparent" />
                                    <p className="text-sm text-custom-secondary">
                                        {t(
                                            "product.quickViewLoadingHint",
                                            "Fetching photos, prices & variants…"
                                        )}
                                    </p>
                                </div>
                            )}
                            {isBoughtWithPreviewError && (
                                <p className="text-center text-sm text-red-600">
                                    {t(
                                        "product.detailsLoadError",
                                        "Could not load product details."
                                    )}
                                </p>
                            )}
                            {boughtWithPreview && !isBoughtWithPreviewLoading && (
                                <>
                                    <div className="group relative overflow-hidden rounded-2xl shadow-xl ring-1 ring-black/5 dark:ring-white/10">
                                        <div className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-t from-black/35 via-transparent to-transparent" />
                                        <img
                                            src={
                                                previewSelectedVariant?.images?.[0]
                                                    ?.path ??
                                                boughtWithPreview.images?.[0]
                                                    ?.path ??
                                                ""
                                            }
                                            alt=""
                                            className="mx-auto w-full max-h-60 object-cover transition duration-500 group-hover:scale-[1.02]"
                                        />
                                    </div>
                                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-custom-secondary">
                                        {boughtWithPreview.category?.name && (
                                            <span className="rounded-full bg-custom-secondary/80 px-2.5 py-0.5 text-xs font-medium">
                                                {boughtWithPreview.category.name}
                                            </span>
                                        )}
                                        {boughtWithPreview.country && (
                                            <span>
                                                {boughtWithPreview.category?.name
                                                    ? "· "
                                                    : ""}
                                                {boughtWithPreview.country}
                                            </span>
                                        )}
                                    </div>
                                    <Rating
                                        rating={boughtWithPreview.rating ?? 0}
                                        size="sm"
                                    />
                                    <div className="flex flex-wrap items-baseline gap-3">
                                        <p className="text-2xl font-bold tabular-nums text-custom-primary">
                                            {previewSelectedVariant
                                                ? previewSelectedVariant.price_formatted ??
                                                  `${previewSelectedVariant.currency_symbol ?? boughtWithPreview.currency_symbol ?? ""}${previewSelectedVariant.price.toFixed(2)}`
                                                : boughtWithPreview.price_after_discount_formatted ??
                                                  boughtWithPreview.price_formatted ??
                                                  `${boughtWithPreview.currency_symbol ?? ""}${(
                                                      boughtWithPreview.price_after_discount ??
                                                      boughtWithPreview.price
                                                  ).toFixed(2)}`}
                                        </p>
                                        {!previewSelectedVariant &&
                                            boughtWithPreview.price >
                                                boughtWithPreview.price_after_discount && (
                                                <p className="text-base text-custom-tertiary line-through">
                                                    {boughtWithPreview.price_formatted ??
                                                        `${boughtWithPreview.currency_symbol ?? ""}${boughtWithPreview.price.toFixed(2)}`}
                                                </p>
                                            )}
                                    </div>
                                    <div className="rounded-2xl border border-custom-primary/15 bg-gradient-to-br from-custom-secondary/50 to-transparent p-4 dark:from-slate-800/50">
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
                                            availableShops={
                                                boughtWithPreview.available_shops
                                            }
                                            selectedId={
                                                previewSelectedShopVariantId
                                            }
                                            onSelect={
                                                setPreviewSelectedShopVariantId
                                            }
                                            className="rounded-2xl border border-cyan-400/20 bg-cyan-50/40 p-4 dark:bg-cyan-950/20"
                                        />
                                    )}
                                    <div className="rounded-xl border border-custom-primary/20 bg-custom-secondary/30 px-3 py-2">
                                        <p className="mb-2 text-xs font-medium text-custom-secondary">
                                            {t("product.quantity", "Quantity")}
                                        </p>
                                        <ProductQuantitySelector
                                            quantity={previewQuantity}
                                            min={1}
                                            max={
                                                previewSelectedVariant
                                                    ? previewSelectedVariant.quantity
                                                    : boughtWithPreview.quantity
                                            }
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
                        <p className="whitespace-pre-wrap text-sm leading-relaxed text-custom-primary">
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
                    productImageUrl={currentImages?.[0] ?? product?.images?.[0]?.path}
                    productAttributes={
                        selectedVariant?.attributes?.length
                            ? selectedVariant.attributes
                                  .map((a) => `${a.attribute}: ${a.value}`)
                                  .join(" • ")
                            : undefined
                    }
                />
            </div>
        </div>
    );
}

export default ProductDetails;
