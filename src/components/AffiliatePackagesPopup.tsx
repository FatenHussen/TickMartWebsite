import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { HiX, HiInformationCircle } from "react-icons/hi";
import { paths } from "@/app/routes/path/paths";
import { PremiumInlineLoader } from "@/shared/component/loading";
import type { PackageApi } from "@/features/account/types";
import {
    formatPackageDuration,
    formatPriceBillingSuffix,
} from "@/features/account/utils/formatPackageDuration";

const CARD_STYLES = [
    { border: "border-t-4 border-t-cyan-400", bg: "bg-blue-50 dark:bg-cyan-900/20" },
    { border: "border-2 border-amber-400", bg: "bg-amber-50 dark:bg-amber-900/20" },
    { border: "border-t-4 border-t-purple-400", bg: "bg-purple-50 dark:bg-purple-900/20" },
];

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
                className="fixed inset-0 bg-black/50 z-40"
                onClick={onClose}
                aria-hidden="true"
            />
            <div
                className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto"
                role="dialog"
                aria-modal="true"
                aria-labelledby="packages-popup-title"
            >
                <div
                    className="bg-custom-card rounded-2xl shadow-xl max-w-2xl w-full my-8 relative"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="flex items-start justify-between gap-4 p-6 pb-4">
                        <div className="flex items-center gap-2 flex-wrap">
                            <h2
                                id="packages-popup-title"
                                className="text-xl md:text-2xl font-bold text-custom-primary"
                            >
                                {t("packagesPopup.title", "Unlock More Savings Every Month")}
                            </h2>
                            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-400 text-custom-primary">
                                {t("packagesPopup.newBadge", "New")}
                            </span>
                        </div>
                        <button
                            type="button"
                            onClick={onClose}
                            className="p-2 rounded-lg hover:bg-custom-tertiary text-custom-secondary transition-colors"
                            aria-label={t("common.close")}
                        >
                            <HiX className="w-6 h-6" />
                        </button>
                    </div>

                    {/* Illustration */}
                    <div className="flex justify-center px-6 pb-4">
                        <div className="border-2 border-dashed border-custom-secondary rounded-xl p-3">
                            <img
                                src="/images/shared/packages.png"
                                alt=""
                                className="max-h-32 md:max-h-40 w-auto object-contain"
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
                    <div className="px-6 pb-4">
                        {isLoading ? (
                            <div className="flex justify-center py-8">
                                <PremiumInlineLoader size="md" />
                            </div>
                        ) : visiblePackages.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                {visiblePackages.map((pkg, idx) => {
                                    const style = CARD_STYLES[idx] ?? CARD_STYLES[0];
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
                                            className={`rounded-xl p-4 ${style.border} ${style.bg}`}
                                        >
                                            <h3 className="font-bold text-custom-primary mb-1 text-sm">
                                                {localizedName}
                                            </h3>
                                            <p className="text-xs text-custom-secondary mb-2">
                                                {duration}
                                            </p>
                                            <ul className="space-y-1 mb-4">
                                                {features.map((text, i) => (
                                                    <li key={i} className="text-xs text-custom-primary">
                                                        {text}
                                                    </li>
                                                ))}
                                            </ul>
                                            <div>
                                                <p className="text-base font-bold text-custom-primary">
                                                    {priceDisplay}
                                                </p>
                                                <p className="text-xs text-custom-secondary text-right">
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
                            className="flex items-center justify-center w-full py-3 px-6 bg-cyan-500 hover:bg-cyan-600 text-white font-semibold rounded-full transition-colors"
                        >
                            {t(
                                "packagesPopup.viewAll",
                                "View all subscription packages"
                            )}
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
