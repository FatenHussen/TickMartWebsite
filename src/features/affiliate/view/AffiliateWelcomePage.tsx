import { Link } from "react-router-dom";
import { Trans, useTranslation } from "react-i18next";
import { useLanguage } from "@/context/LanguageContext";
import { HiChevronRight } from "react-icons/hi";
import { MapPin, Sparkles } from "lucide-react";
import { paths } from "@/app/routes/path/paths";
import { useProfile } from "@/features/account/hooks/useProfile";
import { useAddresses } from "@/features/account/hooks/useAddress";
import { useCheckoutStore } from "@/store/checkout";
import { useMemo } from "react";
import type { Address } from "@/features/account/types";
import { useQuickActions } from "../hooks/useQuickActions";
import { resolveQuickActionPath } from "../lib/resolveQuickActionPath";

/** Quick tiles: shared surface; icon alternates API main / second. */
const QUICK_ACTION_THEMES = [
    {
        iconWrap:
            "bg-[var(--color-main)] shadow-[0_6px_20px_-4px_color-mix(in_srgb,var(--color-main)_45%,transparent)]",
    },
    {
        iconWrap:
            "bg-[var(--color-api-second)] shadow-[0_6px_20px_-4px_color-mix(in_srgb,var(--color-api-second)_40%,transparent)]",
    },
] as const;

const CARD_SHELL =
    "rounded-2xl border border-custom-primary bg-custom-card shadow-sm";

const TILE_BASE =
    "border border-custom-primary/80 bg-[color-mix(in_srgb,var(--color-main)_6%,var(--color-bg-card))] transition-all duration-200 hover:-translate-y-0.5 hover:border-[color-mix(in_srgb,var(--color-main)_35%,var(--color-border-primary))] hover:shadow-md motion-reduce:hover:translate-y-0 dark:bg-[color-mix(in_srgb,var(--color-main)_14%,var(--color-bg-card))] dark:hover:border-[color-mix(in_srgb,var(--color-api-second)_28%,var(--color-border-primary))]";

