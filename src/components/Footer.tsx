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
    const footerColumns = [
        {
            title: t("footer.explore"),
            links: footerLinks.explore.slice(0, 5),
        },
        {
            title: t("footer.shopping"),
            links: footerLinks.shopping,
        },
        {
            title: t("footer.legal"),
            links: [...footerLinks.legal, ...footerLinks.partners],
        },
    ];

    return (
        <footer
            className="mt-auto border-t border-[color-mix(in_srgb,var(--color-main)_30%,transparent)] bg-[linear-gradient(180deg,color-mix(in_srgb,var(--color-main)_12%,white)_0%,color-mix(in_srgb,var(--color-api-second)_10%,white)_100%)]"
            dir={isRTL ? "rtl" : "ltr"}
        >
            <div className="page-container py-12">
                <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-[1.25fr_repeat(3,minmax(0,1fr))]">
                    <div className="space-y-5">
                        <Link to={paths.client.home} className="inline-flex items-center">
                            <img
                                src="/images/shared/logo.png"
                                alt="Tikmart"
                                className="h-14 w-auto object-contain sm:h-[3.75rem]"
                            />
                        </Link>
                        <div className="space-y-2">
                            <p className="text-sm font-semibold text-[var(--color-main)]">
                                {t("footer.getOurApp")}
                            </p>
                            <div className="flex flex-wrap gap-2">
                                <a
                                    href={iosAppUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="rounded-full border border-[color-mix(in_srgb,var(--color-main)_40%,transparent)] bg-[color-mix(in_srgb,var(--color-main)_10%,transparent)] px-3 py-1.5 text-xs font-medium text-[color:var(--color-text)] transition-colors hover:border-[color-mix(in_srgb,var(--color-api-second)_45%,transparent)] hover:bg-[color-mix(in_srgb,var(--color-api-second)_12%,transparent)] hover:text-[var(--color-api-second)]"
                                >
                                    {t("footer.appStore")}
                                </a>
                                <a
                                    href={androidAppUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="rounded-full border border-[color-mix(in_srgb,var(--color-main)_40%,transparent)] bg-[color-mix(in_srgb,var(--color-main)_10%,transparent)] px-3 py-1.5 text-xs font-medium text-[color:var(--color-text)] transition-colors hover:border-[color-mix(in_srgb,var(--color-api-second)_45%,transparent)] hover:bg-[color-mix(in_srgb,var(--color-api-second)_12%,transparent)] hover:text-[var(--color-api-second)]"
                                >
                                    {t("footer.googlePlay")}
                                </a>
                            </div>
                        </div>
                        <p className="text-sm text-[color:var(--color-text)]/75">
                            {t("footer.copyright")}
                        </p>
                    </div>

                    {footerColumns.map((column) => (
                        <div key={column.title}>
                            <h3 className="mb-4 text-sm font-bold text-[var(--color-main)]">
                                {column.title}
                            </h3>
                            <ul className="space-y-2.5">
                                {column.links.map((link) => (
                                    <li key={`${link.path}-${link.label}`}>
                                        <Link
                                            to={link.path}
                                            className="text-sm text-[color:var(--color-text)]/88 transition-colors hover:text-[var(--color-api-second)]"
                                        >
                                            {link.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>
        </footer>
    );
}
