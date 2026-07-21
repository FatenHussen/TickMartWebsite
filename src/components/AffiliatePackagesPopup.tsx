import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { HiX, HiInformationCircle } from "react-icons/hi";
import { HiCheckCircle, HiSparkles } from "react-icons/hi2";
import type { CSSProperties } from "react";
import { paths } from "@/app/routes/path/paths";
import { cn } from "@/shared/lib/utils";
import { PremiumInlineLoader } from "@/shared/component/loading";
import type { PackageApi } from "@/features/account/types";
import {
    formatPackageDuration,
    formatPriceBillingSuffix,
} from "@/features/account/utils/formatPackageDuration";

/**
 * Per-tier accent derived entirely from the API palette
 * (`--color-main` / `--color-api-second`), so cards stay on-brand.
 * The middle tier is featured (highlighted + "Most popular").
 */
const TIER_ACCENTS = [
    "var(--color-main)",
    "var(--color-api-second)",
    "color-mix(in srgb, var(--color-main) 45%, var(--color-api-second))",
] as const;

type AffiliatePackagesPopupProps = {
    isOpen: boolean;
    onClose: () => void;
    packages: PackageApi[];
    isLoading?: boolean;
};

export default function AffiliatePackagesPopup({
    isOpen,
    onClose,
    packages,
    isLoading = false,
}: AffiliatePackagesPopupProps) {
    const { t, i18n } = useTranslation();

    const visiblePackages = packages.slice(0, 3);

    if (!isOpen) return null;

    return (
        <>
            <div
                className="fixed inset-0 bg-black/50 z-[60]"
                onClick={onClose}
                aria-hidden="true"
            />
            <div
                className="fixed inset-0 z-[70] flex items-center justify-center p-4 overflow-y-auto"
                role="dialog"
                aria-modal="true"
                aria-labelledby="packages-popup-title"
            >
                <div
                    className="bg-custom-card rounded-3xl shadow-2xl max-w-2xl w-full my-8 relative overflow-hidden"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Ambient brand glow */}
                    <div
                        className="pointer-events-none absolute inset-x-0 top-0 h-56 bg-gradient-to-b from-[color-mix(in_srgb,var(--color-main)_14%,transparent)] via-[color-mix(in_srgb,var(--color-api-second)_6%,transparent)] to-transparent"
                        aria-hidden
                    />
                    <div
                        className="pointer-events-none absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-[var(--color-main)] via-[var(--color-api-second)] to-[var(--color-main)]"
                        aria-hidden
                    />

                    {/* Header */}
                    <div className="relative flex items-start justify-between gap-4 p-6 pb-4">
                        <div className="flex items-center gap-2 flex-wrap">
                            <h2
                                id="packages-popup-title"
                                className="text-xl md:text-2xl font-bold text-custom-primary"
                            >
                                {t("packagesPopup.title", "Unlock More Savings Every Month")}
                            </h2>
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold text-[var(--color-text-inverse)] bg-gradient-to-r from-[var(--color-main)] to-[var(--color-api-second)] shadow-sm">
                                <HiSparkles className="w-3 h-3" />
                                {t("packagesPopup.newBadge", "New")}
                            </span>
                        </div>
                        <button
                            type="button"
                            onClick={onClose}
                            className="p-2 rounded-full hover:bg-custom-tertiary text-custom-secondary transition-colors"
                            aria-label={t("common.close")}
                        >
                            <HiX className="w-6 h-6" />
                        </button>
                    </div>

                    {/* Illustration */}
                    <div className="relative flex justify-center px-6 pb-4">
                        <div className="relative rounded-2xl border-2 border-dashed border-[color-mix(in_srgb,var(--color-main)_30%,var(--color-border-primary))] bg-[color-mix(in_srgb,var(--color-main)_5%,var(--color-bg-card))] p-4">
                            <div
                                className="pointer-events-none absolute inset-0 rounded-2xl bg-[radial-gradient(circle_at_50%_35%,color-mix(in_srgb,var(--color-main)_18%,transparent),transparent_70%)]"
                                aria-hidden
                            />
                            <img
                                src="/images/shared/packages.png"
                                alt=""
                                className="relative max-h-32 md:max-h-40 w-auto object-contain"
                            />
                        </div>
                    </div>

                    {/* Description */}
                    <p className="text-sm text-custom-secondary px-6 pb-5 text-center">
                        {t(
                            "packagesPopup.description",
                            "Subscribe to a monthly package and get extra discounts, free deliveries, and bonus points on every order."
                        )}
                    </p>

                    {/* Package Cards */}
                    <div className="relative px-6 pb-4">
                        {isLoading ? (
                            <div className="flex justify-center py-8">
                                <PremiumInlineLoader size="md" />
                            </div>
                        ) : visiblePackages.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 pt-3 items-stretch">
                                {visiblePackages.map((pkg, idx) => {
                                    const accent = TIER_ACCENTS[idx] ?? TIER_ACCENTS[0];
                                    const featured = idx === 1;
                                    const localizedName =
                                        typeof pkg.name === "string"
                                            ? pkg.name
                                            : i18n.language === "ar"
                                              ? pkg.name.ar
                                              : pkg.name.en;
                                    const priceDisplay = pkg.price_formatted ?? `${pkg.currency_symbol ?? ""}${pkg.price}`;
                                    const duration = formatPackageDuration(pkg.duration_days, t);
                                    const pricePeriodSuffix = formatPriceBillingSuffix(
                                        pkg.duration_days,
                                        t,
                                    );
                                    const features = [
                                        t("packages.features.discountPercent", { percent: pkg.discount_percentage }),
                                        t("packages.features.freeDeliveriesCount", { count: pkg.free_delivery_count }),
                                        !pkg.monthly_orders_limit || pkg.monthly_orders_limit >= 999
                                            ? t("packages.features.unlimitedOrders")
                                            : t("packages.features.ordersUpTo", { count: pkg.monthly_orders_limit }),
                                        t("packages.features.bonusPointsCount", { count: pkg.points_bonus }),
                                    ];
                                    return (
                                        <div
                                            key={pkg.id}
                                            style={{ "--tier": accent } as CSSProperties}
                                            className={cn(
                                                "group relative flex flex-col rounded-2xl p-4 transition-transform duration-300 motion-reduce:transition-none",
                                                "border bg-[color-mix(in_srgb,var(--tier)_7%,var(--color-bg-card))]",
                                                featured
                                                    ? "border-transparent ring-2 ring-[var(--tier)] shadow-[0_20px_45px_-20px_var(--tier)] sm:-translate-y-1 sm:hover:-translate-y-2"
                                                    : "border-[color-mix(in_srgb,var(--tier)_35%,var(--color-border-primary))] hover:-translate-y-1",
                                            )}
                                        >
                                            {/* Top accent bar */}
                                            <span
                                                className="pointer-events-none absolute inset-x-0 top-0 h-1.5 rounded-t-2xl bg-[var(--tier)]"
                                                aria-hidden
                                            />
                                            {featured && (
                                                <span className="absolute -top-3 start-1/2 -translate-x-1/2 rtl:translate-x-1/2 inline-flex items-center gap-1 whitespace-nowrap rounded-full bg-gradient-to-r from-[var(--color-main)] to-[var(--color-api-second)] px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-[var(--color-text-inverse)] shadow-md">
                                                    <HiSparkles className="h-3 w-3" />
                                                    {t("packagesPopup.mostPopular", "Most popular")}
                                                </span>
                                            )}

                                            <h3 className="mt-2 font-extrabold text-custom-primary text-base">
                                                {localizedName}
                                            </h3>
                                            <p className="text-xs text-custom-secondary mb-3">
                                                {duration}
                                            </p>
                                            <ul className="space-y-2 mb-4">
                                                {features.map((text, i) => (
                                                    <li
                                                        key={i}
                                                        className="flex items-start gap-2 text-xs text-custom-primary"
                                                    >
                                                        <HiCheckCircle className="mt-px h-4 w-4 shrink-0 text-[var(--tier)]" />
                                                        <span>{text}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                            <div className="mt-auto flex items-baseline gap-1">
                                                <p className="text-2xl font-black text-custom-primary">
                                                    {priceDisplay}
                                                </p>
                                                <p className="text-xs font-medium text-custom-secondary">
                                                    {pricePeriodSuffix}
                                                </p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : null}
                    </div>

                    {/* Info text */}
                    <div className="flex items-start gap-2 px-6 pb-4">
                        <HiInformationCircle className="w-4 h-4 text-custom-secondary shrink-0 mt-0.5" />
                        <p className="text-xs text-custom-secondary">
                            {t(
                                "packagesPopup.infoText",
                                "You can change or cancel your package any time from your account settings."
                            )}
                        </p>
                    </div>

                    {/* Actions */}
                    <div className="px-6 pb-6 space-y-2">
                        <Link
                            to={paths.account.packages}
                            onClick={onClose}
                            className="group relative flex items-center justify-center w-full py-3.5 px-6 overflow-hidden bg-gradient-to-r from-[var(--color-main)] to-[var(--color-api-second)] text-[var(--color-text-inverse)] font-bold rounded-full shadow-[0_16px_38px_-14px_color-mix(in_srgb,var(--color-main)_65%,transparent)] transition hover:brightness-110 active:scale-[0.99] motion-reduce:transition-none motion-reduce:active:scale-100"
                        >
                            <span
                                className="pointer-events-none absolute inset-y-0 -start-1/3 w-1/3 -skew-x-12 bg-white/25 blur-md transition-transform duration-700 group-hover:translate-x-[380%] motion-reduce:transition-none"
                                aria-hidden
                            />
                            <span className="relative">
                                {t(
                                    "packagesPopup.viewAll",
                                    "View all subscription packages"
                                )}
                            </span>
                        </Link>
                        <p className="text-center text-xs text-custom-secondary">
                            {t(
                                "packagesPopup.seeFullDetails",
                                "See full details and choose the right plan for you."
                            )}
                        </p>
                        <button
                            type="button"
                            onClick={onClose}
                            className="block w-full text-sm text-custom-secondary underline hover:text-custom-primary text-center"
                        >
                            {t("packagesPopup.maybeLater", "Maybe later")}
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}
