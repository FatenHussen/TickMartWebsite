import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ChevronDown, Settings as SettingsIcon } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { useTheme } from "@/context/ThemeContext";
import { useCurrency } from "@/context/CurrencyContext";
import { Button } from "@/shared/ui";
import { cn } from "@/shared/lib/utils";
import { paths } from "@/app/routes/path/paths";
import { useMyCurrency, useUpdateCurrency } from "../hooks/useCurrencies";
import { _CurrencyApi } from "../api/currency.service";
import { useInfiniteSelect } from "@/shared/hooks/useInfiniteSelect";
import type { CurrencyItem } from "../types";

type ThemeOption = "light" | "dark" | "system";

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
        queryKey: ["currencies", "select"],
        fetchFn: async (page) => {
            const res = await _CurrencyApi.getCurrencies(page);
            return {
                items: res.data.items as CurrencyItem[],
                pagination:
                    (res.data.pagination as {
                        current_page: number;
                        last_page: number;
                        per_page: number;
                        total: number;
                    } | null) ?? null,
            };
        },
        mapToOption: (c) => ({ value: c.id, label: `${c.name} (${c.code})` }),
    });
    const { data: myCurrency } = useMyCurrency();
    const updateCurrencyMutation = useUpdateCurrency();

    const [localLanguage, setLocalLanguage] = useState(language);
    const [localCurrencyId, setLocalCurrencyId] = useState<number | null>(null);
    const [localTheme, setLocalTheme] = useState<ThemeOption>(
        theme === "light" ? "light" : theme === "dark" ? "dark" : "system",
    );

    useEffect(() => {
        if (myCurrency) {
            setCurrency(myCurrency.code, myCurrency.symbol);
            setLocalCurrencyId(myCurrency.id);
        }
    }, [myCurrency, setCurrency]);

    useEffect(() => {
        setLocalLanguage(language);
    }, [language]);

    useEffect(() => {
        if (myCurrency) setLocalCurrencyId(myCurrency.id);
    }, [myCurrency]);

    useEffect(() => {
        setLocalTheme(theme === "light" ? "light" : theme === "dark" ? "dark" : "system");
    }, [theme]);

    const handleCancel = () => {
        setLocalLanguage(language);
        if (myCurrency) setLocalCurrencyId(myCurrency.id);
        setLocalTheme(theme === "light" ? "light" : theme === "dark" ? "dark" : "system");
    };

    const handleSave = async () => {
        setLanguage(localLanguage);

        if (localCurrencyId !== null && localCurrencyId !== myCurrency?.id) {
            try {
                await updateCurrencyMutation.mutateAsync({ currency_id: localCurrencyId });
                const selected = currencies.find((c) => c.id === localCurrencyId);
                if (selected) setCurrency(selected.code, selected.symbol);
            } catch {
                return;
            }
        } else if (myCurrency) {
            setCurrency(myCurrency.code, myCurrency.symbol);
        }

        if (localTheme === "system") {
            const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
            setTheme(systemPrefersDark ? "dark" : "light");
        } else {
            setTheme(localTheme);
        }
    };

    const hasCurrencyChanged = localCurrencyId !== null && localCurrencyId !== myCurrency?.id;
    const hasChanges =
        localLanguage !== language ||
        hasCurrencyChanged ||
        localTheme !== (theme === "light" ? "light" : theme === "dark" ? "dark" : "system");

    const currencySelectDisabled = currenciesLoading;

    return (
        <div className="relative" dir={isRTL ? "rtl" : "ltr"}>
            <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden rounded-3xl">
                <div className="absolute -top-28 start-1/2 h-60 w-[min(100%,32rem)] -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,color-mix(in_srgb,var(--color-api-second)_26%,transparent),transparent_72%)] blur-2xl dark:bg-[radial-gradient(ellipse_at_center,color-mix(in_srgb,var(--color-api-second)_10%,transparent),transparent_72%)]" />
                <div className="absolute -bottom-20 -end-14 h-44 w-44 rounded-full bg-[var(--color-api-second)] opacity-[0.1] blur-3xl dark:opacity-[0.045]" />
                <div className="absolute top-1/3 -start-10 h-36 w-36 rounded-full bg-[var(--color-main)] opacity-[0.07] blur-3xl dark:opacity-[0.035]" />
            </div>

            <div
                className={cn(
                    "account-shell relative overflow-hidden rounded-3xl border border-[var(--color-border-primary)] transition-shadow duration-300",
                    "bg-[linear-gradient(145deg,color-mix(in_srgb,var(--color-bg-card)_95%,var(--color-api-second))_0%,var(--color-bg-card)_52%,color-mix(in_srgb,var(--color-main)_10%,var(--color-bg-card))_100%)]",
                    "p-6 shadow-[0_4px_24px_-8px_var(--color-shadow)] dark:border-[rgba(255,255,255,0.06)] dark:bg-[rgba(16,17,20,0.75)] dark:bg-none dark:shadow-[0_24px_72px_-28px_rgba(0,0,0,0.72),inset_0_1px_0_0_rgba(255,255,255,0.04)] dark:backdrop-blur-xl md:p-8",
                )}
            >
                <div
                    className="pointer-events-none absolute -end-16 -top-20 h-40 w-40 rounded-full bg-[var(--color-api-second)] opacity-[0.12] blur-3xl dark:opacity-[0.055]"
                    aria-hidden
                />

                <div className="relative mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-start gap-4">
                        <div
                            className={cn(
                                "flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl shadow-sm ring-1 ring-[color-mix(in_srgb,var(--color-api-second)_35%,transparent)]",
                                "bg-[color-mix(in_srgb,var(--color-api-second)_18%,var(--color-bg-card))] text-[var(--color-api-second)]",
                                "dark:bg-[color-mix(in_srgb,var(--color-api-second)_12%,rgba(255,255,255,0.04))] dark:text-[color-mix(in_srgb,var(--color-api-second)_75%,#a1a1aa)] dark:shadow-[0_0_24px_-8px_color-mix(in_srgb,var(--color-api-second)_22%,transparent)] dark:ring-[rgba(255,255,255,0.08)]",
                            )}
                        >
                            <SettingsIcon className="h-6 w-6" aria-hidden strokeWidth={1.75} />
                        </div>
                        <div>
                            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--color-api-second)] dark:text-[#71717A]">
                                {t("account.settings.eyebrow", "Preferences")}
                            </p>
                            <h1 className="mt-1 text-xl font-semibold text-custom-primary dark:text-[#FFFFFF]">
                                {t("account.settings.title")}
                            </h1>
                            <p className="mt-1 max-w-xl text-sm leading-relaxed text-custom-secondary dark:text-[#A1A1AA]">
                                {t(
                                    "account.settings.subtitle",
                                    "Choose your currency and review legal documents. Changes apply to your next session.",
                                )}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="relative space-y-6">
                    <div
                        className={cn(
                            "rounded-2xl border border-[var(--color-border-primary)] bg-custom-card/80 p-5 backdrop-blur-sm",
                            "shadow-inner shadow-black/[0.02] dark:border-[rgba(255,255,255,0.06)] dark:bg-[rgba(255,255,255,0.03)]",
                        )}
                    >
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-custom-primary">
                                {t("account.settings.currency.label")}
                            </label>
                            <div className="relative w-full">
                                <select
                                    value={localCurrencyId ?? ""}
                                    onChange={(e) => setLocalCurrencyId(Number(e.target.value) || null)}
                                    disabled={currencySelectDisabled}
                                    onScroll={handleCurrencyScroll}
                                    className={cn(
                                        "w-full rounded-xl border border-custom-secondary px-4 py-2.5",
                                        "bg-custom-card text-custom-primary",
                                        "focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[var(--color-api-second)]/45 dark:border-[rgba(255,255,255,0.06)] dark:bg-[rgba(255,255,255,0.04)] dark:text-[#FFFFFF] dark:focus:ring-[color-mix(in_srgb,var(--color-main)_30%,transparent)]",
                                        "appearance-none cursor-pointer text-sm transition-shadow",
                                        "disabled:opacity-50 disabled:cursor-not-allowed",
                                        isRTL ? "pr-10" : "pl-4",
                                    )}
                                >
                                    {currencySelectDisabled ? (
                                        <option value="">
                                            {t("account.settings.currency.loading", "جاري التحميل...")}
                                        </option>
                                    ) : (
                                        currencyOptions.map((option) => (
                                            <option key={option.value} value={option.value}>
                                                {option.label}
                                            </option>
                                        ))
                                    )}
                                    {isFetchingMoreCurrencies && (
                                        <option value="" disabled>
                                            {t("common.loading")}
                                        </option>
                                    )}
                                </select>
                                <ChevronDown
                                    className={cn(
                                        "pointer-events-none absolute top-1/2 h-5 w-5 -translate-y-1/2 text-[var(--color-api-second)] opacity-80 dark:text-[color-mix(in_srgb,var(--color-api-second)_55%,#71717A)]",
                                        isRTL ? "left-3" : "right-3",
                                    )}
                                    aria-hidden
                                />
                            </div>
                            <p className="text-xs text-custom-secondary mt-1">
                                {t("account.settings.currency.helperText")}
                            </p>
                        </div>
                    </div>

                    <div className="space-y-3 pt-2">
                        <h2 className="text-base font-semibold text-custom-primary">
                            {t("account.settings.privacy.title")}
                        </h2>
                        <div
                            className={cn(
                                "rounded-2xl border border-dashed border-[var(--color-border-accent-light)]",
                                "bg-[color-mix(in_srgb,var(--color-api-second)_6%,var(--color-bg-card))] p-4 dark:border-[rgba(255,255,255,0.08)] dark:bg-[rgba(255,255,255,0.03)]",
                            )}
                        >
                            <div className="space-y-2">
                                <div>
                                    <Link
                                        to={paths.client.privacyPolicy}
                                        className="text-sm font-medium text-[var(--color-main)] underline-offset-4 transition-colors hover:text-[var(--color-api-second)] hover:underline dark:text-[color-mix(in_srgb,var(--color-main)_82%,#FFFFFF)] dark:hover:text-[color-mix(in_srgb,var(--color-api-second)_88%,#FFFFFF)]"
                                    >
                                        {t("account.settings.privacy.viewPrivacyPolicy")}
                                    </Link>
                                </div>
                                <div>
                                    <Link
                                        to={paths.client.termsConditions}
                                        className="text-sm font-medium text-[var(--color-main)] underline-offset-4 transition-colors hover:text-[var(--color-api-second)] hover:underline dark:text-[color-mix(in_srgb,var(--color-main)_82%,#FFFFFF)] dark:hover:text-[color-mix(in_srgb,var(--color-api-second)_88%,#FFFFFF)]"
                                    >
                                        {t("account.settings.privacy.viewTermsConditions")}
                                    </Link>
                                </div>
                            </div>
                            <p className="text-xs text-custom-secondary mt-3 leading-relaxed">
                                {t("account.settings.privacy.description")}
                            </p>
                        </div>
                    </div>

                    <div className={cn("flex flex-wrap items-center gap-3 pt-4", isRTL ? "justify-start" : "justify-end")}>
                        <Button
                            variant="outline"
                            onClick={handleCancel}
                            disabled={!hasChanges}
                            className={cn(
                                "px-6 py-2 text-sm font-medium rounded-xl",
                                "border border-custom-secondary text-custom-primary",
                                "hover:border-[color-mix(in_srgb,var(--color-api-second)_55%,var(--color-border-secondary))] hover:bg-[color-mix(in_srgb,var(--color-api-second)_8%,var(--color-bg-card))]",
                                "dark:border-[rgba(255,255,255,0.08)] dark:text-[#A1A1AA] dark:hover:border-[rgba(255,255,255,0.14)] dark:hover:bg-[rgba(255,255,255,0.05)] dark:hover:text-[#FFFFFF]",
                                "disabled:opacity-50 disabled:cursor-not-allowed",
                            )}
                        >
                            {t("account.settings.cancel")}
                        </Button>
                        <Button
                            variant="primary"
                            onClick={handleSave}
                            disabled={!hasChanges}
                            className={cn(
                                "px-6 py-2 text-sm font-medium rounded-xl shadow-md",
                                "!bg-[var(--color-api-second)] !text-white hover:!bg-[var(--color-api-second-hover)]",
                                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-main)]/35 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-bg-card)] dark:focus-visible:ring-offset-[rgba(16,17,20,0.95)]",
                                "shadow-[0_8px_24px_-12px_color-mix(in_srgb,var(--color-api-second)_45%,transparent)] dark:shadow-[0_14px_40px_-16px_color-mix(in_srgb,var(--color-api-second)_42%,transparent)] dark:ring-1 dark:ring-white/[0.06]",
                                "disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none",
                            )}
                        >
                            {t("account.settings.saveChanges")}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
