import { HiSearch } from "react-icons/hi";
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
            <div className="relative rounded-2xl bg-gradient-to-br from-custom-light via-custom-light to-blue-off/[0.45] shadow-lg shadow-primary/[0.08] dark:from-custom-card dark:via-custom-card dark:to-primary/[0.04]">
                <HiSearch
                    className={cn(
                        "absolute top-1/2 z-[1] -translate-y-1/2 w-5 h-5 text-primary/55",
                        isRTL ? "right-3.5" : "left-3.5"
                    )}
                />
                <input
                    type="text"
                    value={value}
                    onChange={handleChange}
                    placeholder={placeholder}
                    className={cn(
                        "w-full rounded-2xl bg-transparent py-3.5 text-custom-primary",
                        "placeholder:text-custom-tertiary/90",
                        HELP_FOCUS_RING,
                        isRTL ? "pr-11 pl-4" : "pl-11 pr-4"
                    )}
                />
            </div>
        </div>
    );
}
