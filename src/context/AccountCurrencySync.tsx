import { useEffect } from "react";
import { useMyCurrency } from "@/features/account/hooks/useCurrencies";
import { useCurrency } from "./CurrencyContext";

/**
 * The account currency is the source of truth for every product price.
 * Settings used to apply it only while that page was open, so a saved
 * Syrian pound could be overwritten before the products page read it.
 */
export default function AccountCurrencySync() {
    const { data: myCurrency } = useMyCurrency();
    const { setCurrency } = useCurrency();

    useEffect(() => {
        if (!myCurrency?.code) return;
        setCurrency(myCurrency.code, myCurrency.symbol, { fromAccount: true });
    }, [myCurrency?.code, myCurrency?.symbol, setCurrency]);

    return null;
}
