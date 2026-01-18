import { cn } from "@/shared/lib/utils";

export type BadgeVariant = "primary" | "success" | "outline" | "warning";

export type StoreBadgeProps = {
  label: string;
  variant?: BadgeVariant;
};

const badgeStyles: Record<BadgeVariant, string> = {
  primary: "bg-sky-100 text-sky-700 border border-sky-200",
  success: "bg-emerald-100 text-emerald-700 border border-emerald-200",
  outline: "bg-white text-slate-700 border border-slate-200",
  warning: "bg-amber-100 text-amber-800 border border-amber-200",
};

export default function StoreBadge({ label, variant = "outline" }: StoreBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold transition-colors",
        badgeStyles[variant]
      )}
    >
      {label}
    </span>
  );
}

