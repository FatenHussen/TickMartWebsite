import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { HiOutlineClock } from "react-icons/hi";
import { cn } from "@/shared/lib/utils";
import {
    formatApiDateTime,
    isBeforeEarliest,
    parseApiDateTime,
    toDateInputValue,
    toTimeInputValue,
} from "../lib/cartCheckout";
import type { DeliveryChoice } from "../types";

type DeliveryChoiceSectionProps = {
    choice: DeliveryChoice;
    scheduledDeliveryAt: string | null;
    earliestDeliveryAt: string;
    /** Restaurant-only: one instant option, no day/time picker. */
    instantOnly?: boolean;
    onChoiceChange: (choice: DeliveryChoice) => void;
    onScheduledChange: (value: string | null) => void;
};

export default function DeliveryChoiceSection({
    choice,
    scheduledDeliveryAt,
    earliestDeliveryAt,
    instantOnly = false,
    onChoiceChange,
    onScheduledChange,
}: DeliveryChoiceSectionProps) {
    const { t } = useTranslation();
    const earliest = useMemo(
        () => parseApiDateTime(earliestDeliveryAt),
        [earliestDeliveryAt],
    );
    const selected = parseApiDateTime(scheduledDeliveryAt);
    const [dateValue, setDateValue] = useState(() =>
        toDateInputValue(selected ?? earliest ?? new Date()),
    );
    const [timeValue, setTimeValue] = useState(() =>
        toTimeInputValue(selected ?? earliest ?? new Date()),
    );
    const [rejected, setRejected] = useState(false);

    useEffect(() => {
        if (!instantOnly || choice === "asap") return;
        onChoiceChange("asap");
    }, [choice, instantOnly, onChoiceChange]);

    useEffect(() => {
        if (instantOnly || choice !== "scheduled" || !earliestDeliveryAt) return;
        const stamp = `${dateValue} ${timeValue}`;
        if (!isBeforeEarliest(stamp, earliestDeliveryAt)) {
            setRejected(false);
            return;
        }
        onScheduledChange(null);
        setRejected(true);
    }, [choice, dateValue, earliestDeliveryAt, instantOnly, onScheduledChange, timeValue]);

    const minDate = earliest ? toDateInputValue(earliest) : undefined;
    const earliestTime = earliest ? toTimeInputValue(earliest) : undefined;
    const timeMin = earliest && dateValue === minDate ? earliestTime : undefined;

    const commit = (nextDate: string, nextTime: string) => {
        if (!nextDate || !nextTime) {
            onScheduledChange(null);
            setRejected(false);
            return;
        }
        const stamp = `${nextDate} ${nextTime}`;
        if (isBeforeEarliest(stamp, earliestDeliveryAt)) {
            onScheduledChange(null);
            setRejected(true);
            return;
        }
        setRejected(false);
        onScheduledChange(stamp);
    };

    if (instantOnly) {
        return (
            <section className="rounded-2xl border border-custom-primary bg-custom-card px-4 py-4 sm:px-5">
                <h2 className="text-base font-bold text-[color:var(--color-text)]">
                    {t("checkout.deliveryMethod", "Delivery method")}
                </h2>
                <p className="mt-2 text-sm font-semibold text-[color:var(--color-text)]">
                    {t("checkout.instantDelivery", "Instant delivery")}
                </p>
            </section>
        );
    }

    const selectAsap = () => {
        setRejected(false);
        onChoiceChange("asap");
    };

    const selectScheduled = () => {
        onChoiceChange("scheduled");
        const start = earliest ?? new Date();
        const nextDate = toDateInputValue(selected ?? start);
        const nextTime = toTimeInputValue(selected ?? start);
        setDateValue(nextDate);
        setTimeValue(nextTime);
        commit(nextDate, nextTime);
    };

    return (
        <section className="rounded-2xl border border-custom-primary bg-custom-card px-4 py-4 sm:px-5">
            <h2 className="text-base font-bold text-[color:var(--color-text)]">
                {t("checkout.deliveryMethod", "Delivery method")}
            </h2>
            <div className="mt-3 space-y-2">
                <ChoiceRow
                    selected={choice === "asap"}
                    title={t("checkout.deliveryAsap", "As soon as possible")}
                    onSelect={selectAsap}
                />
                <ChoiceRow
                    selected={choice === "scheduled"}
                    title={t("checkout.deliveryScheduled", "Day and time")}
                    onSelect={selectScheduled}
                />
            </div>

            {choice === "scheduled" && (
                <div className="mt-4 space-y-3">
                    <div className="grid gap-3 sm:grid-cols-2">
                        <label className="block text-xs font-medium text-custom-secondary">
                            {t("cart.deliveryDate", "Delivery date")}
                            <input
                                type="date"
                                value={dateValue}
                                min={minDate}
                                onChange={(event) => {
                                    const next = event.target.value;
                                    setDateValue(next);
                                    commit(next, timeValue);
                                }}
                                className="mt-1.5 w-full rounded-xl border border-custom-primary bg-custom-card px-3 py-2.5 text-sm text-[color:var(--color-text)]"
                            />
                        </label>
                        <label className="block text-xs font-medium text-custom-secondary">
                            {t("cart.deliveryTime", "Delivery time")}
                            <input
                                type="time"
                                value={timeValue}
                                min={timeMin}
                                onChange={(event) => {
                                    const next = event.target.value;
                                    setTimeValue(next);
                                    commit(dateValue, next);
                                }}
                                className="mt-1.5 w-full rounded-xl border border-custom-primary bg-custom-card px-3 py-2.5 text-sm text-[color:var(--color-text)]"
                            />
                        </label>
                    </div>
                    {rejected && earliestDeliveryAt && (
                        <p className="text-xs leading-relaxed text-[color:var(--color-error)]">
                            {t("checkout.deliveryTooEarly", {
                                time: earliestDeliveryAt,
                                defaultValue: "Choose a time at or after {{time}}",
                            })}
                        </p>
                    )}
                    {earliest && (
                        <p className="inline-flex items-center gap-1.5 text-xs text-custom-secondary">
                            <HiOutlineClock className="h-3.5 w-3.5" />
                            {t("checkout.earliestDeliveryAt", {
                                time: formatApiDateTime(earliest),
                                defaultValue: "Earliest: {{time}}",
                            })}
                        </p>
                    )}
                </div>
            )}
        </section>
    );
}

function ChoiceRow({
    selected,
    title,
    onSelect,
}: {
    selected: boolean;
    title: string;
    onSelect: () => void;
}) {
    return (
        <button
            type="button"
            onClick={onSelect}
            className={cn(
                "flex w-full items-center gap-3 rounded-xl border px-3 py-3 text-start text-sm font-semibold transition-colors",
                selected
                    ? "border-[color:var(--color-api-second)] bg-[color:color-mix(in_srgb,var(--color-api-second)_8%,var(--color-bg-card))] text-[color:var(--color-text)]"
                    : "border-custom-primary text-custom-secondary hover:text-[color:var(--color-text)]",
            )}
            aria-pressed={selected}
        >
            <span
                className={cn(
                    "flex h-4 w-4 shrink-0 items-center justify-center rounded-full border",
                    selected
                        ? "border-[color:var(--color-api-second)]"
                        : "border-custom-primary",
                )}
            >
                {selected && (
                    <span className="h-2 w-2 rounded-full bg-[color:var(--color-api-second)]" />
                )}
            </span>
            {title}
        </button>
    );
}
