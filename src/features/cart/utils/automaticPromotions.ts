import { resolveLocalizedText } from "@/shared/lib/localizedText";
import type {
    AvailablePromotion,
    OrderPreviewAutomaticPromotions,
    SummaryRewardLine,
} from "../types";

/** Customer-picked discounts. Automatic offers apply on their own and must not be sent as `promotion_id`. */
const CUSTOMER_SELECTED_TYPES = new Set(["simple_discount", "spend_x_discount"]);

const FREE_SHIPPING_TYPES = new Set([
    "first_order_free_shipping",
    "signup_free_shipping",
    "spend_x_get_free_shipping",
    "free_shipping",
]);

export function isCustomerSelectedPromotion(promo: AvailablePromotion): boolean {
    if (!promo.type) return true;
    return CUSTOMER_SELECTED_TYPES.has(promo.type);
}

export function customerSelectedPromotions(
    promotions: AvailablePromotion[] | undefined,
): AvailablePromotion[] {
    return (promotions ?? []).filter(isCustomerSelectedPromotion);
}

/**
 * Id to send as `promotion_id`. Unknown ids (list not loaded yet) are kept.
 * A known automatic offer is dropped so preview and create do not send it.
 */
export function resolveCustomerPromotionId(
    promotionId: number | null | undefined,
    promotions: AvailablePromotion[] | undefined,
): number | undefined {
    if (promotionId == null) return undefined;
    const match = (promotions ?? []).find((promo) => promo.id === promotionId);
    if (!match) return promotionId;
    return isCustomerSelectedPromotion(match) ? promotionId : undefined;
}

type RewardLineInput = {
    automatic?: OrderPreviewAutomaticPromotions | null;
    /** `discounts.promotion_discount` — displayed as sent, not recomputed. */
    promotionDiscount: number;
    deliveryPrice: number;
    language: string;
    formatAmount: (amount: number) => string;
    discountLabel: string;
    freeShippingLabel: string;
    freeShippingValue: string;
};

export function buildAutomaticRewardLines(input: RewardLineInput): SummaryRewardLine[] {
    const automatic = input.automatic;
    if (!automatic) return [];

    const lines: SummaryRewardLine[] = [];
    const discounts = Array.isArray(automatic.discounts) ? automatic.discounts : [];
    const moneyDiscounts = discounts.filter(
        (item) => !item?.type || !FREE_SHIPPING_TYPES.has(item.type),
    );
    const shippingOffer = discounts.find(
        (item) => Boolean(item?.type && FREE_SHIPPING_TYPES.has(item.type)),
    );

    moneyDiscounts.forEach((item, index) => {
        const name = resolveLocalizedText(item.name, input.language).trim();
        const showAmount = index === 0 && input.promotionDiscount > 0;
        if (!name && !showAmount) return;
        lines.push({
            id: `automatic-discount-${item.promotion_id ?? index}`,
            label: name || input.discountLabel,
            value: showAmount ? `-${input.formatAmount(input.promotionDiscount)}` : undefined,
        });
    });

    const freeShippingApplies =
        automatic.free_shipping_applies === true && input.deliveryPrice === 0;
    if (freeShippingApplies) {
        const name = resolveLocalizedText(shippingOffer?.name, input.language).trim();
        lines.push({
            id: `automatic-free-shipping-${shippingOffer?.promotion_id ?? "applies"}`,
            label: name || input.freeShippingLabel,
            value: input.freeShippingValue,
        });
    }

    const gifts = Array.isArray(automatic.gifts) ? automatic.gifts : [];
    gifts.forEach((gift, index) => {
        const name = resolveLocalizedText(gift.promotion_name, input.language).trim();
        const description = resolveLocalizedText(gift.gift_description, input.language).trim();
        if (!name && !description) return;
        lines.push({
            id: `automatic-gift-${gift.promotion_id ?? index}`,
            label: name || description,
            value: name && description ? description : undefined,
        });
    });

    return lines;
}
