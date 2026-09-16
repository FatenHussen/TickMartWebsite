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
        <div className="relative mb-5">
            <Search
                className={cn(
                    "pointer-events-none absolute top-1/2 z-[1] h-4 w-4 -translate-y-1/2 text-custom-secondary",
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
                    "w-full rounded-xl border border-[var(--color-border-primary)] bg-[var(--color-bg-primary)] py-3 text-sm text-custom-primary",
                    "placeholder:text-custom-secondary",
                    HELP_FOCUS_RING,
                    isRTL ? "pr-10 pl-4" : "pl-10 pr-4"
                )}
            />
        </div>
    );
}
