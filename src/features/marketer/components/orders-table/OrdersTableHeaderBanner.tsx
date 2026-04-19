import { HiShoppingBag } from "react-icons/hi";
import { useTranslation } from "react-i18next";

export function OrdersTableHeaderBanner() {
    const { t } = useTranslation();

    return (
        <div className="relative overflow-hidden border-b border-custom-primary bg-[color-mix(in_srgb,var(--color-api-second)_9%,var(--color-bg-card))] px-5 py-5 sm:px-6 sm:py-6">
            <div className="pointer-events-none absolute -right-6 -top-10 h-28 w-28 rounded-full bg-[var(--color-api-second)] opacity-[0.14] blur-2xl" />
            <div className="pointer-events-none absolute -bottom-8 start-1/4 h-20 w-20 rounded-full bg-[var(--color-main)] opacity-[0.08] blur-2xl" />
            <div className="relative flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-start gap-3 sm:items-center">
                    <div
                        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[color-mix(in_srgb,var(--color-api-second)_18%,var(--color-bg-card))] text-[var(--color-main)] shadow-sm ring-1 ring-[color-mix(in_srgb,var(--color-api-second)_30%,transparent)]"
                        aria-hidden
                    >
                        <HiShoppingBag className="h-5 w-5" />
                    </div>
                    <div className="min-w-0 space-y-1">
                        <h3 className="text-lg font-bold tracking-tight text-text-primary">
                            {t("marketer.dashboard.recentOrders", "Recent Orders")}
                        </h3>
                        <p className="max-w-xl text-sm leading-relaxed text-text-secondary">
                            {t(
                                "marketer.dashboard.recentOrdersHint",
                                "See who ordered through your link or coupon — names, totals, and your commission in one place.",
                            )}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
