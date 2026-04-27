import { useTranslation } from "react-i18next";
import { HiClock, HiOutlineCalendar } from "react-icons/hi";
import { useLanguage } from "@/context/LanguageContext";
import type { ShopVendorService, LocalizedText } from "../types/shop";

interface Props {
    service: ShopVendorService;
    onBook: (service: ShopVendorService) => void;
}

function pickLocalized(value: LocalizedText | string | null | undefined, lang: "en" | "ar"): string {
    if (!value) return "";
    if (typeof value === "string") return value;
    return value[lang] || value.en || value.ar || "";
}

export default function ShopServiceCard({ service, onBook }: Props) {
    const { t } = useTranslation();
    const { language } = useLanguage();

    const title = pickLocalized(service.service?.name, language);
    const description = pickLocalized(service.service?.description, language);
    const typeName = pickLocalized(service.service?.type?.name, language);
    const isOpen = service.is_open_now ?? true;

    return (
        <div className="rounded-2xl border border-primary-light/15 bg-custom-card p-4 sm:p-5 shadow-sm flex flex-col gap-3">
            <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                    {typeName && (
                        <span className="inline-block text-xs font-semibold text-primary-light bg-primary-light/10 rounded-full px-2.5 py-0.5 mb-2">
                            {typeName}
                        </span>
                    )}
                    <h3 className="text-base sm:text-lg font-semibold text-custom-primary truncate">
                        {title}
                    </h3>
                    {description && (
                        <p className="text-sm text-custom-secondary mt-1 line-clamp-2">
                            {description}
                        </p>
                    )}
                </div>
                <span
                    className={`shrink-0 text-xs font-semibold rounded-full px-2.5 py-1 ${isOpen
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-600"
                        }`}
                >
                    {isOpen
                        ? t("store.openNow", "Open now")
                        : t("store.closed", "Closed")}
                </span>
            </div>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-custom-secondary">
                <div className="flex items-baseline gap-1">
                    <span className="text-lg font-bold text-custom-primary">
                        £{Number(service.price).toFixed(2)}
                    </span>
                    {service.price_unit && (
                        <span className="text-xs text-custom-tertiary">
                            / {service.price_unit}
                        </span>
                    )}
                </div>
                {service.duration_minutes != null && (
                    <span className="inline-flex items-center gap-1">
                        <HiClock className="h-4 w-4" />
                        {t("store.serviceDuration", "{{minutes}} min", {
                            minutes: service.duration_minutes,
                        })}
                    </span>
                )}
            </div>

            <button
                type="button"
                onClick={() => onBook(service)}
                disabled={!isOpen}
                className="mt-1 inline-flex items-center justify-center gap-2 rounded-xl bg-primary-light text-white text-sm font-semibold py-2.5 px-4 transition hover:bg-primary-light/90 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                <HiOutlineCalendar className="h-4 w-4" />
                {t("store.bookService", "Book service")}
            </button>
        </div>
    );
}
