import { PenLine, BadgeDollarSign, Truck } from "lucide-react";
import { useTranslation } from "react-i18next";
import { cn } from "@/shared/lib/utils";

const STEPS = [
  { key: "stepWrite", hintKey: "stepWriteHint", Icon: PenLine },
  { key: "stepPrice", hintKey: "stepPriceHint", Icon: BadgeDollarSign },
  { key: "stepDeliver", hintKey: "stepDeliverHint", Icon: Truck },
] as const;

type CustomOrderHowItWorksProps = {
  compact?: boolean;
  className?: string;
};

export default function CustomOrderHowItWorks({
  compact = false,
  className,
}: CustomOrderHowItWorksProps) {
  const { t } = useTranslation();

  return (
    <ol
      className={cn(
        "grid gap-2 sm:grid-cols-3 sm:gap-3",
        className
      )}
    >
      {STEPS.map(({ key, hintKey, Icon }, index) => (
        <li
          key={key}
          className={cn(
            "flex items-center gap-3 rounded-2xl border border-custom-primary/12 bg-custom-card px-3.5 text-start",
            compact ? "py-2.5" : "py-3.5"
          )}
        >
          <span className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[color-mix(in_srgb,var(--color-main)_12%,var(--color-bg-card))] text-[color:var(--color-main)]">
            <Icon className="h-5 w-5" aria-hidden />
            <span className="absolute -end-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-[color:var(--color-main)] px-1 text-[10px] font-bold text-custom-inverse">
              {index + 1}
            </span>
          </span>
          <span className="min-w-0">
            <span className="block text-sm font-semibold text-custom-primary">
              {t(`customOrder.homeBanner.${key}`)}
            </span>
            <span className="mt-0.5 block text-xs text-custom-secondary">
              {t(`customOrder.homeBanner.${hintKey}`)}
            </span>
          </span>
        </li>
      ))}
    </ol>
  );
}
