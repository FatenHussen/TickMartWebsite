import { Link } from "react-router-dom";
import { useLanguage } from "@/context/LanguageContext";
import { useTranslation } from "react-i18next";
import { paths } from "@/app/routes/path/paths";
import {
    HiTruck,
    HiShieldCheck,
    HiRefresh,
    HiSparkles,
    HiBadgeCheck,
} from "react-icons/hi";
import { FaApple, FaGooglePlay } from "react-icons/fa6";

const IOS_STORE_FALLBACK = "https://www.apple.com/app-store/";
const PLAY_STORE_FALLBACK = "https://play.google.com/store";

export default function Footer() {
    const { isRTL } = useLanguage();
    const { t } = useTranslation();

    const iosAppUrl =
        (import.meta.env.VITE_IOS_APP_URL as string | undefined) ||
        IOS_STORE_FALLBACK;
    const androidAppUrl =
        (import.meta.env.VITE_ANDROID_APP_URL as string | undefined) ||
        PLAY_STORE_FALLBACK;

    const footerLinks = {
        explore: [
            { label: t("footer.home"), path: paths.client.home },
            { label: t("footer.categories"), path: paths.client.categories },
            { label: t("footer.products"), path: paths.client.products },
            { label: t("footer.brands"), path: paths.client.brands },
            { label: t("footer.baskets"), path: paths.client.baskets },
            { label: t("footer.recipes"), path: paths.client.recipes },
        ],
        shopping: [
            { label: t("footer.shops"), path: paths.client.store },
            { label: t("footer.cart"), path: paths.client.cart },
            { label: t("footer.myOrders"), path: paths.account.orders },
            { label: t("footer.wishlist"), path: paths.account.wishlist },
        ],
        partners: [
            { label: t("footer.becomeVendor"), path: paths.becomeVendor },
            { label: t("footer.becomeMarketer"), path: paths.becomeMarketer },
        ],
        legal: [
            { label: t("footer.privacyPolicy"), path: paths.client.privacyPolicy },
            { label: t("footer.termsConditions"), path: paths.client.termsConditions },
            { label: t("footer.helpSupport"), path: paths.account.helpSupport },
        ],
    };
    const footerColumns = [
        { title: t("footer.explore"), links: footerLinks.explore.slice(0, 5) },
        { title: t("footer.shopping"), links: footerLinks.shopping },
        { title: t("footer.legal"), links: [...footerLinks.legal, ...footerLinks.partners] },
    ];

    const trustBadges = [
        { icon: HiTruck, label: t("footer.trustFastDelivery") },
        { icon: HiShieldCheck, label: t("footer.trustSecurePayments") },
        { icon: HiRefresh, label: t("footer.trustEasyReturns") },
        { icon: HiSparkles, label: t("footer.trustFreshProducts") },
        { icon: HiBadgeCheck, label: t("footer.trustQuality") },
    ];

    return (
        <footer
            className="app-footer-premium relative mt-auto overflow-hidden border-t border-black/[0.06] bg-[#fbfbfc] text-custom-primary dark:border-white/[0.06]"
            dir={isRTL ? "rtl" : "ltr"}
        >
            <div className="page-container py-14 lg:py-16">
                {/* ─── Brand hero + Navigation ───────────────────────────── */}
                <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-[1.5fr_repeat(3,1fr)]">
                    {/* Brand hero */}
                    <div className="space-y-5">
                        <Link to={paths.client.home} className="inline-flex items-center">
                            <img
                                src="/images/shared/logo.png"
                                alt="Tikmart"
                                className="h-14 w-auto object-contain sm:h-[3.75rem]"
                            />
                        </Link>
                        <p className="max-w-xs text-sm leading-relaxed text-custom-secondary">
                            {t("footer.tagline")}
                        </p>

                        {/* App buttons */}
                        <div className="flex flex-wrap gap-3">
                            <a
                                href={iosAppUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group inline-flex items-center gap-2.5 rounded-2xl bg-[#111418] px-4 py-2.5 text-white shadow-[0_8px_22px_-12px_rgba(0,0,0,0.6)] transition-transform duration-200 ease-out hover:-translate-y-0.5 active:translate-y-0 dark:border dark:border-white/10 dark:bg-white/[0.06]"
                            >
                                <FaApple className="h-6 w-6" />
                                <span className="flex flex-col items-start leading-none">
                                    <span className="text-[10px] text-white/70">{t("footer.downloadOnThe")}</span>
                                    <span className="text-sm font-semibold">{t("footer.appStore")}</span>
                                </span>
                            </a>
                            <a
                                href={androidAppUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group inline-flex items-center gap-2.5 rounded-2xl bg-[#111418] px-4 py-2.5 text-white shadow-[0_8px_22px_-12px_rgba(0,0,0,0.6)] transition-transform duration-200 ease-out hover:-translate-y-0.5 active:translate-y-0 dark:border dark:border-white/10 dark:bg-white/[0.06]"
                            >
                                <FaGooglePlay className="h-5 w-5" />
                                <span className="flex flex-col items-start leading-none">
                                    <span className="text-[10px] text-white/70">{t("footer.getItOn")}</span>
                                    <span className="text-sm font-semibold">{t("footer.googlePlay")}</span>
                                </span>
                            </a>
                        </div>
                    </div>

                    {/* Nav columns */}
                    {footerColumns.map((column) => (
                        <div key={column.title}>
                            <h3 className="text-xs font-bold uppercase tracking-[0.12em] text-custom-primary">
                                {column.title}
                            </h3>
                            <span className="mb-4 mt-2.5 block h-0.5 w-7 rounded-full bg-primary/50" aria-hidden />
                            <ul className="space-y-2.5">
                                {column.links.map((link) => (
                                    <li key={`${link.path}-${link.label}`}>
                                        <Link
                                            to={link.path}
                                            className="group inline-flex items-center gap-1.5 text-sm text-custom-secondary transition-[color,transform] duration-200 ease-out hover:text-primary ltr:hover:translate-x-1 rtl:hover:-translate-x-1"
                                        >
                                            <span className="h-1 w-1 rounded-full bg-primary opacity-0 transition-opacity duration-200 group-hover:opacity-100" aria-hidden />
                                            {link.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                {/* ─── Trust badges ──────────────────────────────────────── */}
                <div className="mt-14 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
                    {trustBadges.map((badge) => {
                        const Icon = badge.icon;
                        return (
                            <div
                                key={badge.label}
                                className="flex items-center gap-2.5 rounded-2xl border border-black/[0.06] bg-white px-3.5 py-3 transition-[transform,box-shadow] duration-200 ease-out hover:-translate-y-0.5 hover:shadow-[0_10px_24px_-14px_rgba(15,23,42,0.28)] dark:border-white/[0.08] dark:bg-white/[0.03]"
                            >
                                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                                    <Icon className="h-5 w-5" />
                                </span>
                                <span className="text-sm font-semibold text-custom-primary">
                                    {badge.label}
                                </span>
                            </div>
                        );
                    })}
                </div>

                {/* ─── Bottom bar ────────────────────────────────────────── */}
                <div className="mt-12 flex flex-col items-center gap-4 border-t border-black/[0.06] pt-6 text-center dark:border-white/[0.06] md:flex-row md:justify-between md:text-start">
                    <p className="order-3 text-sm text-custom-secondary md:order-1">
                        {t("footer.copyright")}
                    </p>
                    <div className="order-2 flex items-center gap-4 text-sm">
                        <Link
                            to={paths.client.privacyPolicy}
                            className="text-custom-secondary transition-colors duration-200 hover:text-primary"
                        >
                            {t("footer.privacyPolicy")}
                        </Link>
                        <span className="h-3 w-px bg-black/10 dark:bg-white/10" aria-hidden />
                        <Link
                            to={paths.client.termsConditions}
                            className="text-custom-secondary transition-colors duration-200 hover:text-primary"
                        >
                            {t("footer.termsConditions")}
                        </Link>
                    </div>
                    <p className="order-1 inline-flex items-center gap-1.5 text-sm text-custom-secondary md:order-3">
                        {t("footer.madeWith")}
                        <span className="animate-pulse text-base text-primary" aria-hidden>❤</span>
                        {t("footer.forYou")}
                    </p>
                </div>
            </div>
        </footer>
    );
}
