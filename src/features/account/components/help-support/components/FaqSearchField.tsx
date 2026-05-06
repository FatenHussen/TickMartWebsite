import { Search } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import { HELP_FOCUS_RING } from "../focusRingClasses";

type FaqSearchFieldProps = {
    value: string;
    onChange: (value: string) => void;
    placeholder: string;
    isRTL: boolean;
};

export function FaqSearchField({ value, onChange, placeholder, isRTL }: FaqSearchFieldProps) {
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        onChange(event.target.value);
    };

    return (
        <div className="relative mb-6">
            <div className="relative rounded-2xl bg-gradient-to-br from-custom-light via-custom-light to-blue-off/[0.45] shadow-lg shadow-primary/[0.08] dark:border dark:border-[rgba(255,255,255,0.06)] dark:bg-[rgba(255,255,255,0.04)] dark:bg-none dark:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05),0_12px_36px_-18px_rgba(0,0,0,0.55)]">
                <Search
                    className={cn(
                        "pointer-events-none absolute top-1/2 z-[1] h-5 w-5 -translate-y-1/2 text-primary/55 dark:text-[color-mix(in_srgb,var(--color-main)_48%,#71717A)]",
                        isRTL ? "right-3.5" : "left-3.5"
                    )}
                    aria-hidden
                />
                <input
                    type="text"
                    value={value}
                    onChange={handleChange}
                    placeholder={placeholder}
                    className={cn(
                        "w-full rounded-2xl bg-transparent py-3.5 text-custom-primary dark:text-[#FFFFFF]",
                        "placeholder:text-custom-tertiary/90 dark:placeholder:text-[#71717A]",
                        HELP_FOCUS_RING,
                        isRTL ? "pr-11 pl-4" : "pl-11 pr-4"
                    )}
                />
            </div>
        </div>
    );
}
