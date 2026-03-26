import { useTranslation } from "react-i18next";
import { cn } from "@/shared/lib/utils";
import type { AvailableShop, ShopVariant, VariantAttribute } from "../types/productDetails";

export type ShopVariantsPreviewProps = {
    variants: ShopVariant[];
    availableShops?: AvailableShop[];
    className?: string;
    /** When set, one variant can be chosen (e.g. add to cart) */
    selectedId?: number | null;
    onSelect?: (shopVariantId: number) => void;
};

function renderAttributeValue(attr: VariantAttribute) {
    if (attr.type === "color") {
        return (
            <span
                role="img"
                aria-label={`${attr.attribute}: ${attr.value}`}
                className="inline-block h-7 w-7 shrink-0 rounded-full border-2 border-custom-primary shadow-sm"
                style={{ backgroundColor: attr.value }}
                title={`${attr.attribute}: ${attr.value}`}
            />
        );
    }
    return (
        <span className="inline-flex min-h-8 min-w-[2.5rem] items-center justify-center rounded-lg bg-custom-tertiary px-3 text-xs font-medium text-custom-primary">
            {attr.value}
        </span>
    );
}

export default function ShopVariantsPreview({
    variants,
    availableShops,
    className,
    selectedId,
    onSelect,
}: ShopVariantsPreviewProps) {
    const { t } = useTranslation();
    const selectable = typeof onSelect === "function";

    if (!variants?.length) return null;

    return (
        <div className={cn("space-y-3", className)}>
            <h3 className="text-base font-semibold text-custom-primary">
                {t("product.shopVariants", "Shop variants")}
            </h3>
            {selectable && (
                <p className="text-xs text-custom-secondary">
                    {t(
                        "product.selectOneVariant",
                        "Choose one option to add to cart",
                    )}
                </p>
            )}
            <ul className="flex max-h-[min(320px,40vh)] flex-col gap-3 overflow-y-auto pr-1">
                {variants.map((v) => {
                    const thumb = v.images?.[0]?.path;
                    const shopName = availableShops?.find((s) => s.id === v.shop_id)
                        ?.name;
                    const priceLabel =
                        v.price_formatted ??
                        `${v.currency_symbol ?? ""}${v.price.toFixed(2)}`;
                    const outOfStock = v.quantity <= 0;
                    const isSelected = selectedId === v.id;

                    const rowClass = cn(
                        "flex w-full gap-3 rounded-xl border p-3 text-start transition-all",
                        selectable && !outOfStock && "cursor-pointer",
                        selectable && isSelected
                            ? "border-cyan-500 bg-cyan-50/80 shadow-md ring-2 ring-cyan-400/40 dark:bg-cyan-950/40"
                            : "border-custom-primary/60 bg-custom-secondary/40",
                        selectable &&
                            !isSelected &&
                            !outOfStock &&
                            "hover:border-cyan-400/50",
                        outOfStock && "opacity-60",
                    );

                    const inner = (
                        <>
                            {thumb ? (
                                <img
                                    src={thumb}
                                    alt=""
                                    className="h-20 w-20 shrink-0 rounded-lg object-cover"
                                    loading="lazy"
                                />
                            ) : (
                                <div className="h-20 w-20 shrink-0 rounded-lg bg-custom-tertiary" />
                            )}
                            <div className="min-w-0 flex-1 space-y-2">
                                <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                                    {v.attributes.map((attr) => (
                                        <div
                                            key={`${v.id}-${attr.attribute}`}
                                            className="flex items-center gap-2"
                                        >
                                            <span className="text-xs text-custom-secondary">
                                                {attr.attribute}
                                            </span>
                                            {renderAttributeValue(attr)}
                                        </div>
                                    ))}
                                </div>
                                <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 text-sm">
                                    <span className="font-bold text-custom-primary">
                                        {priceLabel}
                                    </span>
                                    <span className="text-custom-secondary">
                                        {t("product.quantity", "Quantity")}:{" "}
                                        {v.quantity}
                                    </span>
                                    <span className="text-xs text-custom-secondary">
                                        {shopName ??
                                            `${t("product.shop", "Shop")} · #${v.shop_id}`}
                                    </span>
                                    {outOfStock && (
                                        <span className="text-xs font-medium text-red-600">
                                            {t("product.outOfStock", "Out of stock")}
                                        </span>
                                    )}
                                </div>
                            </div>
                            {selectable && isSelected && (
                                <span className="shrink-0 self-center text-cyan-600 dark:text-cyan-300">
                                    <svg
                                        className="h-6 w-6"
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                        aria-hidden
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                </span>
                            )}
                        </>
                    );

                    return (
                        <li key={v.id}>
                            {selectable ? (
                                <button
                                    type="button"
                                    disabled={outOfStock}
                                    onClick={() => !outOfStock && onSelect?.(v.id)}
                                    className={rowClass}
                                >
                                    {inner}
                                </button>
                            ) : (
                                <div className={rowClass}>{inner}</div>
                            )}
                        </li>
                    );
                })}
            </ul>
        </div>
    );
}
