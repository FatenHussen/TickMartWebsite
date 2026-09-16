import { useCallback, useEffect, useMemo } from "react";
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
import {
    findSyriaCountry,
    getCountryDialCode,
    SYRIA_FALLBACK,
    toInternationalPhone,
} from "@/features/auth/utils/countryDialCode";
import { cn } from "@/shared/lib/utils";
import { CountryDialSelect } from "@/features/auth/components/CountryDialSelect";

export interface PhoneInputProps {
    control: Control<SignUpFormValues>;
    setValue: UseFormSetValue<SignUpFormValues>;
    countryError?: FieldError;
    phoneError?: FieldError;
    label?: string;
    required?: boolean;
}

export function normalizePhoneWithCountry(countryCode: string, localPhone: string): string {
    return toInternationalPhone(countryCode, localPhone);
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
        items: apiCountries,
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

    const phoneCountry = useWatch({ control, name: "phoneCountry" });

    useEffect(() => {
        const syria = findSyriaCountry(countries);
        if (!syria) return;
        if (!phoneCountry) {
            setValue("phoneCountry", String(syria.id), { shouldValidate: false });
        }
        setValue("phoneCountryCode", getCountryDialCode(syria), { shouldValidate: false });
    }, [countries, phoneCountry, setValue]);

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
                    "flex overflow-visible rounded-xl border bg-white focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 dark:bg-white/[0.06]",
                    hasError
                        ? "border-red-500 dark:border-red-400"
                        : "border-stone-200 dark:border-white/15",
                )}
                dir="ltr"
            >
                <Controller
                    name="phoneCountry"
                    control={control}
                    rules={{
                        required: required ? t("validation.required") : undefined,
                    }}
                    render={({ field }) => (
                        <CountryDialSelect
                            ariaLabel={t("auth.selectCountry")}
                            value={field.value || String(SYRIA_FALLBACK.id)}
                            options={countries.map((c) => ({
                                id: String(c.id),
                                label: `${getCountryDialCode(c)} ${c.name}`,
                            }))}
                            onChange={(id) => {
                                field.onChange(id);
                                const country = countries.find((c) => String(c.id) === id);
                                setValue("phoneCountryCode", getCountryDialCode(country), {
                                    shouldValidate: false,
                                });
                            }}
                            onListScroll={handleCountryScroll}
                            isLoadingMore={isFetchingMoreCountries}
                            loadingLabel={t("common.loading")}
                            onBlur={field.onBlur}
                        />
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
                            const local = digits.startsWith("0") ? digits.slice(1) : digits;
                            if (local.length < 8) {
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
                            placeholder="0935931471"
                            value={field.value}
                            onChange={handlePhoneChange(field.onChange)}
                            onBlur={field.onBlur}
                            className={cn(
                                "w-full min-w-0 flex-1 bg-transparent px-4 py-2.5 text-sm text-stone-900",
                                "placeholder:text-stone-400 focus:outline-none dark:text-white dark:placeholder:text-zinc-500",
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
