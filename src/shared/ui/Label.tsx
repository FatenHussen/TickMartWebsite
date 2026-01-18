import { forwardRef, type LabelHTMLAttributes } from "react";
import { cn } from "@/shared/lib/utils";

export interface LabelProps extends LabelHTMLAttributes<HTMLLabelElement> {
  required?: boolean;
  error?: boolean;
}

const Label = forwardRef<HTMLLabelElement, LabelProps>(
  ({ className, children, required, error, ...props }, ref) => {
    return (
      <label
        ref={ref}
        className={cn(
          "block text-sm font-medium",
          error
            ? "text-red-600 dark:text-red-400"
            : "text-gray-700 dark:text-gray-300",
          className
        )}
        {...props}
      >
        {children}
        {required && (
          <span className="ml-1 text-red-500 dark:text-red-400">*</span>
        )}
      </label>
    );
  }
);

Label.displayName = "Label";

export default Label;
