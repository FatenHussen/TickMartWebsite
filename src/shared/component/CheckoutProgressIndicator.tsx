import { useTranslation } from "react-i18next";
import ProgressIndicator from "./ProgressIndicator";
import type { ProgressStep } from "./ProgressIndicator";

type CheckoutProgressIndicatorProps = {
    currentStep?: "cart" | "checkout" | "review";
    className?: string;
};

export default function CheckoutProgressIndicator({
    currentStep = "cart",
    className = "",
}: CheckoutProgressIndicatorProps) {
    const { t } = useTranslation();

    const steps: ProgressStep[] = [
        {
            id: "cart",
            label: t("checkout.cart") || "Shopping cart",
        },
        {
            id: "checkout",
            label: t("checkout.checkoutTitle") || "Checkout details",
        },
        {
            id: "review",
            label: t("checkout.reviewConfirm") || "Review & confirm",
        },
    ];

    // Map step name to index
    const stepIndexMap: Record<string, number> = {
        cart: 0,
        checkout: 1,
        review: 2,
    };

    return (
        <ProgressIndicator
            steps={steps}
            currentStep={stepIndexMap[currentStep] ?? 0}
            className={className}
        />
    );
}
