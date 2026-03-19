import { create } from"zustand";

interface OtpStore {
 email: string | null;
 phone: string | null;
 isPasswordReset: boolean;
 setEmail: (email: string) => void;
 setPhone: (phone: string) => void;
 setIsPasswordReset: (isPasswordReset: boolean) => void;
 clear: () => void;
}

export const useOtpStore = create<OtpStore>((set) => ({
 email: null,
 phone: null,
 isPasswordReset: false,
 setEmail: (email: string) =>
 set({ email, phone: null, isPasswordReset: false }),
 setPhone: (phone: string) =>
 set({ phone, email: null, isPasswordReset: false }),
 setIsPasswordReset: (isPasswordReset: boolean) => set({ isPasswordReset }),
 clear: () => set({ email: null, phone: null, isPasswordReset: false }),
}));
