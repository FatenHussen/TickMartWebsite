import { create } from "zustand";

interface OtpStore {
    email: string | null;
    phone: string | null;
    /** In-memory only — used to resend register OTP via POST /auth/login. */
    password: string | null;
    isPasswordReset: boolean;
    setEmail: (email: string) => void;
    setPhone: (phone: string) => void;
    setRegisterCredentials: (phone: string, password: string) => void;
    setIsPasswordReset: (isPasswordReset: boolean) => void;
    clear: () => void;
}

export const useOtpStore = create<OtpStore>((set) => ({
    email: null,
    phone: null,
    password: null,
    isPasswordReset: false,
    setEmail: (email: string) =>
        set({ email, phone: null, password: null, isPasswordReset: false }),
    setPhone: (phone: string) =>
        set({ phone, email: null, password: null, isPasswordReset: false }),
    setRegisterCredentials: (phone: string, password: string) =>
        set({ phone, password, email: null, isPasswordReset: false }),
    setIsPasswordReset: (isPasswordReset: boolean) => set({ isPasswordReset }),
    clear: () =>
        set({ email: null, phone: null, password: null, isPasswordReset: false }),
}));
