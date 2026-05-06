import type { TFunction } from "i18next";

type PointsRewardsHeaderProps = {
    t: TFunction;
};

export function PointsRewardsHeader({ t }: PointsRewardsHeaderProps) {
    return (
        <header className="space-y-2 border-b border-[var(--color-border-primary)] pb-6">
            <h1 className="text-2xl font-bold tracking-tight text-custom-primary sm:text-3xl">
                {t("account.pointsRewards.title")}
            </h1>
            <p className="max-w-2xl text-sm leading-relaxed text-custom-secondary sm:text-base">
                {t("account.pointsRewards.description")}
            </p>
        </header>
    );
}
