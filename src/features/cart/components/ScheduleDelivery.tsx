import { useState, useMemo, useEffect } from"react";
import { useTranslation } from"react-i18next";
import { useLanguage } from"@/context/LanguageContext";
import { HiExclamationCircle } from"react-icons/hi";
import Button from"@/shared/ui/Button";
import { cn } from"@/shared/lib/utils";
import { useSchedules } from"../hooks/useSchedules";
import type { ScheduleItem } from"../types";

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
 const m = String(date.getMonth() + 1).padStart(2,"0");
 const d = String(date.getDate()).padStart(2,"0");
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
 const [orderType, setOrderType] = useState<"one_time"|"schedule">(
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
 const scheduleName = selectedSchedule?.name ??"My Basket";

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
 month:"long",
 year:"numeric",
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
 ? ["SAT","FRI","THU","WED","TUE","MON","SAN"]
 : ["SAN","MON","TUE","WED","THU","FRI","SAT"];

 return (
 <div
 className="bg-custom-primary rounded-xl border border-custom-secondary p-6 space-y-6"
 dir={isRTL ?"rtl":"ltr"}
 >
 {/* Repeat this basket? */}
 <div>
 <h3 className="text-lg font-bold text-custom-primary mb-4">
 {t("cart.repeatBasket")}?
 </h3>
 <div className="flex items-center gap-4">
 {/* One-time order option */}
 <label className="flex items-center gap-3 cursor-pointer flex-1 bg-blue-off rounded-xl p-4 border border-transparent hover:border-primary-light/30 transition-colors">
 <input
 type="radio"
 name="orderType"
 value="one_time"
 checked={orderType ==="one_time"}
 onChange={(e) =>
 setOrderType(e.target.value as"one_time"|"schedule")
 }
 className="w-5 h-5 text-primary-light border-gray-light focus:ring-primary-light focus:ring-2"
 />
 <span className="text-custom-primary font-medium">
 {t("cart.oneTimeOrder")}
 </span>
 </label>

 {/* Schedule delivery option */}
 <label className="flex items-center gap-3 cursor-pointer flex-1 bg-blue-off rounded-xl p-4 border border-transparent hover:border-primary-light/30 transition-colors">
 <input
 type="radio"
 name="orderType"
 value="schedule"
 checked={orderType ==="schedule"}
 onChange={(e) =>
 setOrderType(e.target.value as"one_time"|"schedule")
 }
 className="w-5 h-5 text-primary-light border-gray-light focus:ring-primary-light focus:ring-2"
 />
 <span className="text-custom-primary font-medium">
 {t("cart.scheduleDelivery")}
 </span>
 </label>
 </div>
 </div>

 {orderType ==="schedule"&& (
 <>
 {/* Delivery Frequency */}
 <div>
 <h4 className="text-base font-semibold text-custom-primary mb-3">
 Delivery Frequency
 </h4>
 {isSchedulesLoading ? (
 <div className="text-custom-secondary text-sm">Loading...</div>
 ) : (
 <div className="flex items-center gap-2 flex-wrap">
 {activeSchedules.map((schedule: ScheduleItem) => (
 <button
 key={schedule.id}
 onClick={() => setSelectedScheduleId(schedule.id)}
 className={cn(
"px-4 py-2 rounded-lg font-medium text-sm transition-colors",
 selectedScheduleId === schedule.id
 ?"bg-primary-light text-white"
 :"bg-custom-muted dark:bg-custom-hover text-custom-secondary hover:bg-custom-hover",
 )}
 >
 {schedule.name}
 </button>
 ))}
 </div>
 )}
 </div>

 {/* Start Date + Schedule Summary */}
 <div className="grid grid-cols-2 gap-4">
 {/* Start Date & Calendar */}
 <div>
 <h4 className="text-base font-semibold text-custom-primary mb-3">
 Start Date
 </h4>
 <div className="bg-blue-off rounded-lg p-4">
 {/* Calendar header: < Month Year > */}
 <div className="flex items-center justify-between mb-4">
 <button
 type="button"
 onClick={goPrevMonth}
 className="p-1 hover:bg-custom-card rounded transition-colors"
 aria-label="Previous month"
 >
 <span className="text-custom-primary text-lg">{"<"}</span>
 </button>
 <h5 className="font-semibold text-custom-primary text-sm">
 {monthLabel}
 </h5>
 <button
 type="button"
 onClick={goNextMonth}
 className="p-1 hover:bg-custom-card rounded transition-colors"
 aria-label="Next month"
 >
 <span className="text-custom-primary text-lg">{">"}</span>
 </button>
 </div>

 <div className="grid grid-cols-7 gap-1 mb-2">
 {weekDays.map((day) => (
 <div
 key={day}
 className="text-center text-xs font-medium text-custom-secondary py-2"
 >
 {day}
 </div>
 ))}
 </div>

 <div className="grid grid-cols-7 gap-1">
 {Array.from({ length: firstDayOfWeek }).map((_, i) => (
 <div key={`empty-${i}`} className="aspect-square"/>
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
"aspect-square rounded-lg text-sm font-medium transition-colors",
 isSelected
 ?"bg-primary-light text-white"
 :"text-custom-primary hover:bg-custom-card",
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
 <div className="flex flex-col gap-4">
 {/* Schedule Summary */}
 <div className="bg-blue-off rounded-lg p-4 border border-primary-light/20">
 <h4 className="text-base font-semibold text-custom-primary mb-3">
 Schedule Summary
 </h4>
 <div className="space-y-2 text-sm">
 <div className="flex justify-between">
 <span className="text-custom-secondary">Frequency:</span>
 <span className="text-custom-primary font-medium">
 {selectedSchedule?.name ??"-"}
 </span>
 </div>
 <div className="flex justify-between">
 <span className="text-custom-secondary">Start date:</span>
 <span className="text-custom-primary font-medium">
 {selectedDate.toLocaleDateString(undefined, {
 month:"short",
 day:"numeric",
 year:"numeric",
 })}
 </span>
 </div>
 <div className="flex justify-between">
 <span className="text-custom-secondary">
 Next delivery:
 </span>
 <span className="text-custom-primary font-medium">
 {nextDeliveryDate?.toLocaleDateString(undefined, {
 month:"short",
 day:"numeric",
 year:"numeric",
 }) ??"-"}
 </span>
 </div>
 </div>
 </div>

 {/* Reminder Message */}
 <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-start gap-3">
 <HiExclamationCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5"/>
 <p className="text-sm text-custom-primary">
 We'll remind you 1 day before each delivery. If you don't
 confirm or cancel the reminder, this scheduled basket will be
 cancelled automatically.
 </p>
 </div>
 </div>
 </div>

 {/* Schedule Action Buttons — outside grid, at the bottom */}
 <div className="flex items-center gap-4">
 <Button
 onClick={handleSaveSchedule}
 disabled={!canSave || isSaving}
 className="bg-primary-light hover:opacity-90 text-white disabled:opacity-50 disabled:cursor-not-allowed"
 >
 {isSaving
 ? t("cart.saving","Saving...")
 : t("cart.saveSchedule","Save schedule")}
 </Button>
 <Button
 onClick={onCancelSchedule}
 variant="outline"
 className="bg-custom-muted dark:bg-custom-hover hover:bg-custom-hover"
 >
 Cancel schedule
 </Button>
 </div>
 </>
 )}
 </div>
 );
}
