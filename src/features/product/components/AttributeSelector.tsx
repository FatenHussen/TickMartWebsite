import { cn } from "@/shared/lib/utils";
import { cssColorForAttributeLabel } from "../lib/attributeValueColor";
import type { AttributeOption } from "../types";

export type { AttributeOption };

export interface AttributeSelectorProps {
 attribute: AttributeOption;
 selectedValue?: string;
 onValueChange?: (value: string) => void;
 activeColor?:"dark"|"teal";
 className?: string;
}

export default function AttributeSelector({
 attribute,
 selectedValue,
 onValueChange,
 activeColor ="teal",
 className,
}: AttributeSelectorProps) {
 const isColorType = attribute.type ==="color";
 const disabledValues = attribute.disabledValues || [];

 return (
 <div className={cn("flex flex-col gap-2.5", className)}>
 <label className="text-sm text-custom-secondary">
 {attribute.attribute}
 {selectedValue ? (
  <>
   {": "}
   <span className="font-semibold text-text-primary">{selectedValue}</span>
  </>
 ) : null}
 </label>

 <div className="flex flex-wrap items-center gap-2">
 {attribute.values.map((value, index) => {
 const isSelected = selectedValue === value;
 const isDisabled = disabledValues.includes(value);

 if (isColorType) {
 // Color selector — names from attributes_map (no hex in shop_variants)
 return (
 <button
 key={value}
 type="button"
 onClick={() => !isDisabled && onValueChange?.(value)}
 disabled={isDisabled}
 className={cn(
"h-9 w-9 rounded-full transition-all",
"border-2",
 isSelected
 ?"border-text-primary ring-2 ring-primary/35 ring-offset-2 ring-offset-[var(--color-bg-primary)]"
 :"border-black/10 hover:border-black/25 dark:border-white/20",
 isDisabled &&"opacity-30 cursor-not-allowed"
 )}
 style={{ backgroundColor: cssColorForAttributeLabel(index, value) }}
 aria-label={`Select color ${value}`}
 title={value}
 />
 );
 }

 // Size / square selector – rounded pill buttons
 return (
 <button
 key={value}
 type="button"
 onClick={() => !isDisabled && onValueChange?.(value)}
 disabled={isDisabled}
 className={cn(
"h-10 min-w-10 rounded-lg px-3.5 text-sm font-medium transition-all",
 isSelected
 ? activeColor ==="teal"
 ?"bg-primary text-white ring-2 ring-primary/25"
 :"bg-gray-800 text-white dark:bg-[var(--color-main)] dark:text-[var(--color-text)]"
 :"bg-custom-card text-custom-primary ring-1 ring-black/8 hover:ring-black/16 dark:ring-white/10 dark:hover:ring-white/20",
 isDisabled &&"opacity-30 cursor-not-allowed"
 )}
 aria-label={`Select ${attribute.attribute} ${value}`}
 >
 {value}
 </button>
 );
 })}
 </div>
 </div>
 );
}
