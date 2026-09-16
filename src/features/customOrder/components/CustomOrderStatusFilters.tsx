import { useTranslation } from "react-i18next";
import { cn } from "@/shared/lib/utils";
import {
  CUSTOM_ORDER_STATUS_FILTERS,
  type CustomOrderStatusFilter,
} from "../constants";

type CustomOrderStatusFiltersProps = {
  value: CustomOrderStatusFilter;
  onChange: (value: CustomOrderStatusFilter) => void;
  counts?: Partial<Record<CustomOrderStatusFilter, number>>;
};

export default function CustomOrderStatusFilters({
  value,
  onChange,
  counts,
}: CustomOrderStatusFiltersProps) {
  const { t } = useTranslation();

  return (
    <div
      className="mb-0 flex flex-wrap gap-2"
      role="tablist"
      aria-label={t("customOrder.filtersAriaLabel")}
    >
      {CUSTOM_ORDER_STATUS_FILTERS.map((key) => {
        const active = value === key;
        const count = counts?.[key];
        const label =
          key === "all"
            ? t("customOrder.filterAll")
            : t(`customOrder.status.${key}`);

        return (
          <button
            key={key}
            type="button"
            role="tab"
            aria-selected={active}
            aria-pressed={active}
            onClick={() => onChange(key)}
            className={cn(
              "inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all",
              active
                ? "bg-[var(--color-api-second)] text-custom-inverse shadow-sm"
                : "bg-[var(--color-bg-card)] text-custom-secondary border border-[var(--color-border-primary)] hover:border-[var(--color-border-accent)] hover:text-custom-primary"
            )}
          >
            {label}
            {typeof count === "number" && (
              <span
                className={cn(
                  "min-w-[1.25rem] rounded-full px-1.5 py-0.5 text-center text-[11px] font-semibold tabular-nums",
                  active
                    ? "bg-black/10 text-custom-inverse"
                    : "bg-[var(--color-bg-tertiary)] text-custom-secondary"
                )}
              >
                {count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
