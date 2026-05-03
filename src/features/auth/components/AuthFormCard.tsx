import type { ReactNode } from "react";

type AuthFormCardProps = {
    children: ReactNode;
    className?: string;
};

/** Form card using API-scoped surfaces (auth subtree forces dark + palette variables). */
export default function AuthFormCard({ children, className = "" }: AuthFormCardProps) {
    return (
        <div
            className={`flex flex-col gap-8 rounded-xl border border-custom-primary bg-custom-card px-[38px] py-[60px] shadow-[0_25px_50px_-12px_var(--color-shadow)] ${className}`}
        >
            {children}
        </div>
    );
}
