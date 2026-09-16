import type { ReactNode } from "react";
import { useTheme } from "@/context/ThemeContext";
import { cn } from "@/shared/lib/utils";

type AuthFormCardProps = {
    children: ReactNode;
    className?: string;
};

/** Dark: glass surface (#101014 @ 78% + blur). Light: elevated card from palette. */
export default function AuthFormCard({ children, className = "" }: AuthFormCardProps) {
    const { theme } = useTheme();
    const isDark = theme === "dark";

    return (
        <div
            className={cn(
                "flex w-full min-w-0 max-w-full flex-col gap-5 rounded-2xl border px-5 py-8 sm:gap-6 sm:rounded-3xl sm:px-8 sm:py-10",
                isDark
                    ? "border-[rgba(255,255,255,0.06)] bg-[rgba(16,17,20,0.78)] shadow-[0_32px_64px_-32px_rgba(0,0,0,0.75),inset_0_1px_0_0_rgba(255,255,255,0.04)] backdrop-blur-xl"
                    : "border-stone-200/90 bg-white shadow-[0_20px_50px_-24px_rgba(28,25,23,0.18)]",
                className,
            )}
        >
            {children}
        </div>
    );
}
