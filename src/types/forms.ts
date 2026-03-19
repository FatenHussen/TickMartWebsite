import type { ButtonHTMLAttributes } from"react";

export type RHFFieldError = import("react-hook-form").FieldError;
export type RHFFieldErrorsImpl = import("react-hook-form").FieldErrorsImpl<any>;
export type RHFMerge = import("react-hook-form").Merge<
 RHFFieldError,
 RHFFieldErrorsImpl
>;

export type FormError = RHFFieldError | RHFMerge | undefined;

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
 variant?:"primary"|"secondary"|"outline"|"ghost"|"danger";
 size?:"sm"|"md"|"lg";
 isLoading?: boolean;
 leftIcon?: React.ReactNode;
 rightIcon?: React.ReactNode;
 fullWidth?: boolean;
}
