import { create } from "zustand";

export interface User {
  id: number;
  name: string;
  email?: string;
  phone?: string;
}

interface AuthStore {
  authenticated: boolean;
  user: User | null;
  setAuthenticated: (authenticated: boolean) => void;
  setUser: (user: User | null) => void;
  logoutLocal: () => void;
  isAuthenticated: () => boolean;
}

export const useAuthStore = create<AuthStore>((set, get) => ({
  authenticated: false,
  user: null,
  setAuthenticated: (authenticated: boolean) => set({ authenticated }),
  setUser: (user: User | null) => set({ user, authenticated: !!user }),
  logoutLocal: () => set({ authenticated: false, user: null }),
  isAuthenticated: () => get().authenticated && !!get().user,
}));
