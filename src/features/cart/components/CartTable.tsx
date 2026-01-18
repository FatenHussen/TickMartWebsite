import { Link } from "react-router-dom";
import { HiArrowLeft } from "react-icons/hi";
import { useTranslation } from "react-i18next";
import { useLanguage } from "@/context/LanguageContext";
import { cn } from "@/shared/lib/utils";
import Button from "@/shared/ui/Button";
import CartItemTableRow from "./CartItemTableRow";
import type { CartItem } from "../types";

type CartTableProps = {
  items: CartItem[];
  onQuantityChange: (itemId: number | string, quantity: number) => void;
  onRemove: (itemId: number | string) => void;
  onMoveToWishlist?: (itemId: number | string) => void;
  onUpdateCart?: () => void;
};

export default function CartTable({
  items,
  onQuantityChange,
  onRemove,
  onMoveToWishlist,
  onUpdateCart,
}: CartTableProps) {
  const { t } = useTranslation();
  const { isRTL } = useLanguage();

  return (
    <div className="bg-custom-primary rounded-2xl border border-custom-secondary shadow-sm overflow-hidden" dir={isRTL ? "rtl" : "ltr"}>
      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-custom-secondary bg-blue-off">
              <th className={cn(isRTL ? "text-right" : "text-left", "py-4 px-4 text-sm font-semibold text-custom-primary")}>
                {t("cart.product")}
              </th>
              <th className={cn(isRTL ? "text-left" : "text-right", "py-4 px-4 text-sm font-semibold text-custom-primary")}>
                {t("checkout.price")}
              </th>
              <th className="text-center py-4 px-4 text-sm font-semibold text-custom-primary">
                {t("cart.quantity")}
              </th>
              <th className={cn(isRTL ? "text-left" : "text-right", "py-4 px-4 text-sm font-semibold text-custom-primary")}>
                {t("cart.subtotal")}
              </th>
              <th className="w-16 py-4 px-4"></th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <CartItemTableRow
                key={item.id}
                item={item}
                onQuantityChange={onQuantityChange}
                onRemove={onRemove}
                onMoveToWishlist={onMoveToWishlist}
              />
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer Actions */}
      <div className="px-6 py-4 border-t border-custom-secondary flex items-center justify-between">
        <Link
          to="/home"
          className="inline-flex items-center gap-2 text-custom-accent hover:underline font-medium"
        >
          <HiArrowLeft className="w-5 h-5" />
          {t("cart.returnToShop")}
        </Link>
        <Button
          type="button"
          variant="outline"
          onClick={onUpdateCart}
          className="bg-custom-tertiary hover:bg-custom-hover"
        >
          {t("cart.updateCart")}
        </Button>
      </div>
    </div>
  );
}
