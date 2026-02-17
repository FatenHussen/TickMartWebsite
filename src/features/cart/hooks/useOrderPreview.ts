import { useQuery } from "@tanstack/react-query";
import { useCartStore } from "@/store/cart";
import { _OrderApi } from "../api/orderApi";
import type { OrderPreviewResponse } from "../types";
import { queryKeys } from "@/utils/queryKeys";

export function useOrderPreview(
  addressId: number | null,
  coupon?: string
): { data?: OrderPreviewResponse; isLoading: boolean; error: Error | null } {
  const items = useCartStore((s) => s.items);
  const cart_type = useCartStore((s) => s.cart_type);
  const recipe_id = useCartStore((s) => s.recipe_id);
  const admin_basket_id = useCartStore((s) => s.admin_basket_id);
  const getPreviewItems = useCartStore((s) => s.getPreviewItems);

  const previewItems = getPreviewItems();
  const isInstantDelivery = items.some(
    (i) => i.is_instant_delivery ?? !!i.hasFreeDelivery
  );

  const { data, isLoading, error } = useQuery({
    queryKey: queryKeys.orders.preview(
      addressId,
      previewItems,
      cart_type,
      recipe_id,
      admin_basket_id,
      coupon
    ),
    queryFn: async () => {
      if (addressId == null || previewItems.length === 0) return null;
      const payload = {
        cart_type,
        address_id: addressId,
        is_instant_delivery: isInstantDelivery,
        items: previewItems,
        ...(coupon && { coupon }),
        ...(recipe_id != null && { recipe_id }),
        ...(admin_basket_id != null && { admin_basket_id }),
      };
      return _OrderApi.postOrderPreview(payload);
    },
    enabled:
      addressId != null &&
      addressId > 0 &&
      previewItems.length > 0 &&
      previewItems.every((i) => i.shop_product_variant_id != null),
    staleTime: 1000 * 60, // 1 minute
    refetchOnMount: "always",
  });

  return { data: data ?? undefined, isLoading, error: error as Error | null };
}