const WELCOME_NAME_CLASS =
    "bg-gradient-to-r from-[var(--color-main)] via-[var(--color-api-second)] to-[var(--color-main)] bg-clip-text font-bold text-transparent";

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

    const firstName = displayName.split(" ")[0] || displayName;

    return (
        <div
            className="relative min-h-screen bg-custom-light"
            dir={isRTL ? "rtl" : "ltr"}
        >
            <div
                className="pointer-events-none fixed inset-0 -z-10 opacity-[0.4] motion-reduce:opacity-0 dark:opacity-[0.18]"
                style={{
                    backgroundImage:
                        "radial-gradient(circle at 1px 1px, color-mix(in srgb, var(--color-main) 14%, var(--color-border-primary)) 1px, transparent 0)",
                    backgroundSize: "26px 26px",
                }}
                aria-hidden
            />
            <div className="page-container py-8 md:py-11">
                {/* Welcome — asymmetric layout + orbit art (API colors) */}
                <div className="mb-7">
                    <div
                        className={`relative overflow-hidden ${CARD_SHELL}`}
                    >
                        <div
                            className="h-1.5 w-full bg-gradient-to-r from-[var(--color-main)] via-[var(--color-api-second)] to-[var(--color-main)]"
                            aria-hidden
                        />
                        <div
                            className="pointer-events-none absolute -end-8 top-16 hidden h-24 w-24 rotate-12 rounded-3xl border-2 border-[color-mix(in_srgb,var(--color-api-second)_45%,transparent)] opacity-[0.55] md:block"
                            aria-hidden
                        />
                        <div
                            className="pointer-events-none absolute end-0 top-10 h-56 w-56 translate-x-1/3 rounded-full bg-[color-mix(in_srgb,var(--color-main)_14%,transparent)] blur-3xl"
                            aria-hidden
                        />
                        <div
                            className="pointer-events-none absolute bottom-0 start-0 h-48 w-48 -translate-x-1/3 translate-y-1/3 rounded-full bg-[color-mix(in_srgb,var(--color-api-second)_12%,transparent)] blur-3xl"
                            aria-hidden
                        />
                        <div className="relative bg-[linear-gradient(165deg,color-mix(in_srgb,var(--color-api-second)_9%,var(--color-bg-card))_0%,var(--color-bg-card)_38%,color-mix(in_srgb,var(--color-main)_4%,var(--color-bg-card))_100%)] px-6 py-9 md:px-10 md:py-11 dark:bg-[linear-gradient(165deg,color-mix(in_srgb,var(--color-main)_12%,var(--color-bg-card))_0%,var(--color-bg-card)_42%,var(--color-bg-card)_100%)]">
                            <div className="mx-auto flex max-w-4xl flex-col items-center gap-6 md:flex-row md:items-center md:justify-between md:gap-10 md:text-start">
                                <div className="relative z-10 flex max-w-xl flex-col items-center gap-3 md:items-start">
                                    <div className="inline-flex items-center gap-2 rounded-full border border-[color-mix(in_srgb,var(--color-main)_22%,var(--color-border-primary))] bg-[color-mix(in_srgb,var(--color-main)_8%,var(--color-bg-card))] px-3.5 py-1 text-xs font-semibold text-[var(--color-text-secondary)] shadow-sm">
                                        <Sparkles
                                            className="h-3.5 w-3.5 shrink-0 text-[var(--color-main)]"
                                            aria-hidden
                                        />
                                        <span className="text-[var(--color-text-primary)]">
                                            {t(
                                                "affiliateWelcome.heroBadge",
                                                "Your workspace"
                                            )}
                                        </span>
                                    </div>
                                    <h1 className="text-center text-2xl font-bold tracking-tight text-[var(--color-text-heading)] md:text-start md:text-3xl md:leading-snug">
                                        <Trans
                                            i18nKey="affiliateWelcome.welcomeBack"
                                            values={{ name: firstName }}
                                            components={{
                                                name: (
                                                    <span
                                                        className={WELCOME_NAME_CLASS}
                                                    />
                                                ),
                                            }}
                                        />
                                    </h1>
                                    <p className="text-center text-base font-medium text-[var(--color-text-primary)] md:text-start">
                                        {t(
                                            "affiliateWelcome.happyToSeeYou",
                                            "We're happy to see you again 👋"
                                        )}
                                    </p>
                                    <p className="max-w-md text-center text-sm leading-relaxed text-[var(--color-text-secondary)] md:text-start">
                                        {t(
                                            "affiliateWelcome.pickQuickAction",
                                            "Pick a quick action below to get started."
                                        )}
                                    </p>
                                </div>

                                <div
                                    className="relative mx-auto h-40 w-40 shrink-0 md:mx-0 md:h-44 md:w-44"
                                    aria-hidden
                                >
                                    <div className="absolute inset-0 rounded-full border-2 border-dashed border-[color-mix(in_srgb,var(--color-main)_32%,var(--color-border-primary))] motion-safe:animate-[spin_42s_linear_infinite] motion-reduce:animate-none" />
                                    <div className="absolute inset-4 rounded-full bg-[color-mix(in_srgb,var(--color-api-second)_8%,var(--color-bg-card))] ring-1 ring-[color-mix(in_srgb,var(--color-main)_18%,var(--color-border-primary))]" />
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="flex h-[3.25rem] w-[3.25rem] items-center justify-center rounded-2xl bg-gradient-to-br from-[var(--color-main)] to-[var(--color-api-second)] shadow-[0_12px_28px_-8px_color-mix(in_srgb,var(--color-main)_50%,transparent)]">
                                            <Sparkles className="h-7 w-7 text-[var(--color-text-inverse)] opacity-95" />
                                        </div>
                                    </div>
                                    <div className="absolute end-0 top-2 h-3 w-3 rounded-full bg-[var(--color-main)] shadow-[0_0_0_4px_color-mix(in_srgb,var(--color-main)_22%,transparent)]" />
                                    <div className="absolute bottom-4 start-0 h-2.5 w-2.5 rounded-full bg-[var(--color-api-second)] opacity-90" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Location — icon tile + side accent */}
                <div className="mb-7">
                    <div
                        className={`flex min-h-0 gap-0 overflow-hidden ${CARD_SHELL}`}
                    >
                        <div
                            className="w-1 shrink-0 bg-gradient-to-b from-[var(--color-main)] to-[var(--color-api-second)]"
                            aria-hidden
                        />
                        <div className="flex min-w-0 flex-1 flex-col gap-5 p-5 sm:flex-row sm:items-center md:gap-6 md:p-6">
                            <div className="mx-auto flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-[color-mix(in_srgb,var(--color-main)_12%,var(--color-bg-card))] text-[var(--color-main)] shadow-inner ring-2 ring-[color-mix(in_srgb,var(--color-api-second)_28%,var(--color-border-primary))] sm:mx-0 sm:h-[4.5rem] sm:w-[4.5rem]">
                                <MapPin
                                    className="h-8 w-8 sm:h-9 sm:w-9"
                                    strokeWidth={1.65}
                                    aria-hidden
                                />
                            </div>
                            <div className="min-w-0 flex-1 text-center sm:text-start">
                                <h2 className="mb-4 text-base font-bold text-[var(--color-text-heading)]">
                                    {t(
                                        "affiliateWelcome.yourCurrentLocation",
                                        "Your current location"
                                    )}
                                </h2>
                                <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-baseline sm:justify-between sm:gap-x-10">
                                    <p className="text-sm text-[var(--color-text-primary)]">
                                        <span className="font-semibold text-[var(--color-text-secondary)]">
                                            {t(
                                                "auth.governorate",
                                                "Governorate"
                                            )}
                                        </span>
                                        <span className="mx-1.5 text-[var(--color-border-secondary)]">
                                            ·
                                        </span>
                                        <span className="font-medium">
                                            {governorateName ||
                                                t(
                                                    "affiliateWelcome.notSet",
                                                    "Not set"
                                                )}
                                        </span>
                                    </p>
                                    <p className="text-sm text-[var(--color-text-primary)] sm:text-end">
                                        <span className="font-semibold text-[var(--color-text-secondary)]">
                                            {t("auth.city", "City")}
                                        </span>
                                        <span className="mx-1.5 text-[var(--color-border-secondary)]">
                                            ·
                                        </span>
                                        <span className="font-medium">
                                            {cityName ||
                                                t(
                                                    "affiliateWelcome.notSet",
                                                    "Not set"
                                                )}
                                        </span>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className={`relative overflow-hidden p-5 md:p-6 ${CARD_SHELL}`}>
                    <div
                        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[color-mix(in_srgb,var(--color-main)_45%,transparent)] to-transparent"
                        aria-hidden
                    />
                    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-center gap-3">
                            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[color-mix(in_srgb,var(--color-api-second)_12%,var(--color-bg-card))] text-[var(--color-api-second)] ring-1 ring-[color-mix(in_srgb,var(--color-main)_15%,var(--color-border-primary))]">
                                <Sparkles
                                    className="h-5 w-5"
                                    aria-hidden
                                />
                            </span>
                            <h2 className="text-base font-bold text-[var(--color-text-heading)]">
                                {t(
                                    "affiliateWelcome.quickActions",
                                    "Quick actions"
                                )}
                            </h2>
                        </div>
                        <Link
                            to={paths.client.home}
                            className={`inline-flex items-center gap-1 rounded-full border border-[color-mix(in_srgb,var(--color-main)_22%,var(--color-border-primary))] bg-[color-mix(in_srgb,var(--color-main)_6%,var(--color-bg-card))] px-3.5 py-1.5 text-sm font-semibold text-[var(--color-main)] transition-colors hover:border-[color-mix(in_srgb,var(--color-api-second)_35%,var(--color-border-primary))] hover:text-[var(--color-api-second)] ${isRTL ? "flex-row-reverse" : ""}`}
                        >
                            {t("affiliateWelcome.goToHome", "Go to home")}
                            <HiChevronRight
                                className={`h-4 w-4 shrink-0 ${isRTL ? "rotate-180" : ""}`}
                            />
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

                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-3.5 lg:grid-cols-4 lg:gap-4">
                        {quickActionsLoading &&
                            Array.from({ length: 4 }).map((_, i) => {
                                const th = QUICK_ACTION_THEMES[i % 2];
                                return (
                                    <div
                                        key={`sk-${i}`}
                                        className={`flex items-center gap-3 rounded-xl p-4 ${TILE_BASE} animate-pulse`}
                                    >
                                        <div
                                            className={`h-11 w-11 shrink-0 rounded-full opacity-50 ${th.iconWrap}`}
                                        />
                                        <div className="h-4 flex-1 rounded-md bg-custom-tertiary/30" />
                                        <div className="h-4 w-4 shrink-0 rounded bg-custom-tertiary/40" />
                                    </div>
                                );
                            })}

                        {!quickActionsLoading &&
                            quickActions.map((action, index) => {
                                const to = resolveQuickActionPath(
                                    action.page_slug
                                );
                                const theme = QUICK_ACTION_THEMES[index % 2];
                                return (
                                    <Link
                                        key={action.id}
                                        to={to}
                                        className={`group animate-card-enter flex items-center gap-3.5 rounded-xl p-4 ${TILE_BASE}`}
                                        style={{
                                            animationDelay: `${Math.min(index, 10) * 0.06}s`,
                                        }}
                                    >
                                        <div
                                            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${theme.iconWrap}`}
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
                                        <span className="min-w-0 flex-1 text-sm font-semibold text-[var(--color-text-primary)]">
                                            {action.title}
                                        </span>
                                        <HiChevronRight
                                            className={`h-5 w-5 shrink-0 text-custom-tertiary transition-colors group-hover:text-[var(--color-main)] ${isRTL ? "rotate-180" : ""}`}
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
