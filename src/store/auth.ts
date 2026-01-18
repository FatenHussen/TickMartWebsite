import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface User {
  id: number;
  name: string;
  email?: string;
  phone?: string;
}

interface AuthStore {
  authenticated: boolean;
  user: User | null;
  token: string | null;
  setAuthenticated: (authenticated: boolean) => void;
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  setAuth: (user: User, token: string) => void;
  logoutLocal: () => void;
  isAuthenticated: () => boolean;
  getToken: () => string | null;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      authenticated: false,
      user: null,
      token: null,
      setAuthenticated: (authenticated: boolean) => set({ authenticated }),
      setUser: (user: User | null) => set({ user, authenticated: !!user }),
      setToken: (token: string | null) => set({ token }),
      setAuth: (user: User, token: string) =>
        set({ user, token, authenticated: true }),
      logoutLocal: () => set({ authenticated: false, user: null, token: null }),
      isAuthenticated: () => get().authenticated && !!get().user,
      getToken: () => get().token,
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        token: state.token,
        user: state.user,
        authenticated: state.authenticated,
      }),
    },
  ),
);
