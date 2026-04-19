import type { TFunction } from "i18next";

/**
 * Copy for the “How payments work” timeline (i18n keys under account.paymentMethods).
 */
export function getHowPaymentsWorkSteps(t: TFunction): string[] {
    return [
        t(
            "account.paymentMethods.howPaymentsWork1",
            "Cash on delivery is available for selected stores and areas.",
        ),
        t(
            "account.paymentMethods.howPaymentsWork2",
            "Online payment uses the gateways and wallets configured by the platform.",
        ),
        t(
            "account.paymentMethods.howPaymentsWork3",
            "The final list of options will always appear on the checkout page before you confirm.",
        ),
    ];
}
