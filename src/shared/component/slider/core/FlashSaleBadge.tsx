import { Flame, Snowflake } from "lucide-react";
import { useEffect, useId, useMemo, useState } from "react";

type FlashSaleBadgeProps = {
  endDate: string;
  mainColor?: string | null;
  secondColor?: string | null;
};

export default function FlashSaleBadge({
  endDate,
  mainColor,
  secondColor,
}: FlashSaleBadgeProps) {
  const [now, setNow] = useState(() => Date.now());
  const gradientId = useId();
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

  const remainingMs = useMemo(() => {
    if (!endTs) return 0;
    return Math.max(endTs - now, 0);
  }, [endTs, now]);

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

  const progress = useMemo(() => {
    if (!endTs) return 0;
    const start = endTs - 24 * 60 * 60 * 1000;
    const total = endTs - start;
    const current = now - start;
    return Math.min(Math.max(current / total, 0), 1);
  }, [endTs, now]);

  const radius = 18;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - progress);

  return (
    <div className="relative inline-flex group">
      {!isEnded && (
        <div
          className="absolute -inset-[2px] rounded-2xl blur-md opacity-70"
          style={{
            background: `conic-gradient(from 90deg, ${primary}, ${secondary}, ${primary})`,
          }}
        />
      )}

      <div
        className={`
          relative isolate overflow-hidden rounded-2xl px-3 py-2
          border backdrop-blur-md shadow-xl
          ${isEnded ? "bg-gray-200 text-gray-500 border-white/30" : "text-white border-white/20"}
        `}
        style={
          isEnded
            ? undefined
            : {
                background: `
                  radial-gradient(130% 120% at 0% 0%, ${secondary}55 0%, transparent 45%),
                  radial-gradient(130% 120% at 100% 100%, ${primary}55 0%, transparent 45%),
                  linear-gradient(to left, ${primary}cc 0%, ${secondary}cc 100%)
                `,
              }
        }
      >
        {!isEnded && (
          <>
            <span className="pointer-events-none absolute inset-0 opacity-20 [background:repeating-linear-gradient(135deg,rgba(255,255,255,.22)_0,rgba(255,255,255,.22)_2px,transparent_2px,transparent_14px)]" />
            <span className="pointer-events-none absolute -top-8 -right-8 h-24 w-24 rounded-full bg-white/20 blur-2xl" />
            <span className="pointer-events-none absolute -bottom-8 -left-8 h-24 w-24 rounded-full bg-black/20 blur-2xl" />
          </>
        )}

        <div className="relative z-10 flex items-center gap-3">
          {!isEnded && (
            <svg width="40" height="40" className="absolute -left-2">
              <circle
                cx="20"
                cy="20"
                r={radius}
                stroke="rgba(255,255,255,0.25)"
                strokeWidth="3"
                fill="none"
              />
              <circle
                cx="20"
                cy="20"
                r={radius}
                stroke={`url(#${gradientId})`}
                strokeWidth="3"
                fill="none"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                className="transition-all duration-1000"
              />
              <defs>
                <linearGradient id={gradientId}>
                  <stop offset="0%" stopColor={primary} />
                  <stop offset="100%" stopColor={secondary} />
                </linearGradient>
              </defs>
            </svg>
          )}

          <div className="relative flex items-center justify-center w-6 h-6">
            {!isEnded && (
              <>
                <span
                  className="absolute w-full h-full rounded-full blur-md opacity-70 animate-pulse"
                  style={{ backgroundColor: primary }}
                />
                <span
                  className="absolute w-3 h-3 rounded-full animate-ping"
                  style={{ backgroundColor: secondary }}
                />
              </>
            )}
            <span className="relative z-10">
              {isEnded ? (
                <Snowflake className="h-4 w-4" />
              ) : (
                <Flame className="h-4 w-4 text-white" />
              )}
            </span>
          </div>

          <div className="flex flex-col leading-tight">
            <span className="text-[10px] uppercase tracking-wider opacity-75">
              Limited Offer
            </span>
            <span className="font-semibold">
              {isEnded ? "Sale Ended" : "Flash Sale"}
            </span>
          </div>

          {endTs && (
            <div
              className={`
                flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold tabular-nums
                ${isEnded ? "bg-white text-gray-500" : "border text-white bg-black/25"}
              `}
              style={isEnded ? undefined : { borderColor: `${secondary}66` }}
            >
              {isEnded ? (
                "00:00:00"
              ) : (
                <>
                  {remainingParts.days !== "00" && (
                    <>
                      <span>{remainingParts.days}</span>
                      <span className="opacity-70">:</span>
                    </>
                  )}
                  <span>{remainingParts.hours}</span>
                  <span className="opacity-70">:</span>
                  <span>{remainingParts.minutes}</span>
                  <span className="opacity-70">:</span>
                  <span>{remainingParts.seconds}</span>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}