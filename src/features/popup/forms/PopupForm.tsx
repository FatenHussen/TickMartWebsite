import { useState } from "react";
import { useForm } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import { HiCheckCircle, HiExclamationCircle } from "react-icons/hi";
import { cn } from "@/shared/lib/utils";
import { localize } from "../utils/localize";
import { PopupTracker } from "../tracking/popupTracking";
import { _PopupApi } from "../api/popupApi";
import { PopupFormField } from "./PopupFormField";
import type {
    Language,
    PopupCampaign,
    PopupFormField as FieldDef,
    PopupTrackPayload,
} from "../types";

type Props = {
    popup: PopupCampaign;
    lang: Language;
    textColor: string;
    accentColor: string;
    trackPayload: PopupTrackPayload;
    onSubmitSuccess?: () => void;
};

type FormState = "idle" | "submitting" | "success" | "error";

type FormValues = Record<string, string | boolean>;

export function PopupForm({
    popup,
    lang,
    textColor,
    accentColor,
    trackPayload,
    onSubmitSuccess,
}: Props) {
    const [formState, setFormState] = useState<FormState>("idle");
    const fields = (popup.form?.fields ?? []) as FieldDef[];
    const successMessage = localize(popup.form?.success_message, lang);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<FormValues>({
        defaultValues: Object.fromEntries(
            fields.map((f) => [
                f.name,
                f.type === "checkbox" ? false : (f.default_value ?? ""),
            ])
        ),
    });

    const onSubmit = async (values: FormValues) => {
        setFormState("submitting");
        try {
            await _PopupApi.submitForm(popup.id, {
                ...trackPayload,
                fields: values,
            });
            PopupTracker.trackFormSubmit(popup.id, {
                ...trackPayload,
                fields: values,
            });
            setFormState("success");
            onSubmitSuccess?.();
        } catch {
            setFormState("error");
        }
    };

    return (
        <div className="mt-4">
            <AnimatePresence mode="wait">
                {formState === "success" ? (
                    <motion.div
                        key="success"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex flex-col items-center gap-3 py-6 text-center"
                        style={{ color: textColor }}
                    >
                        <div
                            className="flex h-14 w-14 items-center justify-center rounded-full"
                            style={{ backgroundColor: `${accentColor}33` }}
                        >
                            <HiCheckCircle
                                className="h-8 w-8"
                                style={{ color: accentColor }}
                            />
                        </div>
                        <p className="text-sm font-medium">
                            {successMessage || "Thank you! We'll be in touch."}
                        </p>
                    </motion.div>
                ) : (
                    <motion.form
                        key="form"
                        onSubmit={handleSubmit(onSubmit)}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        noValidate
                        className="flex flex-col gap-3"
                    >
                        {fields.map((field) => (
                            <PopupFormField
                                key={field.name}
                                field={field}
                                lang={lang}
                                register={register}
                                error={errors[field.name]}
                                textColor={textColor}
                            />
                        ))}

                        {formState === "error" && (
                            <div className="flex items-center gap-2 rounded-lg border border-red-400/30 bg-red-500/10 px-3 py-2">
                                <HiExclamationCircle className="h-4 w-4 shrink-0 text-red-400" />
                                <p className="text-xs text-red-400">
                                    Something went wrong. Please try again.
                                </p>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={formState === "submitting"}
                            className={cn(
                                "mt-1 w-full rounded-xl py-2.5 text-sm font-semibold transition-all duration-200",
                                "hover:brightness-110 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
                            )}
                            style={{
                                backgroundColor: accentColor,
                                color: "#0f172a",
                            }}
                        >
                            {formState === "submitting" ? (
                                <span className="inline-flex items-center gap-2">
                                    <Spinner />
                                    Submitting…
                                </span>
                            ) : (
                                "Submit"
                            )}
                        </button>
                    </motion.form>
                )}
            </AnimatePresence>
        </div>
    );
}

function Spinner() {
    return (
        <svg
            className="h-4 w-4 animate-spin"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            aria-hidden="true"
        >
            <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
            />
            <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
        </svg>
    );
}
