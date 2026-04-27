import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useMutation } from "@tanstack/react-query";
import DatePicker, { registerLocale } from "react-datepicker";
import { ar, enUS } from "date-fns/locale";
import "react-datepicker/dist/react-datepicker.css";
import BasePopup from "@/shared/component/BasePopup";
import { useLanguage } from "@/context/LanguageContext";
import { _ShopApi } from "../api/shopApi";
import type { ShopVendorService, LocalizedText } from "../types/shop";

registerLocale("ar", ar);
registerLocale("en", enUS);

interface Props {
    open: boolean;
    onClose: () => void;
    service: ShopVendorService | null;
    shopId: number;
}

const DAY_KEYS = [
    "sunday",
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
] as const;

function pickLocalized(value: LocalizedText | string | null | undefined, lang: "en" | "ar"): string {
    if (!value) return "";
    if (typeof value === "string") return value;
    return value[lang] || value.en || value.ar || "";
}

function formatISODate(d: Date): string {
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
}

export default function BookServiceModal({ open, onClose, service, shopId }: Props) {
    const { t } = useTranslation();
    const { language } = useLanguage();
    const [date, setDate] = useState<Date | null>(null);
    const [time, setTime] = useState("");
    const [notes, setNotes] = useState("");

    const resetAndClose = () => {
        setDate(null);
        setTime("");
        setNotes("");
        onClose();
    };

    const createOrder = useMutation({
        mutationFn: _ShopApi.createServiceOrder,
        onSuccess: () => {
            resetAndClose();
        },
    });

    const today = useMemo(() => {
        const d = new Date();
        d.setHours(0, 0, 0, 0);
        return d;
    }, []);

    const isDayOpen = (d: Date): boolean => {
        if (!service?.schedule) return true;
        const key = DAY_KEYS[d.getDay()];
        const slot = service.schedule[key];
        if (!slot) return false;
        return !slot.closed;
    };

    const dayWindow = useMemo(() => {
        if (!date || !service?.schedule) return null;
        const key = DAY_KEYS[date.getDay()];
        const slot = service.schedule[key];
        if (!slot || slot.closed) return null;
        return { open: slot.open, close: slot.close };
    }, [date, service]);

    const timeError = useMemo(() => {
        if (!time || !dayWindow?.open || !dayWindow?.close) return null;
        if (time < dayWindow.open || time > dayWindow.close) {
            return t("store.booking.outsideHours", "Time must be between {{open}} and {{close}}", {
                open: dayWindow.open,
                close: dayWindow.close,
            });
        }
        return null;
    }, [time, dayWindow, t]);

    const submitting = createOrder.isPending;
    const canSubmit = !!service && !!date && !!time && !timeError && !submitting;

    const handleClose = () => {
        if (createOrder.isPending) return;
        resetAndClose();
    };

    const handleSubmit = () => {
        if (!canSubmit || !service || !date) return;
        const vendorServiceId = service.service?.id;
        if (vendorServiceId == null) return;
        createOrder.mutate({
            shop_id: shopId,
            vendor_service_id: vendorServiceId,
            date: formatISODate(date),
            time,
            ...(notes.trim() ? { notes: notes.trim() } : {}),
        });
    };

    const title = service ? pickLocalized(service.service?.name, language) : "";
    const datepickerLocale = language === "ar" ? "ar" : "en";

    return (
        <BasePopup
            isOpen={open}
            onClose={handleClose}
            maxWidth="md"
            title={t("store.booking.title", "Book service")}
            description={title || undefined}
            contentClassName="text-left rtl:text-right"
        >
            <div className="space-y-4 mt-2">
                <div>
                    <label className="block text-sm font-medium text-custom-primary mb-1.5">
                        {t("store.booking.date", "Date")}
                    </label>
                    <DatePicker
                        selected={date}
                        onChange={(d) => setDate(d)}
                        minDate={today}
                        filterDate={isDayOpen}
                        locale={datepickerLocale}
                        dateFormat="yyyy-MM-dd"
                        placeholderText={t("store.booking.pickDate", "Pick a date")}
                        wrapperClassName="w-full"
                        className="w-full rounded-xl border border-primary-light/20 bg-white text-custom-primary py-2.5 px-3 focus:outline-none focus:ring-2 focus:ring-primary-light/20"
                        popperClassName="z-[100000]"
                        showPopperArrow={false}
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-custom-primary mb-1.5">
                        {t("store.booking.time", "Time")}
                        {dayWindow?.open && dayWindow?.close && (
                            <span className="text-xs text-custom-tertiary font-normal ml-2 rtl:mr-2 rtl:ml-0">
                                ({dayWindow.open} – {dayWindow.close})
                            </span>
                        )}
                    </label>
                    <input
                        type="time"
                        value={time}
                        min={dayWindow?.open}
                        max={dayWindow?.close}
                        onChange={(e) => setTime(e.target.value)}
                        disabled={!date}
                        className="w-full rounded-xl border border-primary-light/20 bg-white text-custom-primary py-2.5 px-3 focus:outline-none focus:ring-2 focus:ring-primary-light/20 disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                    {timeError && (
                        <p className="text-xs text-red-600 mt-1">{timeError}</p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium text-custom-primary mb-1.5">
                        {t("store.booking.notes", "Notes")}
                        <span className="text-xs text-custom-tertiary font-normal ml-2 rtl:mr-2 rtl:ml-0">
                            ({t("common.optional", "Optional")})
                        </span>
                    </label>
                    <textarea
                        rows={3}
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder={t("store.booking.notesPlaceholder", "Add any extra details for the provider")}
                        className="w-full rounded-xl border border-primary-light/20 bg-white text-custom-primary py-2.5 px-3 resize-none focus:outline-none focus:ring-2 focus:ring-primary-light/20"
                    />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                    <button
                        type="button"
                        onClick={handleClose}
                        disabled={submitting}
                        className="rounded-xl border border-primary-light/20 bg-white text-custom-primary text-sm font-semibold py-2.5 px-4 hover:bg-custom-secondary/40 disabled:opacity-50"
                    >
                        {t("common.cancel", "Cancel")}
                    </button>
                    <button
                        type="button"
                        onClick={handleSubmit}
                        disabled={!canSubmit}
                        className="rounded-xl bg-primary-light text-white text-sm font-semibold py-2.5 px-5 hover:bg-primary-light/90 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {submitting
                            ? t("common.sending", "Sending...")
                            : t("store.booking.confirm", "Confirm booking")}
                    </button>
                </div>
            </div>
        </BasePopup>
    );
}
