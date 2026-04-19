import { cn } from "@/shared/lib/utils";
import { HELP_FOCUS_RING_INPUT } from "./focusRingClasses";

/** Shared textarea: soft lift, brand focus ring (no default / black outline). */
export const COMPLAINT_TEXTAREA_BORDER_CLASS = cn(
    "rounded-xl bg-custom-card shadow-md shadow-primary/[0.06]",
    HELP_FOCUS_RING_INPUT
);

/** Inner select: linear blue-off → blue-very-light, custom chevron */
const selectFieldInnerBase =
    "w-full min-h-[48px] rounded-[11px] border-0 bg-gradient-to-r from-blue-off to-blue-very-light py-3 text-custom-primary appearance-none cursor-pointer focus:outline-none";

export function getComplaintTypeSelectClassName(isRTL: boolean): string {
    return cn(
        selectFieldInnerBase,
        "focus:ring-2 focus:ring-offset-0 focus:ring-blue-off/90",
        isRTL ? "pr-5 pl-8" : "pl-5 pr-8"
    );
}

export function getRelatedOrderSelectClassName(isRTL: boolean): string {
    return cn(
        selectFieldInnerBase,
        "focus:ring-2 focus:ring-offset-0 focus:ring-primary-light/45",
        isRTL ? "pr-5 pl-8" : "pl-5 pr-8"
    );
}
