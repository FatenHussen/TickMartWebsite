import { useState, useMemo, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useLanguage } from "@/context/LanguageContext";
import { HiExclamationCircle } from "react-icons/hi";
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
    const { items: schedules = [], isLoading: isSchedulesLoading } = useSchedules();
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
        (s: ScheduleItem) => s.id === selectedScheduleId
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

    const goPrevMonth = () => {
        setCalendarMonth((d) => new Date(d.getFullYear(), d.getMonth() - 1, 1));
    };
    const goNextMonth = () => {
        setCalendarMonth((d) => new Date(d.getFullYear(), d.getMonth() + 1, 1));
    };

    const handleDayClick = (day: number) => {
        setSelectedDate(new Date(year, month, day));
    };

    // Calendar day labels
    const weekDays = isRTL
        ? ["SAT", "FRI", "THU", "WED", "TUE", "MON", "SAN"]
        : ["SAN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

    return (
        <div
            className="space-y-6 rounded-xl border border-custom-secondary bg-custom-primary p-6"
            dir={isRTL ? "rtl" : "ltr"}
        >
            {/* Repeat this basket? */}
            <div>
                <h3 className="text-lg font-bold text-custom-primary mb-4">
                    {t("cart.repeatBasket")}?
                </h3>
                <div className="grid grid-cols-1 gap-3 md:grid-cols-2 md:gap-4">
                    {/* One-time order option */}
                    <label className="flex min-h-[42px] cursor-pointer items-center gap-2 rounded-[8px] border border-[#E8EEF6] bg-[#F7FBFF] px-4 py-2 transition-colors hover:border-[#B9E7F5]">
                        <input
                            type="radio"
                            name="orderType"
                            value="one_time"
                            checked={orderType === "one_time"}
                            onChange={(e) =>
                                setOrderType(e.target.value as "one_time" | "schedule")
                            }
                            className="h-4 w-4 border-gray-light text-primary-light focus:ring-2 focus:ring-primary-light"
                        />
                        <span className="text-sm font-medium text-[#303030]">
                            {t("cart.oneTimeOrder")}
                        </span>
                    </label>

                    {/* Schedule delivery option */}
                    <label className="flex min-h-[42px] cursor-pointer items-center gap-2 rounded-[8px] border border-[#E8EEF6] bg-[#F7FBFF] px-4 py-2 transition-colors hover:border-[#B9E7F5]">
                        <input
                            type="radio"
                            name="orderType"
                            value="schedule"
                            checked={orderType === "schedule"}
                            onChange={(e) =>
                                setOrderType(e.target.value as "one_time" | "schedule")
                            }
                            className="h-4 w-4 border-gray-light text-primary-light focus:ring-2 focus:ring-primary-light"
                        />
                        <span className="text-sm font-medium text-[#303030]">
                            {t("cart.scheduleDelivery")}
                        </span>
                    </label>
                </div>
            </div>

            {orderType === "schedule" && (
                <>
                    {/* Delivery Frequency */}
                    <div>
                        <h4 className="mb-3 text-base font-semibold text-[#303030]">
                            Delivery Frequency
                        </h4>
                        {isSchedulesLoading ? (
                            <div className="text-custom-secondary text-sm">Loading...</div>
                        ) : (
                            <div className="flex flex-wrap items-center gap-2">
                                {activeSchedules.map((schedule: ScheduleItem) => (
                                    <button
                                        key={schedule.id}
                                        onClick={() => setSelectedScheduleId(schedule.id)}
                                        className={cn(
                                            "min-h-[42px] rounded-[8px] border px-4 py-2 text-sm font-medium leading-none transition-all",
                                            selectedScheduleId === schedule.id
                                                ? "border-[#4CDAF6] bg-[#EEF9FF] text-[#00AED1] shadow-[0_0_0_1px_rgba(76,218,246,0.05)]"
                                                : "border-[#9ADDF2] bg-white text-[#5F6C7B] hover:border-[#4CDAF6] hover:text-[#00AED1]",
                                        )}
                                    >
                                        {schedule.name}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Start Date + Schedule Summary */}
                    <div className="grid gap-4 xl:grid-cols-[minmax(0,447px)_259px] xl:items-start xl:justify-between">
                        {/* Start Date & Calendar */}
                        <div className="min-w-0">
                            <h4 className="mb-3 text-base font-semibold text-[#303030]">
                                Start Date
                            </h4>
                            <div className="rounded-[12px] border-2 border-[#8DDAF1] bg-[radial-gradient(circle_at_top,#F7FCFF_0%,#E6F3FD_62%,#EAF5FF_100%)] px-7 pb-9 pt-7 shadow-[0_4px_18px_rgba(0,174,209,0.18)]">
                                {/* Calendar header: < Month Year > */}
                                <div className="mb-6 flex items-center justify-between">
                                    <button
                                        type="button"
                                        onClick={goPrevMonth}
                                        className="rounded-full p-1 text-[#00AED1] transition-colors hover:bg-white/60"
                                        aria-label="Previous month"
                                    >
                                        <span className="text-[28px] leading-none">{"‹"}</span>
                                    </button>
                                    <h5 className="text-[15px] font-semibold text-[#303030]">
                                        {monthLabel}
                                    </h5>
                                    <button
                                        type="button"
                                        onClick={goNextMonth}
                                        className="rounded-full p-1 text-[#00AED1] transition-colors hover:bg-white/60"
                                        aria-label="Next month"
                                    >
                                        <span className="text-[28px] leading-none">{"›"}</span>
                                    </button>
                                </div>

                                <div className="mb-4 grid grid-cols-7 gap-y-2">
                                    {weekDays.map((day) => (
                                        <div
                                            key={day}
                                            className="py-1 text-center text-[13px] font-medium uppercase tracking-[0.2em] text-[#8F96A3]"
                                        >
                                            {day}
                                        </div>
                                    ))}
                                </div>

                                <div className="grid grid-cols-7 gap-y-3">
                                    {Array.from({ length: firstDayOfWeek }).map((_, i) => (
                                        <div key={`empty-${i}`} className="h-[34px] w-[34px] justify-self-center" />
                                    ))}
                                    {days.map((day) => {
                                        const isSelected =
                                            selectedDate.getDate() === day &&
                                            selectedDate.getMonth() === month &&
                                            selectedDate.getFullYear() === year;
                                        return (
                                            <button
                                                key={day}
                                                type="button"
                                                onClick={() => handleDayClick(day)}
                                                className={cn(
                                                    "flex h-[34px] w-[34px] items-center justify-center justify-self-center rounded-full text-[15px] font-semibold leading-none transition-colors",
                                                    isSelected
                                                        ? "bg-[#00B5E2] text-white shadow-[0_6px_14px_rgba(0,181,226,0.35)]"
                                                        : "text-[#4F5F72] hover:bg-white/70",
                                                )}
                                            >
                                                {day}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>

                        {/* Right column: Schedule Summary + Reminder */}
                        <div className="flex flex-col gap-3 xl:pt-[34px]">
                            {/* Schedule Summary */}
                            <div className="w-full max-w-[259px] rounded-[12px] border border-[#4CDAF6] bg-[linear-gradient(180deg,#EAF5FF_0%,#F2FAFF_100%)] px-4 py-4 shadow-[0_4px_20px_0_rgba(0,174,209,0.18)]">
                                <h4 className="mb-4 text-[15px] font-semibold leading-none text-[#2B2B2B]">
                                    Schedule Summary
                                </h4>
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between gap-3 text-[13px] leading-none">
                                        <span className="text-[#6B7280]">Frequency:</span>
                                        <span className="text-right font-semibold text-[#2B2B2B]">
                                            {selectedSchedule?.name ?? "-"}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between gap-3 text-[13px] leading-none">
                                        <span className="text-[#6B7280]">Start date:</span>
                                        <span className="text-right font-semibold text-[#2B2B2B]">
                                            {selectedDate.toLocaleDateString(undefined, {
                                                month: "short",
                                                day: "numeric",
                                                year: "numeric",
                                            })}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between gap-3 text-[13px] leading-none">
                                        <span className="text-[#6B7280]">
                                            Next delivery:
                                        </span>
                                        <span className="text-right font-semibold text-[#2B2B2B]">
                                            {nextDeliveryDate?.toLocaleDateString(undefined, {
                                                month: "short",
                                                day: "numeric",
                                                year: "numeric",
                                            }) ?? "-"}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Reminder Message */}
                            <div className="w-full max-w-[227px] rounded-[8px] border border-[#F4D35E] bg-[#FFF9E8] px-3 py-3">
                                <div className="flex items-start gap-2">
                                    <HiExclamationCircle className="mt-0.5 h-4 w-4 shrink-0 text-[#FF6B57]" />
                                    <p className="text-[10px] font-medium leading-[1.35] text-[#FF6B57]">
                                        We'll remind you 1 day before each delivery. If you don't
                                        confirm or cancel the reminder, this scheduled basket will be
                                        cancelled automatically.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Schedule Action Buttons — outside grid, at the bottom */}
                    <div className="flex flex-wrap items-center gap-3 border-t border-[#B9EDF7] pt-5">
                        <Button
                            onClick={handleSaveSchedule}
                            disabled={!canSave || isSaving}
                            className="h-[50px] min-w-[173px] rounded-[12px] border border-[#2C8090] bg-[linear-gradient(180deg,#4CDAF6_0%,#2C8090_100%)] px-6 text-[15px] font-semibold text-white shadow-[0_10px_24px_rgba(44,128,144,0.24)] hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {isSaving
                                ? t("cart.saving", "Saving...")
                                : t("cart.saveSchedule", "Save schedule")}
                        </Button>
                        <Button
                            onClick={onCancelSchedule}
                            variant="outline"
                            className="h-[50px] min-w-[173px] rounded-[12px] border border-[#87D7EB] bg-white px-6 text-[15px] font-medium text-[#5F6C7B] hover:bg-[#F7FCFF]"
                        >
                            Cancel schedule
                        </Button>
                    </div>
                </>
            )}
        </div>
    );
}
