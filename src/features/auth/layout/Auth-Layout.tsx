import React from "react";
import ThemeToggle from "@/components/ThemeToggle";
import LanguageToggle from "@/components/LanguageToggle";
import Button from "@/shared/ui/Button";
import { useTranslation } from "react-i18next";

type AuthLayoutProps = {
  title: string;
  blurb?: string;
  features?: string[];
  ctaLabel?: string;
  helper?: string;
  illustration?: React.ReactNode;
  children: React.ReactNode;
};

export default function AuthLayout({
  title,
  blurb,
  features = [],
  ctaLabel,
  helper,
  illustration,
  children,
}: AuthLayoutProps) {
  const { t } = useTranslation();

  return (
    <div className="h-full bg-blue-off transition-colors min-h-screen">
      <div className="relative w-full h-full grid lg:grid-cols-[1.1fr_1fr]  shadow-[0_24px_60px_rgba(0,0,0,0.12)] overflow-hidden transition-colors">
        {/* Theme and Language toggles */}
        <div className="absolute top-4 right-4 z-20 flex gap-2">
          <LanguageToggle />
          <ThemeToggle />
        </div>

        {/* LEFT SIDE – like the dribbble shot */}
        <aside className=" px-6 md:px-10 py-8 flex flex-col gap-8 transition-colors">
          {/* Logo + app name */}
          <header className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-cyan-500 flex items-center justify-center text-white text-xl font-bold shadow-md">
              H
            </div>
            <span className="text-slate-800  font-semibold text-lg transition-colors">
              {title}
            </span>
          </header>

          {blurb ? (
            <p className="text-sm text-text-secondary  transition-colors max-w-md">
              {blurb}
            </p>
          ) : null}

          {features.length > 0 ? (
            <ul className="space-y-2 text-sm text-text-primary transition-colors">
              {features.map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span className="text-lg leading-none">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          ) : null}

          {/* Illustration */}
          <div className="flex-1 flex items-center justify-center">
            {illustration ? (
              <div className="w-full max-w-md">{illustration}</div>
            ) : (
              <div className="w-full max-w-md aspect-4/3 rounded-3xl bg-white  shadow-lg flex items-center justify-center transition-colors">
                <span className="text-7xl">🛵</span>
              </div>
            )}
          </div>

          {/* Bottom promo card */}
          <div className="mt-4">
            <div className="bg-white rounded-xl shadow-[0_18px_40px_rgba(15,23,42,0.12)] px-5 py-4 flex gap-4 items-center">
              <div className="h-16 w-16 rounded-xl bg-slate-200 flex items-center justify-center overflow-hidden">
                <span className="text-3xl">🍝</span>
              </div>
              <div className="flex-1 space-y-1">
                <p className="text-[11px] uppercase tracking-wide text-slate-400">
                  {t("auth.sponsored")}
                </p>
                <h3 className="text-sm font-semibold text-slate-900">
                  {t("auth.get30Off")}
                </h3>
                <p className="text-xs text-slate-500">
                  {t("auth.enjoyExclusiveDeals")}
                </p>
              </div>
              <Button
                size="sm"
                variant="secondary"
                className="text-xs whitespace-nowrap"
              >
                {t("auth.viewOffer")}
              </Button>
            </div>

            {blurb || features.length ? (
              <p className="mt-3 text-[11px] text-slate-500  transition-colors">
                {blurb || t("auth.manageCampaigns")}
              </p>
            ) : null}

            {ctaLabel ? (
              <div className="mt-2">
                <Button
                  size="sm"
                  variant="secondary"
                  className="text-xs whitespace-nowrap"
                >
                  {ctaLabel}
                </Button>
                {helper ? (
                  <p className="text-[11px] text-slate-500  mt-2 transition-colors">
                    {helper}
                  </p>
                ) : null}
              </div>
            ) : null}
          </div>
        </aside>

        {/* RIGHT SIDE – auth card */}
        <main className="bg-white flex items-center justify-center px-4 md:px-8 py-8 transition-colors">
          <div className="w-full max-w-md bg-white  rounded-xl shadow-[0_22px_50px_rgba(15,23,42,0.14)] px-6 md:px-8 py-7 transition-colors">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
