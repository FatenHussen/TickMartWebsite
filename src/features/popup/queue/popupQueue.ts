import { canShowPopup } from "../storage/popupStorage";
import type { PopupCampaign, PopupQueueEntry } from "../types";

// ─── In-memory queue (per module load) ───────────────────────────────────────
// NOTE: module-level state intentionally tracks only queued/pending campaigns,
// NOT "has been shown" — that guard lives in PopupProvider's triggeredRef so
// it resets correctly on Vite HMR reloads and React StrictMode remounts.

let queue: PopupQueueEntry[] = [];

// ─── Public queue API ─────────────────────────────────────────────────────────

/**
 * Enqueue a campaign if eligible. Keeps the queue sorted by priority (highest first).
 */
export function enqueue(popup: PopupCampaign): void {
    if (!canShowPopup(popup)) return;
    const alreadyQueued = queue.some((e) => e.popup.id === popup.id);
    if (alreadyQueued) return;

    queue.push({ popup, enqueuedAt: Date.now() });
    queue.sort((a, b) => b.popup.priority - a.popup.priority);
}

/**
 * Dequeue the next eligible campaign. Returns null if the queue is empty.
 */
export function dequeue(): PopupCampaign | null {
    while (queue.length > 0) {
        const entry = queue.shift()!;
        if (canShowPopup(entry.popup)) return entry.popup;
    }
    return null;
}

export function getQueueSize(): number {
    return queue.length;
}

export function clearQueue(): void {
    queue = [];
}
