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
            <h1 className="mb-1 text-2xl font-bold text-custom-primary dark:text-[#FFFFFF]">
                {t("baskets.myBaskets")}
            </h1>
            {showDescription ? (
                <p className="text-sm text-custom-secondary dark:text-[#A1A1AA]">
                    {t("baskets.myBasketsDescription")}
                </p>
            ) : null}
        </div>
    );
}

