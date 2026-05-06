import { Trans, useTranslation } from "react-i18next";
import { useLanguage } from "@/context/LanguageContext";
import { useTheme } from "@/context/ThemeContext";
import { cn } from "@/shared/lib/utils";
import { MapPin, Sparkles, Zap } from "lucide-react";
import { useProfile } from "@/features/account/hooks/useProfile";
import { useAddresses } from "@/features/account/hooks/useAddress";
import { useCheckoutStore } from "@/store/checkout";
import { useMemo } from "react";
import type { Address } from "@/features/account/types";
import { useQuickActions } from "../hooks/useQuickActions";
import { useAffiliateDarkScopeStyle } from "../hooks/useAffiliateDarkScopeStyle";
import AffiliateQuickActionsStage from "../components/AffiliateQuickActionsStage";
import "@/features/affiliate/styles/affiliate-welcome-creative.css";

const WELCOME_NAME_CLASS =
    "bg-gradient-to-r from-[var(--color-main)] via-[var(--color-api-second)] to-[var(--color-main)] bg-clip-text font-black text-transparent";

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
    const affiliateDarkScopeStyle = useAffiliateDarkScopeStyle();
    const { theme } = useTheme();
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
            className={cn(
                "affiliate-welcome-canvas relative min-h-screen overflow-x-hidden bg-[var(--color-bg-primary)]",
                theme === "dark" && "dark",
            )}
            dir={isRTL ? "rtl" : "ltr"}
            style={affiliateDarkScopeStyle}
        >
            {/* Ambient canvas */}
            <div
                className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
                aria-hidden
            >
                <div className="absolute inset-0 bg-gradient-to-b from-[color-mix(in_srgb,var(--color-api-second)_14%,var(--color-bg-primary))] via-[var(--color-bg-primary)] to-[color-mix(in_srgb,var(--color-main)_9%,var(--color-bg-secondary))]" />
                <div className="affiliate-welcome-blob-a absolute -start-[20%] top-[-10%] h-[min(52vw,28rem)] w-[min(52vw,28rem)] rounded-full bg-[color-mix(in_srgb,var(--color-main)_22%,transparent)] blur-[100px]" />
                <div className="affiliate-welcome-blob-b absolute -end-[15%] top-[28%] h-[min(48vw,26rem)] w-[min(48vw,26rem)] rounded-full bg-[color-mix(in_srgb,var(--color-api-second)_26%,transparent)] blur-[110px]" />
                <div className="affiliate-welcome-blob-c absolute start-[12%] bottom-[-8%] h-[min(42vw,22rem)] w-[min(70vw,36rem)] rounded-[45%] bg-[color-mix(in_srgb,var(--color-main)_12%,transparent)] blur-[90px]" />
                <div
                    className="absolute inset-0 opacity-[0.2] mix-blend-soft-light motion-reduce:opacity-0"
                    style={{
                        backgroundImage:
                            "radial-gradient(circle at 1px 1px, color-mix(in srgb, var(--color-main) 22%, var(--color-border-primary)) 1px, transparent 0)",
                        backgroundSize: "28px 28px",
                    }}
                />
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[color-mix(in_srgb,var(--color-main)_45%,transparent)] to-transparent opacity-60" />
            </div>

            <div className="page-container relative space-y-10 py-10 md:space-y-12 md:py-14">
                {/* Hero */}
                <section className="relative">
                    <div className="relative overflow-hidden rounded-[1.75rem] border border-[color-mix(in_srgb,var(--color-main)_18%,var(--color-border-primary))] bg-custom-card/95 shadow-[0_32px_120px_-48px_color-mix(in_srgb,var(--color-main)_45%,transparent)] backdrop-blur-sm">
                        <div
                            className="affiliate-welcome-hero-glow pointer-events-none absolute -end-16 top-0 h-64 w-64 rounded-full bg-[color-mix(in_srgb,var(--color-main)_20%,transparent)] blur-3xl"
                            aria-hidden
                        />
                        <div
                            className="pointer-events-none absolute start-0 top-0 h-1.5 w-[65%] rounded-br-full bg-gradient-to-r from-[var(--color-main)] via-[var(--color-api-second)] to-transparent"
                            aria-hidden
                        />
                        <div className="relative px-6 py-10 md:px-10 md:py-12">
                            <div className="mx-auto grid max-w-5xl gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-center lg:gap-12">
                                <div className="flex flex-col items-center gap-5 text-center lg:items-start lg:text-start">
                                    <div className="inline-flex items-center gap-2 rounded-full border border-[color-mix(in_srgb,var(--color-main)_28%,var(--color-border-primary))] bg-[color-mix(in_srgb,var(--color-main)_10%,var(--color-bg-card))] px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.14em] text-[var(--color-text-secondary)] shadow-sm dark:bg-[color-mix(in_srgb,var(--color-main)_16%,var(--color-bg-card))]">
                                        <Zap
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
                                    <h1 className="max-w-xl text-3xl font-black leading-[1.12] tracking-tight text-[var(--color-text-heading)] md:text-4xl">
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
                                    <p className="text-lg font-semibold text-[var(--color-text-primary)]">
                                        {t(
                                            "affiliateWelcome.happyToSeeYou",
                                            "We're happy to see you again 👋"
                                        )}
                                    </p>
                                    <p className="max-w-lg text-sm leading-relaxed text-[var(--color-text-secondary)] md:text-base">
                                        {t(
                                            "affiliateWelcome.pickQuickAction",
                                            "Pick a quick action below to get started."
                                        )}
                                    </p>
                                </div>

                                <div
                                    className="relative mx-auto flex h-[14rem] w-full max-w-[16rem] items-center justify-center lg:mx-0 lg:h-[16rem] lg:max-w-none"
                                    aria-hidden
                                >
                                    <div className="absolute inset-0 rounded-[2rem] border border-dashed border-[color-mix(in_srgb,var(--color-main)_35%,var(--color-border-primary))] opacity-80 motion-safe:animate-[spin_48s_linear_infinite] motion-reduce:animate-none" />
                                    <div className="absolute inset-5 rounded-[1.5rem] bg-[linear-gradient(145deg,color-mix(in_srgb,var(--color-api-second)_14%,var(--color-bg-card)),var(--color-bg-card))] shadow-inner ring-1 ring-[color-mix(in_srgb,var(--color-main)_20%,var(--color-border-primary))]" />
                                    <div className="absolute end-3 top-10 h-16 w-12 rotate-[-14deg] rounded-2xl bg-gradient-to-br from-[var(--color-main)]/35 to-[var(--color-api-second)]/25 shadow-lg backdrop-blur-sm" />
                                    <div className="absolute bottom-12 start-4 h-14 w-14 rotate-[18deg] rounded-2xl border border-[color-mix(in_srgb,var(--color-api-second)_40%,transparent)] bg-custom-card/80 shadow-md" />
                                    <div className="relative flex h-[4.25rem] w-[4.25rem] items-center justify-center rounded-2xl bg-gradient-to-br from-[var(--color-main)] to-[var(--color-api-second)] shadow-[0_16px_40px_-12px_color-mix(in_srgb,var(--color-main)_55%,transparent)] ring-4 ring-[color-mix(in_srgb,var(--color-main)_18%,transparent)]">
                                        <Sparkles className="h-8 w-8 text-[var(--color-text-inverse)]" />
                                    </div>
                                    <div className="absolute end-6 top-4 h-2.5 w-2.5 rounded-full bg-[var(--color-main)] shadow-[0_0_0_5px_color-mix(in_srgb,var(--color-main)_25%,transparent)] motion-safe:animate-pulse motion-reduce:animate-none" />
                                    <div className="absolute bottom-6 start-10 h-2 w-2 rounded-full bg-[var(--color-api-second)] opacity-90" />
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Location */}
                <section className="relative">
                    <div className="group relative overflow-hidden rounded-[1.75rem] border border-[color-mix(in_srgb,var(--color-main)_16%,var(--color-border-primary))] bg-custom-card shadow-[0_24px_80px_-40px_color-mix(in_srgb,var(--color-main)_35%,transparent)]">
                        <div
                            className="pointer-events-none absolute inset-0 bg-[linear-gradient(120deg,transparent_40%,color-mix(in_srgb,var(--color-api-second)_8%,transparent)_55%,transparent_70%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100 motion-reduce:transition-none"
                            aria-hidden
                        />
                        <div className="relative flex flex-col gap-6 p-6 sm:flex-row sm:items-center md:gap-8 md:p-8">
                            <div className="relative mx-auto flex h-[4.75rem] w-[4.75rem] shrink-0 items-center justify-center sm:mx-0">
                                <span className="absolute inset-0 z-0 rounded-3xl bg-[color-mix(in_srgb,var(--color-main)_14%,var(--color-bg-card))] ring-2 ring-[color-mix(in_srgb,var(--color-api-second)_35%,var(--color-border-primary))]" />
                                <span className="absolute inset-0 z-[1] rounded-3xl bg-[color-mix(in_srgb,var(--color-main)_16%,transparent)] opacity-50 motion-safe:animate-ping motion-reduce:animate-none" />
                                <MapPin
                                    className="relative z-[2] h-9 w-9 text-[var(--color-main)]"
                                    strokeWidth={1.65}
                                    aria-hidden
                                />
                            </div>
                            <div className="min-w-0 flex-1 text-center sm:text-start">
                                <h2 className="mb-1 text-xs font-bold uppercase tracking-[0.12em] text-[var(--color-text-secondary)]">
                                    {t(
                                        "affiliateWelcome.yourCurrentLocation",
                                        "Your current location"
                                    )}
                                </h2>
                                <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-end sm:justify-between sm:gap-x-12">
                                    <p className="text-[15px] text-[var(--color-text-primary)]">
                                        <span className="me-2 font-semibold text-[var(--color-text-secondary)]">
                                            {t(
                                                "auth.governorate",
                                                "Governorate"
                                            )}
                                        </span>
                                        <span className="font-semibold text-[var(--color-text-heading)]">
                                            {governorateName ||
                                                t(
                                                    "affiliateWelcome.notSet",
                                                    "Not set"
                                                )}
                                        </span>
                                    </p>
                                    <p className="text-[15px] text-[var(--color-text-primary)] sm:text-end">
                                        <span className="me-2 font-semibold text-[var(--color-text-secondary)]">
                                            {t("auth.city", "City")}
                                        </span>
                                        <span className="font-semibold text-[var(--color-text-heading)]">
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
                </section>

                {/* Quick actions stage */}
                <section className="relative">
                    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                        <div>
                            <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-[color-mix(in_srgb,var(--color-main)_8%,var(--color-bg-card))] px-3 py-1 text-[11px] font-bold uppercase tracking-[0.14em] text-[var(--color-main)] ring-1 ring-[color-mix(in_srgb,var(--color-main)_22%,var(--color-border-primary))]">
                                <Sparkles className="h-3.5 w-3.5" aria-hidden />
                                {t(
                                    "affiliateWelcome.quickActionsKicker",
                                    "Interactive"
                                )}
                            </div>
                            <h2 className="text-2xl font-black tracking-tight text-[var(--color-text-heading)] md:text-3xl">
                                {t(
                                    "affiliateWelcome.quickActions",
                                    "Quick actions"
                                )}
                            </h2>
                            <p className="mt-1 max-w-xl text-sm text-[var(--color-text-secondary)]">
                                {t(
                                    "affiliateWelcome.quickActionsHint",
                                    "Swipe or wait — slides advance automatically."
                                )}
                            </p>
                        </div>
                    </div>

                    <div className="relative rounded-[1.6rem] p-[1.5px] bg-gradient-to-br from-[color-mix(in_srgb,var(--color-main)_55%,transparent)] via-[color-mix(in_srgb,var(--color-api-second)_35%,transparent)] to-[color-mix(in_srgb,var(--color-main)_40%,transparent)] shadow-[0_40px_100px_-50px_color-mix(in_srgb,var(--color-main)_42%,transparent)]">
                        <div className="overflow-hidden rounded-[1.45rem] bg-[var(--color-bg-primary)]">
                            <AffiliateQuickActionsStage
                                actions={quickActions}
                                isLoading={quickActionsLoading}
                                isError={quickActionsError}
                                isRTL={isRTL}
                            />
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}
