import { useCallback, useEffect, useMemo, useState } from "react";
import { Controller, type Control, type FieldError } from "react-hook-form";
import { useTranslation } from "react-i18next";
import Label from "@/shared/ui/Label";
import { _LocationApi } from "@/features/auth/api/location.service";
import { useInfiniteSelect } from "@/shared/hooks/useInfiniteSelect";
import { detectEmailOrPhone } from "@/shared/lib/utils";
import type { Country } from "@/features/auth/types";
import { cn } from "@/shared/lib/utils";
import {
    findSyriaCountry,
    getCountryDialCode,
    SYRIA_FALLBACK,
    toInternationalPhone,
} from "@/features/auth/utils/countryDialCode";
import { CountryDialSelect } from "@/features/auth/components/CountryDialSelect";

export interface EmailOrPhoneInputProps {
    name: string;
    control: Control<any>;
    label?: string;
    placeholder?: string;
    error?: FieldError;
    required?: boolean;
    rules?: object;
    disabled?: boolean;
    /** Called when the selected dial code changes (`+963`). */
    onDialCodeChange?: (dial: string) => void;
}

function EmailOrPhoneInput({
    name,
    control,
    label,
    placeholder,
    error,
    required,
    rules = {},
    disabled,
    onDialCodeChange,
}: EmailOrPhoneInputProps) {
    const { t } = useTranslation();
    const {
        items: apiCountries,
        handleScroll: handleCountryScroll,
        isFetchingNextPage: isFetchingMoreCountries,
    } = useInfiniteSelect<Country>({
        queryKey: ["location", "countries", "select"],
        fetchFn: async (page) => {
            const res = await _LocationApi.getCountries(page);
            return {
                items: res.data?.items ?? [],
                pagination:
                    (
                        res.data as {
                            pagination: {
                                current_page: number;
                                last_page: number;
                                per_page: number;
                                total: number;
                            } | null;
                        }
                    )?.pagination ?? null,
            };
        },
        mapToOption: (c) => ({
            value: String(c.id),
            label: `${getCountryDialCode(c)} ${c.name}`,
        }),
    });

    const countries = useMemo(() => {
        const list = [...apiCountries];
        if (!findSyriaCountry(list)) {
            list.unshift({
                id: SYRIA_FALLBACK.id,
                name: t("auth.syria", "سوريا"),
                code: SYRIA_FALLBACK.code,
            });
        }
        return list;
    }, [apiCountries, t]);

    const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);

    useEffect(() => {
        if (selectedCountry) return;
        const syria = findSyriaCountry(countries);
        if (syria) {
            setSelectedCountry(syria);
            onDialCodeChange?.(getCountryDialCode(syria));
        }
    }, [countries, selectedCountry, onDialCodeChange]);

    const dial = getCountryDialCode(selectedCountry) || "+963";

    const errorMessage = error?.message as string | undefined;
    const hasError = !!error || !!errorMessage;

    const handleCountryChange = useCallback(
        (id: string) => {
            const country = countries.find((c) => String(c.id) === id);
            if (!country) return;
            setSelectedCountry(country);
            onDialCodeChange?.(getCountryDialCode(country));
        },
        [countries, onDialCodeChange],
    );

    return (
        <Controller
            name={name}
            control={control}
            rules={{
                required: required ? t("validation.required") : undefined,
                validate: (value) => {
                    const raw = String(value ?? "").trim();
                    if (raw.includes("@")) {
                        const emailPattern = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
                        return emailPattern.test(raw) || t("validation.emailInvalid");
                    }
                    const international = toInternationalPhone(dial, raw);
                    const detected = detectEmailOrPhone(international) || detectEmailOrPhone(raw);
                    if (detected !== "phone") return t("validation.emailOrPhoneInvalid");
                    const local = raw.replace(/\D/g, "").replace(/^0/, "");
                    if (local.length < 8) return t("validation.phoneTooShort");
                    return true;
                },
                ...rules,
            }}
            render={({ field }) => {
                const isEmail = (field.value ?? "").includes("@");
                return (
                    <div className="space-y-2">
                        {label && (
                            <Label htmlFor={`${name}-input`} required={required} error={hasError}>
                                {label}
                            </Label>
                        )}
                        <div
                            className={cn(
                                "flex overflow-visible rounded-xl border bg-white shadow-sm focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/25 dark:bg-white/[0.06]",
                                hasError
                                    ? "border-red-500 dark:border-red-400"
                                    : "border-stone-200 dark:border-white/15",
                            )}
                            dir="ltr"
                        >
                            {!isEmail && (
                                <CountryDialSelect
                                    ariaLabel={t("auth.selectCountry")}
                                    value={selectedCountry ? String(selectedCountry.id) : String(SYRIA_FALLBACK.id)}
                                    options={countries.map((c) => ({
                                        id: String(c.id),
                                        label: `${getCountryDialCode(c)} ${c.name}`,
                                    }))}
                                    onChange={handleCountryChange}
                                    onListScroll={handleCountryScroll}
                                    disabled={disabled}
                                    isLoadingMore={isFetchingMoreCountries}
                                    loadingLabel={t("common.loading")}
                                />
                            )}
                            <input
                                id={`${name}-input`}
                                type="text"
                                dir="ltr"
                                inputMode={isEmail ? "email" : "tel"}
                                autoComplete="username"
                                placeholder={
                                    isEmail
                                        ? "email@example.com"
                                        : (placeholder ?? "0935931471")
                                }
                                value={field.value}
                                onChange={(e) => field.onChange(e.target.value.trimStart())}
                                onBlur={field.onBlur}
                                disabled={disabled}
                                className={cn(
                                    "w-full min-w-0 flex-1 bg-transparent px-4 py-2.5 text-sm text-stone-900",
                                    "placeholder:text-stone-400 focus:outline-none dark:text-white dark:placeholder:text-zinc-500",
                                    hasError && "text-red-900 dark:text-red-100",
                                )}
                            />
                        </div>
                        {errorMessage && (
                            <p className="text-xs text-red-500 dark:text-red-400">{errorMessage}</p>
                        )}
                    </div>
                );
            }}
        />
    );
}

export default EmailOrPhoneInput;
