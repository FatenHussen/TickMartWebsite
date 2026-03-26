import { useMemo, useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import BasePopup from "@/shared/component/BasePopup";
import Button from "@/shared/ui/Button";
import { useInfiniteList } from "@/shared/hooks/useInfiniteList";
import { HiPlus, HiChevronRight, HiArrowLeft } from "react-icons/hi2";
import { _ProductsApi } from "@/features/home/api/products.service";
import { _ProductApi } from "@/features/product/api/productApi";
import { queryKeys } from "@/utils/queryKeys";
import ShopVariantsPreview from "@/features/product/components/ShopVariantsPreview";
import type { ScheduledBasketDetail } from "../types/scheduledBasket";
import type { ScheduledBasketExtraItem } from "../types/scheduledBasket";
import type { UpdateScheduledBasketPayload } from "../types/scheduledBasket";
import type { UseMutationResult } from "@tanstack/react-query";
import type { ProductItem } from "@/features/home/types";

const DEFAULT_LAT = 33.5138;
const DEFAULT_LNG = 36.2765;
/** Page size for add-product list; more pages load on scroll via useInfiniteList */
const ADD_PRODUCT_PAGE_SIZE = 20;

export interface AddProductModalProps {
    isOpen: boolean;
    onClose: () => void;
    basket: ScheduledBasketDetail;
    /** Current delivery schedule (from details or user’s selection before save) */
    scheduleId: number;
    addedExtras: ScheduledBasketExtraItem[];
    itemQuantities: Record<number, number>;
    updateMutation: UseMutationResult<
        unknown,
        Error,
        { id: number | string; payload: UpdateScheduledBasketPayload },
        unknown
    >;
}

export default function AddProductModal({
    isOpen,
    onClose,
    basket,
    scheduleId,
    addedExtras,
    itemQuantities,
    updateMutation,
}: AddProductModalProps) {
    const { t } = useTranslation();
    const [addingProductId, setAddingProductId] = useState<number | null>(null);
    const [detailProductId, setDetailProductId] = useState<number | null>(null);
    const [listProductForDetail, setListProductForDetail] = useState<ProductItem | null>(null);
    const [selectedVariantId, setSelectedVariantId] = useState<number | null>(null);
    const [listScrollRoot, setListScrollRoot] = useState<HTMLDivElement | null>(null);

    const isInstantDeliveryParam = useMemo((): 0 | 1 => {
        const items = [...basket.items, ...addedExtras];
        if (items.length === 0) return 1;
        const first = items[0];
        const product =
            "product" in first ? first.product : (first as ScheduledBasketExtraItem).product;
        const v = product?.is_instant_delivery;
        return v === 0 || v === 1 ? v : 1;
    }, [basket.items, addedExtras]);

    const {
        items: products,
        observerTarget,
        isLoading: listLoading,
        isFetchingNextPage,
        hasNextPage,
    } = useInfiniteList<ProductItem>({
        queryKey: ["products", "addToBasket", isInstantDeliveryParam],
        fetchFn: async (page) => {
            const res = await _ProductsApi.getProducts({
                is_instant_delivery: isInstantDeliveryParam,
                per_page: ADD_PRODUCT_PAGE_SIZE,
                page,
            });
            return {
                items: res.data.items,
                pagination: res.data.pagination,
            };
        },
        enabled: isOpen && detailProductId === null,
        root: listScrollRoot,
    });

    useEffect(() => {
        if (!isOpen) {
            setDetailProductId(null);
            setListProductForDetail(null);
            setSelectedVariantId(null);
        }
    }, [isOpen]);

    useEffect(() => {
        setSelectedVariantId(null);
    }, [detailProductId]);

    const { data: productDetails, isLoading: detailsLoading } = useQuery({
        queryKey: queryKeys.product.details(detailProductId ?? 0, 0),
        queryFn: () =>
            _ProductApi.getProductDetails({
                productId: detailProductId!,
                lat: DEFAULT_LAT,
                lng: DEFAULT_LNG,
                shopId: 0,
            }),
        select: (response) => response.data,
        enabled: isOpen && detailProductId != null,
    });

    useEffect(() => {
        if (!productDetails?.shop_variants?.length) return;
        const inStock = productDetails.shop_variants.filter((v) => v.quantity > 0);
        if (inStock.length === 1) {
            setSelectedVariantId(inStock[0].id);
        }
    }, [productDetails?.id, productDetails?.shop_variants]);

    const existingProductIds = useMemo(() => {
        const ids = new Set(basket.items.map((i) => i.product.id));
        addedExtras.forEach((e) => ids.add(e.product.id));
        return ids;
    }, [basket.items, addedExtras]);

    const openProductDetail = (product: ProductItem) => {
        setDetailProductId(product.id);
        setListProductForDetail(product);
    };

    const closeProductDetail = () => {
        setDetailProductId(null);
        setListProductForDetail(null);
        setSelectedVariantId(null);
    };

    const resolveVariantIdForAdd = (): number | null => {
        if (selectedVariantId != null) return selectedVariantId;
        const variants = productDetails?.shop_variants;
        if (variants?.length === 1 && variants[0].quantity > 0) {
            return variants[0].id;
        }
        if (!variants?.length && listProductForDetail?.shop_product_variant_id != null) {
            return listProductForDetail.shop_product_variant_id;
        }
        return null;
    };

    const handleAddToBasket = () => {
        if (addingProductId != null || detailProductId == null) return;

        const variantId = resolveVariantIdForAdd();
        const productId = productDetails?.id ?? detailProductId;

        if (variantId == null) {
            toast.error(
                t("product.selectOneVariant", "Choose one option to add to cart"),
            );
            return;
        }

        setAddingProductId(productId);

        const existingItems = basket.items.map((item) => ({
            product_id: item.product.id,
            shop_product_variant_id: item.shop_product_variant_id ?? item.id,
            quantity: itemQuantities[item.id] ?? item.quantity,
        }));

        const newItemsFromExtras = addedExtras.map((extra) => ({
            product_id: extra.product.id,
            shop_product_variant_id: extra.shop_product_variant_id,
            quantity: itemQuantities[extra.id] ?? extra.quantity ?? 1,
        }));

        const newProductItem = {
            product_id: productId,
            shop_product_variant_id: variantId,
            quantity: 1,
        };

        updateMutation.mutate(
            {
                id: basket.id,
                payload: {
                    name: basket.name,
                    schedule_id: scheduleId,
                    items: [...existingItems, ...newItemsFromExtras, newProductItem],
                },
            },
            {
                onSuccess: () => {
                    toast.success(t("baskets.productAdded", "Product added to basket"));
                    onClose();
                    closeProductDetail();
                },
                onError: () => {
                    toast.error(t("baskets.failedToAddProduct", "Failed to add product"));
                    setAddingProductId(null);
                },
            },
        );
    };

    const isAdding = addingProductId != null || updateMutation.isPending;
    const detailTitle = productDetails?.name ?? listProductForDetail?.name ?? "";
    const detailImage =
        productDetails?.images?.[0]?.path ?? listProductForDetail?.image ?? "";
    const descriptionSnippet = useMemo(() => {
        const raw = productDetails?.full_description ?? productDetails?.description ?? "";
        if (!raw) return "";
        const stripped = raw.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
        return stripped.length > 220 ? `${stripped.slice(0, 220)}…` : stripped;
    }, [productDetails?.full_description, productDetails?.description]);

    const canAddFromDetail = (() => {
        const vid = resolveVariantIdForAdd();
        return vid != null;
    })();

    const showVariantPicker =
        (productDetails?.shop_variants?.length ?? 0) > 0;

    return (
        <BasePopup
            isOpen={isOpen}
            onClose={onClose}
            title={
                detailProductId != null
                    ? detailTitle || t("baskets.addProduct", "Add Product")
                    : t("baskets.addProduct", "Add Product")
            }
            maxWidth="lg"
            contentClassName="!text-start p-6"
            actions={
                detailProductId != null ? (
                    <div className="flex w-full flex-col gap-2 sm:flex-row sm:justify-between">
                        <Button
                            type="button"
                            onClick={closeProductDetail}
                            variant="secondary"
                            className="w-full border-custom-primary sm:w-auto"
                            size="lg"
                        >
                            <HiArrowLeft className="me-2 inline h-5 w-5" />
                            {t("common.back", "Back")}
                        </Button>
                        <Button
                            type="button"
                            onClick={handleAddToBasket}
                            disabled={isAdding || !canAddFromDetail}
                            className="w-full bg-cyan-500 hover:bg-cyan-600 text-white sm:w-auto"
                            size="lg"
                        >
                            {isAdding ? (
                                <span className="animate-pulse">{t("common.loading")}</span>
                            ) : (
                                <>
                                    <HiPlus className="me-2 inline h-5 w-5" />
                                    {t("baskets.add", "Add")}
                                </>
                            )}
                        </Button>
                    </div>
                ) : (
                    <Button
                        onClick={onClose}
                        className="w-full bg-cyan-500 hover:bg-cyan-600 text-white"
                        size="lg"
                    >
                        {t("common.close")}
                    </Button>
                )
            }
        >
            {detailProductId != null ? (
                <div className="space-y-4">
                    {detailsLoading ? (
                        <div className="flex justify-center py-12">
                            <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-primary" />
                        </div>
                    ) : (
                        <>
                            {detailImage ? (
                                <img
                                    src={detailImage}
                                    alt=""
                                    className="mx-auto max-h-48 w-auto rounded-xl object-contain"
                                />
                            ) : null}
                            {descriptionSnippet ? (
                                <p className="text-sm text-custom-secondary">{descriptionSnippet}</p>
                            ) : null}

                            {showVariantPicker ? (
                                <ShopVariantsPreview
                                    variants={productDetails!.shop_variants}
                                    availableShops={productDetails!.available_shops}
                                    selectedId={selectedVariantId}
                                    onSelect={(id) => setSelectedVariantId(id)}
                                />
                            ) : listProductForDetail?.shop_product_variant_id != null ? (
                                <p className="text-sm text-custom-secondary">
                                    {t(
                                        "baskets.addProductSingleVariant",
                                        "This product will be added with the default offer from the list.",
                                    )}
                                </p>
                            ) : (
                                <p className="text-sm font-medium text-amber-700 dark:text-amber-400">
                                    {t(
                                        "baskets.addProductNoVariant",
                                        "No purchasable variant is available for this product.",
                                    )}
                                </p>
                            )}
                        </>
                    )}
                </div>
            ) : (
                <div
                    ref={setListScrollRoot}
                    className="max-h-[50vh] overflow-y-auto"
                >
                    {listLoading && products.length === 0 ? (
                        <div className="flex justify-center py-12">
                            <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-primary" />
                        </div>
                    ) : products.length === 0 ? (
                        <p className="py-8 text-center text-custom-secondary">
                            {t("baskets.noProductsAvailable", "No products available to add.")}
                        </p>
                    ) : (
                        <>
                            <div className="space-y-3">
                                {products.map((product) => {
                                    const alreadyInBasket = existingProductIds.has(product.id);
                                    return (
                                    <button
                                        key={product.id}
                                        type="button"
                                        disabled={alreadyInBasket}
                                        onClick={() =>
                                            !alreadyInBasket && openProductDetail(product)
                                        }
                                        className={`flex w-full items-center gap-4 rounded-xl border p-3 text-start transition ${
                                            alreadyInBasket
                                                ? "cursor-not-allowed border-custom-secondary/60 bg-custom-tertiary/40 opacity-75"
                                                : "border-custom-primary hover:border-cyan-300 hover:bg-cyan-50/50 dark:hover:border-cyan-600 dark:hover:bg-cyan-900/20"
                                        }`}
                                    >
                                        <img
                                            src={product.image}
                                            alt={product.name}
                                            className="h-14 w-14 shrink-0 rounded-lg object-cover"
                                        />
                                        <div className="min-w-0 flex-1">
                                            <h4 className="truncate text-sm font-semibold text-custom-primary">
                                                {product.name}
                                            </h4>
                                            {alreadyInBasket ? (
                                                <p className="mt-1 text-xs font-medium text-custom-secondary">
                                                    {t(
                                                        "baskets.addProductAlreadyInBasket",
                                                        "Already in this basket",
                                                    )}
                                                </p>
                                            ) : (
                                                <p className="mt-1 text-sm font-bold text-cyan-600">
                                                    {product.price_after_discount_formatted ??
                                                        `${product.currency_symbol ?? ""}${(
                                                            product.price_after_discount ??
                                                            product.price ??
                                                            0
                                                        ).toFixed(2)}`}
                                                </p>
                                            )}
                                        </div>
                                        {!alreadyInBasket && (
                                            <HiChevronRight className="h-5 w-5 shrink-0 text-custom-tertiary" />
                                        )}
                                    </button>
                                    );
                                })}
                            </div>
                            {hasNextPage && isFetchingNextPage && (
                                <div className="flex justify-center py-4">
                                    <div className="h-6 w-6 animate-spin rounded-full border-b-2 border-primary" />
                                </div>
                            )}
                            <div ref={observerTarget} className="h-px w-full" aria-hidden />
                        </>
                    )}
                </div>
            )}
        </BasePopup>
    );
}
