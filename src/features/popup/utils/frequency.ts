import type { PopupCampaign } from "../types";

const LAST_SHOWN_KEY = (id: number) => `popup_${id}_lastShown`;
const IMPRESSIONS_KEY = (id: number) => `popup_${id}_impressions`;

function readNumber(key: string): number | null {
    try {
        const raw = localStorage.getItem(key);
        if (!raw) return null;
        const n = Number(raw);
        return Number.isFinite(n) ? n : null;
    } catch {
        return null;
    }
}

function write(key: string, value: number): void {
    try {
        localStorage.setItem(key, String(value));
    } catch {
        // localStorage unavailable (private mode, quota) — silently ignore
    }
}

export function canShowPopup(popup: PopupCampaign): boolean {
    const showEvery = popup.frequency?.show_every; // minutes
    const maxImpressions = popup.frequency?.max_impressions;

    if (typeof maxImpressions === "number" && maxImpressions > 0) {
        const seen = readNumber(IMPRESSIONS_KEY(popup.id)) ?? 0;
        if (seen >= maxImpressions) return false;
    }

    if (typeof showEvery === "number" && showEvery > 0) {
        const lastShown = readNumber(LAST_SHOWN_KEY(popup.id));
        if (lastShown != null) {
            const elapsedMinutes = (Date.now() - lastShown) / 60000;
            if (elapsedMinutes < showEvery) return false;
        }
    }

    return true;
}

export function recordImpression(popup: PopupCampaign): void {
    write(LAST_SHOWN_KEY(popup.id), Date.now());
    const seen = readNumber(IMPRESSIONS_KEY(popup.id)) ?? 0;
    write(IMPRESSIONS_KEY(popup.id), seen + 1);
}
