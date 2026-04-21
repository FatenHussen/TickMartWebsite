import { Inbox } from "lucide-react";
import { useTranslation } from "react-i18next";

export function OrdersTableEmptyState() {
    const { t } = useTranslation();

    return (
        <tr>
            <td colSpan={7} className="px-4 py-14 sm:px-6 sm:py-16">
                <div className="mx-auto flex max-w-md flex-col items-center text-center">
                    <div
                        className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-[color-mix(in_srgb,var(--color-api-second)_14%,var(--color-bg-muted))] text-[var(--color-api-second)] shadow-inner ring-4 ring-[color-mix(in_srgb,var(--color-api-second)_10%,transparent)]"
                        aria-hidden
                    >
                        <Inbox className="h-8 w-8 opacity-90" />
                    </div>
                    <p className="text-base font-semibold text-text-primary">
                        {t("marketer.dashboard.noOrdersTitle", "Nothing here yet")}
                    </p>
                    <p className="mt-2 text-sm leading-relaxed text-text-secondary">
                        {t(
                            "marketer.dashboard.noOrdersHint",
                            "When a customer checks out with your affiliate link or coupon, their order will appear in this list with your commission.",
                        )}
                    </p>
                </div>
            </td>
        </tr>
    );
}
