import { useTranslation } from "react-i18next";
import { useLanguage } from "@/context/LanguageContext";
import type { LegalDocumentData } from "../types";

type LegalDocumentPageProps = {
  data: LegalDocumentData | null | undefined;
  isLoading: boolean;
  error: Error | null;
  heroImageSrc: string;
};

export default function LegalDocumentPage({
  data,
  isLoading,
  error,
  heroImageSrc,
}: LegalDocumentPageProps) {
  const { t } = useTranslation();
  const { isRTL } = useLanguage();

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center" dir={isRTL ? "rtl" : "ltr"}>
        <div className="animate-spin rounded-full h-12 w-12 border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="page-container py-16 text-center" dir={isRTL ? "rtl" : "ltr"}>
        <p className="text-gray-600 dark:text-gray-400">
          {error ? error.message : "Content not available."}
        </p>
      </div>
    );
  }

  return (
    <div dir={isRTL ? "rtl" : "ltr"}>
      {/* Hero with wavy background */}
      <div className="relative w-full overflow-hidden">
        <div className="bg-linear-to-br from-primary-light via-primary-light/95 to-cyan-500/90 dark:from-primary-light/90 dark:via-primary-light/85 dark:to-cyan-500/80">
          <div className="page-container py-12 md:py-16">
            <div
              className={`flex flex-col md:flex-row items-center gap-8 ${
                isRTL ? "md:flex-row-reverse" : ""
              }`}
            >
              <div className="flex-1 text-white">
                <h1 className="text-3xl md:text-4xl font-bold mb-2">{data.title}</h1>
                <p className="text-white/90 text-lg">{t("legal.heroSubtitle")}</p>
              </div>
              <div className="flex-1 flex justify-center md:justify-end">
                <img
                  src={heroImageSrc}
                  alt=""
                  className="max-h-64 md:max-h-80 w-auto object-contain"
                />
              </div>
            </div>
          </div>
        </div>
        {/* Wavy divider - asymmetric: lower on left, curves up towards right */}
        <svg
          className="absolute bottom-0 left-0 w-full h-16 md:h-24 text-white dark:text-gray-900"
          preserveAspectRatio="none"
          viewBox="0 0 1200 120"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill="currentColor"
            d="M0,100 C150,105 300,85 450,95 C600,75 750,55 900,65 C1050,45 1150,38 1200,35 L1200,120 L0,120 Z"
          />
        </svg>
      </div>

      {/* Content */}
      <div className="bg-white dark:bg-gray-900 -mt-16 md:-mt-24 relative z-10">
        <div className="page-container py-10 md:py-14 max-w-4xl">
          <div
            className="prose prose-gray dark:prose-invert max-w-none text-gray-700 dark:text-gray-300 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: data.content }}
          />
        </div>
      </div>
    </div>
  );
}
