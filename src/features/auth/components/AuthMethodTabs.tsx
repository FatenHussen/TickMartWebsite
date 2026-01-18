import { useTranslation } from "react-i18next";
import Button from "@/shared/ui/Button";

export type AuthMethod = "email" | "phone";

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
    <div className="border-b border-slate-200 flex gap-8 text-sm font-medium mb-5 transition-colors">
      <Button
        type="button"
        variant="ghost"
        onClick={() => onChange("email")}
        className={`pb-2 -mb-px rounded-none border-b-2 transition-all ${
          value === "email"
            ? "text-primary border-primary"
            : "text-slate-400 hover:text-slate-600 border-transparent"
        }`}
      >
        {t("auth.emailAddress")}
      </Button>
      <Button
        type="button"
        variant="ghost"
        onClick={() => onChange("phone")}
        className={`pb-2 -mb-px rounded-none border-b-2 transition-all ${
          value === "phone"
            ? "text-primary border-primary"
            : "text-slate-400 hover:text-slate-600 border-transparent"
        }`}
      >
        {t("auth.phoneNumber")}
      </Button>
    </div>
  );
}
