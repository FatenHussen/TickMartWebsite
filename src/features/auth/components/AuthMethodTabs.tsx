import { useTranslation } from"react-i18next";
import Button from"@/shared/ui/Button";
import type { AuthMethod } from"../types";

export type { AuthMethod };

type AuthMethodTabsProps = {
 value: AuthMethod;
 onChange: (next: AuthMethod) => void;
};

// Shared tabs for switching between email and phone auth
export default function AuthMethodTabs({
 value,
 onChange,
}: AuthMethodTabsProps) {
 const { t } = useTranslation();

 return (
 <div className="mb-5 flex gap-8 border-b border-custom-primary text-sm font-medium transition-colors">
 <Button
 type="button"
 variant="ghost"
 onClick={() => onChange("email")}
 className={`-mb-px rounded-none border-b-2 pb-2 transition-all ${
 value ==="email"
 ?"border-[var(--color-main)] text-[var(--color-main)]"
 :"border-transparent text-custom-tertiary hover:text-custom-secondary"
 }`}
 >
 {t("auth.emailAddress")}
 </Button>
 <Button
 type="button"
 variant="ghost"
 onClick={() => onChange("phone")}
 className={`-mb-px rounded-none border-b-2 pb-2 transition-all ${
 value ==="phone"
 ?"border-[var(--color-main)] text-[var(--color-main)]"
 :"border-transparent text-custom-tertiary hover:text-custom-secondary"
 }`}
 >
 {t("auth.phoneNumber")}
 </Button>
 </div>
 );
}
