import { forwardRef } from"react";
import Label from"./Label";
import { cn } from"@/shared/lib/utils";
import type { LabelProps } from"./Label";
import type { FormError } from"@/types/forms";

export interface SelectOption {
 value: string | number;
 label: string;
 disabled?: boolean;
}

export interface SelectProps extends Omit<
 React.SelectHTMLAttributes<HTMLSelectElement>,
"children"
> {
 label?: string;
 labelProps?: Omit<LabelProps,"children"|"htmlFor">;
 error?: FormError;
 helperText?: string;
 required?: boolean;
 options: SelectOption[];
 placeholder?: string;
 isLoadingMore?: boolean;
 loadingMoreText?: string;
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
 (
 {
 label,
 labelProps,
 error,
 required,
 id,
 helperText,
 options,
 placeholder,
 className,
 disabled,
 isLoadingMore,
 loadingMoreText ="Loading…",
 ...selectProps
 },
 ref,
 ) => {
 const selectId =
 id || `select-${label?.toLowerCase().replace(/\s+/g,"-")}`;
 const errorMessage = error?.message as string | undefined;
 const hasError = !!error || !!errorMessage;

 return (
 <div className="space-y-2">
 {label && (
 <Label
 htmlFor={selectId}
 required={required}
 error={hasError}
 {...labelProps}
 >
 {label}
 </Label>
 )}
 <select
 ref={ref}
 id={selectId}
 disabled={disabled}
 className={cn(
"w-full px-4 py-2.5 rounded-lg border bg-custom-card dark:bg-bg-primary text-text-primary focus:outline-none focus:ring-2 focus:ring-[#4CDAF6] focus:border-transparent transition-all disabled:opacity-50 disabled:cursor-not-allowed",
 hasError ?"border-red-500 focus:ring-red-500":"border-[#4CDAF6]",
 className,
 )}
 {...selectProps}
 >
 {placeholder && (
 <option value=""disabled>
 {placeholder}
 </option>
 )}
 {options.map((option) => (
 <option
 key={option.value}
 value={option.value}
 disabled={option.disabled}
 >
 {option.label}
 </option>
 ))}
 {isLoadingMore && (
 <option value=""disabled>
 {loadingMoreText}
 </option>
 )}
 </select>
 {errorMessage && (
 <p className="text-sm text-red-600 dark:text-red-400">
 {errorMessage}
 </p>
 )}
 {helperText && !errorMessage && (
 <p className="text-sm text-text-secondary">{helperText}</p>
 )}
 </div>
 );
 },
);

Select.displayName ="Select";

export default Select;
