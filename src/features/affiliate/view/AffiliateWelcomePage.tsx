import { useCallback, useEffect, useMemo } from "react";
import { Link, Navigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { Copy, MapPin, Plus, Wallet } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { useTheme } from "@/context/ThemeContext";
import { cn } from "@/shared/lib/utils";
import { paths } from "@/app/routes/path/paths";
import { useProfile } from "@/features/account/hooks/useProfile";
import { useAddresses } from "@/features/account/hooks/useAddress";
import { useCheckoutStore } from "@/store/checkout";
import type { Address } from "@/features/account/types";
import {
    useMarketerProfile,
    useMarketerStatistics,
} from "@/features/marketer/hooks/useMarketer";
import { useMarketerAccess } from "@/features/marketer/hooks/useMarketerAccess";
import {
    demoteLocalAffiliateApproval,
    isAffiliateNotAuthorizedError,
} from "@/features/marketer/utils/isApprovedMarketer";
import { useQuickActions } from "../hooks/useQuickActions";
import { useAffiliateDarkScopeStyle } from "../hooks/useAffiliateDarkScopeStyle";
import AffiliateQuickActionsStage from "../components/AffiliateQuickActionsStage";

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
    const { isApprovedMarketer, isAffiliateStatusPending } = useMarketerAccess();
    const { data: profile } = useProfile();
    const { data: addresses = [] } = useAddresses();
    const { addressId } = useCheckoutStore();
    const { data: stats, error: statsError } = useMarketerStatistics({
        enabled: isApprovedMarketer,
    });
    const { data: marketerProfile, error: profileError } = useMarketerProfile({
        enabled: isApprovedMarketer,
    });
    const {
        data: quickActions = [],
        isLoading: quickActionsLoading,
        isError: quickActionsError,
    } = useQuickActions({ enabled: isApprovedMarketer });

    const unauthorized =
        isAffiliateNotAuthorizedError(statsError) ||
        isAffiliateNotAuthorizedError(profileError);

    useEffect(() => {
        if (unauthorized) {
            demoteLocalAffiliateApproval();
        }
    }, [unauthorized]);

    const selectedAddress = useMemo(() => {
        if (addressId != null) {
            return addresses.find(
                (a: Address) => a.id === addressId || a.id === Number(addressId),
            );
        }
        return addresses.find((a: Address) => a.is_default) ?? addresses[0];
    }, [addresses, addressId]);

    const governorateName = selectedAddress
        ? resolveLocalized(selectedAddress.area?.city?.governorate?.name, lang)
        : "";
    const cityName = selectedAddress
        ? resolveLocalized(selectedAddress.area?.city?.name, lang)
        : "";
    const streetName = selectedAddress?.street_name?.trim() ?? "";
    const addressLine = [streetName, cityName, governorateName]
        .filter(Boolean)
        .join(" · ");

    const displayName = profile?.name
        ? typeof profile.name === "string"
            ? profile.name
            : resolveLocalized(profile.name, lang)
        : t("affiliateWelcome.guest", "Guest");

    const firstName = displayName.split(" ")[0] || displayName;
    const affiliateLink = marketerProfile?.affiliate_link?.trim() ?? "";
    const availableBalance = stats?.available_balance ?? 0;
    const totalOrders = stats?.total_orders ?? 0;

    const copyAffiliateLink = useCallback(() => {
        if (!affiliateLink) return;
        void navigator.clipboard.writeText(affiliateLink);
        toast.success(t("marketer.dashboard.linkCopied", "Link copied!"));
    }, [affiliateLink, t]);

    const addressHref = selectedAddress
        ? paths.account.editAddress(selectedAddress.id)
        : paths.account.addAddress;

    if (isAffiliateStatusPending) {
        return (
            <div
                className="page-container space-y-4 py-8"
                dir={isRTL ? "rtl" : "ltr"}
            >
                <div className="h-40 animate-pulse rounded-2xl bg-custom-card" />
                <div className="h-24 animate-pulse rounded-2xl bg-custom-card" />
            </div>
        );
    }

    if (!isApprovedMarketer || unauthorized) {
        return <Navigate to={paths.becomeMarketer} replace />;
    }

    return (
        <div
            className={cn(
                "relative min-h-screen overflow-x-hidden bg-[var(--color-bg-primary)]",
                theme === "dark" && "dark",
            )}
            dir={isRTL ? "rtl" : "ltr"}
            style={affiliateDarkScopeStyle}
        >
            <div className="page-container relative space-y-6 py-8 sm:space-y-8 sm:py-10">
                <section className="rounded-2xl border border-stone-200/90 bg-[#FFFcf8] px-5 py-6 sm:px-8 sm:py-7 dark:border-white/10 dark:bg-[#24201C]">
                    <p className="text-[13px] font-medium text-[var(--color-primary)]">
                        {t("affiliateWelcome.heroBadge", "Marketer dashboard")}
                    </p>
                    <h1 className="mt-1.5 text-[1.7rem] font-semibold tracking-[-0.03em] text-zinc-900 dark:text-[#E8E4DC] sm:text-[2rem]">
                        {t("affiliateWelcome.helloName", { name: firstName })}
                    </h1>

                    <div className="mt-5 flex flex-wrap gap-3">
                        <div className="min-w-[9.5rem] rounded-xl border border-stone-200/80 bg-white px-4 py-3 dark:border-white/10 dark:bg-white/5">
                            <p className="text-[12px] text-stone-500 dark:text-[#E8E4DC]/70">
                                {t("marketer.dashboard.availableBalance")}
                            </p>
                            <p className="mt-0.5 text-lg font-semibold tabular-nums text-zinc-900 dark:text-white">
                                {availableBalance.toLocaleString()}
                            </p>
                        </div>
                        <div className="min-w-[9.5rem] rounded-xl border border-stone-200/80 bg-white px-4 py-3 dark:border-white/10 dark:bg-white/5">
                            <p className="text-[12px] text-stone-500 dark:text-[#E8E4DC]/70">
                                {t("marketer.dashboard.totalOrders")}
                            </p>
                            <p className="mt-0.5 text-lg font-semibold tabular-nums text-zinc-900 dark:text-white">
                                {totalOrders.toLocaleString()}
                            </p>
                        </div>
                    </div>

                    <div className="mt-5 flex flex-wrap items-center gap-2.5">
                        {affiliateLink ? (
                            <button
                                type="button"
                                onClick={copyAffiliateLink}
                                className="cta-honey inline-flex h-11 items-center gap-2 rounded-full px-5 text-sm font-semibold"
                            >
                                <Copy className="h-4 w-4" aria-hidden />
                                {t("marketer.dashboard.copyLink")}
                            </button>
                        ) : (
                            <Link
                                to={paths.client.customOrderCreate}
                                className="cta-honey inline-flex h-11 items-center gap-2 rounded-full px-5 text-sm font-semibold"
                            >
                                <Plus className="h-4 w-4" aria-hidden />
                                {t("affiliateWelcome.createNewOrder")}
                            </Link>
                        )}
                        {affiliateLink ? (
                            <Link
                                to={paths.client.customOrderCreate}
                                className="inline-flex h-11 items-center gap-2 rounded-full border border-stone-200 bg-white px-5 text-sm font-semibold text-zinc-800 dark:border-white/12 dark:bg-white/8 dark:text-[#E8E4DC]"
                            >
                                <Plus className="h-4 w-4" aria-hidden />
                                {t("affiliateWelcome.createNewOrder")}
                            </Link>
                        ) : null}
                        <Link
                            to={paths.marketerDashboard}
                            className="inline-flex h-11 items-center gap-2 rounded-full px-4 text-sm font-semibold text-stone-600 dark:text-[#E8E4DC]/80"
                        >
                            <Wallet className="h-4 w-4" aria-hidden />
                            {t("affiliateWelcome.viewEarnings")}
                        </Link>
                    </div>
                </section>

                <section className="flex flex-col gap-3 rounded-2xl border border-stone-200/90 bg-[#FFFcf8] px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6 dark:border-white/10 dark:bg-[#24201C]">
                    <div className="flex min-w-0 items-start gap-3">
                        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-stone-100 text-stone-600 dark:bg-white/8 dark:text-[#E8E4DC]">
                            <MapPin className="h-5 w-5" strokeWidth={1.75} aria-hidden />
                        </span>
                        <div className="min-w-0">
                            <p className="text-[13px] font-medium text-stone-500 dark:text-[#E8E4DC]/70">
                                {t("affiliateWelcome.deliveryAddress")}
                            </p>
                            <p className="mt-0.5 truncate text-[0.98rem] font-semibold text-zinc-900 dark:text-[#E8E4DC]">
                                {addressLine || t("affiliateWelcome.notSet")}
                            </p>
                        </div>
                    </div>
                    <Link
                        to={addressHref}
                        className="inline-flex h-10 shrink-0 items-center justify-center rounded-full border border-stone-200 bg-white px-4 text-sm font-semibold text-zinc-800 dark:border-white/12 dark:bg-white/8 dark:text-[#E8E4DC]"
                    >
                        {selectedAddress
                            ? t("account.addresses.edit")
                            : t("affiliateWelcome.setAddress")}
                    </Link>
                </section>

                <section>
                    <h2 className="text-lg font-semibold text-zinc-900 dark:text-[#E8E4DC] sm:text-xl">
                        {t("affiliateWelcome.quickActions")}
                    </h2>
                    <p className="mt-1 text-sm text-stone-500 dark:text-[#E8E4DC]/70">
                        {t("affiliateWelcome.quickActionsHint")}
                    </p>
                    <div className="mt-4 overflow-hidden rounded-2xl border border-stone-200/90 bg-[#FFFcf8] dark:border-white/10 dark:bg-[#24201C]">
                        <AffiliateQuickActionsStage
                            actions={quickActions}
                            isLoading={quickActionsLoading}
                            isError={quickActionsError}
                            isRTL={isRTL}
                        />
                    </div>
                </section>
            </div>
        </div>
    );
}
