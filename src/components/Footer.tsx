import { Link } from "react-router-dom";
import { useLanguage } from "@/context/LanguageContext";
import { useTranslation } from "react-i18next";
import { paths } from "@/app/routes/path/paths";

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
            {
                label: t("footer.privacyPolicy"),
                path: paths.client.privacyPolicy,
            },
            {
                label: t("footer.termsConditions"),
                path: paths.client.termsConditions,
            },
            { label: t("footer.helpSupport"), path: paths.account.helpSupport },
        ],
    };

    return (
        <footer
            className="bg-gradient-to-r from-secondary/20 via-secondary/10 to-primary-light/20 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 mt-auto"
            dir={isRTL ? "rtl" : "ltr"}
        >
            <div className="page-container py-12">
                {/* Logo */}
                <div className="flex justify-center mb-10">
                    <Link to="/home" className="flex items-center gap-2">
                        <img
                            src="/images/shared/logo-footer.png"
                            alt="Tikmart"
                            className="h-44 w-auto object-contain"
                        />
                    </Link>
                </div>

                {/* Footer Links Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-8">
                    {/* Explore */}
                    <div>
                        <h3 className="font-bold text-custom-primary mb-4">
                            {t("footer.explore")}
                        </h3>
                        <ul className="space-y-2">
                            {footerLinks.explore.map((link) => (
                                <li key={link.path}>
                                    <Link
                                        to={link.path}
                                        className="text-custom-secondary hover:text-primary-light transition-colors"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Shopping */}
                    <div>
                        <h3 className="font-bold text-custom-primary mb-4">
                            {t("footer.shopping")}
                        </h3>
                        <ul className="space-y-2">
                            {footerLinks.shopping.map((link) => (
                                <li key={link.path}>
                                    <Link
                                        to={link.path}
                                        className="text-custom-secondary hover:text-primary-light transition-colors"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Partners */}
                    <div>
                        <h3 className="font-bold text-custom-primary mb-4">
                            {t("footer.partners")}
                        </h3>
                        <ul className="space-y-2">
                            {footerLinks.partners.map((link) => (
                                <li key={link.path}>
                                    <Link
                                        to={link.path}
                                        className="text-custom-secondary hover:text-primary-light transition-colors"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Legal & support */}
                    <div>
                        <h3 className="font-bold text-custom-primary mb-4">
                            {t("footer.legal")}
                        </h3>
                        <ul className="space-y-2">
                            {footerLinks.legal.map((link) => (
                                <li key={link.path}>
                                    <Link
                                        to={link.path}
                                        className="text-custom-secondary hover:text-primary-light transition-colors"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Get our app Column */}
                    <div>
                        <h3 className="font-bold text-custom-primary mb-4">
                            {t("footer.getOurApp")}
                        </h3>
                        <div className="space-y-3">
                            <a
                                href={iosAppUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-3 bg-black text-white px-4 py-3 rounded-lg hover:bg-gray-800 transition-colors"
                            >
                                <svg
                                    className="w-6 h-6"
                                    fill="currentColor"
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C1.79 15.25 2.54 7.59 9.5 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.14 3.74-4.68.42 1.75-.53 3.5-1.85 4.59-1.31 1.14-2.88 1.98-1.89 4.09h-.01z" />
                                </svg>
                                <div className="flex flex-col items-start">
                                    <span className="text-xs">
                                        {t("footer.downloadOnThe")}
                                    </span>
                                    <span className="text-sm font-semibold">
                                        {t("footer.appStore")}
                                    </span>
                                </div>
                            </a>
                            <a
                                href={androidAppUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-3 bg-black text-white px-4 py-3 rounded-lg hover:bg-gray-800 transition-colors"
                            >
                                <svg
                                    className="w-6 h-6"
                                    fill="currentColor"
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z" />
                                </svg>
                                <div className="flex flex-col items-start">
                                    <span className="text-xs">
                                        {t("footer.getItOn")}
                                    </span>
                                    <span className="text-sm font-semibold">
                                        {t("footer.googlePlay")}
                                    </span>
                                </div>
                            </a>
                        </div>
                    </div>
                </div>

                {/* Divider */}
                <div className="border-t border-primary-light/30 my-8"></div>

                {/* Copyright */}
                <div className="text-center">
                    <p className="text-custom-secondary">{t("footer.copyright")}</p>
                </div>
            </div>
        </footer>
    );
}
