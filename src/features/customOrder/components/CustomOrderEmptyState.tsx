import { Zap } from "lucide-react";
import { useTranslation } from "react-i18next";
import Button from "@/shared/ui/Button";
import CustomOrderHowItWorks from "./CustomOrderHowItWorks";

type CustomOrderEmptyStateProps = {
  filtered: boolean;
  onCreate: () => void;
  onViewAll: () => void;
};

export default function CustomOrderEmptyState({
  filtered,
  onCreate,
  onViewAll,
}: CustomOrderEmptyStateProps) {
  const { t } = useTranslation();

  if (filtered) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center rounded-2xl border border-dashed border-custom-primary/20 bg-custom-card px-6 py-16 text-center">
        <p className="text-base font-semibold text-custom-primary">
          {t("customOrder.emptyFiltered")}
        </p>
        <p className="mt-2 max-w-md text-sm text-custom-secondary">
          {t("customOrder.emptyFilteredHint")}
        </p>
        <Button
          type="button"
          variant="outline"
          className="mt-5 min-h-11 rounded-xl px-5"
          onClick={onViewAll}
        >
          {t("customOrder.viewAllRequests")}
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col items-center justify-center rounded-2xl border border-dashed border-custom-primary/20 bg-custom-card px-6 py-12 text-center sm:py-16">
      <span className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[color-mix(in_srgb,var(--color-main)_16%,var(--color-bg-card))] text-[color:var(--color-main)]">
        <Zap className="h-7 w-7" aria-hidden />
      </span>
      <h2 className="text-xl font-bold text-custom-primary">
        {t("customOrder.empty")}
      </h2>
      <p className="mt-2 max-w-lg text-sm text-custom-secondary">
        {t("customOrder.emptyHint")}
      </p>
      <CustomOrderHowItWorks className="mt-6 w-full max-w-3xl text-start" />
      <Button
        type="button"
        variant="primary"
        className="mt-8 min-h-11 rounded-xl px-6"
        onClick={onCreate}
      >
        {t("customOrder.newRequest")}
      </Button>
    </div>
  );
}
