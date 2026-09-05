import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import BasePopup from "@/shared/component/BasePopup";
import Button from "@/shared/ui/Button";
import FormattedPrice from "@/shared/component/FormattedPrice";
import { PremiumInlineLoader } from "@/shared/component/loading";
import ShopVariantsPreview from "@/features/product/components/ShopVariantsPreview";
import { _ProductApi } from "@/features/product/api/productApi";
import { queryKeys } from "@/utils/queryKeys";
import { paths } from "@/app/routes/path/paths";
import {
    isPurchasableVariant,
    variantOrderLimit,
    exceedsVariantStock,
} from "@/features/product/types/productDetails";
import type { ProductItem } from "@/features/home/types";
import type { UseMutationResult } from "@tanstack/react-query";
import type { CustomBasketState } from "../types";
import QtyStepper from "./QtyStepper";

const DEFAULT_LAT = 33.5138;
const DEFAULT_LNG = 36.2765;

type AddToCustomBasketPopupProps = {
    isOpen: boolean;
    onClose: () => void;
    product: ProductItem | null;
    addMutation: UseMutationResult<
        CustomBasketState,
        Error,
        { shop_product_variant_id: number; quantity: number },
        unknown
    >;
};

export default function AddToCustomBasketPopup({
    isOpen,
    onClose,
    product,
    addMutation,
}: AddToCustomBasketPopupProps) {
    const { t } = useTranslation();
    const [selectedVariantId, setSelectedVariantId] = useState<number | null>(
        null,
    );
    const [quantity, setQuantity] = useState(1);

    const productId = product?.id ?? 0;

    const { data: details, isLoading } = useQuery({
        queryKey: queryKeys.product.details(productId, 0),
        queryFn: () =>
            _ProductApi.getProductDetails({
                productId,
                lat: DEFAULT_LAT,
                lng: DEFAULT_LNG,
                shopId: 0,
            }),
        select: (response) => response.data,
        enabled: isOpen && productId > 0,
    });

    const purchasable = useMemo(
        () => (details?.shop_variants ?? []).filter(isPurchasableVariant),
        [details?.shop_variants],
    );

    useEffect(() => {
        if (!isOpen) {
            setSelectedVariantId(null);
            setQuantity(1);
            return;
        }
        setQuantity(1);
        setSelectedVariantId(null);
    }, [isOpen, productId]);

    useEffect(() => {
        if (purchasable.length === 1) {
            setSelectedVariantId(purchasable[0].id);
        }
    }, [details?.id, purchasable]);

    const selectedVariant =
        purchasable.find((v) => v.id === selectedVariantId) ?? null;

    const maxQty = variantOrderLimit(
        selectedVariant,
        details?.max_purchase_quantity,
    );

    const priceLabel =
        selectedVariant?.price_after_discount_formatted ??
        selectedVariant?.price_formatted ??
        details?.price_after_discount_formatted ??
        product?.price_after_discount_formatted ??
        null;

    const resolvedVariantId = (): number | null => {
        if (selectedVariantId != null) return selectedVariantId;
        if (purchasable.length === 1) return purchasable[0].id;
        if (
            purchasable.length === 0 &&
            product?.shop_product_variant_id != null
        ) {
            return product.shop_product_variant_id;
        }
        return null;
    };

    const handleAdd = () => {
        const variantId = resolvedVariantId();
        if (variantId == null) {
            toast.error(
                t("product.selectOneVariant", "Choose one option to add to cart"),
            );
            return;
        }
        if (exceedsVariantStock(selectedVariant, quantity)) {
            toast.error(
                t("product.insufficientStock", "Not enough stock for this quantity."),
            );
            return;
        }
        addMutation.mutate(
            { shop_product_variant_id: variantId, quantity },
            {
                onSuccess: () => {
                    onClose();
                },
            },
        );
    };

    const canAdd = resolvedVariantId() != null && quantity >= 1;
    const imageSrc = details?.images?.[0]?.path ?? product?.image;

    return (
        <BasePopup
            isOpen={isOpen}
            onClose={onClose}
            title={details?.name ?? product?.name ?? t("customBasket.addToBasket")}
            maxWidth="lg"
            contentClassName="!text-start p-5"
            actions={
                <Button
                    type="button"
                    variant="primary"
                    fullWidth
                    className="h-12 rounded-2xl"
                    disabled={!canAdd || addMutation.isPending}
                    isLoading={addMutation.isPending}
                    onClick={handleAdd}
                >
                    {t("customBasket.addToBasket")}
                </Button>
            }
        >
            {isLoading ? (
                <div className="flex min-h-40 items-center justify-center">
                    <PremiumInlineLoader size="sm" />
                </div>
            ) : (
                <div className="space-y-4">
                    {imageSrc ? (
                        <img
                            src={imageSrc}
                            alt=""
                            className="mx-auto h-32 w-32 rounded-3xl object-cover shadow-md ring-1 ring-black/5 dark:ring-white/10"
                        />
                    ) : null}
                    {priceLabel ? (
                        <div className="text-center">
                            <FormattedPrice
                                value={priceLabel}
                                prominent
                                className="text-lg font-bold text-custom-primary dark:text-white"
                            />
                        </div>
                    ) : null}
                    {purchasable.length > 0 && (
                        <ShopVariantsPreview
                            variants={details?.shop_variants ?? []}
                            availableShops={details?.available_shops}
                            selectedId={selectedVariantId}
                            onSelect={setSelectedVariantId}
                        />
                    )}
                    <div className="flex items-center justify-between gap-3">
                        <p className="text-sm font-medium text-custom-secondary">
                            {t("product.quantity", "Quantity")}
                        </p>
                        <QtyStepper
                            value={quantity}
                            min={1}
                            max={maxQty}
                            onChange={setQuantity}
                        />
                    </div>
                    {productId > 0 && (
                        <Link
                            to={paths.client.productDetails(productId)}
                            className="block text-center text-sm font-semibold text-primary hover:underline"
                        >
                            {t("product.viewFullProduct", "View full product")}
                        </Link>
                    )}
                </div>
            )}
        </BasePopup>
    );
}
