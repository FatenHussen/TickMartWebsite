import { forwardRef } from"react";

import { PremiumInlineLoader } from"@/shared/component/loading";
import { cn } from"@/shared/lib/utils";
import type { ButtonProps } from"@/types/forms";

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
 (
 {
 className,
 variant ="primary",
 size ="md",
 isLoading = false,
 leftIcon,
 rightIcon,
 fullWidth = false,
 disabled,
 children,
 ...props
 },
 ref
 ) => {
 const baseStyles =
"inline-flex items-center justify-center gap-2 font-semibold rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";

 const getVariantStyles = (variant: string) => {
 const base ="focus:ring-2 focus:ring-offset-2";

 switch (variant) {
 case"primary":
 return `${base} bg-primary hover:opacity-90 text-white focus:ring-primary`;
 case"secondary":
 return `${base} bg-secondary hover:opacity-90 text-text-primary focus:ring-secondary`;
 case"outline":
 return `${base} border-2 border-primary text-primary hover:bg-primary/10 focus:ring-primary bg-transparent`;
 case"ghost":
 return `${base} text-primary hover:bg-primary/10 focus:ring-primary bg-transparent`;
 case"danger":
 return `${base} bg-red hover:bg-red-600 text-white focus:ring-red`;
 default:
 return base;
 }
 };

 const sizes = {
 sm:"px-3 py-1.5 text-sm",
 md:"px-4 py-2.5 text-sm",
 lg:"px-6 py-3 text-base",
 };

 return (
 <button
 ref={ref}
 disabled={disabled || isLoading}
 className={cn(
 baseStyles,
 getVariantStyles(variant),
 sizes[size],
 fullWidth &&"w-full",
 isLoading &&"premium-btn-loading",
 className
 )}
 {...props}
 >
 {isLoading ? (
 <>
 <span className="sr-only">Loading</span>
 <PremiumInlineLoader size="sm" />
 </>
 ) : (
 <>
 {leftIcon && <span>{leftIcon}</span>}
 {children}
 {rightIcon && <span>{rightIcon}</span>}
 </>
 )}
 </button>
 );
 }
);

Button.displayName ="Button";

export default Button;
