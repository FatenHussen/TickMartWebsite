import AnimatedButton from"@/shared/ui/AnimatedButton";
import { cn } from"@/shared/lib/utils";
import { HiBadgeCheck, HiCheckCircle, HiSparkles, HiStar } from"react-icons/hi";
import type { BadgeVariant } from"./StoreBadge";

type StorePerksProps = {
 perks: Array<{ label: string; variant?: BadgeVariant }>;
};

export default function StorePerks({ perks }: StorePerksProps) {
 if (!perks.length) return null;

 const getPerkIcon = (label: string, variant?: BadgeVariant) => {
 const normalized = label.toLowerCase();
 if (normalized.includes("recommend")) return HiStar;
 if (normalized.includes("verify")) return HiBadgeCheck;
 if (normalized.includes("accept")) return HiCheckCircle;
 if (variant === "success") return HiCheckCircle;
 return HiSparkles;
 };

 return (
 <div className="rounded-2xl border border-primary-light/20 bg-white/65 p-3.5 backdrop-blur-sm">
 <div className="mb-2 px-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-custom-tertiary">
 Highlights
 </div>
 <div className="flex flex-wrap items-center gap-2.5">
      {perks.map((perk) => {
        const Icon = getPerkIcon(perk.label, perk.variant);
        const variantClassName =
          perk.variant ==="success"
            ? "border border-emerald-300/70 bg-gradient-to-r from-emerald-500 to-green-500 text-white shadow-[0_10px_20px_-14px_rgba(16,185,129,0.9)]"
            : perk.variant ==="primary"
              ? "border border-primary-light/30 bg-gradient-to-r from-primary-light to-primary text-white shadow-[0_10px_20px_-14px_var(--color-shadow-accent)]"
              : perk.variant ==="warning"
                ? "border border-amber-300/70 bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-[0_10px_20px_-14px_rgba(245,158,11,0.9)]"
                : "border border-slate-200 bg-white text-slate-700";

        return (
          <AnimatedButton
            key={perk.label}
            type="button"
            variant="primary"
            size="sm"
            heightClassName="h-9"
            className={cn(
              "w-auto min-w-fit whitespace-nowrap px-4 text-xs font-semibold",
              variantClassName
            )}
            note={{
              primary: (
                <span className="inline-flex items-center gap-1.5">
                  <Icon className="h-3.5 w-3.5" />
                  {perk.label}
                </span>
              ),
              secondary: perk.label,
            }}
          />
        );
      })}
 </div>
 </div>
 );
}

