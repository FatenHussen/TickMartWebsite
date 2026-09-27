import { create } from"zustand";
import type { DeliveryChoice } from "@/features/cart/types";

interface CheckoutStore {
 addressId: number | string | null;
 coupon: string;
 paymentMethodId: string;
 additionalNotes: string;
 deliveryChoice: DeliveryChoice;
 /** `Y-m-d H:i` when the customer picked a day and time. */
 scheduledDeliveryAt: string | null;
 /** From `checkout.earliest_delivery_at`. Times before this are not sent. */
 earliestDeliveryAt: string | null;
 // Active Benefits
 pointCouponExchangeId: number | null;
 pointFreeDeliveryExchangeId: number | null;
 useSubscriptionDiscount: boolean;
 useSubscriptionFreeDelivery: boolean;
 // Selected promotion
 promotionId: number | null;

 setAddressId: (id: number | string | null) => void;
 setCoupon: (code: string) => void;
 setPaymentMethodId: (id: string) => void;
 setAdditionalNotes: (notes: string) => void;
 setDeliveryChoice: (choice: DeliveryChoice) => void;
 setScheduledDeliveryAt: (value: string | null) => void;
 setEarliestDeliveryAt: (value: string | null) => void;
 setPointCouponExchangeId: (id: number | null) => void;
 setPointFreeDeliveryExchangeId: (id: number | null) => void;
 setUseSubscriptionDiscount: (value: boolean) => void;
 setUseSubscriptionFreeDelivery: (value: boolean) => void;
 setPromotionId: (id: number | null) => void;
 reset: () => void;
}

const initialState = {
 addressId: null,
 coupon:"",
 paymentMethodId:"",
 additionalNotes:"",
 deliveryChoice: "asap" as DeliveryChoice,
 scheduledDeliveryAt: null as string | null,
 earliestDeliveryAt: null as string | null,
 pointCouponExchangeId: null,
 pointFreeDeliveryExchangeId: null,
 useSubscriptionDiscount: false,
 useSubscriptionFreeDelivery: false,
 promotionId: null,
};

export const useCheckoutStore = create<CheckoutStore>((set) => ({
 ...initialState,
 setAddressId: (id) => set({ addressId: id }),
 setCoupon: (code) => set({ coupon: code }),
 setPaymentMethodId: (id) => set({ paymentMethodId: id }),
 setAdditionalNotes: (notes) => set({ additionalNotes: notes }),
 setDeliveryChoice: (choice) =>
 set(
 choice === "asap"
 ? { deliveryChoice: "asap", scheduledDeliveryAt: null }
 : { deliveryChoice: "scheduled" },
 ),
 setScheduledDeliveryAt: (value) => set({ scheduledDeliveryAt: value }),
 setEarliestDeliveryAt: (value) => set({ earliestDeliveryAt: value }),
 setPointCouponExchangeId: (id) =>
 set(id != null
 ? { pointCouponExchangeId: id, promotionId: null, useSubscriptionDiscount: false }
 : { pointCouponExchangeId: null }),
 setPointFreeDeliveryExchangeId: (id) => set({ pointFreeDeliveryExchangeId: id }),
 setUseSubscriptionDiscount: (value) =>
 set(value
 ? { useSubscriptionDiscount: true, promotionId: null, pointCouponExchangeId: null }
 : { useSubscriptionDiscount: false }),
 setUseSubscriptionFreeDelivery: (value) => set({ useSubscriptionFreeDelivery: value }),
 setPromotionId: (id) =>
 set(id != null
 ? { promotionId: id, pointCouponExchangeId: null, useSubscriptionDiscount: false }
 : { promotionId: null }),
 reset: () => set(initialState),
}));
