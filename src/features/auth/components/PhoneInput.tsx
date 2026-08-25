import { useCallback, useEffect } from "react";
import {
    Controller,
    useWatch,
    type Control,
    type FieldError,
    type UseFormSetValue,
} from "react-hook-form";
import { useTranslation } from "react-i18next";
import Label from "@/shared/ui/Label";
import { _LocationApi } from "@/features/auth/api/location.service";
import { useInfiniteSelect } from "@/shared/hooks/useInfiniteSelect";
import type { Country, SignUpFormValues } from "@/features/auth/types";
import { cn } from "@/shared/lib/utils";

export interface PhoneInputProps {
    control: Control<SignUpFormValues>;
    setValue: UseFormSetValue<SignUpFormValues>;
    countryError?: FieldError;
    phoneError?: FieldError;
    label?: string;
    required?: boolean;
}

function findSyriaCountry(countries: Country[]): Country | undefined {
    return countries.find(
        (c) =>
            c.code === "+963" ||
            c.name.toLowerCase().includes("syria") ||
            c.name.includes("سوريا"),
    );
}

export function normalizePhoneWithCountry(countryCode: string, localPhone: string): string {
    let local = localPhone.replace(/\D/g, "");
    if (local.startsWith("0")) {
        local = local.slice(1);
    }
    const countryDigits = countryCode.replace(/\D/g, "");
    return countryDigits + local;
}

export default function PhoneInput({
    control,
    setValue,
    countryError,
    phoneError,
    label,
    required,
}: PhoneInputProps) {
    const { t } = useTranslation();

    const {
        items: countries,
        handleScroll: handleCountryScroll,
        isFetchingNextPage: isFetchingMoreCountries,
    } = useInfiniteSelect<Country>({
        queryKey: ["location", "countries", "signup-phone"],
        fetchFn: async (page) => {
            const res = await _LocationApi.getCountries(page);
            return {
                items: res.data?.items ?? [],
                pagination:
                    (res.data as {
                        pagination: {
                            current_page: number;
                            last_page: number;
                            per_page: number;
                            total: number;
                        } | null;
                    })?.pagination ?? null,
            };
        },
        mapToOption: (c) => ({
            value: String(c.id),
            label: `${c.code} ${c.name}`,
        }),
    });

    const phoneCountry = useWatch({ control, name: "phoneCountry" });

    useEffect(() => {
        if (countries.length === 0) return;
        if (phoneCountry) return;

        const syria = findSyriaCountry(countries);
        if (syria) {
            setValue("phoneCountry", String(syria.id), { shouldValidate: false });
            setValue("phoneCountryCode", syria.code, { shouldValidate: false });
        }
    }, [countries, phoneCountry, setValue]);

    const handleCountryChange = useCallback(
        (onChange: (v: string) => void) => (e: React.ChangeEvent<HTMLSelectElement>) => {
            const id = e.target.value;
            onChange(id);

            const country = countries.find((c) => String(c.id) === id);
            setValue("phoneCountryCode", country?.code ?? "", { shouldValidate: false });
        },
        [countries, setValue],
    );

    const handlePhoneChange = useCallback(
        (onChange: (v: string) => void) => (e: React.ChangeEvent<HTMLInputElement>) => {
            const digits = e.target.value.replace(/\D/g, "");
            if (!digits) {
                onChange("");
                return;
            }
            if (!/^[09]/.test(digits)) return;
            onChange(digits);
        },
        [],
    );

    const errorMessage =
        (phoneError?.message as string | undefined) ||
        (countryError?.message as string | undefined);
    const hasError = !!phoneError || !!countryError || !!errorMessage;

    return (
        <div className="space-y-2">
            {label && (
                <Label required={required} error={hasError}>
                    {label}
                </Label>
            )}

            <div
                className={cn(
                    "flex flex-col overflow-hidden rounded-lg border focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary bg-custom-card sm:flex-row sm:items-stretch",
                    hasError
                        ? "border-red-500 dark:border-red-400"
                        : "border-custom-secondary",
                )}
            >
                <Controller
                    name="phoneCountry"
                    control={control}
                    rules={{
                        required: required ? t("validation.required") : undefined,
                    }}
                    render={({ field }) => (
                        <select
                            aria-label={t("auth.selectCountry")}
                            className={cn(
                                "w-full min-w-0 appearance-none bg-transparent px-3 py-2.5 text-sm text-custom-primary sm:w-auto sm:min-w-[6.5rem] sm:max-w-[12rem] sm:shrink-0",
                                "border-b border-custom-secondary sm:border-b-0 sm:border-e",
                                "focus:outline-none",
                                hasError && "border-red-500 dark:border-red-400",
                            )}
                            value={field.value}
                            onChange={handleCountryChange(field.onChange)}
                            onBlur={field.onBlur}
                            onScroll={handleCountryScroll}
                        >
                            <option value="">{t("auth.selectCountry")}</option>
                            {countries.map((c) => (
                                <option key={c.id} value={String(c.id)}>
                                    {c.code} {c.name}
                                </option>
                            ))}
                            {isFetchingMoreCountries && (
                                <option value="" disabled>
                                    {t("common.loading")}
                                </option>
                            )}
                        </select>
                    )}
                />

                <Controller
                    name="phone"
                    control={control}
                    rules={{
                        required: required ? t("validation.required") : undefined,
                        validate: (value) => {
                            const digits = value.replace(/\D/g, "");
                            if (!digits) return true;
                            if (!/^[09]/.test(digits)) {
                                return t("validation.phoneMustStartWithZeroOrNine");
                            }
                            if (digits.length < 8) {
                                return t("validation.phoneMinLength");
                            }
                            return true;
                        },
                    }}
                    render={({ field }) => (
                        <input
                            type="tel"
                            inputMode="numeric"
                            autoComplete="tel-national"
                            placeholder="0933123456"
                            value={field.value}
                            onChange={handlePhoneChange(field.onChange)}
                            onBlur={field.onBlur}
                            className={cn(
                                "w-full min-w-0 flex-1 px-4 py-2.5 text-sm",
                                "placeholder:text-custom-tertiary dark:placeholder:text-custom-secondary",
                                "focus:outline-none bg-transparent text-custom-primary",
                                hasError && "text-red-900 dark:text-red-100",
                            )}
                        />
                    )}
                />
            </div>

            {errorMessage && (
                <p className="text-xs text-red-500 dark:text-red-400">{errorMessage}</p>
            )}
        </div>
    );
}
