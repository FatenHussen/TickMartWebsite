import { useState, useMemo, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useLanguage } from "@/context/LanguageContext";
import {
    HiOutlineCalendar,
    HiOutlineRefresh,
    HiOutlineClock,
    HiOutlineBell,
    HiChevronLeft,
    HiChevronRight,
} from "react-icons/hi";
import { HiOutlineExclamationTriangle } from "react-icons/hi2";
import Button from "@/shared/ui/Button";
import { cn } from "@/shared/lib/utils";
import { useSchedules } from "../hooks/useSchedules";
import type { ScheduleItem } from "../types";

export type ScheduleDeliveryData = {
    name: string;
    schedule_id: number;
    start_date: string; // YYYY-MM-DD
};

type ScheduleDeliveryProps = {
    onSaveSchedule?: (data: ScheduleDeliveryData) => void;
    onCancelSchedule?: () => void;
    isSaving?: boolean;
};

function formatDateToYYYYMMDD(date: Date): string {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
}

export default function ScheduleDelivery({
    onSaveSchedule,
    onCancelSchedule,
    isSaving = false,
}: ScheduleDeliveryProps) {
    const { t } = useTranslation();
    const { isRTL } = useLanguage();
    const { items: schedules = [], isLoading: isSchedulesLoading } =
        useSchedules();
    const [orderType, setOrderType] = useState<"one_time" | "schedule">(
        "schedule",
    );
    const [selectedScheduleId, setSelectedScheduleId] = useState<number | null>(
        schedules[0]?.id ?? null,
    );
    const [calendarMonth, setCalendarMonth] = useState<Date>(() => new Date());
    const [selectedDate, setSelectedDate] = useState<Date>(() => new Date());

    const activeSchedules = useMemo(
        () => schedules.filter((s: ScheduleItem) => s.is_active !== false),
        [schedules],
    );

    useEffect(() => {
        if (activeSchedules.length > 0 && selectedScheduleId === null) {
            setSelectedScheduleId(activeSchedules[0].id);
        }
    }, [activeSchedules, selectedScheduleId]);

    const selectedSchedule = activeSchedules.find(
        (s: ScheduleItem) => s.id === selectedScheduleId,
    );

    // Auto-generate schedule name from selected schedule
    const scheduleName = selectedSchedule?.name ?? "My Basket";

    const nextDeliveryDate = selectedSchedule
        ? (() => {
              const next = new Date(selectedDate);
              next.setDate(next.getDate() + selectedSchedule.interval_days);
              return next;
          })()
        : null;

    const handleSaveSchedule = () => {
        if (selectedScheduleId != null && onSaveSchedule) {
            onSaveSchedule({
                name: scheduleName,
                schedule_id: selectedScheduleId,
                start_date: formatDateToYYYYMMDD(selectedDate),
            });
        }
    };

    const canSave = selectedScheduleId != null;

    // Calendar - dynamic month from calendarMonth
    const year = calendarMonth.getFullYear();
    const month = calendarMonth.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfWeek = new Date(year, month, 1).getDay();
    const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
    const monthLabel = calendarMonth.toLocaleDateString(undefined, {
        month: "long",
        year: "numeric",
    });

    const goPrevMonth = () =>
        setCalendarMonth((d) => new Date(d.getFullYear(), d.getMonth() - 1, 1));
    const goNextMonth = () =>
        setCalendarMonth((d) => new Date(d.getFullYear(), d.getMonth() + 1, 1));

    const handleDayClick = (day: number) =>
        setSelectedDate(new Date(year, month, day));

    const today = new Date();
    const isToday = (day: number) =>
        today.getDate() === day &&
        today.getMonth() === month &&
        today.getFullYear() === year;

    const weekDays = isRTL
        ? ["SAT", "FRI", "THU", "WED", "TUE", "MON", "SUN"]
        : ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

    return (
        <div
            className="rounded-2xl border border-custom-primary bg-custom-card p-4 sm:p-5 md:p-6 shadow-sm space-y-6"
            dir={isRTL ? "rtl" : "ltr"}
        >
            {/* Repeat this basket? */}
            <section>
                <div className="flex items-center gap-2.5 mb-4">
                    <HeaderIcon icon={<HiOutlineRefresh className="w-4 h-4" />} />
                    <h3 className="text-base sm:text-lg font-bold text-[color:var(--color-text)]">
                        {t("cart.repeatBasket")}?
                    </h3>
                </div>

                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                    <OrderTypeOption
                        value="one_time"
                        currentValue={orderType}
                        onChange={(v) => setOrderType(v)}
                        label={t("cart.oneTimeOrder")}
                        description={t(
                            "cart.oneTimeOrderDescription",
                            "Place this basket as a single order",
                        )}
                        icon={<HiOutlineClock className="w-5 h-5" />}
                    />
                    <OrderTypeOption
                        value="schedule"
                        currentValue={orderType}
                        onChange={(v) => setOrderType(v)}
                        label={t("cart.scheduleDelivery")}
                        description={t(
                            "cart.scheduleDeliveryDescription",
                            "Repeat automatically on your chosen frequency",
                        )}
                        icon={<HiOutlineCalendar className="w-5 h-5" />}
                    />
                </div>
            </section>

            {orderType === "schedule" && (
                <>
                    {/* Delivery Frequency */}
                    <section>
                        <h4 className="mb-3 text-sm font-semibold text-[color:var(--color-text)]">
                            {t("cart.deliveryFrequency", "Delivery Frequency")}
                        </h4>
                        {isSchedulesLoading ? (
                            <div className="flex items-center gap-2">
                                {[1, 2, 3, 4].map((i) => (
                                    <div
                                        key={i}
                                        className="h-9 w-24 rounded-full bg-custom-tertiary animate-pulse"
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="flex flex-wrap items-center gap-2">
                                {activeSchedules.map(
                                    (schedule: ScheduleItem) => {
                                        const isActive =
                                            selectedScheduleId === schedule.id;
                                        return (
                                            <button
                                                key={schedule.id}
                                                type="button"
                                                onClick={() =>
                                                    setSelectedScheduleId(
                                                        schedule.id,
                                                    )
                                                }
                                                className={cn(
                                                    "px-4 py-2 text-xs sm:text-sm font-semibold rounded-full",
                                                    "border transition-all duration-200",
                                                    "focus:outline-none focus-visible:ring-2 focus-visible:ring-[color:color-mix(in_srgb,var(--color-main)_25%,transparent)]",
                                                    isActive
                                                        ? "text-white border-transparent shadow-sm bg-[color:var(--color-api-second)] hover:bg-[color:var(--color-api-second-hover)]"
                                                        : "bg-custom-card text-[color:var(--color-text)]/70 border-custom-primary hover:text-[color:var(--color-text)] hover:border-[color:color-mix(in_srgb,var(--color-main)_35%,transparent)]",
                                                )}
                                            >
                                                {schedule.name}
                                            </button>
                                        );
                                    },
                                )}
                            </div>
                        )}
                    </section>

                    {/* Calendar + Schedule Summary */}
                    <section className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_280px] xl:items-start">
                        <div className="min-w-0">
                            <h4 className="mb-3 text-sm font-semibold text-[color:var(--color-text)]">
                                {t("cart.startDate", "Start Date")}
                            </h4>
                            <div
                                className="rounded-2xl p-3 sm:p-5 md:p-6 border"
                                style={{
                                    background:
                                        "linear-gradient(180deg, color-mix(in srgb, var(--color-main) 6%, var(--color-bg-card)) 0%, color-mix(in srgb, var(--color-main) 3%, var(--color-bg-card)) 100%)",
                                    borderColor:
                                        "color-mix(in srgb, var(--color-main) 25%, transparent)",
                                    boxShadow:
                                        "0 4px 18px -8px color-mix(in srgb, var(--color-main) 25%, transparent)",
                                }}
                            >
                                {/* Calendar header */}
                                <div className="mb-5 flex items-center justify-between">
                                    <button
                                        type="button"
                                        onClick={goPrevMonth}
                                        aria-label="Previous month"
                                        className="flex h-9 w-9 items-center justify-center rounded-full transition-colors hover:bg-custom-card"
                                        style={{
                                            color: "var(--color-main)",
                                        }}
                                    >
                                        {isRTL ? (
                                            <HiChevronRight className="w-5 h-5" />
                                        ) : (
                                            <HiChevronLeft className="w-5 h-5" />
                                        )}
                                    </button>
                                    <h5 className="text-sm sm:text-base font-bold text-[color:var(--color-text)] tracking-wide">
                                        {monthLabel}
                                    </h5>
                                    <button
                                        type="button"
                                        onClick={goNextMonth}
                                        aria-label="Next month"
                                        className="flex h-9 w-9 items-center justify-center rounded-full transition-colors hover:bg-custom-card"
                                        style={{
                                            color: "var(--color-main)",
                                        }}
                                    >
                                        {isRTL ? (
                                            <HiChevronLeft className="w-5 h-5" />
                                        ) : (
                                            <HiChevronRight className="w-5 h-5" />
                                        )}
                                    </button>
                                </div>

                                <div className="mb-3 grid grid-cols-7 gap-1">
                                    {weekDays.map((day) => (
                                        <div
                                            key={day}
                                            className="py-1 text-center text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.1em] sm:tracking-[0.18em] text-custom-tertiary"
                                        >
                                            {day.slice(0, 3)}
                                        </div>
                                    ))}
                                </div>

                                <div className="grid grid-cols-7 gap-y-1.5 sm:gap-y-2">
                                    {Array.from({ length: firstDayOfWeek }).map(
                                        (_, i) => (
                                            <div
                                                key={`empty-${i}`}
                                                className="h-8 w-8 sm:h-9 sm:w-9 justify-self-center"
                                            />
                                        ),
                                    )}
                                    {days.map((day) => {
                                        const isSelected =
                                            selectedDate.getDate() === day &&
                                            selectedDate.getMonth() === month &&
                                            selectedDate.getFullYear() === year;
                                        const today = isToday(day);
                                        return (
                                            <button
                                                key={day}
                                                type="button"
                                                onClick={() =>
                                                    handleDayClick(day)
                                                }
                                                className={cn(
                                                    "relative flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center justify-self-center rounded-full text-xs sm:text-sm font-semibold leading-none transition-all duration-200",
                                                    isSelected
                                                        ? "text-white scale-105"
                                                        : "text-[color:var(--color-text)]/80 hover:bg-custom-card",
                                                )}
                                                style={
                                                    isSelected
                                                        ? {
                                                              backgroundColor:
                                                                  "var(--color-api-second)",
                                                              boxShadow:
                                                                  "0 6px 14px -4px color-mix(in srgb, var(--color-api-second) 50%, transparent)",
                                                          }
                                                        : undefined
                                                }
                                            >
                                                {day}
                                                {today && !isSelected && (
                                                    <span
                                                        className="absolute bottom-1 h-1 w-1 rounded-full"
                                                        style={{
                                                            backgroundColor:
                                                                "var(--color-main)",
                                                        }}
                                                    />
                                                )}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>

                        {/* Schedule Summary + Reminder */}
                        <div className="space-y-3 xl:pt-[34px]">
                            <div
                                className="rounded-2xl p-5 border bg-custom-card"
                                style={{
                                    borderColor:
                                        "color-mix(in srgb, var(--color-main) 30%, transparent)",
                                    boxShadow:
                                        "0 4px 16px -8px color-mix(in srgb, var(--color-main) 22%, transparent)",
                                }}
                            >
                                <div className="flex items-center gap-2.5 mb-4">
                                    <HeaderIcon
                                        icon={
                                            <HiOutlineCalendar className="w-4 h-4" />
                                        }
                                    />
                                    <h4 className="text-sm font-bold text-[color:var(--color-text)]">
                                        {t(
                                            "cart.scheduleSummary",
                                            "Schedule Summary",
                                        )}
                                    </h4>
                                </div>

                                <div className="space-y-3 text-xs">
                                    <SummaryDetail
                                        label={t(
                                            "cart.frequency",
                                            "Frequency",
                                        )}
                                        value={selectedSchedule?.name ?? "-"}
                                    />
                                    <SummaryDetail
                                        label={t(
                                            "cart.startDate",
                                            "Start date",
                                        )}
                                        value={selectedDate.toLocaleDateString(
                                            undefined,
                                            {
                                                month: "short",
                                                day: "numeric",
                                                year: "numeric",
                                            },
                                        )}
                                    />
                                    <SummaryDetail
                                        label={t(
                                            "cart.nextDelivery",
                                            "Next delivery",
                                        )}
                                        value={
                                            nextDeliveryDate?.toLocaleDateString(
                                                undefined,
                                                {
                                                    month: "short",
                                                    day: "numeric",
                                                    year: "numeric",
                                                },
                                            ) ?? "-"
                                        }
                                        highlight
                                    />
                                </div>
                            </div>

                            {/* Reminder */}
                            <div
                                className="rounded-xl px-3.5 py-3 border"
                                style={{
                                    backgroundColor:
                                        "var(--color-ui-amber-50)",
                                    borderColor:
                                        "var(--color-ui-amber-200)",
                                }}
                            >
                                <div className="flex items-start gap-2">
                                    <HiOutlineBell
                                        className="mt-0.5 h-4 w-4 shrink-0"
                                        style={{
                                            color: "var(--color-ui-amber-400)",
                                        }}
                                    />
                                    <p
                                        className="text-[11px] font-medium leading-[1.45]"
                                        style={{
                                            color: "var(--color-ui-amber-900)",
                                        }}
                                    >
                                        {t(
                                            "cart.scheduleReminderNote",
                                            "We'll remind you 1 day before each delivery. If you don't confirm or cancel the reminder, this scheduled basket will be cancelled automatically.",
                                        )}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Action buttons */}
                    <div
                        className="flex flex-col sm:flex-row sm:flex-wrap sm:items-center gap-3 border-t pt-5"
                        style={{
                            borderColor:
                                "color-mix(in srgb, var(--color-main) 18%, transparent)",
                        }}
                    >
                        <Button
                            onClick={handleSaveSchedule}
                            disabled={!canSave || isSaving}
                            className={cn(
                                "h-12 w-full sm:w-auto sm:min-w-[160px] rounded-xl px-6 text-sm font-semibold text-white transition-all duration-200",
                                "!bg-[color:var(--color-api-second)] hover:!bg-[color:var(--color-api-second-hover)] hover:-translate-y-0.5",
                                "shadow-[0_8px_22px_-8px_color-mix(in_srgb,var(--color-main)_45%,transparent)]",
                                "disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0",
                            )}
                        >
                            {isSaving
                                ? t("cart.saving", "Saving…")
                                : t("cart.saveSchedule", "Save schedule")}
                        </Button>
                        <Button
                            onClick={onCancelSchedule}
                            variant="outline"
                            className={cn(
                                "h-12 w-full sm:w-auto sm:min-w-[160px] rounded-xl px-6 text-sm font-medium",
                                "!bg-custom-card !border !border-custom-primary text-[color:var(--color-text)]/80",
                                "hover:!border-[color:color-mix(in_srgb,var(--color-main)_35%,transparent)] hover:!bg-custom-hover hover:text-[color:var(--color-text)]",
                                "transition-all duration-200",
                            )}
                        >
                            {t("cart.cancelSchedule", "Cancel schedule")}
                        </Button>
                    </div>
                </>
            )}

            {orderType === "one_time" && (
                <div
                    className="rounded-xl px-4 py-3 text-sm flex items-start gap-2"
                    style={{
                        backgroundColor:
                            "color-mix(in srgb, var(--color-main) 6%, var(--color-bg-card))",
                        border:
                            "1px solid color-mix(in srgb, var(--color-main) 22%, transparent)",
                        color: "var(--color-text)",
                    }}
                >
                    <HiOutlineExclamationTriangle
                        className="w-5 h-5 shrink-0 mt-0.5"
                        style={{ color: "var(--color-main)" }}
                    />
                    <span className="leading-relaxed text-[color:var(--color-text)]/80">
                        {t(
                            "cart.oneTimeOrderHint",
                            "This will be placed as a single order. Switch to “Schedule delivery” to repeat this basket automatically.",
                        )}
                    </span>
                </div>
            )}
        </div>
    );
}

type OrderTypeOptionProps = {
    value: "one_time" | "schedule";
    currentValue: "one_time" | "schedule";
    onChange: (v: "one_time" | "schedule") => void;
    label: string;
    description: string;
    icon: React.ReactNode;
};

function OrderTypeOption({
    value,
    currentValue,
    onChange,
    label,
    description,
    icon,
}: OrderTypeOptionProps) {
    const isActive = currentValue === value;
    return (
        <label
            className={cn(
                "group relative flex cursor-pointer items-start gap-3 rounded-2xl",
                "px-4 py-3.5 transition-all duration-200",
                "border bg-custom-card",
                "focus-within:ring-2 focus-within:ring-[color:color-mix(in_srgb,var(--color-main)_25%,transparent)]",
                isActive
                    ? "border-[color:color-mix(in_srgb,var(--color-main)_55%,transparent)] shadow-[0_4px_18px_-8px_color-mix(in_srgb,var(--color-main)_35%,transparent)]"
                    : "border-custom-primary hover:-translate-y-0.5 hover:border-[color:color-mix(in_srgb,var(--color-main)_35%,transparent)] hover:shadow-sm",
            )}
        >
            <input
                type="radio"
                name="orderType"
                value={value}
                checked={isActive}
                onChange={(e) =>
                    onChange(e.target.value as "one_time" | "schedule")
                }
                className="sr-only"
            />
            <span
                className={cn(
                    "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-colors",
                    isActive ? "text-white" : "",
                )}
                style={
                    isActive
                        ? {
                              background:
                                  "linear-gradient(135deg, var(--color-main), var(--color-api-second))",
                          }
                        : {
                              backgroundColor:
                                  "color-mix(in srgb, var(--color-main) 10%, var(--color-bg-card))",
                              color: "var(--color-main)",
                          }
                }
            >
                {icon}
            </span>
            <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                    <span className="text-sm font-semibold text-[color:var(--color-text)]">
                        {label}
                    </span>
                    <span
                        className={cn(
                            "flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2 transition-all",
                            isActive
                                ? "border-[color:var(--color-api-second)]"
                                : "border-custom-primary",
                        )}
                        aria-hidden
                    >
                        {isActive && (
                            <span
                                className="h-2 w-2 rounded-full"
                                style={{
                                    backgroundColor:
                                        "var(--color-api-second)",
                                }}
                            />
                        )}
                    </span>
                </div>
                <p className="mt-0.5 text-xs text-custom-secondary leading-snug">
                    {description}
                </p>
            </div>
        </label>
    );
}

function HeaderIcon({ icon }: { icon: React.ReactNode }) {
    return (
        <span
            className="flex h-8 w-8 items-center justify-center rounded-lg"
            style={{
                background:
                    "color-mix(in srgb, var(--color-main) 12%, var(--color-bg-card))",
                color: "var(--color-main)",
            }}
        >
            {icon}
        </span>
    );
}

type SummaryDetailProps = {
    label: string;
    value: string;
    highlight?: boolean;
};

function SummaryDetail({ label, value, highlight }: SummaryDetailProps) {
    return (
        <div className="flex items-center justify-between gap-3 leading-none">
            <span className="text-custom-secondary">{label}:</span>
            <span
                className="text-right font-bold tabular-nums"
                style={
                    highlight
                        ? { color: "var(--color-main)" }
                        : { color: "var(--color-text)" }
                }
            >
                {value}
            </span>
        </div>
    );
}
