import type { PopupCampaign, PopupCloseReason } from "../types";

// ─── Key factories ────────────────────────────────────────────────────────────

const K = {
    lastShown: (id: number) => `popup_${id}_lastShown`,
    impressions: (id: number) => `popup_${id}_impressions`,
    dismissed: (id: number) => `popup_${id}_dismissed`,
    dailyShown: (id: number) => `popup_${id}_dailyShown`,
    closeReason: (id: number) => `popup_${id}_closeReason`,
};

// ─── Storage primitives ───────────────────────────────────────────────────────

function get(key: string): string | null {
    try {
        return localStorage.getItem(key);
    } catch {
        return null;
    }
}

function set(key: string, value: string): void {
    try {
        localStorage.setItem(key, value);
    } catch {
        // Silently ignore quota / private mode errors
    }
}

function remove(key: string): void {
    try {
        localStorage.removeItem(key);
    } catch {
        // noop
    }
}

function getNumber(key: string): number | null {
    const raw = get(key);
    if (raw == null) return null;
    const n = Number(raw);
    return Number.isFinite(n) ? n : null;
}

function getToday(): string {
    return new Date().toISOString().slice(0, 10); // "YYYY-MM-DD"
}

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * Pure localStorage check — no sessionStorage.
 * The "don't show twice per session" guard lives in triggeredRef inside
 * PopupProvider so it resets cleanly on HMR and React StrictMode remounts.
 */
export function canShowPopup(popup: PopupCampaign): boolean {
    const { frequency } = popup;

    // Permanently dismissed after hitting the max impression cap
    if (get(K.dismissed(popup.id)) === "1") return false;

    // Max impressions cap
    const maxImpressions = frequency?.max_impressions;
    if (typeof maxImpressions === "number" && maxImpressions > 0) {
        const seen = getNumber(K.impressions(popup.id)) ?? 0;
        if (seen >= maxImpressions) return false;
    }

    // Once-per-day cap
    if (frequency?.once_per_day) {
        const dailyDate = get(K.dailyShown(popup.id));
        if (dailyDate === getToday()) return false;
    }

    // Cooldown between impressions (days) — API defines show_every in days
    const showEvery = frequency?.show_every;
    if (typeof showEvery === "number" && showEvery > 0) {
        const lastShown = getNumber(K.lastShown(popup.id));
        if (lastShown != null) {
            const elapsedDays = (Date.now() - lastShown) / 86_400_000;
            if (elapsedDays < showEvery) return false;
        }
    }

    return true;
}

export function recordImpression(popup: PopupCampaign): void {
    const now = Date.now();
    const current = getNumber(K.impressions(popup.id)) ?? 0;

    set(K.lastShown(popup.id), String(now));
    set(K.impressions(popup.id), String(current + 1));
    set(K.dailyShown(popup.id), getToday());
}

export function recordDismissal(popup: PopupCampaign, reason: PopupCloseReason): void {
    const maxImpressions = popup.frequency?.max_impressions;
    const seen = getNumber(K.impressions(popup.id)) ?? 0;

    // Permanently dismiss once the user has exhausted their impression budget
    if (typeof maxImpressions === "number" && seen >= maxImpressions) {
        set(K.dismissed(popup.id), "1");
    }

    set(K.closeReason(popup.id), reason);
}

export function getImpressionCount(id: number): number {
    return getNumber(K.impressions(id)) ?? 0;
}

export function getLastShown(id: number): number | null {
    return getNumber(K.lastShown(id));
}

export function getCloseReason(id: number): string | null {
    return get(K.closeReason(id));
}

export function resetPopup(id: number): void {
    remove(K.lastShown(id));
    remove(K.impressions(id));
    remove(K.dismissed(id));
    remove(K.dailyShown(id));
    remove(K.closeReason(id));
}
