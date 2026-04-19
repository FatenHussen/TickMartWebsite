import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useLanguage } from "@/context/LanguageContext";
import { HiChevronRight } from "react-icons/hi";
import { paths } from "@/app/routes/path/paths";
import { useProfile } from "@/features/account/hooks/useProfile";
import { useAddresses } from "@/features/account/hooks/useAddress";
import { useCheckoutStore } from "@/store/checkout";
import { useMemo } from "react";
import type { Address } from "@/features/account/types";
import { useQuickActions } from "../hooks/useQuickActions";
import { resolveQuickActionPath } from "../lib/resolveQuickActionPath";

/** Visual rhythm for quick-action tiles (matches design: blue → green → purple → amber). */
const QUICK_ACTION_THEMES = [
    { card: "bg-blue-50 dark:bg-blue-950/30", iconWrap: "bg-blue-600" },
    { card: "bg-green-50 dark:bg-green-950/30", iconWrap: "bg-green-500" },
    { card: "bg-purple-50 dark:bg-purple-950/30", iconWrap: "bg-purple-500" },
    { card: "bg-amber-50 dark:bg-amber-950/30", iconWrap: "bg-amber-500" },
] as const;

function resolveLocalized(value: unknown, lang: string): string {
    if (value == null) return "";
    if (typeof value === "string") return value;
    if (
        typeof value === "object" &&
        value !== null &&
        ("ar" in value || "en" in value)
    ) {
        const o = value as { ar?: string; en?: string };
        return (lang.startsWith("ar") ? o.ar ?? o.en : o.en ?? o.ar) ?? "";
    }
    return String(value);
}

