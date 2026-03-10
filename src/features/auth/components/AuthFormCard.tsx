import type { ReactNode } from "react";

const FORM_CARD_SHADOW = "0px 25px 50px -12px rgba(0, 0, 0, 0.25)";

type AuthFormCardProps = {
  children: ReactNode;
  className?: string;
};

/** White card with shadow and padding for auth forms. */
export default function AuthFormCard({ children, className = "" }: AuthFormCardProps) {
  return (
    <div
      className={`bg-white dark:bg-gray-800 rounded-xl py-[60px] px-[38px] flex flex-col gap-8 border border-gray-100 dark:border-gray-700 ${className}`}
      style={{ boxShadow: FORM_CARD_SHADOW }}
    >
      {children}
    </div>
  );
}
