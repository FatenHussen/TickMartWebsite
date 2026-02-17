import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useLanguage } from "@/context/LanguageContext";
import { useTheme } from "@/context/ThemeContext";
import { useCurrency } from "@/context/CurrencyContext";
import { Button } from "@/shared/ui";
import { HiChevronDown } from "react-icons/hi";
import { cn } from "@/shared/lib/utils";
import type { Currency } from "@/context/CurrencyContext";

type ThemeOption = "light" | "dark" | "system";

export default function Settings() {
  const { t } = useTranslation();
  const { isRTL, language, setLanguage } = useLanguage();
  const { theme, setTheme } = useTheme();
  const { currency, setCurrency } = useCurrency();

  // Local state for form (to allow cancel)
  const [localLanguage, setLocalLanguage] = useState(language);
  const [localCurrency, setLocalCurrency] = useState<Currency>(currency);
  const [localTheme, setLocalTheme] = useState<ThemeOption>(
    theme === "light" ? "light" : theme === "dark" ? "dark" : "system"
  );

  // Update local state when context changes
  useEffect(() => {
    setLocalLanguage(language);
  }, [language]);

  useEffect(() => {
    setLocalCurrency(currency);
  }, [currency]);

  useEffect(() => {
    setLocalTheme(theme === "light" ? "light" : theme === "dark" ? "dark" : "system");
  }, [theme]);

  const handleCancel = () => {
    setLocalLanguage(language);
    setLocalCurrency(currency);
    setLocalTheme(theme === "light" ? "light" : theme === "dark" ? "dark" : "system");
  };

  const handleSave = () => {
    setLanguage(localLanguage);
    setCurrency(localCurrency);
    
    // Handle system theme
    if (localTheme === "system") {
      const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      setTheme(systemPrefersDark ? "dark" : "light");
    } else {
      setTheme(localTheme);
    }
    
    // TODO: Show success message
  };

  const hasChanges =
    localLanguage !== language ||
    localCurrency !== currency ||
    localTheme !== (theme === "light" ? "light" : theme === "dark" ? "dark" : "system");

  const currencyOptions: { value: Currency; label: string }[] = [
    { value: "USD", label: t("account.settings.currency.usd") },
    { value: "EUR", label: t("account.settings.currency.eur") },
    { value: "GBP", label: t("account.settings.currency.gbp") },
    { value: "SYP", label: t("account.settings.currency.syp") },
  ];

  return (
    <div
      className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6 md:p-8"
      dir={isRTL ? "rtl" : "ltr"}
    >
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
          {t("account.settings.title")}
        </h1>
      </div>

      <div className="space-y-6">
        {/* Language Section */}
        <div className="space-y-2">
          <label className="block text-sm font-normal text-gray-700 dark:text-gray-300">
            {t("account.settings.language.label")}
          </label>
          <div className="relative w-full">
            <select
              value={localLanguage}
              onChange={(e) => setLocalLanguage(e.target.value as "en" | "ar")}
              className={cn(
                "w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600",
                "bg-white dark:bg-gray-700 text-gray-900 dark:text-white",
                "focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent",
                "appearance-none cursor-pointer text-sm",
                isRTL ? "pr-10" : "pl-4"
              )}
            >
              <option value="en">{t("account.settings.language.english")}</option>
              <option value="ar">{t("account.settings.language.arabic")}</option>
            </select>
            <HiChevronDown
              className={cn(
                "absolute top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none",
                isRTL ? "left-3" : "right-3"
              )}
            />
          </div>
        </div>

        {/* Currency Section */}
        <div className="space-y-2">
          <label className="block text-sm font-normal text-gray-700 dark:text-gray-300">
            {t("account.settings.currency.label")}
          </label>
          <div className="relative w-full">
            <select
              value={localCurrency}
              onChange={(e) => setLocalCurrency(e.target.value as Currency)}
              className={cn(
                "w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600",
                "bg-white dark:bg-gray-700 text-gray-900 dark:text-white",
                "focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent",
                "appearance-none cursor-pointer text-sm",
                isRTL ? "pr-10" : "pl-4"
              )}
            >
              {currencyOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <HiChevronDown
              className={cn(
                "absolute top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none",
                isRTL ? "left-3" : "right-3"
              )}
            />
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            {t("account.settings.currency.helperText")}
          </p>
        </div>

        {/* Theme Section */}
        <div className="space-y-2">
          <label className="block text-sm font-normal text-gray-700 dark:text-gray-300">
            {t("account.settings.theme.label")}
          </label>
          <div className={cn("flex items-center gap-6", isRTL && "flex-row-reverse")}>
            {(["light", "dark", "system"] as ThemeOption[]).map((themeOption) => (
              <label
                key={themeOption}
                className={cn(
                  "flex items-center gap-2 cursor-pointer group",
                  isRTL && "flex-row-reverse"
                )}
              >
                <input
                  type="radio"
                  name="theme"
                  value={themeOption}
                  checked={localTheme === themeOption}
                  onChange={() => setLocalTheme(themeOption)}
                  className="w-4 h-4 text-cyan-500 focus:ring-cyan-500 cursor-pointer accent-cyan-500 border-gray-300"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300 capitalize">
                  {t(`account.settings.theme.${themeOption}`)}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Privacy & Data Section */}
        <div className="space-y-3 pt-6 border-t border-gray-200 dark:border-gray-700">
          <h2 className="text-base font-semibold text-gray-900 dark:text-white">
            {t("account.settings.privacy.title")}
          </h2>
          <div className="space-y-1">
            <div>
              <a
                href="#"
                className="text-sm text-cyan-500 hover:text-cyan-600 dark:hover:text-cyan-400"
              >
                {t("account.settings.privacy.viewPrivacyPolicy")}
              </a>
            </div>
            <div>
              <a
                href="#"
                className="text-sm text-cyan-500 hover:text-cyan-600 dark:hover:text-cyan-400"
              >
                {t("account.settings.privacy.viewTermsConditions")}
              </a>
            </div>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
            {t("account.settings.privacy.description")}
          </p>
        </div>

        {/* Action Buttons */}
        <div className={cn(
          "flex items-center gap-3 pt-6",
          isRTL ? "justify-start" : "justify-end"
        )}>
          <Button
            variant="outline"
            onClick={handleCancel}
            disabled={!hasChanges}
            className={cn(
              "px-6 py-2 text-sm font-medium rounded-lg",
              "border border-gray-300 text-gray-700 dark:text-gray-300",
              "hover:bg-gray-50 dark:hover:bg-gray-700",
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
