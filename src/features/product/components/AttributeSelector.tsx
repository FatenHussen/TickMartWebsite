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
 <div className={cn("flex flex-col gap-2", className)}>
 {/* Label with selected value */}
 <label className="text-sm text-gray">
 {attribute.attribute}:{""}
 <span className="font-semibold text-text-primary">
 {isColorType ? selectedValue : selectedValue}
 </span>
 </label>

 {/* Options */}
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
"h-8 w-8 rounded-full transition-all",
"border-2",
 isSelected
 ?"border-text-primary ring-2 ring-text-primary ring-offset-2"
 :"border-custom-primary hover:border-custom-secondary",
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
"h-9 min-w-9 px-4 rounded-full text-sm font-medium transition-all",
 isSelected
 ? activeColor ==="teal"
 ?"bg-primary-light text-white"
 :"bg-gray-800 text-white dark:bg-[var(--color-main)] dark:text-[var(--color-text)]"
 :"bg-custom-tertiary text-custom-primary hover:bg-custom-muted",
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
