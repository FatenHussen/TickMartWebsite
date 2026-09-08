import { createContext, useContext, useEffect, useState } from"react";
import type { ReactNode } from"react";

export type Currency = string;

interface CurrencyState {
 code: string;
 symbol: string;
}

interface CurrencyContextType {
 currency: Currency;
 currencySymbol: string;
 setCurrency: (currency: Currency, symbol?: string) => void;
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

function getStoredCurrency(): CurrencyState {
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
 return { code:"USD", symbol: defaultCurrencySymbols.USD };
}

export function CurrencyProvider({ children }: { children: ReactNode }) {
 const [currencyState, setCurrencyState] = useState<CurrencyState>(
 getStoredCurrency
 );

 useEffect(() => {
 localStorage.setItem("currency", currencyState.code);
 localStorage.setItem("currencySymbol", currencyState.symbol);
 }, [currencyState]);

 const setCurrency = (newCurrency: Currency, symbol?: string) => {
 const resolvedSymbol =
 symbol ?? defaultCurrencySymbols[newCurrency] ?? newCurrency;
 setCurrencyState({ code: newCurrency, symbol: resolvedSymbol });
 };

 const getCurrencySymbol = () => currencyState.symbol;

 const formatPrice = (amount: number) => {
 if (amount == null || typeof amount !== "number"|| Number.isNaN(amount)) {
 return `${currencyState.symbol}0`;
 }
 return `${currencyState.symbol}${amount.toLocaleString()}`;
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
