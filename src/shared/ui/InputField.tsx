import { forwardRef } from "react";
import Label from "./Label";
import Input from "./Input";
import type { LabelProps } from "./Label";
import type { InputProps } from "./Input";
import type { FormError } from "@/types/forms";

export interface InputFieldProps
  extends Omit<InputProps, "error" | "helperText"> {
  label?: string;
  labelProps?: Omit<LabelProps, "children" | "htmlFor">;
  error?: FormError;
  helperText?: string;
  required?: boolean;
}

const InputField = forwardRef<HTMLInputElement, InputFieldProps>(
  (
    { label, labelProps, error, required, id, helperText, ...inputProps },
    ref
  ) => {
    const inputId = id || `input-${label?.toLowerCase().replace(/\s+/g, "-")}`;
    const errorMessage = error?.message as string | undefined;
    const hasError = !!error || !!errorMessage;

    return (
      <div className="space-y-2">
        {label && (
          <Label
            htmlFor={inputId}
            required={required}
            error={hasError}
            {...labelProps}
          >
            {label}
          </Label>
        )}
        <Input
          ref={ref}
          id={inputId}
          error={hasError}
          helperText={errorMessage || helperText}
          {...inputProps}
        />
      </div>
    );
  }
);

InputField.displayName = "InputField";

export default InputField;
