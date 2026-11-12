import { createContext, useCallback, useContext, useEffect, useRef, useState } from"react";
import type { ReactNode } from"react";
import i18next from"i18next";
import { formatMoneyAmount, presentMoney } from"@/shared/lib/formatApiPrice";
import {
 currencySymbols,
 persistCurrencySelection,
 persistDefaultCurrency,
 readCurrencySelection,
 readDefaultCurrency,
 resetAccountCurrencySelection,
 resolveCurrencySelection,
 type CurrencySelection,
 type CurrencyValue,
} from "@/shared/lib/currencyPreference";

export type Currency = string;

interface CurrencyContextType {
 currency: Currency;
 currencySymbol: string;
 setCurrency: (
 currency: Currency,
 symbol?: string,
 options?: { fromAccount?: boolean; fromDefault?: boolean },
 ) => void;
 resetAccountCurrency: () => void;
 getCurrencySymbol: () => string;
 formatPrice: (amount: number) => string;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(
 undefined
);

function getStoredCurrency(): CurrencySelection {
 try {
 return readCurrencySelection(typeof window === "undefined" ? undefined : localStorage);
 } catch {
 return readCurrencySelection();
 }
}

function getStoredDefaultCurrency(): CurrencyValue {
 try {
 return readDefaultCurrency(typeof window === "undefined" ? undefined : localStorage);
 } catch {
 return readDefaultCurrency();
 }
}

export function CurrencyProvider({ children }: { children: ReactNode }) {
 const [currencyState, setCurrencyState] = useState<CurrencySelection>(
 getStoredCurrency
 );
 const defaultCurrencyRef = useRef<CurrencyValue | null>(null);
 if (defaultCurrencyRef.current === null) defaultCurrencyRef.current = getStoredDefaultCurrency();

 useEffect(() => {
 try {
 persistCurrencySelection(localStorage, currencyState);
 } catch {
 /* Storage access may be disabled by the browser. */
 }
 }, [currencyState]);

 const setCurrency = useCallback((
 newCurrency: Currency,
 symbol?: string,
 options?: { fromAccount?: boolean; fromDefault?: boolean },
 ) => {
 const resolvedSymbol =
 symbol ?? currencySymbols[newCurrency] ?? newCurrency;
 const source = options?.fromAccount ? "account" : options?.fromDefault ? "default" : "user";
 const incoming: CurrencySelection = { code: newCurrency, symbol: resolvedSymbol, source };
 if (source === "default") {
 defaultCurrencyRef.current = { code: newCurrency, symbol: resolvedSymbol };
 try {
 persistDefaultCurrency(localStorage, { code: newCurrency, symbol: resolvedSymbol });
 } catch {
 /* API defaults still apply without browser storage. */
 }
 }
 setCurrencyState((current) => resolveCurrencySelection(current, incoming));
 }, []);

 const resetAccountCurrency = useCallback(() => {
 const defaultCurrency = defaultCurrencyRef.current ?? getStoredDefaultCurrency();
 setCurrencyState((current) => resetAccountCurrencySelection(current, defaultCurrency));
 }, []);

 const getCurrencySymbol = () => currencyState.symbol;

 const formatPrice = (amount: number) => {
 const value =
 amount == null || typeof amount !== "number" || Number.isNaN(amount)
 ? 0
 : amount;
 return presentMoney(
 `${currencyState.symbol}${formatMoneyAmount(value, currencyState.code)}`,
 i18next.resolvedLanguage || i18next.language,
 );
 };

 return (
 <CurrencyContext.Provider
 value={{
 currency: currencyState.code,
 currencySymbol: currencyState.symbol,
 setCurrency,
 resetAccountCurrency,
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
