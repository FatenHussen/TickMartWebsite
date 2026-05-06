import type { ReactNode } from "react";
import { HiCheckCircle, HiGift } from "react-icons/hi2";
import AuthHeader from "@/features/auth/components/AuthHeader";
import AuthPromoPanel from "@/features/auth/components/AuthPromoPanel";
import AuthFormCard from "@/features/auth/components/AuthFormCard";
import { useAuthDarkScopeStyle } from "@/features/auth/hooks/useAuthDarkScopeStyle";
import { useTheme } from "@/context/ThemeContext";
import { cn } from "@/shared/lib/utils";

export type LeftPanelVariant = "promo" | "image" | "signup" | "custom" | "none";

export type AuthLayoutProps = {
    /** Left panel type */
    leftPanel?: LeftPanelVariant;
    /** For image: image source */
    leftImageSrc?: string;
    /** For image: optional click-through link */
    leftImageLink?: string;
    /** For image: alt text */
    leftImageAlt?: string;
    /** For image:"full"= fill grid cell,"100vh"= fixed viewport height */
    leftImageHeight?: "full" | "100vh";
    /** For custom: custom left content */
    leftContent?: ReactNode;
    /** For signup: panel title */
    title?: string;
    /** For signup: feature list */
    features?: string[];
    /** For signup: CTA button label */
    ctaLabel?: string;
    /** For signup: CTA helper text */
    helper?: string;
    /** For signup: custom illustration */
    illustration?: ReactNode;
    /** Form content */
    children: ReactNode;
    /** Wrap form in white card with shadow */
    useFormCard?: boolean;
    /** Optional extra classes for the form card */
    formCardClassName?: string;
    /** Max width of form container */
    maxWidth?: "md" | "auth" | "authWide" | "576" | "lg" | "640" | "2xl";
};

const MAX_WIDTH_CLASS = {
    md: "max-w-md",
    /** Premium auth column — tight focus (≈ 460px) */
    auth: "max-w-[460px]",
    authWide: "max-w-[520px]",
    "576": "max-w-[576px]",
    lg: "max-w-lg",
    "640": "max-w-[640px]",
    "2xl": "max-w-2xl",
} as const;

