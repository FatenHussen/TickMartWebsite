import { useState, useCallback } from "react";
import { Controller, type Control, type FieldError } from "react-hook-form";
import { useTranslation } from "react-i18next";
import Label from "@/shared/ui/Label";
import { _LocationApi } from "@/features/auth/api/location.service";
import { useInfiniteSelect } from "@/shared/hooks/useInfiniteSelect";
import { detectEmailOrPhone } from "@/shared/lib/utils";
import type { Country } from "@/features/auth/types";
import { cn } from "@/shared/lib/utils";

export interface EmailOrPhoneInputProps {
  name: string;
  control: Control<any>;
  label?: string;
  placeholder?: string;
  error?: FieldError;
  required?: boolean;
  rules?: object;
  disabled?: boolean;
}

/**
 * Extracts the phone prefix from a value (e.g. "+963" from "+963933123456").
 * Returns the prefix including + and initial digits, or null if not a phone format.
 */
function extractPhonePrefix(value: string, countries: Country[]): string | null {
  if (!value.startsWith("+")) return null;
  // Match longest country code (e.g. +963 over +96)
  const sorted = [...countries].sort((a, b) => b.code.length - a.code.length);
  for (const c of sorted) {
    if (value.startsWith(c.code)) return c.code;
  }
  // Fallback: take + and consecutive digits
  const match = value.match(/^(\+\d+)/);
  return match ? match[1] : null;
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
}: EmailOrPhoneInputProps) {
  const { t } = useTranslation();
  const {
    items: countries,
    handleScroll: handleCountryScroll,
    isFetchingNextPage: isFetchingMoreCountries,
  } = useInfiniteSelect<Country>({
    queryKey: ["location", "countries", "select"],
    fetchFn: async (page) => {
      const res = await _LocationApi.getCountries(page);
      return { items: res.data?.items ?? [], pagination: (res.data as { pagination: { current_page: number; last_page: number; per_page: number; total: number } | null })?.pagination ?? null };
    },
    mapToOption: (c) => ({
      value: String(c.id),
      label: `${c.code} ${c.name}`,
    }),
  });
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);

  const handleCountryChange = useCallback(
    (onChange: (v: string) => void) =>
      (e: React.ChangeEvent<HTMLSelectElement>) => {
        const id = e.target.value;
        if (!id) {
          const wasPhoneMode = !!selectedCountry;
          setSelectedCountry(null);
          if (wasPhoneMode) onChange("");
          return;
        }
        const country = countries.find((c) => String(c.id) === id);
        if (country) {
          setSelectedCountry(country);
          onChange(country.code);
        }
      },
    [countries, selectedCountry]
  );

  const handleInputChange = useCallback(
    (onChange: (v: string) => void, _currentValue: string) =>
      (e: React.ChangeEvent<HTMLInputElement>) => {
        const raw = e.target.value;

        // Email mode: contains @
        if (raw.includes("@")) {
          setSelectedCountry(null);
          onChange(raw);
          return;
        }

        // Phone mode: country selected
        if (selectedCountry) {
          const prefix = selectedCountry.code;
          const afterPrefix = raw.startsWith(prefix)
            ? raw.slice(prefix.length)
            : raw;
          const digits = afterPrefix.replace(/\D/g, "");
          onChange(prefix + digits);
          return;
        }

        // Phone mode: user typed + manually
        if (raw.startsWith("+")) {
          const prefix = extractPhonePrefix(raw, countries) || raw.match(/^(\+\d*)/)?.[1] || "+";
          const afterPrefix = raw.slice(prefix.length);
          const digits = afterPrefix.replace(/\D/g, "");
          onChange(prefix + digits);
          return;
        }

        // Ambiguous: allow (could be email or leading digits)
        onChange(raw);
      },
    [selectedCountry, countries]
  );

  const errorMessage = error?.message as string | undefined;
  const hasError = !!error || !!errorMessage;

  return (
    <Controller
      name={name}
      control={control}
      rules={{
        required: required ? t("validation.required") : undefined,
        validate: (value) => {
          const detected = detectEmailOrPhone(value);
          if (!detected) return t("validation.emailOrPhoneInvalid");
          if (detected === "email") {
            const emailPattern = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
            if (!emailPattern.test(value)) return t("validation.emailInvalid");
          } else if (detected === "phone") {
            const digitCount = value.replace(/\D/g, "").length;
            if (digitCount < 6) return t("validation.phoneTooShort");
          }
          return true;
        },
        ...rules,
      }}
      render={({ field }) => (
        <div className="space-y-2">
          {label && (
            <Label
              htmlFor={`${name}-input`}
              required={required}
              error={hasError}
            >
              {label}
            </Label>
          )}
          <div
            className={cn(
              "flex rounded-lg border overflow-hidden focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary bg-white dark:bg-gray-800",
              hasError
                ? "border-red-500 dark:border-red-400"
                : "border-gray-300 dark:border-gray-700"
            )}
          >
            <select
              aria-label={t("auth.selectCountry")}
              className={cn(
                "appearance-none bg-transparent px-3 py-2.5 text-sm text-gray-700 dark:text-gray-300",
                "border-r border-gray-300 dark:border-gray-700",
                "focus:outline-none min-w-[100px]",
                hasError && "border-red-500 dark:border-red-400"
              )}
              value={selectedCountry?.id ?? ""}
              onChange={handleCountryChange(field.onChange)}
              onScroll={handleCountryScroll}
              disabled={disabled}
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
            <input
              id={`${name}-input`}
              type="text"
              inputMode={
                field.value?.includes("@")
                  ? "email"
                  : field.value?.startsWith("+")
                    ? "numeric"
                    : "text"
              }
              autoComplete="email"
              placeholder={placeholder ?? "your.email@example.com / +963xxxxxxxxx"}
              value={field.value}
              onChange={handleInputChange(field.onChange, field.value)}
              onBlur={field.onBlur}
              disabled={disabled}
              className={cn(
                "flex-1 min-w-0 px-4 py-2.5 text-sm",
                "placeholder:text-gray-400 dark:placeholder:text-gray-500",
                "focus:outline-none bg-transparent",
                "text-gray-700 dark:text-gray-300",
                hasError && "text-red-900 dark:text-red-100"
              )}
            />
          </div>
          {errorMessage && (
            <p className="text-xs text-red-500 dark:text-red-400">
              {errorMessage}
            </p>
          )}
        </div>
      )}
    />
  );
}

export default EmailOrPhoneInput;
