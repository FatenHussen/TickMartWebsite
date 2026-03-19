import { useState, useEffect } from"react";
import { Link } from"react-router-dom";
import { useTranslation } from"react-i18next";
import { useLanguage } from"@/context/LanguageContext";
import { useTheme } from"@/context/ThemeContext";
import { useCurrency } from"@/context/CurrencyContext";
import { Button } from"@/shared/ui";
import { HiChevronDown } from"react-icons/hi";
import { cn } from"@/shared/lib/utils";
import { paths } from"@/app/routes/path/paths";
import { useMyCurrency, useUpdateCurrency } from"../hooks/useCurrencies";
import { _CurrencyApi } from"../api/currency.service";
import { useInfiniteSelect } from"@/shared/hooks/useInfiniteSelect";
import type { CurrencyItem } from"../types";

type ThemeOption ="light"|"dark"|"system";

export default function Settings() {
 const { t } = useTranslation();
 const { isRTL, language, setLanguage } = useLanguage();
 const { theme, setTheme } = useTheme();
 const { setCurrency } = useCurrency();

 const {
 options: currencyOptions,
 items: currencies,
 isLoading: currenciesLoading,
 handleScroll: handleCurrencyScroll,
 isFetchingNextPage: isFetchingMoreCurrencies,
 } = useInfiniteSelect<CurrencyItem>({
 queryKey: ["currencies","select"],
 fetchFn: async (page) => {
 const res = await _CurrencyApi.getCurrencies(page);
 return { items: res.data.items as CurrencyItem[], pagination: (res.data.pagination as { current_page: number; last_page: number; per_page: number; total: number } | null) ?? null };
 },
 mapToOption: (c) => ({ value: c.id, label: `${c.name} (${c.code})` }),
 });
 const { data: myCurrency } = useMyCurrency();
 const updateCurrencyMutation = useUpdateCurrency();

 // Local state for form (to allow cancel)
 const [localLanguage, setLocalLanguage] = useState(language);
 const [localCurrencyId, setLocalCurrencyId] = useState<number | null>(null);
 const [localTheme, setLocalTheme] = useState<ThemeOption>(
 theme ==="light"?"light": theme ==="dark"?"dark":"system"
 );

 // Sync my-currency from API to context when data loads
 useEffect(() => {
 if (myCurrency) {
 setCurrency(myCurrency.code, myCurrency.symbol);
 setLocalCurrencyId(myCurrency.id);
 }
 }, [myCurrency, setCurrency]);

 // Update local state when context/API changes
 useEffect(() => {
 setLocalLanguage(language);
 }, [language]);

 useEffect(() => {
 if (myCurrency) setLocalCurrencyId(myCurrency.id);
 }, [myCurrency]);

 useEffect(() => {
 setLocalTheme(theme ==="light"?"light": theme ==="dark"?"dark":"system");
 }, [theme]);

 const handleCancel = () => {
 setLocalLanguage(language);
 if (myCurrency) setLocalCurrencyId(myCurrency.id);
 setLocalTheme(theme ==="light"?"light": theme ==="dark"?"dark":"system");
 };

 const handleSave = async () => {
 setLanguage(localLanguage);

 // Update currency via API if changed
 if (localCurrencyId !== null && localCurrencyId !== myCurrency?.id) {
 try {
 await updateCurrencyMutation.mutateAsync({ currency_id: localCurrencyId });
 const selected = currencies.find((c) => c.id === localCurrencyId);
 if (selected) setCurrency(selected.code, selected.symbol);
 } catch {
 // Error toast handled by mutation
 return;
 }
 } else if (myCurrency) {
 setCurrency(myCurrency.code, myCurrency.symbol);
 }

 // Handle system theme
 if (localTheme ==="system") {
 const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
 setTheme(systemPrefersDark ?"dark":"light");
 } else {
 setTheme(localTheme);
 }
 };

 const hasCurrencyChanged = localCurrencyId !== null && localCurrencyId !== myCurrency?.id;
 const hasChanges =
 localLanguage !== language ||
 hasCurrencyChanged ||
 localTheme !== (theme ==="light"?"light": theme ==="dark"?"dark":"system");

 const currencySelectDisabled = currenciesLoading;

 return (
 <div
 className="bg-custom-card rounded-2xl shadow-sm p-6 md:p-8"
 dir={isRTL ?"rtl":"ltr"}
 >
 {/* Header */}
 <div className="mb-8">
 <h1 className="text-xl font-semibold text-custom-primary">
 {t("account.settings.title")}
 </h1>
 </div>

 <div className="space-y-6">
 {/* Language Section */}
 {/* <div className="space-y-2">
 <label className="block text-sm font-normal text-custom-primary">
 {t("account.settings.language.label")}
 </label>
 <div className="relative w-full">
 <select
 value={localLanguage}
 onChange={(e) => setLocalLanguage(e.target.value as"en"|"ar")}
 className={cn(
"w-full px-4 py-2.5 rounded-lg border border-custom-secondary",
"bg-custom-card text-custom-primary",
"focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent",
"appearance-none cursor-pointer text-sm",
 isRTL ?"pr-10":"pl-4"
 )}
 >
 <option value="en">{t("account.settings.language.english")}</option>
 <option value="ar">{t("account.settings.language.arabic")}</option>
 </select>
 <HiChevronDown
 className={cn(
"absolute top-1/2 -translate-y-1/2 w-5 h-5 text-custom-tertiary pointer-events-none",
 isRTL ?"left-3":"right-3"
 )}
 />
 </div>
 </div> */}

 {/* Currency Section */}
 <div className="space-y-2">
 <label className="block text-sm font-normal text-custom-primary">
 {t("account.settings.currency.label")}
 </label>
 <div className="relative w-full">
 <select
 value={localCurrencyId ??""}
 onChange={(e) => setLocalCurrencyId(Number(e.target.value) || null)}
 disabled={currencySelectDisabled}
 onScroll={handleCurrencyScroll}
 className={cn(
"w-full px-4 py-2.5 rounded-lg border border-custom-secondary",
"bg-custom-card text-custom-primary",
"focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent",
"appearance-none cursor-pointer text-sm",
"disabled:opacity-50 disabled:cursor-not-allowed",
 isRTL ?"pr-10":"pl-4"
 )}
 >
 {currencySelectDisabled ? (
 <option value="">
 {t("account.settings.currency.loading","جاري التحميل...")}
 </option>
 ) : (
 currencyOptions.map((option) => (
 <option key={option.value} value={option.value}>
 {option.label}
 </option>
 ))
 )}
 {isFetchingMoreCurrencies && (
 <option value=""disabled>
 {t("common.loading")}
 </option>
 )}
 </select>
 <HiChevronDown
 className={cn(
"absolute top-1/2 -translate-y-1/2 w-5 h-5 text-custom-tertiary pointer-events-none",
 isRTL ?"left-3":"right-3"
 )}
 />
 </div>
 <p className="text-xs text-custom-secondary mt-1">
 {t("account.settings.currency.helperText")}
 </p>
 </div>

 {/* Theme Section */}
 {/* <div className="space-y-2">
 <label className="block text-sm font-normal text-custom-primary">
 {t("account.settings.theme.label")}
 </label>
 <div className={cn("flex items-center gap-6", isRTL &&"flex-row-reverse")}>
 {(["light","dark","system"] as ThemeOption[]).map((themeOption) => (
 <label
 key={themeOption}
 className={cn(
"flex items-center gap-2 cursor-pointer group",
 isRTL &&"flex-row-reverse"
 )}
 >
 <input
 type="radio"
 name="theme"
 value={themeOption}
 checked={localTheme === themeOption}
 onChange={() => setLocalTheme(themeOption)}
 className="w-4 h-4 text-cyan-500 focus:ring-cyan-500 cursor-pointer accent-cyan-500 border-custom-secondary"
 />
 <span className="text-sm text-custom-primary capitalize">
 {t(`account.settings.theme.${themeOption}`)}
 </span>
 </label>
 ))}
 </div>
 </div> */}

 {/* Privacy & Data Section */}
 <div className="space-y-3 pt-6 border-t border-custom-primary">
 <h2 className="text-base font-semibold text-custom-primary">
 {t("account.settings.privacy.title")}
 </h2>
 <div className="space-y-1">
 <div>
 <Link
 to={paths.client.privacyPolicy}
 className="text-sm text-cyan-500 hover:text-cyan-600 dark:hover:text-cyan-400"
 >
 {t("account.settings.privacy.viewPrivacyPolicy")}
 </Link>
 </div>
 <div>
 <Link
 to={paths.client.termsConditions}
 className="text-sm text-cyan-500 hover:text-cyan-600 dark:hover:text-cyan-400"
 >
 {t("account.settings.privacy.viewTermsConditions")}
 </Link>
 </div>
 </div>
 <p className="text-xs text-custom-secondary mt-2">
 {t("account.settings.privacy.description")}
 </p>
 </div>

 {/* Action Buttons */}
 <div className={cn(
"flex items-center gap-3 pt-6",
 isRTL ?"justify-start":"justify-end"
 )}>
 <Button
 variant="outline"
 onClick={handleCancel}
 disabled={!hasChanges}
 className={cn(
"px-6 py-2 text-sm font-medium rounded-lg",
"border border-custom-secondary text-custom-primary",
"hover:bg-custom-light",
"disabled:opacity-50 disabled:cursor-not-allowed"
 )}
 >
 {t("account.settings.cancel")}
 </Button>
 <Button
 variant="primary"
 onClick={handleSave}
 disabled={!hasChanges}
 className={cn(
"px-6 py-2 text-sm font-medium rounded-lg",
"bg-cyan-500 text-white hover:bg-cyan-600",
"disabled:opacity-50 disabled:cursor-not-allowed"
 )}
 >
 {t("account.settings.saveChanges")}
 </Button>
 </div>
 </div>
 </div>
 );
}
