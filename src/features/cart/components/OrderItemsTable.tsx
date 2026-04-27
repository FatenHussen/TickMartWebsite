import { useTranslation } from"react-i18next";
import {
 GradientTable,
 GradientTableHeader,
 GradientTableHeaderCell,
 GradientTableBody,
 GradientTableRow,
 GradientTableCell,
} from"@/shared/component/table";
import type { CartItem } from"../types";

type OrderItemsTableProps = {
 items: CartItem[];
 onMoveToWishlist?: (itemId: number | string) => void;
 title?: string;
 showTitle?: boolean;
};

export default function OrderItemsTable({
 items,
 onMoveToWishlist,
 title ="Order Items",
 showTitle = true,
}: OrderItemsTableProps) {
 return (
 <GradientTable title={title} showTitle={showTitle}>
 <GradientTableHeader>
 <GradientTableHeaderCell align="left"isFirst>
 Product
 </GradientTableHeaderCell>
 <GradientTableHeaderCell align="center">Price</GradientTableHeaderCell>
 <GradientTableHeaderCell align="center">Quantity</GradientTableHeaderCell>
 <GradientTableHeaderCell align="right"isLast>
 Subtotal
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
 return (
 <GradientTableRow
 isLast={isLast}
 className="bg-[color-mix(in_srgb,var(--color-main)_2%,var(--color-bg-card))] even:bg-[color-mix(in_srgb,var(--color-api-second)_4%,var(--color-bg-card))]"
 >
 {/* Product */}
 <GradientTableCell align="left">
 <div className="flex items-start gap-3">
 <div className="w-14 h-14 rounded-lg overflow-hidden shrink-0 bg-[color-mix(in_srgb,var(--color-main)_10%,var(--color-bg-card))] ring-1 ring-[color-mix(in_srgb,var(--color-main)_25%,transparent)]">
 {item.image && (
 <img
 src={item.image}
 alt={item.name}
 className="w-full h-full object-cover"
 />
 )}
 </div>
 <div className="min-w-0 flex-1">
 <p className="text-sm font-semibold text-custom-primary leading-tight">
 {item.name}
 {(item as { _isFree?: boolean })._isFree && (
 <span className="ml-1 font-medium text-[var(--color-api-second)]">
 ({t("cart.free", "FREE")})
 </span>
 )}
 </p>
 <p className="text-xs text-custom-secondary">
 {item.category} · {item.store}
 </p>
 <p className="text-xs text-custom-secondary">
 {item.size} | {item.type}
 </p>
 {((item as { _freeQuantity?: number })._freeQuantity ?? 0) > 0 && (
 <p className="text-xs font-medium text-[var(--color-api-second)]">
 {((item as { _freeQuantity?: number })._freeQuantity ?? 0)} × {t("cart.free", "FREE")}
 </p>
 )}
 {(item as { _isExcludedFromCoupon?: boolean })._isExcludedFromCoupon && (
 <p className="text-xs text-amber-600">
 {t("cart.excludedFromCoupon", "Not eligible for coupon")}
 </p>
 )}
 <div className="flex items-center gap-3 mt-1">
 {onMoveToWishlist && (
 <button
 type="button"
 onClick={() => onMoveToWishlist(item.id)}
 className="text-xs text-[var(--color-api-second)] hover:underline"
 >
 Move to wishlist
 </button>
 )}
 {item.hasFreeDelivery && (
 <span className="text-xs text-[var(--color-api-second)]">
 Free delivery
 </span>
 )}
 </div>
 </div>
 </div>
 </GradientTableCell>

 {/* Price */}
 <GradientTableCell align="center">
 <div className="text-sm font-semibold text-custom-primary">
 {item.price}
 </div>
 {item.originalPrice && (
 <div className="text-xs line-through text-custom-secondary">
 {item.originalPrice}
 </div>
 )}
 {item.savingsText && (
 <div className="text-xs font-medium text-[var(--color-api-second)]">
 {item.savingsText}
 </div>
 )}
 </GradientTableCell>

 {/* Quantity */}
 <GradientTableCell align="center">
 <span className="text-sm text-custom-primary">{item.quantity}</span>
 </GradientTableCell>

 {/* Subtotal */}
 <GradientTableCell align="right">
 <span className="text-sm font-semibold text-custom-primary">
 {item.subtotal}
 </span>
 </GradientTableCell>
 </GradientTableRow>
 );
}
