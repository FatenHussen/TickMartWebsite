import { useTranslation } from "react-i18next";
import { cn } from "@/shared/lib/utils";
import { isCancelledStatus, statusTranslationKey } from "../utils/customOrderHelpers";

type CustomOrderStatusBadgeProps = {
  status: string;
  className?: string;
};

const STATUS_STYLES: Record<string, string> = {
  pending_pricing:
    "bg-[color-mix(in_srgb,var(--color-warning)_16%,var(--color-bg-card))] text-[var(--color-warning)]",
  waiting_approval:
    "bg-[color-mix(in_srgb,var(--color-api-second)_14%,var(--color-bg-card))] text-[var(--color-api-second)]",
  approved:
    "bg-[color-mix(in_srgb,var(--color-success)_14%,var(--color-bg-card))] text-[var(--color-success)]",
  cancelled:
    "bg-[color-mix(in_srgb,var(--color-ui-red-500)_12%,var(--color-bg-card))] text-[var(--color-ui-red-500)]",
  cancelled_by_admin:
    "bg-[color-mix(in_srgb,var(--color-ui-red-500)_12%,var(--color-bg-card))] text-[var(--color-ui-red-500)]",
};

export default function CustomOrderStatusBadge({
  status,
  className,
}: CustomOrderStatusBadgeProps) {
  const { t } = useTranslation();
  const styleKey = isCancelledStatus(status) && !STATUS_STYLES[status] ? "cancelled" : status;

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold",
        STATUS_STYLES[styleKey] ?? "bg-custom-tertiary/60 text-custom-secondary",
        className
      )}
    >
      {t(statusTranslationKey(status), status)}
    </span>
  );
}
