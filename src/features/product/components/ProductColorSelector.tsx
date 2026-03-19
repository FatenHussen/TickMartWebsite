import { useTranslation } from"react-i18next";
import { cn } from"@/shared/lib/utils";
import Button from"@/shared/ui/Button";
import type { ColorOption } from"../types";

export type { ColorOption };

export type ProductColorSelectorProps = {
 colors: ColorOption[];
 selectedColorId?: string;
 onColorChange?: (colorId: string) => void;
 label?: string;
 className?: string;
};

export default function ProductColorSelector({
 colors,
 selectedColorId,
 onColorChange,
 label,
 className,
}: ProductColorSelectorProps) {
 const { t } = useTranslation();
 const defaultLabel = label || t("product.color");
 const selectedName = colors.find((c) => c.id === selectedColorId)?.name ||"";

 return (
 <div className={cn("flex flex-col gap-3", className)}>
 <label className="text-sm font-semibold text-gray-light">
 {defaultLabel}{""}
 <span className="font-bold text-text-primary">{selectedName}</span>
 </label>

 <div className="flex items-center gap-3">
 {colors.map((color) => {
 const isSelected = selectedColorId === color.id;

 return (
 <Button
 key={color.id}
 type="button"
 variant="ghost"
 size="sm"
 onClick={() => onColorChange?.(color.id)}
 className={cn(
"h-6 w-6 p-0 rounded-full transition-transform",
"ring-1 ring-slate-200 hover:scale-110",
 isSelected &&"ring-2 ring-slate-900"
 )}
 style={
 !color.isImage ? { backgroundColor: color.value } : undefined
 }
 aria-label={`Select color ${color.name}`}
 title={color.name}
 >
 {color.isImage && (
 <img
 src={color.value}
 alt={color.name}
 className="h-full w-full rounded-full object-cover"
 />
 )}
 </Button>
 );
 })}
 </div>
 </div>
 );
}
