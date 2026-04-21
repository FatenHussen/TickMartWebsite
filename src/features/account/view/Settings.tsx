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
                <div className="absolute -top-28 start-1/2 h-60 w-[min(100%,32rem)] -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,color-mix(in_srgb,var(--color-api-second)_26%,transparent),transparent_72%)] blur-2xl" />
                <div className="absolute -bottom-20 -end-14 h-44 w-44 rounded-full bg-[var(--color-api-second)] opacity-[0.1] blur-3xl" />
                <div className="absolute top-1/3 -start-10 h-36 w-36 rounded-full bg-[var(--color-main)] opacity-[0.07] blur-3xl" />
            </div>

            <div
                className={cn(
                    "relative overflow-hidden rounded-2xl border border-border-accent-light",
                    "bg-[linear-gradient(145deg,color-mix(in_srgb,var(--color-bg-card)_95%,var(--color-api-second))_0%,var(--color-bg-card)_52%,color-mix(in_srgb,var(--color-main)_10%,var(--color-bg-card))_100%)]",
                    "p-6 shadow-[0_14px_44px_-20px_color-mix(in_srgb,var(--color-api-second)_24%,transparent)] md:p-8",
                    "dark:border-custom-primary/45 dark:bg-[linear-gradient(145deg,color-mix(in_srgb,var(--color-bg-card)_91%,var(--color-api-second))_0%,var(--color-bg-card)_58%)]",
                )}
            >
                <div
                    className="pointer-events-none absolute -end-16 -top-20 h-40 w-40 rounded-full bg-[var(--color-api-second)] opacity-[0.12] blur-3xl"
                    aria-hidden
                />

                <div className="relative mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-start gap-4">
                        <div
                            className={cn(
                                "flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl shadow-sm ring-1 ring-[color-mix(in_srgb,var(--color-api-second)_35%,transparent)]",
                                "bg-[color-mix(in_srgb,var(--color-api-second)_18%,var(--color-bg-card))] text-[var(--color-api-second)]",
                            )}
                        >
                            <SettingsIcon className="h-6 w-6" aria-hidden strokeWidth={1.75} />
                        </div>
                        <div>
                            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--color-api-second)]">
                                {t("account.settings.eyebrow", "Preferences")}
                            </p>
                            <h1 className="mt-1 text-xl font-semibold text-custom-primary">
                                {t("account.settings.title")}
                            </h1>
                            <p className="mt-1 max-w-xl text-sm leading-relaxed text-custom-secondary">
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
                            "rounded-2xl border border-border-accent-light bg-custom-card/80 p-5 backdrop-blur-sm",
                            "shadow-inner shadow-black/[0.02] dark:border-custom-primary/35 dark:bg-custom-card/90",
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
                                        "w-full px-4 py-2.5 rounded-xl border border-custom-secondary",
                                        "bg-custom-card text-custom-primary",
                                        "focus:outline-none focus:ring-2 focus:ring-[var(--color-api-second)]/45 focus:border-transparent",
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
                                        "pointer-events-none absolute top-1/2 h-5 w-5 -translate-y-1/2 text-[var(--color-api-second)] opacity-80",
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
                                "rounded-2xl border border-dashed border-[color-mix(in_srgb,var(--color-api-second)_40%,var(--color-border-primary))]",
                                "bg-[color-mix(in_srgb,var(--color-api-second)_6%,var(--color-bg-card))] p-4 dark:bg-[color-mix(in_srgb,var(--color-api-second)_10%,var(--color-bg-card))]",
                            )}
                        >
                            <div className="space-y-2">
                                <div>
                                    <Link
                                        to={paths.client.privacyPolicy}
                                        className="text-sm font-medium text-[var(--color-main)] underline-offset-4 hover:text-[var(--color-api-second)] hover:underline"
                                    >
                                        {t("account.settings.privacy.viewPrivacyPolicy")}
                                    </Link>
                                </div>
                                <div>
                                    <Link
                                        to={paths.client.termsConditions}
                                        className="text-sm font-medium text-[var(--color-main)] underline-offset-4 hover:text-[var(--color-api-second)] hover:underline"
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
                                "!text-white !bg-[var(--color-api-second)] hover:!bg-[var(--color-api-second-hover)]",
                                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-main)]/35 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-bg-card)]",
                                "shadow-[0_8px_24px_-12px_color-mix(in_srgb,var(--color-api-second)_45%,transparent)]",
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
