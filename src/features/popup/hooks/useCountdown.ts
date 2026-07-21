import { useEffect, useMemo, useState } from "react";

export type CountdownParts = {
    days: string;
    hours: string;
    minutes: string;
    seconds: string;
};

export type Countdown = {
    /** Parsed end timestamp (ms), or null if the input was missing/invalid. */
    endTs: number | null;
    remainingMs: number;
    /** True once the end time has passed, or when there is no valid end time. */
    isEnded: boolean;
    parts: CountdownParts;
};

const ZERO_PARTS: CountdownParts = {
    days: "00",
    hours: "00",
    minutes: "00",
    seconds: "00",
};

/**
 * Live countdown to an ISO 8601 end time. Each tick recomputes from `Date.now()`
 * rather than decrementing a counter, so the value self-corrects when a tab is
 * backgrounded/throttled and later resumes. Returns `isEnded` so callers can
 * remove or disable expired items.
 */
export function useCountdown(endDate: string | null | undefined): Countdown {
    const [now, setNow] = useState(() => Date.now());

    const endTs = useMemo(() => {
        if (!endDate) return null;
        const parsed = Date.parse(endDate);
        return Number.isFinite(parsed) ? parsed : null;
    }, [endDate]);

    useEffect(() => {
        if (endTs == null) return;
        const id = setInterval(() => setNow(Date.now()), 1000);
        return () => clearInterval(id);
    }, [endTs]);

    const remainingMs = endTs != null ? Math.max(endTs - now, 0) : 0;
    const isEnded = endTs == null || remainingMs <= 0;

    const parts = useMemo<CountdownParts>(() => {
        if (endTs == null) return ZERO_PARTS;
        const totalSeconds = Math.floor(remainingMs / 1000);
        return {
            days: String(Math.floor(totalSeconds / 86400)).padStart(2, "0"),
            hours: String(Math.floor((totalSeconds % 86400) / 3600)).padStart(2, "0"),
            minutes: String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, "0"),
            seconds: String(totalSeconds % 60).padStart(2, "0"),
        };
    }, [endTs, remainingMs]);

    return { endTs, remainingMs, isEnded, parts };
}
