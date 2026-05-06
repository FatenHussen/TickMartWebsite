import { _PopupApi } from "../api/popupApi";
import type {
    PopupCloseReason,
    PopupTrackDismissPayload,
    PopupTrackPayload,
    PopupFormSubmitPayload,
} from "../types";

// ─── Dedup guard ─────────────────────────────────────────────────────────────
// Prevents duplicate events within the same browser session.

type EventKey = `${number}:${"view" | "click" | "dismiss" | "form_submit"}`;
const firedThisSession = new Set<EventKey>();

function once(key: EventKey, fn: () => void): void {
    if (firedThisSession.has(key)) return;
    firedThisSession.add(key);
    fn();
}

// ─── Debounce helper ──────────────────────────────────────────────────────────

function debounce<T extends (...args: Parameters<T>) => void>(
    fn: T,
    ms: number
): (...args: Parameters<T>) => void {
    let timer: ReturnType<typeof setTimeout> | null = null;
    return (...args: Parameters<T>) => {
        if (timer) clearTimeout(timer);
        timer = setTimeout(() => {
            timer = null;
            fn(...args);
        }, ms);
    };
}

// ─── Raw fire functions ───────────────────────────────────────────────────────

function _fireView(id: number, payload: PopupTrackPayload): void {
    _PopupApi.trackView(id, payload).catch(() => {});
}

function _fireClick(id: number, payload: PopupTrackPayload): void {
    _PopupApi.trackClick(id, payload).catch(() => {});
}

function _fireDismiss(id: number, payload: PopupTrackDismissPayload): void {
    _PopupApi.trackDismiss(id, payload).catch(() => {});
}

function _fireFormSubmit(id: number, payload: PopupFormSubmitPayload): void {
    _PopupApi.submitForm(id, payload).catch(() => {});
}

// Debounced versions — 300ms window collapses rapid-fire calls
const debouncedView = debounce(_fireView, 300);
const debouncedClick = debounce(_fireClick, 300);

// ─── Public tracker API ───────────────────────────────────────────────────────

export const PopupTracker = {
    /**
     * Fire once per popup per session. Safe to call eagerly on open.
     */
    trackView(id: number, payload: PopupTrackPayload): void {
        once(`${id}:view`, () => debouncedView(id, payload));
    },

    /**
     * Fire on primary CTA click. Deduped per session.
     */
    trackClick(id: number, payload: PopupTrackPayload): void {
        once(`${id}:click`, () => debouncedClick(id, payload));
    },

    /**
     * Fire when the popup is dismissed (close, escape, backdrop, secondary CTA).
     * Includes the close reason for analytics attribution.
     */
    trackDismiss(
        id: number,
        reason: PopupCloseReason,
        payload: PopupTrackPayload
    ): void {
        once(`${id}:dismiss`, () =>
            _fireDismiss(id, { ...payload, reason })
        );
    },

    /**
     * Fire on successful form submission.
     */
    trackFormSubmit(id: number, payload: PopupFormSubmitPayload): void {
        once(`${id}:form_submit`, () => _fireFormSubmit(id, payload));
    },

    /**
     * Reset dedup state for a popup (used in testing / dev only).
     */
    _resetDedup(id: number): void {
        firedThisSession.delete(`${id}:view`);
        firedThisSession.delete(`${id}:click`);
        firedThisSession.delete(`${id}:dismiss`);
        firedThisSession.delete(`${id}:form_submit`);
    },
};
