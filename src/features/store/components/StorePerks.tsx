import AnimatedButton from"@/shared/ui/AnimatedButton";
import { cn } from"@/shared/lib/utils";
import { HiSparkles } from"react-icons/hi";
import type { BadgeVariant } from"./StoreBadge";

type StorePerksProps = {
 perks: Array<{ label: string; variant?: BadgeVariant }>;
};

export default function StorePerks({ perks }: StorePerksProps) {
 if (!perks.length) return null;

 return (
 <div className="flex flex-wrap items-center gap-2">
      {perks.map((perk) => {
        const variantClassName =
          perk.variant ==="success"
            ? "bg-emerald-500 text-white"
            : perk.variant ==="primary"
              ? "bg-sky-500 text-white"
              : perk.variant ==="warning"
                ? "bg-amber-500 text-white"
                : "bg-white text-slate-700 border border-slate-200";

        return (
          <AnimatedButton
            key={perk.label}
            type="button"
            variant="primary"
            size="sm"
            heightClassName="h-9"
            className={cn(
              "w-auto min-w-fit whitespace-nowrap px-4 text-xs font-semibold shadow-none",
              variantClassName
            )}
            note={{
              primary: (
                <span className="inline-flex items-center gap-1.5">
                  <HiSparkles className="h-3.5 w-3.5" />
                  {perk.label}
                </span>
              ),
              secondary: perk.label,
            }}
          />
        );
      })}
 </div>
 );
}

