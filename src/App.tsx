import React from"react";
import { ThemeProvider } from"@/context/ThemeContext";
import { LanguageProvider } from"@/context/LanguageContext";
import { CurrencyProvider } from"@/context/CurrencyContext";
import"@/i18n/config";

type AppProps = {
 children?: React.ReactNode;
};

export default function App({ children }: AppProps) {
 return (
 <LanguageProvider>
 <CurrencyProvider>
 <ThemeProvider>{children}</ThemeProvider>
 </CurrencyProvider>
 </LanguageProvider>
 );
}
