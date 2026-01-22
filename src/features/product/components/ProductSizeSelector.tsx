import { useTranslation } from "react-i18next";
import { cn } from "@/shared/lib/utils";
import Button from "@/shared/ui/Button";
import type { SizeOption } from "../types";

export type { SizeOption };

export type ProductSizeSelectorProps = {
  sizes: SizeOption[];
  selectedSizeId?: string;
  onSizeChange?: (sizeId: string) => void;
  label?: string;
  className?: string;
};

export default function ProductSizeSelector({
  sizes,
  selectedSizeId,
  onSizeChange,
  label,
  className,
}: ProductSizeSelectorProps) {
  const { t } = useTranslation();
  const defaultLabel = label || t("product.size");
  const selectedLabel = sizes.find((s) => s.id === selectedSizeId)?.label || "";

  return (
    <div className={cn("flex flex-col gap-3", className)}>
      <label className="text-sm font-semibold text-gray-light">
        {defaultLabel}{" "}
        <span className="font-bold text-text-primary">{selectedLabel}</span>
      </label>

      <div className="flex flex-wrap items-center gap-2">
        {sizes.map((size) => {
          const isSelected = selectedSizeId === size.id;
          const isAvailable = size.available !== false;

          return (
            <Button
              key={size.id}
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => isAvailable && onSizeChange?.(size.id)}
              disabled={!isAvailable}
              className={cn(
                "h-10 w-10 p-0 rounded-full border text-sm font-semibold transition-all",
                isSelected
                  ? "border-text-primary bg-gray-bold text-text-primary"
                  : isAvailable
                  ? "border-custom-secondary text-text-primary hover:border-custom-secondary bg-custom-primary"
                  : "cursor-not-allowed border-custom-primary bg-custom-light text-custom-tertiary"
              )}
              aria-label={`Select size ${size.label}`}
            >
              {size.label}
            </Button>
          );
        })}
      </div>
    </div>
  );
}
