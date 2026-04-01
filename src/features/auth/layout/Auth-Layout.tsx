import type { ReactNode } from "react";
import { HiCheckCircle, HiGift } from "react-icons/hi2";
import AuthHeader from "@/features/auth/components/AuthHeader";
import AuthPromoPanel from "@/features/auth/components/AuthPromoPanel";
import AuthFormCard from "@/features/auth/components/AuthFormCard";

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
    maxWidth?: "md" | "576" | "lg" | "640" | "2xl";
};

const MAX_WIDTH_CLASS = {
    md: "max-w-md",
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
    maxWidth = "576",
}: AuthLayoutProps) {
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
                <aside className="hidden lg:flex items-center justify-center bg-custom-tertiary p-8">
                    {leftContent}
                </aside>
            );
        }

        if (leftPanel === "signup") {
            return (
                <aside className="relative hidden lg:flex min-h-[400px] lg:min-h-screen overflow-hidden items-center justify-center bg-[#22BDE9] px-8 py-12">
                    <div className="flex w-full max-w-[446px] flex-col items-center gap-9">
                        <div className="w-full overflow-hidden rounded-[18px]">
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
                            className="w-full rounded-[20px] bg-white px-8 py-10 text-[#2A2A2A]"
                            style={{ boxShadow: "0px 20px 45px rgba(0, 0, 0, 0.14)" }}
                        >
                            <h2 className="mb-7 text-[28px] font-bold leading-[1.2] tracking-[-0.02em]">
                                {title}
                            </h2>
                            {features.length > 0 && (
                                <ul className="space-y-5">
                                    {features.map((item, index) => (
                                        <li key={index} className="flex items-center gap-4">
                                            <HiCheckCircle className="h-7 w-7 flex-shrink-0 text-[#22BDE9]" />
                                            <span className="text-[18px] font-medium leading-[1.45]">
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
                                className="flex min-h-[106px] w-full max-w-[257px] items-center justify-between rounded-[18px] bg-[#FFD426] px-6 py-5 text-left text-[#2A2A2A] transition-all hover:brightness-95"
                                style={{ boxShadow: "0px 12px 28px rgba(0, 0, 0, 0.18)" }}
                            >
                                <div className="flex flex-col gap-1">
                                    {ctaLabel && (
                                        <span className="text-[16px] font-extrabold leading-none">
                                            {ctaLabel}
                                        </span>
                                    )}
                                    {helper && (
                                        <span className="text-[14px] font-medium leading-none">
                                            {helper}
                                        </span>
                                    )}
                                </div>
                                <HiGift className="h-9 w-9 flex-shrink-0 text-white" />
                            </button>
                        )}
                    </div>
                </aside>
            );
        }

        return null;
    };

    return (
        <div className="min-h-screen flex flex-col bg-custom-card">
            <AuthHeader />
            <div
                className={`relative flex-1 grid min-h-0 ${leftPanel === "none" ? "lg:grid-cols-1" : "lg:grid-cols-2"
                    }`}
            >
                {renderLeftPanel()}

                <main className="flex items-center justify-center px-4 md:px-6 lg:px-8 py-8 lg:py-10 bg-custom-card">
                    <div className={`w-full ${MAX_WIDTH_CLASS[maxWidth]}`}>
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
