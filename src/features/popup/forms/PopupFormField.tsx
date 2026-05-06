import type { UseFormRegister, FieldError } from "react-hook-form";
import { cn } from "@/shared/lib/utils";
import { localize } from "../utils/localize";
import type { Language, PopupFormField as FieldDef } from "../types";

type Props = {
    field: FieldDef;
    lang: Language;
    register: UseFormRegister<Record<string, string | boolean>>;
    error?: FieldError;
    textColor: string;
};

const baseInput =
    "w-full rounded-xl border border-white/20 bg-white/10 px-4 py-2.5 text-sm placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-white/40 transition-all duration-200 backdrop-blur-sm";

const errorRing = "border-red-400/60 focus:ring-red-400/40";

export function PopupFormField({ field, lang, register, error, textColor }: Props) {
    const label = localize(field.label, lang);
    const placeholder = localize(field.placeholder, lang);

    const validationRules = buildRules(field, lang);

    const sharedProps = {
        id: field.name,
        placeholder,
        style: { color: textColor },
        className: cn(baseInput, error && errorRing),
        ...register(field.name as string, validationRules),
    } as const;

    return (
        <div className="flex flex-col gap-1.5">
            {label && (
                <label
                    htmlFor={field.name}
                    className="text-xs font-medium opacity-80 select-none"
                    style={{ color: textColor }}
                >
                    {label}
                    {field.required && (
                        <span className="ml-0.5 text-red-400" aria-hidden="true">
                            *
                        </span>
                    )}
                </label>
            )}

            {field.type === "textarea" ? (
                <textarea
                    {...sharedProps}
                    rows={3}
                    className={cn(baseInput, "resize-none", error && errorRing)}
                />
            ) : field.type === "select" ? (
                <select
                    {...sharedProps}
                    className={cn(
                        baseInput,
                        "appearance-none cursor-pointer",
                        error && errorRing
                    )}
                >
                    <option value="" className="bg-gray-900">
                        {placeholder || label}
                    </option>
                    {field.options?.map((opt) => (
                        <option
                            key={opt.value}
                            value={opt.value}
                            className="bg-gray-900"
                        >
                            {localize(opt.label, lang)}
                        </option>
                    ))}
                </select>
            ) : field.type === "checkbox" ? (
                <label className="flex items-start gap-3 cursor-pointer group">
                    <input
                        type="checkbox"
                        id={field.name}
                        {...register(field.name as string, validationRules)}
                        className="mt-0.5 h-4 w-4 rounded border-white/30 bg-white/10 accent-white cursor-pointer shrink-0"
                    />
                    <span
                        className="text-xs leading-relaxed opacity-80"
                        style={{ color: textColor }}
                    >
                        {label}
                    </span>
                </label>
            ) : (
                <input
                    {...sharedProps}
                    type={field.type === "phone" ? "tel" : field.type}
                    autoComplete={autoCompleteFor(field.type)}
                />
            )}

            {error?.message && (
                <p className="text-xs text-red-400 mt-0.5" role="alert">
                    {error.message}
                </p>
            )}
        </div>
    );
}

// ─── Validation rules builder ─────────────────────────────────────────────────

function buildRules(
    field: FieldDef,
    lang: Language
): Parameters<UseFormRegister<Record<string, string | boolean>>>[1] {
    const customMessage = field.validation?.message
        ? localize(field.validation.message, lang)
        : undefined;

    const rules: Parameters<UseFormRegister<Record<string, string | boolean>>>[1] = {};

    if (field.required) {
        rules.required = customMessage || `${localize(field.label, lang) || "This field"} is required`;
    }

    if (field.type === "email") {
        rules.pattern = {
            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
            message: customMessage || "Enter a valid email address",
        };
    }

    if (field.type === "phone") {
        rules.pattern = {
            value: /^[\d\s+\-()]{6,20}$/,
            message: customMessage || "Enter a valid phone number",
        };
    }

    if (field.validation?.min != null) {
        rules.minLength = {
            value: field.validation.min,
            message: customMessage || `Minimum ${field.validation.min} characters`,
        };
    }

    if (field.validation?.max != null) {
        rules.maxLength = {
            value: field.validation.max,
            message: customMessage || `Maximum ${field.validation.max} characters`,
        };
    }

    if (field.validation?.pattern) {
        rules.pattern = {
            value: new RegExp(field.validation.pattern),
            message: customMessage || "Invalid format",
        };
    }

    return rules;
}

function autoCompleteFor(type: string): string {
    if (type === "email") return "email";
    if (type === "phone") return "tel";
    return "off";
}
