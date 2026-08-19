import { useTranslation } from "react-i18next";
import RouteErrorFallback from "@/shared/component/RouteErrorFallback";

/** `errorElement` for `/product/:productId`. */
export default function ProductErrorFallback() {
    const { t } = useTranslation();

    return (
        <RouteErrorFallback
            title={t("product.errorTitle", "Could not load this product")}
            description={t(
                "product.errorDescription",
                "An unexpected problem stopped this product page from loading. Please try again.",
            )}
        />
    );
}
