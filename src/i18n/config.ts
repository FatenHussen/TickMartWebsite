import i18n from"i18next";
import { initReactI18next } from"react-i18next";
import enTranslations from"../locales/en.json";
import arTranslations from"../locales/ar.json";

const savedLanguage = localStorage.getItem("language") ||"en";

// Initialize i18n synchronously
i18n
 .use(initReactI18next)
 .init({
 resources: {
 en: {
 translation: enTranslations,
 },
 ar: {
 translation: arTranslations,
 },
 },
 lng: savedLanguage ==="ar"|| savedLanguage ==="en"? savedLanguage :"en",
 fallbackLng:"en",
 defaultNS:"translation",
 ns: ["translation"],
 interpolation: {
 escapeValue: false,
 },
 react: {
 useSuspense: false,
 },
 debug: false,
 returnEmptyString: false,
 returnNull: false,
 });

export default i18n;

