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
  /** For image: alt text */
  leftImageAlt?: string;
  /** For image: "full" = fill grid cell, "100vh" = fixed viewport height */
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
  /** Max width of form container: md (28rem), 576 (36rem), lg (32rem), 2xl (42rem) */
  maxWidth?: "md" | "576" | "lg" | "2xl";
};

const MAX_WIDTH_CLASS = {
  md: "max-w-md",
  "576": "max-w-[576px]",
  lg: "max-w-lg",
  "2xl": "max-w-2xl",
} as const;

export default function AuthLayout({
  leftPanel = "promo",
  leftImageSrc,
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
  maxWidth = "576",
}: AuthLayoutProps) {
  const renderLeftPanel = () => {
    if (leftPanel === "none") return null;

    if (leftPanel === "promo") {
      return <AuthPromoPanel />;
    }

    if (leftPanel === "image" && leftImageSrc) {
      const heightClass = leftImageHeight === "100vh" ? "h-[100vh]" : "h-full min-h-0";
      return (
        <div className={`hidden lg:block ${heightClass}`}>
          <img
            src={leftImageSrc}
            alt={leftImageAlt}
            className="w-full h-full object-cover"
          />
        </div>
      );
    }

    if (leftPanel === "custom" && leftContent) {
      return (
        <aside className="hidden lg:flex items-center justify-center bg-gray-100 dark:bg-gray-800 p-8">
          {leftContent}
        </aside>
      );
    }

    if (leftPanel === "signup") {
      return (
        <aside className="relative hidden lg:flex bg-cyan-500 dark:bg-cyan-600 px-6 md:px-10 py-10 flex-col items-center justify-center min-h-[400px] lg:min-h-screen overflow-hidden gap-8">
          <div className="w-full max-w-sm flex justify-center">
            {illustration ? (
              <div className="w-full">{illustration}</div>
            ) : (
              <div className="w-full rounded-3xl bg-cyan-100 dark:bg-cyan-900/40 p-6 flex items-center justify-center min-h-[200px]">
                <div className="relative flex items-end gap-4">
                  <div className="w-32 h-40 bg-white rounded-2xl shadow-lg p-2 flex items-center justify-center">
                    <div className="flex gap-1 flex-wrap justify-center text-2xl">
                      <span>🍔</span>
                      <span>🍕</span>
                      <span>🛒</span>
                    </div>
                  </div>
                  <div className="text-5xl">🛵</div>
                  <div className="absolute -top-2 -right-2 w-3 h-3 bg-white rounded-full opacity-60" />
                  <div className="absolute top-4 right-6 w-2 h-2 bg-white rounded-full opacity-50" />
                </div>
              </div>
            )}
          </div>
          <div className="w-full max-w-sm bg-white dark:bg-gray-700 rounded-2xl shadow-xl p-6">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
              {title}
            </h2>
            {features.length > 0 && (
              <ul className="space-y-3">
                {features.map((item, index) => (
                  <li key={index} className="flex items-center gap-3">
                    <HiCheckCircle className="w-5 h-5 text-cyan-500 dark:text-cyan-400 flex-shrink-0" />
                    <span className="text-sm text-gray-700 dark:text-gray-300">
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
              className="flex items-center justify-center gap-2 w-full max-w-sm bg-yellow-400 hover:bg-yellow-500 dark:bg-yellow-500 dark:hover:bg-yellow-600 text-gray-900 px-5 py-4 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all"
            >
              <div className="flex flex-col items-center gap-0.5">
                {ctaLabel && <span>{ctaLabel}</span>}
                {helper && (
                  <span className="flex items-center gap-1.5 text-sm font-normal">
                    {helper}
                    <HiGift className="w-4 h-4" />
                  </span>
                )}
              </div>
            </button>
          )}
        </aside>
      );
    }

    return null;
  };

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-gray-900">
      <AuthHeader />
      <div
        className={`relative flex-1 grid min-h-0 ${
          leftPanel === "none" ? "lg:grid-cols-1" : "lg:grid-cols-2"
        }`}
      >
        {renderLeftPanel()}

        <main className="flex items-center justify-center px-6 md:px-10 py-10 bg-white dark:bg-gray-900">
          <div className={`w-full ${MAX_WIDTH_CLASS[maxWidth]}`}>
            {useFormCard ? (
              <AuthFormCard>{children}</AuthFormCard>
            ) : (
              children
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
