import { MessageCircle, Mail, Phone } from "lucide-react";
import { useTranslation } from "react-i18next";
import { cn } from "@/shared/lib/utils";
import { HELP_FOCUS_RING } from "../focusRingClasses";
import { formatWhatsAppUrl } from "../utils/formatWhatsAppUrl";

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

export function ContactChannelsGrid({ contact }: ContactChannelsGridProps) {
    const { t } = useTranslation();

    const hasAnyChannel = Boolean(contact?.whatsapp || contact?.phone || contact?.email);

    const channelCardClass = cn(
        "flex min-h-[112px] flex-col items-center justify-center gap-3 rounded-xl border border-[var(--color-border-primary)] bg-[var(--color-bg-primary)] p-5",
        "text-custom-primary transition-colors hover:border-[#ff9f00]/50",
        HELP_FOCUS_RING
    );

    return (
        <div className="mb-1 grid grid-cols-1 gap-3 sm:grid-cols-3">
            {contact?.whatsapp && (
                <a
                    href={formatWhatsAppUrl(contact.whatsapp)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={channelCardClass}
                >
                    <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#25D366]">
                        <MessageCircle className="h-5 w-5 text-white" aria-hidden />
                    </span>
                    <span className="text-center text-sm font-semibold">{t("helpCenter.openWhatsApp")}</span>
                </a>
            )}
            {contact?.phone && (
                <a href={`tel:${contact.phone}`} className={channelCardClass}>
                    <span className="flex h-11 w-11 items-center justify-center rounded-full bg-cta">
                        <Phone className="h-5 w-5 text-white" aria-hidden />
                    </span>
                    <span className="text-center text-sm font-semibold">{t("helpCenter.callUs")}</span>
                </a>
            )}
            {contact?.email && (
                <a href={`mailto:${contact.email}`} className={channelCardClass}>
                    <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#3f4a3c]">
                        <Mail className="h-5 w-5 text-white" aria-hidden />
                    </span>
                    <span className="text-center text-sm font-semibold">{t("helpCenter.sendEmail")}</span>
                </a>
            )}
            {!hasAnyChannel && (
                <div className="col-span-full py-6 text-center">
                    <p className="text-sm text-custom-secondary">
                        {t("helpCenter.contactUnavailable")}
                    </p>
                </div>
            )}
        </div>
    );
}