export default function AuthLayout({
    leftPanel = "promo",
    leftImageSrc,
    leftImageLink,
    leftImageAlt = "",
    leftImageHeight = "full",
    leftContent,
    title,
    features = [],
    ctaLabel,
    helper,
    illustration,
    children,
    useFormCard = false,
    formCardClassName = "",
    maxWidth = "auth",
}: AuthLayoutProps) {
    const authDarkScopeStyle = useAuthDarkScopeStyle();
    const { theme } = useTheme();
    const isAuthDark = theme === "dark";

    const renderLeftPanel = () => {
        if (leftPanel === "none") return null;

        if (leftPanel === "promo") {
            return <AuthPromoPanel />;
        }

        if (leftPanel === "image" && leftImageSrc) {
            const heightClass = leftImageHeight === "100vh" ? "h-screen" : "h-full min-h-0";
            const imageElement = (
                <img
                    src={leftImageSrc}
                    alt={leftImageAlt}
                    className="w-full h-full object-cover"
                />
            );
            return (
                <aside className={`hidden lg:block sticky top-0 self-start ${heightClass}`}>
                    {leftImageLink ? (
                        <a
                            href={leftImageLink}
                            target="_blank"
                            rel="noreferrer"
                            className="block w-full h-full"
                        >
                            {imageElement}
                        </a>
                    ) : (
                        imageElement
                    )}
                </aside>
            );
        }

        if (leftPanel === "custom" && leftContent) {
            return (
                <aside
                    className={cn(
                        "hidden lg:flex items-center justify-center border-e p-8",
                        isAuthDark
                            ? "border-[rgba(255,255,255,0.06)] bg-[#0B0B0C]"
                            : "border-transparent bg-custom-tertiary",
                    )}
                >
                    {leftContent}
                </aside>
            );
        }

        if (leftPanel === "signup") {
            return (
                <aside
                    className={cn(
                        "relative hidden lg:flex min-h-[400px] lg:min-h-screen overflow-hidden items-center justify-center border-e px-8 py-12",
                        isAuthDark
                            ? "border-[rgba(255,255,255,0.06)] bg-[#0B0B0C]"
                            : "border-transparent bg-gradient-to-br from-[var(--color-main)] via-[color-mix(in_srgb,var(--color-api-second)_28%,var(--color-main))] to-[color-mix(in_srgb,var(--color-api-second)_42%,var(--color-main))]",
                    )}
                >
                    <div className="flex w-full max-w-[446px] flex-col items-center gap-9">
                        <div
                            className={cn(
                                "w-full overflow-hidden",
                                isAuthDark
                                    ? "rounded-3xl border border-[rgba(255,255,255,0.06)] bg-[rgba(16,17,20,0.5)] shadow-[0_24px_60px_-28px_rgba(0,0,0,0.55)] backdrop-blur-md"
                                    : "rounded-[18px]",
                            )}
                        >
                            {illustration ? (
                                <div className="w-full">{illustration}</div>
                            ) : (
                                <img
                                    src="/images/auth/ContainerSingup.png"
                                    alt="Signup"
                                    className="block h-auto w-full object-cover"
                                />
                            )}
                        </div>

                        <div
                            className={cn(
                                "w-full rounded-3xl border px-8 py-10 text-custom-primary shadow-[0_24px_56px_-24px_rgba(0,0,0,0.55)] backdrop-blur-xl",
                                isAuthDark
                                    ? "border-[rgba(255,255,255,0.06)] bg-[rgba(16,17,20,0.72)]"
                                    : "rounded-[20px] border-[var(--color-border-accent-light)] bg-custom-card shadow-[0_20px_45px_var(--color-shadow)]",
                            )}
                        >
                            <h2 className="mb-7 text-[28px] font-bold leading-[1.2] tracking-[-0.02em] text-custom-primary">
                                {title}
                            </h2>
                            {features.length > 0 && (
                                <ul className="space-y-5">
                                    {features.map((item, index) => (
                                        <li key={index} className="flex items-center gap-4">
                                            <HiCheckCircle className="h-7 w-7 flex-shrink-0 text-[var(--color-main)]" />
                                            <span className="text-[18px] font-medium leading-[1.45] text-custom-primary">
                                                {item}
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>

                        {(ctaLabel || helper) && (
                            <button
                                type="button"
                                className={cn(
                                    "flex min-h-[106px] w-full max-w-[257px] items-center justify-between rounded-2xl border px-6 py-5 text-left text-custom-primary transition-[transform,box-shadow,background-color] duration-200 hover:-translate-y-0.5",
                                    isAuthDark
                                        ? "border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.04)] shadow-[0_12px_36px_-16px_rgba(0,0,0,0.65)] hover:bg-[rgba(255,255,255,0.06)]"
                                        : "rounded-[18px] border-transparent bg-[var(--color-api-second)] shadow-[0_12px_28px_var(--color-shadow-strong)] hover:opacity-90",
                                )}
                            >
                                <div className="flex flex-col gap-1">
                                    {ctaLabel && (
                                        <span className="text-[16px] font-extrabold leading-none">
                                            {ctaLabel}
                                        </span>
                                    )}
                                    {helper && (
                                        <span className="text-[14px] font-medium leading-none text-custom-secondary">
                                            {helper}
                                        </span>
                                    )}
                                </div>
                                <HiGift
                                    className={cn(
                                        "h-9 w-9 flex-shrink-0",
                                        isAuthDark ? "text-[var(--color-main)]" : "text-[var(--color-text-inverse)]",
                                    )}
                                />
                            </button>
                        )}
                    </div>
                </aside>
            );
        }

        return null;
    };

    return (
        <div
            className={cn(
                "auth-scope min-h-screen flex flex-col bg-custom-card text-custom-primary",
                theme === "dark" && "dark",
            )}
            style={authDarkScopeStyle}
        >
            <AuthHeader />
            <div
                className={`relative flex-1 grid min-h-0 ${leftPanel === "none" ? "lg:grid-cols-1" : "lg:grid-cols-2"
                    }`}
            >
                {renderLeftPanel()}

                <main
                    className={cn(
                        "relative flex flex-1 items-center justify-center px-4 py-10 md:px-6 lg:px-8 lg:py-12",
                        isAuthDark
                            ? "bg-[#050505]"
                            : "bg-gradient-to-b from-[var(--color-bg-primary)] to-[color-mix(in_srgb,var(--color-api-second)_12%,var(--color-bg-secondary))]",
                    )}
                >
                    <div className={`w-full min-w-0 max-w-full ${MAX_WIDTH_CLASS[maxWidth]}`}>
                        {useFormCard ? (
                            <AuthFormCard className={formCardClassName}>{children}</AuthFormCard>
                        ) : (
                            children
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
}
