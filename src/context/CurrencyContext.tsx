import { createContext, useCallback, useContext, useEffect, useRef, useState } from"react";
import type { ReactNode } from"react";
import { formatMoneyAmount, presentMoney } from"@/shared/lib/formatApiPrice";

export type Currency = string;

interface CurrencyState {
 code: string;
 symbol: string;
}

interface CurrencyContextType {
 currency: Currency;
 currencySymbol: string;
 setCurrency: (
 currency: Currency,
 symbol?: string,
 options?: { fromAccount?: boolean },
 ) => void;
 getCurrencySymbol: () => string;
 formatPrice: (amount: number) => string;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(
 undefined
);

const defaultCurrencySymbols: Record<string, string> = {
 USD:"$",
 EUR:"€",
 GBP:"£",
 SYP:"ل.س",
 AED:"د.إ",
 SAR:"ر.س",
 EGP:"ج.م",
};

/** Storefront default for guests — no login / settings required. */
const DEFAULT_CURRENCY: CurrencyState = {
 code: "SYP",
 symbol: defaultCurrencySymbols.SYP,
};

/** Bump when the guest default changes so old USD localStorage is replaced once. */
const CURRENCY_DEFAULTS_VERSION = "syp-default-v2";
const CURRENCY_DEFAULTS_VERSION_KEY = "currencyDefaultsVersion";

function getStoredCurrency(): CurrencyState {
 if (typeof window === "undefined") return DEFAULT_CURRENCY;
 try {
 const version = localStorage.getItem(CURRENCY_DEFAULTS_VERSION_KEY);
 if (version !== CURRENCY_DEFAULTS_VERSION) {
 localStorage.setItem(CURRENCY_DEFAULTS_VERSION_KEY, CURRENCY_DEFAULTS_VERSION);
 return DEFAULT_CURRENCY;
 }
 const storedCode = localStorage.getItem("currency");
 const storedSymbol = localStorage.getItem("currencySymbol");
 if (storedCode && storedSymbol) {
 return { code: storedCode, symbol: storedSymbol };
 }
 if (storedCode && defaultCurrencySymbols[storedCode]) {
 return {
 code: storedCode,
 symbol: defaultCurrencySymbols[storedCode],
 };
 }
 return DEFAULT_CURRENCY;
 } catch {
 return DEFAULT_CURRENCY;
 }
}

export function CurrencyProvider({ children }: { children: ReactNode }) {
 const [currencyState, setCurrencyState] = useState<CurrencyState>(
 getStoredCurrency
 );

 useEffect(() => {
 localStorage.setItem("currency", currencyState.code);
 localStorage.setItem("currencySymbol", currencyState.symbol);
 }, [currencyState]);

 const pinnedByUser = useRef(false);

 const setCurrency = useCallback((
 newCurrency: Currency,
 symbol?: string,
 options?: { fromAccount?: boolean },
 ) => {
 if (options?.fromAccount && pinnedByUser.current) return;
 if (!options?.fromAccount) pinnedByUser.current = true;
 const resolvedSymbol =
 symbol ?? defaultCurrencySymbols[newCurrency] ?? newCurrency;
 setCurrencyState({ code: newCurrency, symbol: resolvedSymbol });
 }, []);

 const getCurrencySymbol = () => currencyState.symbol;

 const formatPrice = (amount: number) => {
 const value =
 amount == null || typeof amount !== "number" || Number.isNaN(amount)
 ? 0
 : amount;
 return presentMoney(`${currencyState.symbol}${formatMoneyAmount(value, currencyState.code)}`);
 };

 return (
 <CurrencyContext.Provider
 value={{
 currency: currencyState.code,
 currencySymbol: currencyState.symbol,
 setCurrency,
 getCurrencySymbol,
 formatPrice,
 }}
 >
 {children}
 </CurrencyContext.Provider>
 );
}

export function useCurrency() {
 const context = useContext(CurrencyContext);
 if (context === undefined) {
 throw new Error("useCurrency must be used within a CurrencyProvider");
 }
 return context;
}

export function useCurrencyOptional() {
 return useContext(CurrencyContext);
}
