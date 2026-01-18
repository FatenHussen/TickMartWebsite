import { forwardRef } from "react";
import { cn } from "@/shared/lib/utils";

type SelectOption = {
  value: string;
  label: string;
};

type SelectProps = {
  options: SelectOption[];
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  className?: string;
  label?: string;
  disabled?: boolean;
};

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      options,
      value,
      onChange,
      placeholder,
      className,
      label,
      disabled = false,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      "px-4 py-2 rounded-lg border border-custom-primary bg-custom-primary text-custom-primary text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary-light focus:border-primary-light transition-all cursor-pointer hover:border-primary-light disabled:opacity-50 disabled:cursor-not-allowed";

    return (
      <div className="flex flex-col gap-2">
        {label && (
          <label className="text-sm font-medium text-custom-secondary whitespace-nowrap">
            {label}
          </label>
        )}
        <select
          ref={ref}
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          disabled={disabled}
          className={cn(baseStyles, className)}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    );
  }
);

Select.displayName = "Select";

export default Select;
