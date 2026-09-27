import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { getCart } from "../api/cartApi";
import { extractCartCheckout, normalizeCartCheckout } from "../lib/cartCheckout";
import { useAuthStore } from "@/store/auth";

export function useCartCheckout() {
    const token = useAuthStore((s) => s.token);
    const { i18n } = useTranslation();

    return useQuery({
        queryKey: ["cart", "checkout", i18n.language],
        queryFn: async () => {
            const payload = await getCart<unknown>();
            return normalizeCartCheckout(extractCartCheckout(payload));
        },
        enabled: Boolean(token),
        staleTime: 15_000,
    });
}
