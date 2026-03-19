import type { UserRole } from"@/features/auth/types";

type AuthRoleToggleProps = {
 role: UserRole;
 setRole: (r: UserRole) => void;
 t: (key: string) => string;
};

function AuthRoleToggle({ role, setRole, t }: AuthRoleToggleProps) {
 return (
 <div className="relative z-30 flex gap-2">
 <button
 type="button"
 onClick={() => setRole("customer")}
 className={`flex-1 rounded-xl py-2.5 px-5 text-sm font-medium transition-all w-3xs ${
 role ==="customer"
 ?"bg-primary text-white"
 :"bg-custom-card border border-primary text-primary hover:bg-primary/5"
 }`}
 >
 {t("common.customer")}
 </button>
 <button
 type="button"
 onClick={() => setRole("seller")}
 className={`flex-1 rounded-xl py-2.5 px-5 text-sm font-medium transition-all w-3xs ${
 role ==="seller"
 ?"bg-primary text-white"
 :"bg-custom-card border border-primary text-primary hover:bg-primary/5"
 }`}
 >
 {t("common.seller")}
 </button>
 </div>
 );
}

export default AuthRoleToggle;
