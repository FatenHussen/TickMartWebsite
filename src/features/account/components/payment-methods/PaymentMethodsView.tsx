import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useLanguage } from "@/context/LanguageContext";
import { usePaymentMethods } from "@/features/cart/hooks/usePaymentMethods";
import { paths } from "@/app/routes/path/paths";
import { usePaymentMethodPreference } from "./hooks/usePaymentMethodPreference";
import { getHowPaymentsWorkSteps } from "./utils/getHowPaymentsWorkSteps";
import { PaymentMethodsHeader } from "./components/PaymentMethodsHeader";
import { PaymentMethodOptionsList } from "./components/PaymentMethodOptionsList";
import { PaymentMethodsFootnote } from "./components/PaymentMethodsFootnote";
import { HowPaymentsWorkPanel } from "./components/HowPaymentsWorkPanel";

import illustrationSrc from "/images/accounts/PaymentMethods.png";

export default function PaymentMethodsView() {
    const { t } = useTranslation();
    const { isRTL } = useLanguage();
    const { methods, isLoading } = usePaymentMethods();

    const { selectedMethodId, defaultMethodId, selectMethod } =
        usePaymentMethodPreference(methods);

    const effectiveSelectedId = selectedMethodId || defaultMethodId;

    const pageTitle = t("account.paymentMethods.title", "Payment methods");
    const pageSubtitle = t(
        "account.paymentMethods.subtitle",
        "Choose how you prefer to pay for your orders.",
    );

    const defaultBadgeLabel = t("account.addresses.default", "Default");

    const footnoteText = t(
        "account.paymentMethods.note",
        "Available payment methods may change depending on your location and order type.",
    );

    const howPaymentsEyebrow = t(
        "account.paymentMethods.howPaymentsEyebrow",
        "Peace of mind",
    );
    const howPaymentsTitle = t(
        "account.paymentMethods.howPaymentsWork",
        "How payments work",
    );
    const howPaymentsIntro = t(
        "account.paymentMethods.howPaymentsIntro",
        "Your choice here is saved for checkout. Here is a quick overview before you place your next order.",
    );
    const checkoutCtaLabel = t(
        "account.paymentMethods.ctaCheckout",
        "Continue to checkout",
    );

    const howPaymentsWorkSteps = useMemo(
        () => getHowPaymentsWorkSteps(t),
        [t],
    );

    return (
        <div className="space-y-6" dir={isRTL ? "rtl" : "ltr"}>
            <PaymentMethodsHeader
                title={pageTitle}
                subtitle={pageSubtitle}
            />

            <PaymentMethodOptionsList
                methods={methods}
                isLoading={isLoading}
                effectiveSelectedId={effectiveSelectedId}
                defaultMethodId={defaultMethodId}
                defaultBadgeLabel={defaultBadgeLabel}
                onSelectMethod={selectMethod}
            />

            <PaymentMethodsFootnote text={footnoteText} />

            <HowPaymentsWorkPanel
                illustrationSrc={illustrationSrc}
                eyebrow={howPaymentsEyebrow}
                title={howPaymentsTitle}
                intro={howPaymentsIntro}
                checkoutPath={paths.client.checkout}
                checkoutCtaLabel={checkoutCtaLabel}
                timelineSteps={howPaymentsWorkSteps}
            />
        </div>
    );
}
