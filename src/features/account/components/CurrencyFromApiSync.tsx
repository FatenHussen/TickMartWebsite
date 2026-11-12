import { useLayoutEffect } from "react";
import { useCurrency } from "@/context/CurrencyContext";
import { useAuthStore } from "@/store/auth";
import { useCurrencies, useMyCurrency } from "../hooks/useCurrencies";

/** Dashboard defaults apply to visitors until they choose a currency. */
export function CurrencyFromApiSync() {
    const { setCurrency, resetAccountCurrency } = useCurrency();
    const authenticated = useAuthStore((state) => Boolean(state.token));
    const userId = useAuthStore((state) => state.user?.id);
    const { data: currencies } = useCurrencies();
    const { data: myCurrency } = useMyCurrency();
    const defaultCurrency = currencies?.find((item) => item.is_default);

    useLayoutEffect(() => {
        if (defaultCurrency) {
            setCurrency(defaultCurrency.code, defaultCurrency.symbol, { fromDefault: true });
        }
    }, [defaultCurrency, setCurrency]);

    useLayoutEffect(() => {
        resetAccountCurrency();
    }, [authenticated, userId, resetAccountCurrency]);

    useLayoutEffect(() => {
        if (authenticated && myCurrency) {
            setCurrency(myCurrency.code, myCurrency.symbol, { fromAccount: true });
        }
    }, [authenticated, userId, myCurrency, setCurrency]);

    return null;
}
