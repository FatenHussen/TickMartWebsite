import { HiClipboardCopy, HiExternalLink } from "react-icons/hi";
import { useTranslation } from "react-i18next";
import type { MarketerProfile } from "@/features/marketer/types";

interface MarketerAffiliateProfileCardProps {
    profile: MarketerProfile | undefined;
    isLoading: boolean;
    onCopyAffiliateLink: () => void;
}

export function MarketerAffiliateProfileCard({
    profile,
    isLoading,
    onCopyAffiliateLink,
}: MarketerAffiliateProfileCardProps) {
    const { t } = useTranslation();

    if (!isLoading && !profile) {
        return null;
    }

    return (
        <div className="rounded-2xl border border-white/20 bg-[var(--color-api-second)] p-6 text-white shadow-lg">
            {isLoading ? (
                <div className="space-y-3 animate-pulse">
                    <div className="h-5 w-1/3 rounded bg-white/25" />
                    <div className="h-4 w-2/3 rounded bg-white/20" />
                </div>
            ) : profile ? (
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <span className="text-sm text-white/85">
                                {t("marketer.dashboard.affiliateId", "Affiliate ID")}:
                            </span>
                            <span className="text-lg font-bold">{profile.affiliate_id}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-sm text-white/85">
                                {t("marketer.dashboard.commissionRate", "Commission Rate")}:
                            </span>
                            <span className="text-xl font-bold">{profile.rate}%</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-sm text-white/85">
                                {t("marketer.dashboard.totalVisits", "Total Visits")}:
                            </span>
                            <span className="font-semibold">{profile.total_visites.toLocaleString()}</span>
                        </div>
                        {profile.coupon && (
                            <div className="flex items-center gap-2">
                                <span className="text-sm text-white/85">
                                    {t("marketer.dashboard.couponCode", "Coupon")}:
                                </span>
                                <span className="rounded bg-white/20 px-2 py-0.5 font-bold">{profile.coupon.code}</span>
                            </div>
                        )}
                    </div>

                    <div className="flex flex-col gap-2">
                        <button
                            type="button"
                            onClick={onCopyAffiliateLink}
                            className="flex items-center gap-2 rounded-xl bg-white/20 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-white/30"
                        >
                            <HiClipboardCopy className="h-4 w-4 shrink-0" aria-hidden />
                            {t("marketer.dashboard.copyLink", "Copy Affiliate Link")}
                        </button>
                        <a
                            href={profile.affiliate_link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 rounded-xl bg-white/10 px-4 py-2.5 text-sm text-white transition-colors hover:bg-white/20"
                        >
                            <HiExternalLink className="h-4 w-4 shrink-0" aria-hidden />
                            {t("marketer.dashboard.viewLink", "View Link")}
                        </a>
                    </div>
                </div>
            ) : null}
        </div>
    );
}
