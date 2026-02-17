import { create } from "zustand";

interface CheckoutStore {
  addressId: number | string | null;
  coupon: string;
  paymentMethodId: string;
  additionalNotes: string;
  setAddressId: (id: number | string | null) => void;
  setCoupon: (code: string) => void;
  setPaymentMethodId: (id: string) => void;
  setAdditionalNotes: (notes: string) => void;
  reset: () => void;
}

const initialState = {
  addressId: null,
  coupon: "",
  paymentMethodId: "",
  additionalNotes: "",
};

export const useCheckoutStore = create<CheckoutStore>((set) => ({
  ...initialState,
  setAddressId: (id) => set({ addressId: id }),
  setCoupon: (code) => set({ coupon: code }),
  setPaymentMethodId: (id) => set({ paymentMethodId: id }),
  setAdditionalNotes: (notes) => set({ additionalNotes: notes }),
  reset: () => set(initialState),
}));
