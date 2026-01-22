import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useLanguage } from "@/context/LanguageContext";
import { HiExclamationCircle } from "react-icons/hi";
import Button from "@/shared/ui/Button";
import { cn } from "@/shared/lib/utils";

type ScheduleDeliveryProps = {
  onSaveSchedule?: () => void;
  onCancelSchedule?: () => void;
};

type DeliveryFrequency = "every_3_days" | "weekly" | "every_2_weeks" | "monthly";

export default function ScheduleDelivery({
  onSaveSchedule,
  onCancelSchedule,
}: ScheduleDeliveryProps) {
  const { t } = useTranslation();
  const { isRTL } = useLanguage();
  const [orderType, setOrderType] = useState<"one_time" | "schedule">("schedule");
  const [frequency, setFrequency] = useState<DeliveryFrequency>("every_3_days");
  const [selectedDate, setSelectedDate] = useState<Date>(new Date(2021, 8, 19)); // Sept 19, 2021 (for calendar display)
  const [scheduleStartDate] = useState<Date>(new Date(2024, 0, 14)); // Jan 14, 2024 (for summary)

  const frequencyOptions: { value: DeliveryFrequency; label: string }[] = [
    { value: "every_3_days", label: "Every 3 days" },
    { value: "weekly", label: "Weekly" },
    { value: "every_2_weeks", label: "Every 2 weeks" },
    { value: "monthly", label: "Monthly" },
  ];

  const getNextDeliveryDate = (startDate: Date, freq: DeliveryFrequency): Date => {
    const next = new Date(startDate);
    switch (freq) {
      case "every_3_days":
        next.setDate(next.getDate() + 3);
        break;
      case "weekly":
        next.setDate(next.getDate() + 7);
        break;
      case "every_2_weeks":
        next.setDate(next.getDate() + 14);
        break;
      case "monthly":
        next.setMonth(next.getMonth() + 1);
        break;
    }
    return next;
  };

  const formatDate = (date: Date): string => {
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const nextDelivery = getNextDeliveryDate(scheduleStartDate, frequency);

  // Simple calendar - showing September 2021 as in the image
  const calendarDate = new Date(2021, 8, 1); // September 2021 (month is 0-indexed)
  const daysInMonth = new Date(2021, 9, 0).getDate(); // Last day of September
  const firstDayOfWeek = calendarDate.getDay(); // Day of week for Sept 1, 2021 (Wednesday = 3)
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  
  // Calendar day labels as shown in image: "SAN", "MON", "TUE", etc.
  const weekDays = isRTL 
    ? ["SAT", "FRI", "THU", "WED", "TUE", "MON", "SAN"]
    : ["SAN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

  return (
    <div className="bg-custom-primary rounded-xl border border-custom-secondary p-6 space-y-6" dir={isRTL ? "rtl" : "ltr"}>
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
              checked={orderType === "one_time"}
              onChange={(e) => setOrderType(e.target.value as "one_time" | "schedule")}
              className="w-5 h-5 text-primary-light border-gray-light focus:ring-primary-light focus:ring-2"
            />
            <span className="text-custom-primary font-medium">{t("cart.oneTimeOrder")}</span>
          </label>
          
          {/* Schedule delivery option */}
          <label className="flex items-center gap-3 cursor-pointer flex-1 bg-blue-off rounded-xl p-4 border border-transparent hover:border-primary-light/30 transition-colors">
            <input
              type="radio"
              name="orderType"
              value="schedule"
              checked={orderType === "schedule"}
              onChange={(e) => setOrderType(e.target.value as "one_time" | "schedule")}
              className="w-5 h-5 text-primary-light border-gray-light focus:ring-primary-light focus:ring-2"
            />
            <span className="text-custom-primary font-medium">{t("cart.scheduleDelivery")}</span>
          </label>
        </div>
      </div>

      {orderType === "schedule" && (
        <>
          {/* Delivery Frequency */}
          <div>
            <h4 className="text-base font-semibold text-custom-primary mb-3">
              Delivery Frequency
            </h4>
            <div className="flex items-center gap-2 flex-wrap">
              {frequencyOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setFrequency(option.value)}
                  className={cn(
                    "px-4 py-2 rounded-lg font-medium text-sm transition-colors",
                    frequency === option.value
                      ? "bg-primary-light text-white"
                      : "bg-gray-bold text-custom-secondary hover:bg-custom-hover"
                  )}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">

          {/* Start Date & Calendar */}
          <div>
            <h4 className="text-base font-semibold text-custom-primary mb-3">
              Start Date
            </h4>
            <div className="bg-blue-off rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <h5 className="font-semibold text-custom-primary">September 2021</h5>
                <div className="flex items-center gap-2">
                  <button 
                    className="p-1 hover:bg-white rounded transition-colors"
                    aria-label="Previous month"
                  >
                    <span className="text-custom-primary text-lg">{"<"}</span>
                  </button>
                  <button 
                    className="p-1 hover:bg-white rounded transition-colors"
                    aria-label="Next month"
                  >
                    <span className="text-custom-primary text-lg">{">"}</span>
                  </button>
                </div>
              </div>
              
              <div className="grid grid-cols-7 gap-1 mb-2">
                {weekDays.map((day) => (
                  <div key={day} className="text-center text-xs font-medium text-custom-secondary py-2">
                    {day}
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-7 gap-1">
                {Array.from({ length: firstDayOfWeek }).map((_, i) => (
                  <div key={`empty-${i}`} className="aspect-square" />
                ))}
                {days.map((day) => {
                  const isSelected = selectedDate.getDate() === day && 
                                    selectedDate.getMonth() === 8 && 
                                    selectedDate.getFullYear() === 2021;
                  return (
                    <button
                      key={day}
                      onClick={() => setSelectedDate(new Date(2021, 8, day))}
                      className={cn(
                        "aspect-square rounded-lg text-sm font-medium transition-colors",
                        isSelected
                          ? "bg-primary-light text-white"
                          : "text-custom-primary hover:bg-white"
                      )}
                    >
                      {day}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

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
                  {frequencyOptions.find((opt) => opt.value === frequency)?.label}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-custom-secondary">Start date:</span>
                <span className="text-custom-primary font-medium">
                  Jan 14, 2024
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-custom-secondary">Next delivery:</span>
                <span className="text-custom-primary font-medium">
                  Jan 17, 2024
                </span>
              </div>
            </div>
          </div>

          {/* Reminder Message */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-start gap-3">
            <HiExclamationCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
            <p className="text-sm text-custom-primary">
              We'll remind you 1 day before each delivery. If you don't confirm or cancel the reminder, this scheduled basket will be cancelled automatically.
            </p>
          </div>

          {/* Schedule Action Buttons */}
          <div className="flex items-center gap-4">
            <Button
              onClick={onSaveSchedule}
              className="flex-1 bg-primary-light hover:opacity-90 text-white"
            >
              Save schedule
            </Button>
            <Button
              onClick={onCancelSchedule}
              variant="outline"
              className="flex-1 bg-gray-bold hover:bg-custom-hover"
            >
              Cancel schedule
            </Button>
          </div>

          </div>
          </div>
        </>
      )}
    </div>
  );
}
