import { createContext, useContext, useEffect, useRef, useState } from"react";
import type { ReactNode } from"react";
import { useQueryClient } from"@tanstack/react-query";
import i18n from"@/i18n/config";

type Language ="en"|"ar";

interface LanguageContextType {
 language: Language;
 toggleLanguage: () => void;
 setLanguage: (lang: Language) => void;
 isRTL: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(
 undefined
);

export function LanguageProvider({ children }: { children: ReactNode }) {
 const queryClient = useQueryClient();
 const isInitialMount = useRef(true);
 const [language, setLanguageState] = useState<Language>(() => {
 const stored = localStorage.getItem("language") as Language | null;
 if (stored && (stored ==="en"|| stored ==="ar")) {
 return stored;
 }
 return"en";
 });

 useEffect(() => {
 i18n.changeLanguage(language);
 localStorage.setItem("language", language);

 // Update HTML lang attribute and dir
 document.documentElement.lang = language;
 document.documentElement.dir = language ==="ar"?"rtl":"ltr";

 // Invalidate all queries on language change (not on initial mount) so data refetches with new Accept-Language
 if (!isInitialMount.current) {
 queryClient.invalidateQueries();
 } else {
 isInitialMount.current = false;
 }
 }, [language, queryClient]);

 const toggleLanguage = () => {
 setLanguageState((prev) => (prev ==="en"?"ar":"en"));
 };

 const setLanguage = (lang: Language) => {
 setLanguageState(lang);
 };

 return (
 <LanguageContext.Provider
 value={{
 language,
 toggleLanguage,
 setLanguage,
 isRTL: language ==="ar",
 }}
 >
 {children}
 </LanguageContext.Provider>
 );
}

export function useLanguage() {
 const context = useContext(LanguageContext);
 if (context === undefined) {
 throw new Error("useLanguage must be used within a LanguageProvider");
 }
 return context;
}

