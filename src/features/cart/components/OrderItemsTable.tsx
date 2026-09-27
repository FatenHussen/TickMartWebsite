import { useTranslation } from "react-i18next";
import {
    GradientTable,
    GradientTableHeader,
    GradientTableHeaderCell,
    GradientTableBody,
    GradientTableRow,
    GradientTableCell,
} from "@/shared/component/table";
import type { CartItem } from "../types";
import PriceBlock from "@/shared/component/PriceBlock";

type OrderItemsTableProps = {
    items: CartItem[];
    onMoveToWishlist?: (itemId: number | string) => void;
    title?: string;
    showTitle?: boolean;
    compact?: boolean;
};

export default function OrderItemsTable({
    items,
    onMoveToWishlist,
    title,
    showTitle = true,
    compact = false,
}: OrderItemsTableProps) {
    const { t } = useTranslation();

    if (compact) {
        return (
            <section className="overflow-hidden rounded-2xl border border-custom-primary bg-custom-card">
                {showTitle && (
                    <div className="border-b border-custom-primary px-4 py-4 sm:px-5">
                        <h2 className="text-base font-semibold text-custom-primary">
                            {title ?? t("checkout.orderItems")}
                        </h2>
                    </div>
                )}
                <div className="divide-y divide-[color:color-mix(in_srgb,var(--color-border-primary)_85%,transparent)]">
                    {items.map((item) => (
                        <CompactOrderItemRow key={item.id} item={item} />
                    ))}
                </div>
            </section>
        );
    }

    return (
        <GradientTable
            title={title ?? t("checkout.orderItems", "Order items")}
            showTitle={showTitle}
        >
            <GradientTableHeader>
                <GradientTableHeaderCell align="left" isFirst>
                    {t("cart.product")}
                </GradientTableHeaderCell>
                <GradientTableHeaderCell align="center">
                    {t("checkout.price")}
                </GradientTableHeaderCell>
                <GradientTableHeaderCell align="center">
                    {t("cart.quantity")}
                </GradientTableHeaderCell>
                <GradientTableHeaderCell align="right" isLast>
                    {t("cart.subtotal")}
                </GradientTableHeaderCell>
            </GradientTableHeader>
            <GradientTableBody>
                {items.map((item, index) => (
                    <OrderItemRow
                        key={item.id}
                        item={item}
                        onMoveToWishlist={onMoveToWishlist}
                        isLast={index === items.length - 1}
                    />
                ))}
            </GradientTableBody>
        </GradientTable>
    );
}

function CompactOrderItemRow({ item }: { item: CartItem }) {
    const { t } = useTranslation();
    const variant = [item.size, item.type].filter(Boolean).join(" · ");
    const isFree = Boolean((item as { _isFree?: boolean })._isFree);

    return (
        <article className="flex items-center gap-3 px-4 py-3.5 sm:px-5">
            <div className="h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-custom-muted">
                {item.image ? (
                    <img
                        src={item.image}
                        alt=""
                        className="h-full w-full object-cover"
                    />
                ) : null}
            </div>
            <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-custom-primary">
                    {item.name}
                    {isFree ? (
                        <span className="ms-1 font-medium text-[var(--color-success)]">
                            ({t("cart.free")})
                        </span>
                    ) : null}
                </p>
                <p className="mt-0.5 text-xs text-custom-secondary">
                    {t("orders.qty")} {item.quantity}
                    {item.store ? ` · ${item.store}` : ""}
                    {variant ? ` · ${variant}` : ""}
                </p>
            </div>
            <span className="shrink-0 text-sm font-semibold tabular-nums text-custom-primary">
                {isFree ? t("cart.free") : item.price}
            </span>
        </article>
    );
}

type OrderItemRowProps = {
    item: CartItem;
    onMoveToWishlist?: (itemId: number | string) => void;
    isLast?: boolean;
};

function OrderItemRow({
    item,
    onMoveToWishlist,
    isLast = false,
}: OrderItemRowProps) {
    const { t } = useTranslation();
    const meta = [item.category, item.store].filter(Boolean).join(" · ");
    const variant = [item.size, item.type].filter(Boolean).join(" · ");
    const isFree = Boolean((item as { _isFree?: boolean })._isFree);
    const freeQuantity =
        (item as { _freeQuantity?: number })._freeQuantity ?? 0;
    const isExcluded = Boolean(
        (item as { _isExcludedFromCoupon?: boolean })._isExcludedFromCoupon,
    );

    return (
        <GradientTableRow
            isLast={isLast}
            className="bg-[color-mix(in_srgb,var(--color-main)_2%,var(--color-bg-card))] even:bg-[color-mix(in_srgb,var(--color-api-second)_4%,var(--color-bg-card))]"
        >
            <GradientTableCell align="left">
                <div className="flex items-start gap-3">
                    <div className="h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-[color-mix(in_srgb,var(--color-main)_10%,var(--color-bg-card))] ring-1 ring-[color-mix(in_srgb,var(--color-main)_25%,transparent)]">
                        {item.image ? (
                            <img
                                src={item.image}
                                alt=""
                                className="h-full w-full object-cover"
                            />
                        ) : null}
                    </div>
                    <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold leading-tight text-custom-primary">
                            {item.name}
                            {isFree && (
                                <span className="ms-1 font-medium text-[var(--color-api-second)]">
                                    ({t("cart.free", "FREE")})
                                </span>
                            )}
                        </p>
                        {meta ? (
                            <p className="mt-0.5 text-xs text-custom-secondary">
                                {meta}
                            </p>
                        ) : null}
                        {variant ? (
                            <p className="text-xs text-custom-secondary">
                                {variant}
                            </p>
                        ) : null}
                        {freeQuantity > 0 && (
                            <p className="text-xs font-medium text-[var(--color-api-second)]">
                                {freeQuantity} × {t("cart.free", "FREE")}
                            </p>
                        )}
                        {isExcluded && (
                            <p className="text-xs text-amber-600">
                                {t("cart.excludedFromCoupon")}
                            </p>
                        )}
                        <div className="mt-1 flex items-center gap-3">
                            {onMoveToWishlist && (
                                <button
                                    type="button"
                                    onClick={() => onMoveToWishlist(item.id)}
                                    className="text-xs text-[var(--color-api-second)] hover:underline"
                                >
                                    {t("cart.moveToWishlist")}
                                </button>
                            )}
                            {item.hasFreeDelivery && (
                                <span className="text-xs text-[var(--color-api-second)]">
                                    {t("cart.freeDelivery")}
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            </GradientTableCell>

            <GradientTableCell align="center">
                <PriceBlock
                    price={item.price}
                    originalPrice={item.originalPrice}
                    savings={item.savingsText}
                    size="xs"
                    align="center"
                />
            </GradientTableCell>

            <GradientTableCell align="center">
                <span className="text-sm text-custom-primary tabular-nums">
                    {item.quantity}
                </span>
            </GradientTableCell>

            <GradientTableCell align="right">
                <span className="text-sm font-semibold text-custom-primary tabular-nums">
                    {item.subtotal}
                </span>
            </GradientTableCell>
        </GradientTableRow>
    );
}
