import { useEffect, useMemo, useState, type ReactNode } from "react";
import { Trans, useTranslation } from "react-i18next";
import { HiCalendar, HiShoppingBag } from "react-icons/hi";
import BasePopup from "@/shared/component/BasePopup";
import Button from "@/shared/ui/Button";
import { cn } from "@/shared/lib/utils";
import type { ScheduleItem } from "@/features/cart/types";

function todayIsoDate(): string {
    const d = new Date();
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
}

type ConfirmChoice = "schedule" | "once";

type ConfirmCustomBasketPopupProps = {
    isOpen: boolean;
    onClose: () => void;
    schedule: ScheduleItem | null;
    isPending: boolean;
    onYes: (startDate: string) => void;
    onNo: () => void;
};

export default function ConfirmCustomBasketPopup({
    isOpen,
    onClose,
    schedule,
    isPending,
    onYes,
    onNo,
}: ConfirmCustomBasketPopupProps) {
    const { t } = useTranslation();
    const minDate = useMemo(() => todayIsoDate(), []);
    const [startDate, setStartDate] = useState(minDate);
    const [choice, setChoice] = useState<ConfirmChoice>("schedule");

    useEffect(() => {
        if (!isOpen) return;
        setChoice("schedule");
        setStartDate(todayIsoDate());
    }, [isOpen]);

    return (
        <BasePopup
            isOpen={isOpen}
            onClose={onClose}
            title={t("customBasket.confirm")}
            maxWidth="md"
            contentClassName="!text-start p-5"
        >
            <p className="text-sm leading-relaxed text-custom-secondary">
                <Trans
                    i18nKey="customBasket.confirmQuestion"
                    values={{ name: schedule?.name ?? "" }}
                    components={{
                        strong: <strong className="font-semibold text-custom-primary dark:text-white" />,
                    }}
                />
            </p>

            <div className="mt-5 grid gap-3">
                <ChoiceCard
                    active={choice === "schedule"}
                    icon={<HiCalendar className="h-5 w-5" />}
                    title={t("customBasket.yesSchedule")}
                    body={t("customBasket.yesScheduleHint")}
                    onClick={() => setChoice("schedule")}
                />
                <ChoiceCard
                    active={choice === "once"}
                    icon={<HiShoppingBag className="h-5 w-5" />}
                    title={t("customBasket.noOnce")}
                    body={t("customBasket.noOnceHint")}
                    onClick={() => setChoice("once")}
                />
            </div>

            {choice === "schedule" && (
                <label className="mt-5 block text-sm font-medium text-custom-secondary">
                    {t("customBasket.startDate")}
                    <input
                        type="date"
                        min={minDate}
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        dir="ltr"
                        className="mt-2 h-11 w-full rounded-xl border border-custom-secondary bg-custom-card px-3 text-sm text-text-primary outline-none focus:border-primary/40 focus:ring-2 focus:ring-primary/20"
                    />
                </label>
            )}

            <Button
                type="button"
                variant="primary"
                fullWidth
                className="mt-6 h-12 rounded-2xl"
                disabled={isPending || (choice === "schedule" && !startDate)}
                isLoading={isPending}
                onClick={() => {
                    if (choice === "schedule") onYes(startDate);
                    else onNo();
                }}
            >
                {choice === "schedule"
                    ? t("customBasket.confirmSchedule")
                    : t("customBasket.confirmOnce")}
            </Button>
        </BasePopup>
    );
}

function ChoiceCard({
    active,
    icon,
    title,
    body,
    onClick,
}: {
    active: boolean;
    icon: ReactNode;
    title: string;
    body: string;
    onClick: () => void;
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            aria-pressed={active}
            className={cn(
                "flex w-full gap-3 rounded-2xl border p-3.5 text-start transition",
                active
                    ? "border-primary bg-primary/10 ring-1 ring-primary/25"
                    : "border-[color-mix(in_srgb,var(--color-primary)_12%,var(--color-border-primary))] bg-[var(--color-bg-card)] hover:border-primary/30 dark:border-white/10 dark:bg-white/[0.03]",
            )}
        >
            <span
                className={cn(
                    "mt-0.5 grid h-10 w-10 shrink-0 place-items-center rounded-full",
                    active
                        ? "bg-primary text-white"
                        : "bg-primary/10 text-primary",
                )}
            >
                {icon}
            </span>
            <span className="min-w-0">
                <span className="block font-semibold text-custom-primary dark:text-white">
                    {title}
                </span>
                <span className="mt-0.5 block text-xs leading-relaxed text-custom-secondary">
                    {body}
                </span>
            </span>
        </button>
    );
}
