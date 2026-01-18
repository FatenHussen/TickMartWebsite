import { cn } from "@/shared/lib/utils";

export type BadgeProps = {
  label: string;
  variant?: "default" | "blue" | "yellow" | "green" | "red" | "gray";
  className?: string;
};

const variantStyles = {
  default: "bg-blue-500 text-white",
  blue: "bg-blue-500 text-white",
  yellow: "bg-yellow-400 text-black",
  green: "bg-green-500 text-white",
  red: "bg-red-500 text-white",
  gray: "bg-gray-500 text-white",
};

export default function Badge({
  label,
  variant = "default",
  className,
}: BadgeProps) {
  return (
    <span
      className={cn(
        "rounded-lg px-2.5 py-1 text-xs font-semibold",
        className || variantStyles[variant]
      )}
    >
      {label}
    </span>
  );
}
