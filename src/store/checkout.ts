import { create } from"zustand";

interface CheckoutStore {
 addressId: number | string | null;
 coupon: string;
 paymentMethodId: string;
 additionalNotes: string;
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