export default function AffiliateWelcomePage() {
    const { t, i18n } = useTranslation();
    const lang = i18n.language || "en";
    const { isRTL } = useLanguage();
    const { data: profile } = useProfile();
    const { data: addresses = [] } = useAddresses();
    const { addressId } = useCheckoutStore();
    const {
        data: quickActions = [],
        isLoading: quickActionsLoading,
        isError: quickActionsError,
    } = useQuickActions();

    const selectedAddress = useMemo(() => {
        if (addressId != null) {
            return addresses.find(
                (a: Address) => a.id === addressId || a.id === Number(addressId)
            );
        }
        return addresses.find((a: Address) => a.is_default) ?? addresses[0];
    }, [addresses, addressId]);

    const governorateName = selectedAddress
        ? resolveLocalized(
              selectedAddress.area?.city?.governorate?.name,
              lang
          )
        : "";
    const cityName = selectedAddress
        ? resolveLocalized(selectedAddress.area?.city?.name, lang)
        : "";

    const displayName = profile?.name
        ? typeof profile.name === "string"
            ? profile.name
            : resolveLocalized(profile.name, lang)
        : t("affiliateWelcome.guest", "Guest");

    return (
        <div
            className="min-h-screen bg-custom-light"
            dir={isRTL ? "rtl" : "ltr"}
        >
            <div className="page-container py-8 md:py-10">
                {/* Welcome Banner */}
                <div className="mb-6">
                    <div
                        className="flex flex-col items-center gap-2 rounded-2xl bg-gradient-to-b from-[#E0F2FE] via-[#B3E5FC] to-[#81D4FA] py-6 px-8 text-center shadow-[0_4px_6px_-4px_rgba(0,174,209,0.1),0_10px_15px_-3px_rgba(0,174,209,0.1)] dark:from-slate-800 dark:via-slate-800/95 dark:to-slate-900 dark:shadow-[0_4px_6px_-4px_rgba(76,218,246,0.08),0_10px_15px_-3px_rgba(76,218,246,0.06)]"
                    >
                        <h1 className="text-2xl md:text-3xl font-bold text-custom-primary tracking-tight">
                            {t(
                                "affiliateWelcome.welcomeBack",
                                "Welcome back, {{name}}!",
                                {
                                    name:
                                        displayName.split(" ")[0] || displayName,
                                }
                            )}
                        </h1>
                        <p className="text-base font-medium text-custom-primary">
                            {t(
                                "affiliateWelcome.happyToSeeYou",
                                "We're happy to see you again 👋"
                            )}
                        </p>
                        <p className="text-sm font-normal text-custom-secondary leading-relaxed">
                            {t(
                                "affiliateWelcome.pickQuickAction",
                                "Pick a quick action below to get started."
                            )}
                        </p>
                    </div>
                </div>

                {/* Your current location */}
                <div className="mb-6">
                    <div className="bg-blue-off rounded-xl border border-custom-primary p-5 md:p-6 shadow-sm">
                        <h2 className="text-base font-bold text-custom-primary mb-4">
                            {t(
                                "affiliateWelcome.yourCurrentLocation",
                                "Your current location"
                            )}
                        </h2>
                        <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:justify-between sm:items-baseline sm:gap-x-8">
                            <p className="text-custom-primary text-sm">
                                <span className="font-medium">
                                    {t("auth.governorate", "Governorate")}:
                                </span>{" "}
                                <span className="text-custom-primary">
                                    {governorateName ||
                                        t("affiliateWelcome.notSet", "Not set")}
                                </span>
                            </p>
                            <p className="text-custom-primary text-sm sm:text-right">
                                <span className="font-medium">
                                    {t("auth.city", "City")}:
                                </span>{" "}
                                <span className="text-custom-primary">
                                    {cityName ||
                                        t("affiliateWelcome.notSet", "Not set")}
                                </span>
                            </p>
                        </div>
                    </div>
                </div>

                {/* Quick actions — header + grid inside one white card (matches screenshot) */}
                <div className="bg-custom-card rounded-xl border border-custom-primary p-5 md:p-6 shadow-sm">
                    <div className="flex items-center justify-between gap-4 mb-5">
                        <h2 className="text-base font-bold text-custom-primary">
                            {t("affiliateWelcome.quickActions", "Quick actions")}
                        </h2>
                        <Link
                            to={paths.client.home}
                            className="text-sm font-medium text-primary-light underline underline-offset-2 decoration-primary-light/80 hover:text-primary hover:decoration-primary shrink-0 transition-colors"
                        >
                            {t("affiliateWelcome.goToHome", "Go to home")}
                        </Link>
                    </div>

                    {quickActionsError && (
                        <p className="text-sm text-red-600 dark:text-red-400 mb-4">
                            {t(
                                "affiliateWelcome.quickActionsError",
                                "Couldn't load quick actions. Please try again later."
                            )}
                        </p>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
                        {quickActionsLoading &&
                            Array.from({ length: 4 }).map((_, i) => {
                                const th = QUICK_ACTION_THEMES[i % 4];
                                return (
                                    <div
                                        key={`sk-${i}`}
                                        className={`flex items-center gap-3 p-4 rounded-xl ${th.card} animate-pulse`}
                                    >
                                        <div
                                            className={`w-11 h-11 rounded-full shrink-0 opacity-60 ${th.iconWrap}`}
                                        />
                                        <div className="flex-1 h-4 rounded bg-custom-tertiary/25" />
                                        <div className="w-4 h-4 rounded bg-gray-300/50 dark:bg-gray-600/50 shrink-0" />
                                    </div>
                                );
                            })}

                        {!quickActionsLoading &&
                            quickActions.map((action, index) => {
                                const to = resolveQuickActionPath(
                                    action.page_slug
                                );
                                const theme =
                                    QUICK_ACTION_THEMES[index % 4];
                                return (
                                    <Link
                                        key={action.id}
                                        to={to}
                                        className={`flex items-center gap-3 p-4 rounded-xl transition-shadow hover:shadow-md group ${theme.card}`}
                                    >
                                        <div
                                            className={`w-11 h-11 rounded-full flex items-center justify-center shrink-0 ${theme.iconWrap}`}
                                        >
                                            {action.icon ? (
                                                <img
                                                    src={action.icon}
                                                    alt=""
                                                    className="h-5 w-5 max-h-5 max-w-5 object-contain"
                                                    referrerPolicy="no-referrer"
                                                    loading="lazy"
                                                    decoding="async"
                                                />
                                            ) : null}
                                        </div>
                                        <span className="flex-1 min-w-0 text-sm font-medium text-custom-primary">
                                            {action.title}
                                        </span>
                                        <HiChevronRight
                                            className={`w-5 h-5 text-gray-400 dark:text-gray-500 shrink-0 group-hover:text-gray-500 dark:group-hover:text-gray-400 transition-colors ${isRTL ? "rotate-180" : ""}`}
                                        />
                                    </Link>
                                );
                            })}
                    </div>
                </div>
            </div>
        </div>
    );
}
