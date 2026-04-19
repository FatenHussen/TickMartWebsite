import { HiChat, HiMail, HiPhone } from "react-icons/hi";
import { useTranslation } from "react-i18next";
import { cn } from "@/shared/lib/utils";
import { HELP_FOCUS_RING } from "../focusRingClasses";
import { formatWhatsAppUrl } from "../utils/formatWhatsAppUrl";
import { buildContactChannelGridStyle } from "../utils/buildContactChannelGridStyle";

type ContactInfo = {
    whatsapp?: string;
    phone?: string;
    email?: string;
};

type AppSettingsColor = { main_color?: string; text_color?: string } | undefined;

type ContactChannelsGridProps = {
    contact: ContactInfo | undefined;
    appColor: AppSettingsColor;
};

export function ContactChannelsGrid({ contact, appColor }: ContactChannelsGridProps) {
    const { t } = useTranslation();
    const gridStyle = buildContactChannelGridStyle(appColor);
    const labelStyle = { color: "var(--contact-text, var(--color-text-primary))" };

    const hasAnyChannel = Boolean(contact?.whatsapp || contact?.phone || contact?.email);

    const channelCardClass = cn(
        "group flex min-h-[128px] flex-col items-center justify-center gap-3 rounded-2xl p-6",
        "bg-gradient-to-b from-custom-card via-custom-card to-blue-off/[0.22] shadow-lg shadow-[color-mix(in_srgb,var(--color-primary)_12%,transparent)]",
        "transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-[color-mix(in_srgb,var(--color-primary)_18%,transparent)]",
        "dark:to-primary/[0.04]",
        HELP_FOCUS_RING
    );

    const iconWrapClass =
        "flex h-14 w-14 items-center justify-center rounded-2xl " +
        "bg-gradient-to-br from-primary/[0.12] to-[var(--color-api-second)]/[0.18] " +
        "transition-transform duration-200 group-hover:scale-105";

    return (
        <div
            className="mb-2 grid grid-cols-1 gap-4 sm:grid-cols-3"
            style={gridStyle}
        >
            {contact?.whatsapp && (
                <a
                    href={formatWhatsAppUrl(contact.whatsapp)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={channelCardClass}
                >
                    <span className={iconWrapClass}>
                        <HiChat className="h-9 w-9 shrink-0 text-[var(--color-ui-green-500)]" />
                    </span>
                    <span className="text-center text-sm font-semibold" style={labelStyle}>
                        {t("helpCenter.openWhatsApp")}
                    </span>
                </a>
            )}
            {contact?.phone && (
                <a href={`tel:${contact.phone}`} className={channelCardClass}>
                    <span className={iconWrapClass}>
                        <HiPhone className="h-9 w-9 shrink-0 text-primary-dark" />
                    </span>
                    <span className="text-center text-sm font-semibold" style={labelStyle}>
                        {t("helpCenter.callUs")}
                    </span>
                </a>
            )}
            {contact?.email && (
                <a href={`mailto:${contact.email}`} className={channelCardClass}>
                    <span className={iconWrapClass}>
                        <HiMail className="h-9 w-9 shrink-0 text-custom-secondary" />
                    </span>
                    <span className="text-center text-sm font-semibold" style={labelStyle}>
                        {t("helpCenter.sendEmail")}
                    </span>
                </a>
            )}
            {!hasAnyChannel && (
                <div className="col-span-full py-8 text-center">
                    <p className="text-sm text-custom-secondary">
                        {t("helpCenter.contactUnavailable", "Contact information not available.")}
                    </p>
                </div>
            )}
        </div>
    );
}
