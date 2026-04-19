import { useTranslation } from "react-i18next";

type MyBasketsHeaderProps = {
    showDescription?: boolean;
};

export default function MyBasketsHeader({
    showDescription = true,
}: MyBasketsHeaderProps) {
    const { t } = useTranslation();

    return (
        <div className="mb-6">
            <h1 className="text-2xl font-bold text-custom-primary mb-1">
                {t("baskets.myBaskets")}
            </h1>
            {showDescription ? (
                <p className="text-sm text-custom-secondary">
                    {t("baskets.myBasketsDescription")}
                </p>
            ) : null}
        </div>
    );
}

