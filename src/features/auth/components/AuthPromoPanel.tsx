import { useTranslation } from"react-i18next";

/** Left panel with App Everything branding and logo. */
export default function AuthPromoPanel() {
 const { t } = useTranslation();

 return (
 <aside className="hidden lg:flex flex-col overflow-auto bg-gradient-to-b from-[var(--color-bg-secondary)] via-[var(--color-bg-primary)] to-[color-mix(in_srgb,var(--color-api-second)_10%,var(--color-bg-primary))]">
 <div className="pt-10 pb-6 px-8 md:px-12">
 <div className="flex items-center gap-3">
 <div className="flex items-center justify-center text-[var(--color-main)]">
 <svg
 xmlns="http://www.w3.org/2000/svg"
 viewBox="0 0 24 24"
 fill="currentColor"
 className="w-8 h-8"
 aria-hidden
 >
 <path d="M11 9H9V2H7v7H5V2H3v7c0 2.12 1.66 3.84 3.75 3.97V22h2.5v-9.03C11.34 12.84 13 11.12 13 9V2h-2v7zm5-3v8h2.5v8H21V2c-2.76 0-5 2.24-5 4z"/>
 </svg>
 </div>
 <span className="text-lg font-semibold text-custom-primary">
 {t("auth.appEverything")}
 </span>
 </div>
 </div>

 <div className="flex-1 flex flex-col items-center justify-center px-8 md:px-12 min-h-0">
 <div className="w-full max-w-sm">
 <div className="flex items-center justify-center overflow-hidden rounded-2xl border border-[var(--color-border-accent-light)] bg-custom-card p-8 shadow-[0_8px_32px_var(--color-shadow)]">
 <img
 src="/images/shared/logo.png"
 alt="Logo"
 className="w-full h-auto max-h-64 object-contain"
 />
 </div>
 </div>
 </div>
 </aside>
 );
}
