import { forwardRef, type InputHTMLAttributes } from"react";
import { cn } from"@/shared/lib/utils";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
 error?: boolean;
 helperText?: string;
 leftIcon?: React.ReactNode;
 rightIcon?: React.ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
 (
 {
 className,
 type ="text",
 error,
 helperText,
 leftIcon,
 rightIcon,
 ...props
 },
 ref
 ) => {
 return (
 <div className="w-full">
 <div className="relative">
 {leftIcon && (
 <div className="absolute left-3 top-1/2 -translate-y-1/2 text-custom-tertiary">
 {leftIcon}
 </div>
 )}
 <input
 type={type}
 ref={ref}
 className={cn(
"w-full rounded-lg border bg-custom-card px-4 py-2 text-sm",
"placeholder:text-custom-tertiary dark:placeholder:text-custom-secondary",
"focus:outline-none focus:ring-2 transition-colors",
 leftIcon &&"pl-10",
 rightIcon &&"pr-10",
 error
 ?"border-red-500 dark:border-red-400 focus:ring-red-500 dark:focus:ring-red-400 text-red-900 dark:text-red-100"
 :"border-custom-secondary focus:ring-cyan-dark dark:focus:ring-cyan-light text-text-primary dark:text-text-primary",
 className
 )}
 {...props}
 />
 {rightIcon && (
 <div className="absolute right-3 top-1/2 -translate-y-1/2 text-custom-tertiary">
 {rightIcon}
 </div>
 )}
 </div>
 {helperText && (
 <p
 className={cn(
"mt-1 text-xs",
 error
 ?"text-red-600 dark:text-red-400"
 :"text-custom-secondary"
 )}
 >
 {helperText}
 </p>
 )}
 </div>
 );
 }
);

Input.displayName ="Input";

export default Input;
