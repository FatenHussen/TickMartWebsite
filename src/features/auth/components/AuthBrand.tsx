import { cn } from "@/shared/lib/utils";

type AuthBrandProps = {
    /** Extra classes for the wrapper (e.g. spacing) */
    className?: string;
    /** Logo size */
    size?: "sm" | "md";
};

/**
 * Shared brand lockup for auth pages — one consistent identity across
 * sign-in, sign-up, OTP, forgot/change password. Uses the palette-driven
 * logo asset so it always matches the active theme.
 */
export default function AuthBrand({ className, size = "md" }: AuthBrandProps) {
    const dim = size === "sm" ? "h-9" : "h-11";

    return (
        <div className={cn("flex items-center justify-center", className)}>
            <img
                src="/images/shared/logo.png"
                alt="Logo"
                className={cn(dim, "w-auto object-contain")}
            />
        </div>
    );
}
