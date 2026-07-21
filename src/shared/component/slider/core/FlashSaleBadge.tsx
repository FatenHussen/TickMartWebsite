import { Flame, Snowflake } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useLanguage } from "@/context/LanguageContext";

type FlashSaleBadgeProps = {
  endDate: string;
  mainColor?: string | null;
  secondColor?: string | null;
};

/** A single time unit shown as a premium, readable tile with a unit caption. */
function TimeUnit({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <span className="relative flex min-w-[2.1ch] items-center justify-center overflow-hidden rounded-[10px] bg-gradient-to-b from-stone-800 to-stone-950 px-2 py-1.5 text-center text-sm font-extrabold tabular-nums leading-none text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.12),0_2px_6px_-2px_rgba(0,0,0,0.4)] dark:from-white/[0.18] dark:to-white/[0.08]">
        {value}
      </span>
      <span className="mt-1 text-[8.5px] font-bold uppercase tracking-[0.08em] text-stone-400 dark:text-zinc-500">
        {label}
      </span>
    </div>
  );
}

export default function FlashSaleBadge({
  endDate,
  mainColor,
  secondColor,
}: FlashSaleBadgeProps) {
  const { t } = useTranslation();
  const { isRTL } = useLanguage();
  const [now, setNow] = useState(() => Date.now());
  const primary = mainColor?.trim() || "#ff4d6d";
  const secondary = secondColor?.trim() || "#ffb703";

  const endTs = useMemo(() => {
    const parsed = Date.parse(endDate);
    return Number.isFinite(parsed) ? parsed : null;
  }, [endDate]);

  useEffect(() => {
    if (!endTs) return;
    const i = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(i);
  }, [endTs]);

  const remainingMs = endTs ? Math.max(endTs - now, 0) : 0;
  const isEnded = remainingMs <= 0;

  const remainingParts = useMemo(() => {
    const totalSeconds = Math.floor(remainingMs / 1000);
    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return {
      days: String(days).padStart(2, "0"),
      hours: String(hours).padStart(2, "0"),
      minutes: String(minutes).padStart(2, "0"),
      seconds: String(seconds).padStart(2, "0"),
    };
  }, [remainingMs]);

  const showDays = remainingParts.days !== "00";

  return (
    <div
      dir={isRTL ? "rtl" : "ltr"}
      className="inline-flex items-center gap-3 rounded-[1.1rem] border border-stone-200/70 bg-white/80 px-3 py-2 shadow-[0_1px_2px_rgba(15,23,42,0.04),0_8px_22px_-14px_rgba(15,23,42,0.25)] backdrop-blur-md dark:border-white/10 dark:bg-white/[0.05]"
    >
      {/* Flame / ended icon — tinted with the campaign color, never washed out */}
      <span
        className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-[0.9rem] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.3),0_4px_12px_-4px_rgba(0,0,0,0.35)]"
        style={
          isEnded
            ? { background: "#9ca3af" }
            : { background: `linear-gradient(135deg, ${primary}, ${secondary})` }
        }
      >
        {!isEnded && (
          <span
            aria-hidden
            className="absolute inset-0 rounded-[0.9rem] opacity-60 blur-md"
            style={{ background: `linear-gradient(135deg, ${primary}, ${secondary})` }}
          />
        )}
        <span className="relative z-10">
          {isEnded ? (
            <Snowflake className="h-4 w-4" />
          ) : (
            <Flame className="h-4 w-4 drop-shadow-sm" />
          )}
        </span>
      </span>

      {/* Label — always dark text for readability on the light section band */}
      <div className="flex flex-col leading-tight">
        <span className="text-[8.5px] font-bold uppercase tracking-[0.12em] text-stone-400 dark:text-zinc-500">
          {t("flashSale.limitedOffer")}
        </span>
        <span className="text-[0.9rem] font-extrabold tracking-tight text-stone-900 dark:text-white">
          {isEnded ? t("flashSale.saleEnded") : t("flashSale.flashSale")}
        </span>
      </div>

      {/* Countdown — segmented tiles, numbers stay LTR so time reads correctly */}
      {endTs && !isEnded && (
        <div
          dir="ltr"
          className="ms-0.5 flex items-start gap-1.5 border-stone-200/70 ps-3 [border-inline-start-width:1px] dark:border-white/10"
        >
          {showDays && (
            <>
              <TimeUnit value={remainingParts.days} label={t("flashSale.days")} />
              <span className="self-center pt-0.5 text-sm font-bold text-stone-300 dark:text-zinc-600">:</span>
            </>
          )}
          <TimeUnit value={remainingParts.hours} label={t("flashSale.hours")} />
          <span className="self-center pt-0.5 text-sm font-bold text-stone-300 dark:text-zinc-600">:</span>
          <TimeUnit value={remainingParts.minutes} label={t("flashSale.minutes")} />
          <span className="self-center pt-0.5 text-sm font-bold text-stone-300 dark:text-zinc-600">:</span>
          <TimeUnit value={remainingParts.seconds} label={t("flashSale.seconds")} />
        </div>
      )}
    </div>
  );
}
