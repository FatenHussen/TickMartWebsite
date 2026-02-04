import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";

export type Currency = "USD" | "EUR" | "GBP" | "SYP";

interface CurrencyContextType {
  currency: Currency;
  setCurrency: (currency: Currency) => void;
  getCurrencySymbol: () => string;
  formatPrice: (amount: number) => string;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(
  undefined
);

const currencySymbols: Record<Currency, string> = {
  USD: "$",
  EUR: "€",
  GBP: "£",
  SYP: "ل.س",
};

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [currency, setCurrencyState] = useState<Currency>(() => {
    const stored = localStorage.getItem("currency") as Currency | null;
    if (stored && ["USD", "EUR", "GBP", "SYP"].includes(stored)) {
      return stored;
    }
    return "USD";
  });

  useEffect(() => {
    localStorage.setItem("currency", currency);
  }, [currency]);

  const setCurrency = (newCurrency: Currency) => {
    setCurrencyState(newCurrency);
  };

  const getCurrencySymbol = () => {
    return currencySymbols[currency];
  };

  const formatPrice = (amount: number) => {
    return `${getCurrencySymbol()}${amount.toLocaleString()}`;
  };

  return (
    <CurrencyContext.Provider
      value={{
        currency,
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
