import type { UserRole } from"@/features/auth/types";
import { useTheme } from"@/context/ThemeContext";
import { cn } from"@/shared/lib/utils";

type AuthRoleToggleProps = {
 role: UserRole;
 setRole: (r: UserRole) => void;
 t: (key: string) => string;
};

function AuthRoleToggle({ role, setRole, t }: AuthRoleToggleProps) {
 const { theme } = useTheme();
 const isDark = theme ==="dark";

 return (
 <div className="relative z-30 flex w-full min-w-0 gap-2">
 <button
 type="button"
 onClick={() => setRole("customer")}
 className={cn(
 "min-w-0 flex-1 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 sm:px-5",
 role ==="customer"
 ?"bg-primary text-[var(--color-text-inverse)] shadow-[0_8px_24px_-10px_color-mix(in_srgb,var(--color-main)_45%,transparent)]"
 : isDark
 ?"border border-[rgba(255,255,255,0.1)] bg-[rgba(255,255,255,0.04)] text-custom-secondary hover:bg-[rgba(255,255,255,0.07)] hover:text-custom-primary"
 :"bg-custom-card border border-primary text-primary hover:bg-primary/5"
 )}
 >
 {t("common.customer")}
 </button>
 <button
 type="button"
 onClick={() => setRole("seller")}
 className={cn(
 "min-w-0 flex-1 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 sm:px-5",
 role ==="seller"
 ?"bg-primary text-[var(--color-text-inverse)] shadow-[0_8px_24px_-10px_color-mix(in_srgb,var(--color-main)_45%,transparent)]"
 : isDark
 ?"border border-[rgba(255,255,255,0.1)] bg-[rgba(255,255,255,0.04)] text-custom-secondary hover:bg-[rgba(255,255,255,0.07)] hover:text-custom-primary"
 :"bg-custom-card border border-primary text-primary hover:bg-primary/5"
 )}
 >
 {t("common.seller")}
 </button>
 </div>
 );
}

export default AuthRoleToggle;
