import { HiClock } from"react-icons/hi";
import StoreBadge from"./StoreBadge";

type StoreScheduleProps = {
 schedule: string;
  workingHours?: Record<
    string,
    {
      open?: string;
      close?: string;
      closed?: boolean;
    }
  >;
 status:"open"|"closed";
};

const daysOrder = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
] as const;

const dayLabels: Record<(typeof daysOrder)[number], string> = {
  monday:"Mon",
  tuesday:"Tue",
  wednesday:"Wed",
  thursday:"Thu",
  friday:"Fri",
  saturday:"Sat",
  sunday:"Sun",
};

function getTodayKey() {
  const todayIndex = new Date().getDay();
  return daysOrder[(todayIndex + 6) % 7];
}

export default function StoreSchedule({
  schedule,
  workingHours,
  status,
}: StoreScheduleProps) {
  const todayKey = getTodayKey();
  const todayHours = workingHours?.[todayKey];
  const todayLabel = todayHours?.closed
    ? "Closed today"
    : todayHours?.open && todayHours?.close
      ? `${todayHours.open} - ${todayHours.close}`
      : schedule;

  return (
    <div className="rounded-2xl border border-sky-100 bg-white/70 p-4 shadow-sm backdrop-blur-sm md:min-w-[290px]">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-sky-600">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-sky-100">
              <HiClock className="h-4 w-4" />
            </span>
            <span className="text-xs font-semibold uppercase tracking-[0.18em]">
              Opening hours
            </span>
          </div>
          <p className="text-lg font-semibold text-custom-primary">{todayLabel}</p>
          <p className="text-xs text-custom-secondary">
            {status ==="open" ? "Serving customers right now" : "Currently closed"}
          </p>
        </div>
        <StoreBadge
          label={status ==="open"?"Open now":"Closed"}
          variant={status ==="open"?"success":"outline"}
        />
 </div>

      {workingHours && (
        <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
          {daysOrder.map((day) => {
            const hours = workingHours[day];
            const label = hours?.closed
              ? "Closed"
              : hours?.open && hours?.close
                ? `${hours.open} - ${hours.close}`
                : "Not set";

            return (
              <div
                key={day}
                className="flex items-center justify-between rounded-xl border border-slate-100 bg-custom-card px-3 py-2"
              >
                <span className="text-xs font-semibold text-custom-primary">
                  {dayLabels[day]}
                </span>
                <span className="text-xs text-custom-secondary">{label}</span>
              </div>
            );
          })}
        </div>
      )}
 </div>
 );
}

