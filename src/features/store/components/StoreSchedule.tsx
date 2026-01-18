import { HiClock } from "react-icons/hi";
import StoreBadge from "./StoreBadge";

type StoreScheduleProps = {
  schedule: string;
  status: "open" | "closed";
};

export default function StoreSchedule({ schedule, status }: StoreScheduleProps) {
  return (
    <div className="flex flex-wrap items-center gap-4 text-sm text-custom-secondary">
      <div className="flex items-center gap-2">
        <HiClock className="text-primary-light" />
        <span>{schedule}</span>
      </div>
      <StoreBadge
        label={status === "open" ? "Open now" : "Closed"}
        variant="success"
      />
    </div>
  );
}

