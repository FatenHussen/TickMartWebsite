import { useTranslation } from "react-i18next";
import Button from "@/shared/ui/Button";
import type { AuthMethod } from "../types";

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
    <div className="border-b border-slate-200 dark:border-gray-700 flex gap-8 text-sm font-medium mb-5 transition-colors">
      <Button
        type="button"
        variant="ghost"
        onClick={() => onChange("email")}
        className={`pb-2 -mb-px rounded-none border-b-2 transition-all ${
          value === "email"
            ? "text-primary dark:text-cyan-400 border-primary dark:border-cyan-400"
            : "text-slate-400 dark:text-gray-500 hover:text-slate-600 dark:hover:text-gray-300 border-transparent"
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
            ? "text-primary dark:text-cyan-400 border-primary dark:border-cyan-400"
            : "text-slate-400 dark:text-gray-500 hover:text-slate-600 dark:hover:text-gray-300 border-transparent"
        }`}
      >
        {t("auth.phoneNumber")}
      </Button>
    </div>
  );
}
